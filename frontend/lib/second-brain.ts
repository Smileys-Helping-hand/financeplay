/**
 * Second Brain Ecosystem Integration
 * Connect FinancePlay to the Master Hub
 *
 * This module handles all communication with the Second Brain
 * (central ecosystem controller)
 */

import axios from 'axios';

const SECOND_BRAIN_API_URL = process.env.NEXT_PUBLIC_SECOND_BRAIN_URL || 'http://localhost:3000';
const SECOND_BRAIN_API_KEY = process.env.NEXT_PUBLIC_SECOND_BRAIN_API_KEY || '';

// Create Second Brain client
const secondBrainClient = axios.create({
  baseURL: SECOND_BRAIN_API_URL,
  headers: {
    'Authorization': `Bearer ${SECOND_BRAIN_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// ==================== AUTHENTICATION ==================

/**
 * Get current user profile from Second Brain
 */
export async function getSecondBrainUser() {
  try {
    const response = await secondBrainClient.get('/api/auth/me');
    return response.data;
  } catch (err: any) {
    console.error('Failed to get user from Second Brain:', err.message);
    throw new Error('Cannot reach Master Hub');
  }
}

/**
 * Register user with Second Brain
 */
export async function registerWithSecondBrain(userId: string, email: string, displayName: string) {
  try {
    const response = await secondBrainClient.post('/api/auth/register', {
      uid: userId,
      email,
      displayName
    });
    return response.data;
  } catch (err: any) {
    console.error('Failed to register with Second Brain:', err.message);
    throw err;
  }
}

/**
 * Login with Second Brain
 */
export async function loginWithSecondBrain(userId: string, email: string) {
  try {
    const response = await secondBrainClient.post('/api/auth/login', {
      uid: userId,
      email
    });
    return response.data;
  } catch (err: any) {
    console.error('Failed to login with Second Brain:', err.message);
    throw err;
  }
}

// ==================== GATEWAY ROUTING ==================

/**
 * Route a request through Second Brain to another app
 * Useful for inter-app communication
 */
export async function routeToApp(
  targetApp: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  data?: any
) {
  try {
    const response = await secondBrainClient.post('/api/gateway/route', {
      targetApp,
      method,
      path,
      data
    });
    return response.data;
  } catch (err: any) {
    console.error(`Failed to route to ${targetApp}:`, err.message);
    throw err;
  }
}

// ==================== DATA SYNCHRONIZATION ==================

/**
 * Get all data from all connected apps
 * Aggregates data across the entire ecosystem
 */
export async function getAllEcosystemData() {
  try {
    const response = await secondBrainClient.post('/api/sync/all-data');
    return response.data;
  } catch (err: any) {
    console.error('Failed to sync data:', err.message);
    throw err;
  }
}

/**
 * Sync specific data type to another app
 */
export async function syncDataToApp(
  targetApp: string,
  dataType: string,
  payload: any
) {
  try {
    const response = await secondBrainClient.post('/api/sync/push-data', {
      targetApp,
      dataType,
      payload
    });
    return response.data;
  } catch (err: any) {
    console.error(`Failed to sync to ${targetApp}:`, err.message);
    throw err;
  }
}

// ==================== CONNECTED APPS ==================

/**
 * Get list of all connected apps in the ecosystem
 */
export async function getConnectedApps() {
  try {
    const response = await secondBrainClient.get('/api/apps');
    return response.data;
  } catch (err: any) {
    console.error('Failed to get connected apps:', err.message);
    throw err;
  }
}

// ==================== SEARCH & INSIGHTS ==================

/**
 * Search across all apps
 */
export async function searchEcosystem(query: string) {
  try {
    const response = await secondBrainClient.get('/api/search', {
      params: { query }
    });
    return response.data;
  } catch (err: any) {
    console.error('Search failed:', err.message);
    throw err;
  }
}

/**
 * Get AI insights from across the ecosystem
 */
export async function getEcosystemInsights() {
  try {
    const response = await secondBrainClient.get('/api/insights');
    return response.data;
  } catch (err: any) {
    console.error('Failed to get insights:', err.message);
    throw err;
  }
}

// ==================== JARVIS COMMANDS ==================

/**
 * Execute JARVIS commands that work across all apps
 * Example: "Log a transaction of 500 to FinancePlay"
 */
export async function executeJarvisCommand(command: string, context?: any) {
  try {
    const response = await secondBrainClient.post('/api/jarvis/command', {
      command,
      context
    });
    return response.data;
  } catch (err: any) {
    console.error('JARVIS command failed:', err.message);
    throw err;
  }
}

// ==================== HEALTH CHECK ==================

/**
 * Check if Second Brain is reachable
 */
export async function checkSecondBrainHealth() {
  try {
    const response = await axios.get(`${SECOND_BRAIN_API_URL}/health`);
    return response.data;
  } catch (err) {
    console.error('Second Brain is unreachable');
    return null;
  }
}

export default secondBrainClient;
