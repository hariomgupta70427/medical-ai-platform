/**
 * LLM Service
 * 
 * This module provides a unified interface for generating drug modification explanations
 * using different LLM providers (DeepSeek, OpenAI, etc.)
 */

import { generateDrugModificationExplanation } from './deepseek';
import { generateOpenAIDrugExplanation } from './openai';

export type LLMProvider = 'deepseek' | 'openai' | 'auto';

export interface DrugModificationData {
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
}

/**
 * Generate a drug modification explanation using the specified LLM provider
 */
export async function generateExplanation(
  drugData: DrugModificationData,
  provider: LLMProvider = 'auto'
): Promise<string> {
  try {
    // Determine which provider to use
    let actualProvider = provider;
    
    if (provider === 'auto') {
      // Logic to choose the best provider based on available API keys and other factors
      if (process.env.DEEPSEEK_API_KEY) {
        actualProvider = 'deepseek';
      } else if (process.env.OPENAI_API_KEY) {
        actualProvider = 'openai';
      } else {
        // No API keys available, return a simple fallback
        return generateFallbackExplanation(drugData);
      }
    }
    
    // Call the appropriate provider
    switch (actualProvider) {
      case 'deepseek':
        return await generateDrugModificationExplanation(drugData);
      case 'openai':
        return await generateOpenAIDrugExplanation(drugData);
      default:
        return generateFallbackExplanation(drugData);
    }
  } catch (error) {
    console.error('Error generating explanation:', error);
    return generateFallbackExplanation(drugData);
  }
}

/**
 * Generate a basic fallback explanation when no API is available
 */
function generateFallbackExplanation(drugData: DrugModificationData): string {
  return `
## Drug Modification Analysis: ${drugData.original_drug_name}

The modification to ${drugData.original_drug_name} involves ${drugData.modification_description}. This change aims to ${drugData.modification_goal}, which could potentially provide important benefits such as ${drugData.expected_benefits}.

However, this modification comes with potential trade-offs, including ${drugData.potential_drawbacks || 'some unknown risks that would require further testing'}.

👉 **Bottom line**: This modification shows promise for improving ${drugData.original_drug_name}'s clinical profile, but would benefit from additional computational and experimental validation.

(Note: This is a fallback explanation generated without using an LLM API. For more detailed insights, please configure an API key for DeepSeek or OpenAI.)
`;
}

/**
 * Get an example drug modification explanation similar to what the DeepSeek API would return
 * This is used for demonstration purposes when no API is available
 */
