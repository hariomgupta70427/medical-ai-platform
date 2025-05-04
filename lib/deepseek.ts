/**
 * OpenRouter API Integration
 * 
 * This module provides a client for the OpenRouter API to generate
 * responses for the MediAI chatbot.
 * 
 * OpenRouter API Documentation: https://openrouter.ai/docs
 */

import { DrugModificationData } from "./llmService";

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Call the OpenRouter API for general conversation
 */
export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const API_KEY = process.env.DEEPSEEK_API_KEY;
    
    if (!API_KEY) {
      console.warn('API key is not configured');
      return `I'm sorry, I'm unable to process your request as the API key hasn't been configured. Please contact the administrator.`;
    }

    // Validate API key format
    if (!API_KEY.startsWith('sk-')) {
      console.error('Invalid API key format. Key should start with "sk-".');
      return `I'm sorry, I'm unable to process your request as the API key is not properly configured. Please check the API key format in your environment variables.`;
    }
    
    console.log('Calling OpenRouter API with messages:', JSON.stringify(messages));
    
    // Ensure there's a system message at the beginning
    if (messages.length === 0 || messages[0].role !== 'system') {
      messages.unshift({
        role: 'system',
        content: 'You are MediAI, a helpful assistant specializing in drug discovery, pharmaceutical chemistry, and molecular optimization. Provide accurate, concise and informative responses about drugs, medications, molecular structures, and chemical modifications.'
      });
    }
    
    try {
      // Use a local fallback for development/testing
      const useLocalFallback = false; // Set to false to use the actual API
      
      if (useLocalFallback) {
        console.log('Using local fallback response');
        const userMessage = messages[messages.length - 1].content.toLowerCase();
        
        if (userMessage.includes('aspirin')) {
          return "Aspirin (acetylsalicylic acid) is a common non-steroidal anti-inflammatory drug (NSAID). It works by inhibiting the production of prostaglandins, which are substances in the body that cause inflammation, pain, and fever. Specifically, aspirin irreversibly inhibits the enzyme cyclooxygenase (COX), which is responsible for producing prostaglandins.\n\nMechanism of action:\n1. Aspirin acetylates the COX enzyme, preventing it from functioning\n2. This reduces prostaglandin production\n3. Lower prostaglandin levels reduce inflammation, pain, and fever\n\nAspirin also has antiplatelet effects, which is why it's used in low doses to prevent heart attacks and strokes in at-risk individuals. It prevents platelets from sticking together and forming clots by inhibiting thromboxane A2 production.";
        }
        
        if (userMessage.includes('paracetamol') || userMessage.includes('acetaminophen')) {
          return "Paracetamol (also known as acetaminophen) is a widely used over-the-counter analgesic (pain reliever) and antipyretic (fever reducer). Unlike NSAIDs such as aspirin and ibuprofen, paracetamol has minimal anti-inflammatory properties.\n\nThe main side effects of paracetamol include:\n\n1. Hepatotoxicity (liver damage) - This is the most serious potential side effect and typically occurs with overdose or in patients with pre-existing liver conditions. The toxic metabolite N-acetyl-p-benzoquinone imine (NAPQI) depletes glutathione stores in the liver, leading to cell death.\n\n2. Allergic reactions - Rare but can include rash, urticaria (hives), and in severe cases, anaphylaxis.\n\n3. Kidney problems - Long-term use may affect kidney function.\n\n4. Blood disorders - Very rarely, paracetamol can cause blood disorders like thrombocytopenia (low platelet count) or leukopenia (low white blood cell count).\n\nImportantly, paracetamol is generally safe when taken as directed, but the therapeutic window is narrower than for many other medications.";
        }
        
        if (userMessage.includes('ibuprofen')) {
          return "Ibuprofen is a non-steroidal anti-inflammatory drug (NSAID) that works by inhibiting cyclooxygenase (COX) enzymes, which are responsible for producing prostaglandins - compounds involved in inflammation and pain.\n\nMechanism of action in the body:\n\n1. Inhibition of COX enzymes: Ibuprofen reversibly inhibits both COX-1 and COX-2 enzymes, though it has a slightly greater effect on COX-2.\n\n2. Reduced prostaglandin synthesis: By blocking COX enzymes, ibuprofen decreases the production of prostaglandins, which are key mediators of pain, inflammation, and fever.\n\n3. Anti-inflammatory effects: Decreased prostaglandin levels reduce the inflammatory response, including swelling, redness, and heat.\n\n4. Analgesic (pain-relieving) effects: By reducing prostaglandins at sites of injury, ibuprofen diminishes pain signal transmission to the brain.\n\n5. Antipyretic (fever-reducing) effects: Ibuprofen reduces fever by affecting the hypothalamic heat-regulating center, primarily through decreased prostaglandin E2 production in the central nervous system.\n\nIbuprofen is absorbed rapidly from the gastrointestinal tract and metabolized in the liver, with a half-life of about 2-4 hours. It's primarily excreted through the kidneys.";
        }
        
        return "I'm MediAI, a pharmaceutical assistant specializing in drug discovery, medicinal chemistry, and molecular optimization. I can help answer questions about medications, drug mechanisms, molecular structures, and pharmaceutical research. What specific information about drugs or medications would you like to know about?";
      }
      
      // Call actual OpenRouter API
      console.log('Making OpenRouter API call with key:', API_KEY.substring(0, 5) + '...');
      
      // Format messages for OpenAI compatibility
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'system' ? 'system' : msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'https://mediai.app',
          'X-Title': 'MediAI Drug Discovery Assistant'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your API key configuration.');
        }
        
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('OpenRouter API response:', JSON.stringify(data, null, 2));
      
      if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
        console.error('Unexpected OpenRouter API response format:', JSON.stringify(data));
        throw new Error('Invalid response from OpenRouter API');
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenRouter API:', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error,
        messages: messages
      });
      return `I'm sorry, I encountered an error while processing your request. ${error instanceof Error ? error.message : 'Please try again later.'}`;
    }
  } catch (error: any) {
    console.error('Error generating chat response with OpenRouter:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : error,
      messages: messages
    });
    return `I'm sorry, I encountered an error while processing your request. ${error.message}`;
  }
}

