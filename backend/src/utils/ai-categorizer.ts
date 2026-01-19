import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const allowedCategories = [
  'food',
  'coffee',
  'transport',
  'uber',
  'rent',
  'education',
  'shopping',
  'clothing',
  'entertainment',
  'phone',
  'electricity',
  'water',
  'wifi',
  'gas',
  'utilities',
  'savings',
  'income',
  'allowance',
  'other'
] as const;

type AllowedCategory = (typeof allowedCategories)[number];

function normalizeCategory(value: string): AllowedCategory {
  const normalized = value.trim().toLowerCase().replace(/[^a-z]/g, '');
  const match = allowedCategories.find((cat) => cat === normalized);
  return match ?? 'other';
}

export async function categorizeWithAI(description: string, amount: number, date: string): Promise<AllowedCategory> {
  if (!process.env.OPENAI_API_KEY) return 'other';

  const input =
    'You are categorizing a single bank transaction for a budgeting app.\n' +
    `Transaction:\n- Description: ${description}\n- Amount: ${amount}\n- Date: ${date}\n\n` +
    `Return ONLY ONE category from this list:\n${allowedCategories.join(', ')}\n` +
    'Do not add any extra text.';

  try {
    const completion = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input,
      max_output_tokens: 20
    });

    return normalizeCategory(completion.output_text || 'other');
  } catch {
    return 'other';
  }
}
