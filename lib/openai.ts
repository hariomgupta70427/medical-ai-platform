/**
 * OpenAI API Integration
 * 
 * This module provides a client for the OpenAI API to generate
 * drug modification explanations and insights as an alternative to DeepSeek.
 */
import { formatPromptFromData } from './deepseek';

/**
 * Call the OpenAI API to generate a drug modification explanation
 */
export async function generateOpenAIDrugExplanation(drugData: {
  original_drug_name: string;
  original_smiles: string;
  original_formula: string;
  original_purpose: string;
  modified_smiles: string;
  modified_formula?: string;
  modification_description: string;
  modification_goal: string;
  expected_benefits: string;
  potential_drawbacks?: string;
  swissadme_summary?: string;
  database_summary?: string;
  toxicity_info?: string;
  mechanistic_insight?: string;
}): Promise<string> {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }
    
    // Reuse the same prompt formatting
    const prompt = formatPromptFromData(drugData);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating drug modification explanation with OpenAI:', error);
    throw error;
  }
} 