/**
 * Generate a drug modification explanation using the DeepSeek API
 */
export async function generateDrugModificationExplanation(
  data: DrugModificationData
): Promise<string> {
  // In a real implementation, this would call the DeepSeek API
  // For now, we'll return a fallback explanation
  return `
## Drug Modification Analysis: ${data.original_drug_name}

The modification to ${data.original_drug_name} involves ${data.modification_description}. This change aims to ${data.modification_goal}, which could potentially provide important benefits such as ${data.expected_benefits}.

However, this modification comes with potential trade-offs, including ${data.potential_drawbacks || 'some unknown risks that would require further testing'}.

👉 **Bottom line**: This modification shows promise for improving ${data.original_drug_name}'s clinical profile, but would benefit from additional computational and experimental validation.

(Note: This is a fallback explanation generated without using an LLM API. For more detailed insights, please configure an API key for DeepSeek or OpenAI.)
`;
}

/**
 * Format a prompt for the DeepSeek API based on drug modification data
 */
export function formatPromptFromData(data: DrugModificationData): string {
  return `
Analyze the following drug modification:

Original Drug: ${data.original_drug_name}
Original SMILES: ${data.original_smiles}
Original Formula: ${data.original_formula}
Original Purpose: ${data.original_purpose}

Modified SMILES: ${data.modified_smiles}
Modification Description: ${data.modification_description}
Modification Goal: ${data.modification_goal}
Expected Benefits: ${data.expected_benefits}
${data.potential_drawbacks ? `Potential Drawbacks: ${data.potential_drawbacks}` : ''}
${data.swissadme_summary ? `SwissADME Summary: ${data.swissadme_summary}` : ''}
${data.toxicity_info ? `Toxicity Information: ${data.toxicity_info}` : ''}
${data.mechanistic_insight ? `Mechanistic Insight: ${data.mechanistic_insight}` : ''}

Provide a detailed scientific explanation of this drug modification, including:
1. The scientific reasoning behind the modification
2. How the structural changes affect the drug's behavior in the body
3. The potential benefits compared to the original drug
4. Any potential drawbacks or concerns
5. A brief recommendation on whether this modification appears promising

Format your response in Markdown with appropriate sections and scientific detail.
`;
} 