export function getExampleExplanation(drugName: string = "Aspirin"): string {
  const examples: Record<string, string> = {
    "Aspirin": `
## Aspirin Modification: Enhancing Gastric Tolerance

The molecular modification made to aspirin (acetylsalicylic acid) involves replacing the carboxylic acid group with a glycol ester. This change was specifically implemented to address one of aspirin's most significant drawbacks: gastric irritation.

### The Science Behind This Change

Standard aspirin contains a carboxylic acid group that becomes ionized in the acidic environment of the stomach. This ionized form can directly irritate the gastric mucosa, leading to the common side effects of stomach pain, inflammation, and in some cases, ulceration. By converting this carboxylic acid to a glycol ester, we've effectively "masked" the acidic functionality.

### How This Improves Drug Behavior

This modification works through several mechanisms:

1. **Reduced Direct Irritation**: The ester functionality is not acidic like the carboxylic acid it replaces, so it doesn't directly irritate the stomach lining.

2. **Delayed Activation**: The ester bond must be hydrolyzed by esterases in the body before releasing the active salicylate. This means less active drug is present in the stomach and more is released after absorption.

3. **Maintained Efficacy**: Once the ester is hydrolyzed, the standard active metabolite of aspirin is released, maintaining the drug's core anti-inflammatory and anti-platelet effects.

The SwissADME analysis supports these benefits, showing an increased topological polar surface area (TPSA) and slightly reduced lipophilicity (LogP), which together may reduce the drug's tendency to penetrate and damage the gastric mucosa, while maintaining good blood-brain barrier permeability.

### Trade-offs and Risks

This modification isn't without potential drawbacks:

1. **Delayed Onset**: The need for ester hydrolysis means the drug likely has a slower onset of action compared to standard aspirin. This makes it less suitable for situations requiring rapid pain relief.

2. **Metabolism Variations**: Individual differences in esterase activity could lead to variable drug response between patients.

3. **New Metabolites**: The glycol component released after hydrolysis introduces a new metabolite not present with standard aspirin, though toxicity predictions don't indicate this presents significant concerns.

### Recommendation

This modification appears quite promising. By addressing one of aspirin's primary limitations while preserving its therapeutic benefits, this modified version could significantly improve patient compliance and reduce adverse events, particularly for those requiring long-term aspirin therapy for cardioprotection.

The slight delay in onset should be weighed against the substantial benefit of improved gastric tolerability. For acute pain relief, traditional formulations might still be preferred, but for chronic preventative use, this modification offers clear advantages.

👉 **Bottom line**: This glycol ester modification of aspirin represents a smart, targeted change that maintains therapeutic efficacy while potentially eliminating its most problematic side effect, making it an excellent candidate for development, particularly for long-term use patients.
`,

    "Ibuprofen": `
## Ibuprofen Modification: Protecting Kidney Function

The modification made to ibuprofen involves creating a dimer structure with a cleavable linker between two ibuprofen molecules. This represents a thoughtful approach to addressing one of ibuprofen's significant adverse effects: kidney toxicity.

### The Science Behind This Change

Standard ibuprofen works by inhibiting cyclooxygenase (COX) enzymes, reducing prostaglandin synthesis throughout the body. While this mechanism produces the desired anti-inflammatory and analgesic effects, it also reduces prostaglandin production in the kidneys, where these compounds play a crucial role in maintaining renal blood flow and function.

By creating a dimer with a cleavable linker, this modification effectively creates a prodrug that:
1. Has different physical properties than the parent compound
2. Requires metabolic activation to release the active drug molecules

### How This Improves Drug Behavior

The primary benefit of this approach is more selective drug distribution and activation:

1. **Reduced Renal Concentration**: The larger, more complex dimer structure likely has different distribution properties than standard ibuprofen, potentially reducing direct exposure in the kidneys.

2. **Controlled Release**: As the linker gradually cleaves in vivo, active ibuprofen is released over time, preventing high peak concentrations that can overwhelm detoxification pathways.

3. **Preserved Efficacy**: Once the linker is cleaved, standard ibuprofen is released, maintaining the original drug's proven efficacy for pain and inflammation.

### Trade-offs and Risks

This clever modification does introduce some potential concerns:

1. **Altered Pharmacokinetics**: The modified structure will have different absorption, distribution, and elimination properties, necessitating dose adjustments.

2. **Complex Metabolism**: The cleavage of the linker adds an additional metabolic step that could be affected by individual variability or drug interactions.

3. **Manufacturing Complexity**: Dimer production likely requires additional synthetic steps, potentially increasing manufacturing costs.

The computational predictions suggest decent pharmacokinetic properties, but the larger molecular size of the dimer could impact bioavailability compared to standard ibuprofen.

### Recommendation

This modification shows considerable promise for patients requiring long-term NSAID therapy who may be at risk for renal complications. The approach of using a cleavable linker to create a prodrug represents sophisticated pharmaceutical design thinking.

For acute, short-term use, the additional complexity may not be warranted, but for chronic pain conditions requiring ongoing NSAID therapy, particularly in patients with existing kidney concerns, this modified version could offer a meaningful safety advantage.

Further in vivo studies would be particularly valuable to confirm the theoretical kidney-protective effects and to establish appropriate dosing regimens given the likely altered pharmacokinetics.

👉 **Bottom line**: This ibuprofen dimer represents an intelligent application of prodrug strategy to potentially reduce kidney toxicity while preserving therapeutic benefits, making it particularly valuable for patients requiring long-term NSAID therapy.
`,

    "Paracetamol": `
## Paracetamol Modification: Reducing Liver Toxicity

The modification applied to paracetamol (acetaminophen) involves methylation of the phenolic hydroxyl group, creating a methyl ether prodrug. This represents a targeted approach to addressing paracetamol's most serious clinical concern: hepatotoxicity.

### The Science Behind This Change

Standard paracetamol undergoes metabolism primarily through glucuronidation and sulfation pathways. However, approximately 5-10% is processed through the cytochrome P450 system (particularly CYP2E1), generating the toxic metabolite N-acetyl-p-benzoquinone imine (NAPQI). When paracetamol is taken at recommended doses, this NAPQI is detoxified by glutathione. However, in overdose situations or in patients with compromised liver function, glutathione stores become depleted, allowing NAPQI to bind to cellular proteins and cause hepatic necrosis.

By methylating the phenolic hydroxyl group, this modification blocks one of the key sites involved in CYP450-mediated oxidation to NAPQI.

### How This Improves Drug Behavior

This modification works through several mechanisms:

1. **Reduced Toxic Metabolite Formation**: By blocking the phenolic hydroxyl group, the modified drug is less likely to form the hepatotoxic NAPQI metabolite through CYP450 metabolism.

2. **Prodrug Activation**: The methyl group is likely removed by carboxylesterases in the body, releasing the active drug after the prodrug has been distributed throughout the body.

3. **Maintained Therapeutic Effect**: Once demethylated, the drug reverts to standard paracetamol, preserving its established analgesic and antipyretic effects.

### Trade-offs and Risks

While promising, this modification introduces some potential concerns:

1. **Delayed Onset**: As a prodrug requiring enzymatic activation, the modified version likely has a slower onset of action compared to standard paracetamol.

2. **Enzyme-Dependent Efficacy**: Variations in carboxylesterase activity between patients could lead to variable drug response.

3. **Incomplete Protection**: While the modification should reduce NAPQI formation, it may not eliminate it entirely if alternative metabolic pathways exist.

### Recommendation

This methylated prodrug approach appears quite promising for improving paracetamol's safety profile. The simple chemical modification effectively targets the known mechanism of toxicity while preserving the drug's therapeutic benefits.

This modified version would be particularly valuable in several scenarios:
- For patients with liver disease or compromised hepatic function
- In formulations intended for children, where dosing errors can be particularly dangerous
- In extended-release formulations, where higher total drug loads are present

The slower onset would need to be considered in clinical use, potentially making it less suitable for situations requiring rapid fever or pain control, but this trade-off seems reasonable given the safety benefits.

👉 **Bottom line**: This methyl ether modification of paracetamol represents a clever pharmaceutical intervention that directly addresses the drug's known toxicity mechanism, potentially creating a safer alternative with minimal impact on efficacy, though the altered onset time would need consideration in clinical use.
`
  };
  
  return examples[drugName] || examples["Aspirin"];
} 