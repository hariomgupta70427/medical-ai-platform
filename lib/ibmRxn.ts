/**
 * IBM RXN for Chemistry API Integration
 * Documentation: https://rxn.res.ibm.com/api/v2/docs
 */

import { getApiKeys } from './env';

// IBM RXN API Endpoints
const IBM_RXN_API_BASE = 'https://rxn.res.ibm.com/api/v2';

/**
 * Predict the products of a chemical reaction
 * @param reaction The reaction SMILES string
 * @returns The predicted products
 */
export async function predictReaction(reaction: string) {
  try {
    const { ibmRxn } = getApiKeys();
    
    if (!ibmRxn) {
      throw new Error('IBM RXN API key is not configured. Please add it to your .env file.');
    }
    
    const response = await fetch(`${IBM_RXN_API_BASE}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ibmRxn}`,
      },
      body: JSON.stringify({
        reactants: reaction,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`IBM RXN API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error predicting reaction with IBM RXN:', error);
    throw error;
  }
}

/**
 * Analyze a reaction for feasibility
 * @param reaction The reaction SMILES string
 * @returns Analysis result
 */
export async function analyzeReactionFeasibility(reaction: string) {
  try {
    const { ibmRxn } = getApiKeys();
    
    if (!ibmRxn) {
      throw new Error('IBM RXN API key is not configured. Please add it to your .env file.');
    }
    
    const response = await fetch(`${IBM_RXN_API_BASE}/reaction/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ibmRxn}`,
      },
      body: JSON.stringify({
        reaction: reaction,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`IBM RXN API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing reaction feasibility with IBM RXN:', error);
    throw error;
  }
}

/**
 * Get retrosynthesis suggestions
 * @param target The target molecule SMILES
 * @param options Optional parameters
 * @returns Retrosynthesis suggestions
 */
export async function getRetrosynthesis(target: string, options: { maxSteps?: number } = {}) {
  try {
    const { ibmRxn } = getApiKeys();
    
    if (!ibmRxn) {
      throw new Error('IBM RXN API key is not configured. Please add it to your .env file.');
    }
    
    const maxSteps = options.maxSteps || 3;
    
    const response = await fetch(`${IBM_RXN_API_BASE}/retrosynthesis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ibmRxn}`,
      },
      body: JSON.stringify({
        target: target,
        maxSteps: maxSteps,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`IBM RXN API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting retrosynthesis with IBM RXN:', error);
    throw error;
  }
} 