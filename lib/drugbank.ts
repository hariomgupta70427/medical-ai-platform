/**
 * DrugBank API Integration
 * Documentation: https://docs.drugbankplus.com/v1/
 */

import { getApiKeys } from './env';

// DrugBank API Endpoints
const DRUGBANK_API_BASE = 'https://api.drugbankplus.com/v1';

/**
 * Get detailed information about a drug by name
 * @param drugName The name of the drug
 * @returns Detailed drug information
 */
export async function getDrugByName(drugName: string) {
  try {
    const { drugbank } = getApiKeys();
    
    if (!drugbank) {
      throw new Error('DrugBank API key is not configured. Please add it to your .env file.');
    }
    
    const response = await fetch(`${DRUGBANK_API_BASE}/drugs?q=${encodeURIComponent(drugName)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${drugbank}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`DrugBank API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching drug information from DrugBank:', error);
    throw error;
  }
}

/**
 * Get drug interactions for a specific drug
 * @param drugId The DrugBank ID
 * @returns List of drug interactions
 */
export async function getDrugInteractions(drugId: string) {
  try {
    const { drugbank } = getApiKeys();
    
    if (!drugbank) {
      throw new Error('DrugBank API key is not configured. Please add it to your .env file.');
    }
    
    const response = await fetch(`${DRUGBANK_API_BASE}/drugs/${drugId}/interactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${drugbank}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`DrugBank API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching drug interactions from DrugBank:', error);
    throw error;
  }
}

/**
 * Get adverse effects for a specific drug
 * @param drugId The DrugBank ID
 * @returns List of adverse effects
 */
export async function getDrugAdverseEffects(drugId: string) {
  try {
    const { drugbank } = getApiKeys();
    
    if (!drugbank) {
      throw new Error('DrugBank API key is not configured. Please add it to your .env file.');
    }
    
    const response = await fetch(`${DRUGBANK_API_BASE}/drugs/${drugId}/adverse-effects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${drugbank}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`DrugBank API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching adverse effects from DrugBank:', error);
    throw error;
  }
}

/**
 * Search drugs by various criteria
 * @param params Search parameters
 * @returns Search results
 */
export async function searchDrugs(params: {
  name?: string;
  category?: string;
  indication?: string;
  target?: string;
}) {
  try {
    const { drugbank } = getApiKeys();
    
    if (!drugbank) {
      throw new Error('DrugBank API key is not configured. Please add it to your .env file.');
    }
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (params.name) queryParams.append('name', params.name);
    if (params.category) queryParams.append('category', params.category);
    if (params.indication) queryParams.append('indication', params.indication);
    if (params.target) queryParams.append('target', params.target);
    
    const response = await fetch(`${DRUGBANK_API_BASE}/drugs/search?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${drugbank}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`DrugBank API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching drugs in DrugBank:', error);
    throw error;
  }
} 