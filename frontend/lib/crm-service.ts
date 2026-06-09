/**
 * CRM Integration Service for Family Wealth Custodians
 * Syncs bookings and lead data to Salesforce or HubSpot
 */

export interface CrmLead {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  services?: string[];
  wealthGoal?: string;
  source?: string; // "website_booking"
  tags?: string[];
}

export interface CrmContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  lastContact?: Date;
}

export interface CrmOpportunity {
  id: string;
  contactId: string;
  name: string;
  amount?: number;
  stage: string;
  closeDate?: Date;
  description: string;
}

export type CrmProvider = 'salesforce' | 'hubspot' | 'mock';

/**
 * Create or update a lead in CRM from booking
 */
export async function syncBookingToCrm(lead: CrmLead): Promise<{ success: boolean; contactId?: string; error?: string }> {
  try {
    const provider = getCrmProvider();

    switch (provider) {
      case 'salesforce':
        return await syncToSalesforce(lead);
      case 'hubspot':
        return await syncToHubSpot(lead);
      default:
        console.log('[CRM] Mock CRM - lead would be created:', lead);
        return { success: true, contactId: `crm-${Date.now()}` };
    }
  } catch (error) {
    console.error('[CRM ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sync to CRM',
    };
  }
}

/**
 * Create an opportunity in CRM for a booking
 */
export async function createBookingOpportunity(
  contactId: string,
  clientName: string,
  services: string[],
  estimatedValue?: number
): Promise<{ success: boolean; opportunityId?: string; error?: string }> {
  try {
    const provider = getCrmProvider();

    const opportunity: CrmOpportunity = {
      id: '',
      contactId,
      name: `${clientName} - Wealth Management`,
      amount: estimatedValue || 50000,
      stage: 'Qualification',
      description: `Services interested: ${services.join(', ')}`,
    };

    switch (provider) {
      case 'salesforce':
        return await createSalesforceOpportunity(opportunity);
      case 'hubspot':
        return await createHubSpotDeal(opportunity);
      default:
        console.log('[CRM] Mock CRM - opportunity would be created:', opportunity);
        return { success: true, opportunityId: `opp-${Date.now()}` };
    }
  } catch (error) {
    console.error('[CRM ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create opportunity',
    };
  }
}

/**
 * Salesforce Integration
 * https://developer.salesforce.com/
 */
async function syncToSalesforce(lead: CrmLead): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
  const username = process.env.SALESFORCE_USERNAME;
  const password = process.env.SALESFORCE_PASSWORD;

  if (!instanceUrl || !clientId || !clientSecret || !username || !password) {
    throw new Error('Salesforce credentials not configured');
  }

  try {
    // Get access token
    const tokenResponse = await fetch(`${instanceUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username,
        password,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      throw new Error(`Salesforce auth failed: ${error.error_description}`);
    }

    const { access_token } = (await tokenResponse.json()) as { access_token: string };

    // Create Lead record
    const leadResponse = await fetch(`${instanceUrl}/services/data/v57.0/sobjects/Lead`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirstName: lead.firstName,
        LastName: lead.lastName,
        Email: lead.email,
        Phone: lead.phone,
        Country: lead.country || 'ZA',
        Description: `Services: ${(lead.services || []).join(', ')} | Goal: ${lead.wealthGoal || 'Not specified'}`,
        LeadSource: lead.source || 'Website',
        Status: 'Open - Not Contacted',
        Company: lead.firstName + ' ' + lead.lastName, // Salesforce requires Company field
      }),
    });

    if (!leadResponse.ok) {
      const error = await leadResponse.json();
      throw new Error(`Failed to create Salesforce lead: ${error.message}`);
    }

    const result = (await leadResponse.json()) as { id: string };

    return {
      success: true,
      contactId: result.id,
    };
  } catch (error) {
    throw error;
  }
}

async function createSalesforceOpportunity(
  opportunity: CrmOpportunity
): Promise<{ success: boolean; opportunityId?: string; error?: string }> {
  const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
  const token = process.env.SALESFORCE_ACCESS_TOKEN;

  if (!instanceUrl || !token) {
    throw new Error('Salesforce not configured for opportunities');
  }

  try {
    const response = await fetch(`${instanceUrl}/services/data/v57.0/sobjects/Opportunity`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        AccountId: opportunity.contactId,
        Name: opportunity.name,
        Amount: opportunity.amount,
        StageName: opportunity.stage,
        CloseDate: opportunity.closeDate?.toISOString().split('T')[0],
        Description: opportunity.description,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create Salesforce opportunity: ${error.message}`);
    }

    const result = (await response.json()) as { id: string };

    return {
      success: true,
      opportunityId: result.id,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * HubSpot Integration
 * https://developers.hubspot.com/
 */
async function syncToHubSpot(lead: CrmLead): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const apiKey = process.env.HUBSPOT_API_KEY;

  if (!apiKey) {
    throw new Error('HUBSPOT_API_KEY not configured');
  }

  try {
    // Create or update contact
    const contactResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          firstname: lead.firstName,
          lastname: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          country: lead.country || 'ZA',
          hs_lead_status: 'Open',
          lifecyclestage: 'lead',
          source: lead.source || 'Website Booking',
          notes: `Services interested: ${(lead.services || []).join(', ')} | Goal: ${lead.wealthGoal || 'Not specified'}`,
        },
      }),
    });

    if (!contactResponse.ok) {
      const error = await contactResponse.json();
      throw new Error(`Failed to create HubSpot contact: ${error.message}`);
    }

    const result = (await contactResponse.json()) as { id: string };

    // Add tags
    if (lead.tags && lead.tags.length > 0) {
      await addHubSpotTags(result.id, lead.tags, apiKey);
    }

    return {
      success: true,
      contactId: result.id,
    };
  } catch (error) {
    throw error;
  }
}

async function createHubSpotDeal(
  opportunity: CrmOpportunity
): Promise<{ success: boolean; opportunityId?: string; error?: string }> {
  const apiKey = process.env.HUBSPOT_API_KEY;

  if (!apiKey) {
    throw new Error('HUBSPOT_API_KEY not configured');
  }

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          dealname: opportunity.name,
          dealstage: 'qualificationstage',
          amount: opportunity.amount?.toString(),
          closedate: opportunity.closeDate?.getTime(),
          description: opportunity.description,
        },
        associations: [
          {
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationType: 'contact_to_deal' }],
            id: opportunity.contactId,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create HubSpot deal: ${error.message}`);
    }

    const result = (await response.json()) as { id: string };

    return {
      success: true,
      opportunityId: result.id,
    };
  } catch (error) {
    throw error;
  }
}

async function addHubSpotTags(contactId: string, tags: string[], apiKey: string): Promise<void> {
  try {
    for (const tag of tags) {
      await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            hs_analytics_num_page_views: tag,
          },
        }),
      });
    }
  } catch (error) {
    console.warn('[HUBSPOT] Failed to add tags:', error);
  }
}

/**
 * Utility
 */

function getCrmProvider(): CrmProvider {
  if (process.env.SALESFORCE_CLIENT_ID) return 'salesforce';
  if (process.env.HUBSPOT_API_KEY) return 'hubspot';
  return 'mock';
}
