/**
 * Drug Modification Utility Functions
 * 
 * Provides functionality for suggesting drug modifications using:
 * - Predefined modifications for common drugs
 * - RDKit API for molecular manipulation (when available)
 * - IBM RXN for chemistry predictions (when available)
 */

import { getSmilesByName, getCompoundProperties } from './pubchem';
import { isFeatureEnabled, getBaseUrl, getApiKeys } from './env';
import { getRetrosynthesis, predictReaction } from './ibmRxn';

export interface ModificationSuggestion {
  originalDrug: string;
  originalSmiles?: string;
  modifiedSmiles?: string;
  modificationDescription: string;
  expectedBenefits: string;
  potentialDrawbacks?: string;
  confidenceScore?: number; // 0-1
  feasibility?: number; // 0-1, synthetic feasibility
  reactionPrediction?: string; // Reaction prediction from IBM RXN
  molecularFormula?: string; // Molecular formula of the original compound
}

// For API integration with newer endpoints
export interface DrugModification {
  id: string;
  original_drug_name: string;
  original_smiles: string;
  original_purpose?: string;
  modified_smiles: string;
  description: string;
  goal?: string;
  benefits: string;
  drawbacks?: string;
  swissadme_data?: string;
  database_info?: string;
  toxicity_data?: string;
  mechanism?: string;
  confidence_score?: number;
}

// Predefined modifications for common drugs
const DRUG_MODIFICATIONS: Record<string, ModificationSuggestion> = {
  'aspirin': {
    originalDrug: 'Aspirin',
    originalSmiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    modifiedSmiles: 'CC(=O)OC1=CC=CC=C1C(=O)OCCO', // This would be a real modified structure in production
    modificationDescription: 'Addition of a glycol ester group to reduce direct contact with gastric mucosa',
    expectedBenefits: 'Reduced gastrointestinal irritation while maintaining anti-inflammatory and anti-platelet effects',
    potentialDrawbacks: 'Potentially slower onset of action due to the need for esterase-mediated hydrolysis',
    confidenceScore: 0.75,
    molecularFormula: 'C9H8O4' // Aspirin's molecular formula
  },
  'ibuprofen': {
    originalDrug: 'Ibuprofen',
    originalSmiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
    modifiedSmiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)OCOC(=O)C(C)C', // Example modification
    modificationDescription: 'Creation of a dimer with a cleavable linker',
    expectedBenefits: 'Reduced direct COX inhibition in the kidneys, potentially reducing renal side effects',
    potentialDrawbacks: 'May have altered pharmacokinetics and require dose adjustment',
    confidenceScore: 0.68,
    molecularFormula: 'C13H18O2'
  },
  'paracetamol': {
    originalDrug: 'Paracetamol',
    originalSmiles: 'CC(=O)NC1=CC=C(C=C1)O',
    modifiedSmiles: 'CC(=O)NC1=CC=C(C=C1)OC', // Methylated derivative
    modificationDescription: 'Methylation of the phenolic hydroxyl group to create a prodrug form',
    expectedBenefits: 'Reduced formation of the hepatotoxic metabolite N-acetyl-p-benzoquinone imine (NAPQI)',
    potentialDrawbacks: 'May have reduced efficacy until metabolized to the active form',
    confidenceScore: 0.82,
    molecularFormula: 'C8H9NO2'
  },
  'acetaminophen': {
    originalDrug: 'Acetaminophen',
    originalSmiles: 'CC(=O)NC1=CC=C(C=C1)O',
    modifiedSmiles: 'CC(=O)NC1=CC=C(C=C1)OC', // Same as paracetamol (they're the same compound)
    modificationDescription: 'Methylation of the phenolic hydroxyl group to create a prodrug form',
    expectedBenefits: 'Reduced formation of the hepatotoxic metabolite N-acetyl-p-benzoquinone imine (NAPQI)',
    potentialDrawbacks: 'May have reduced efficacy until metabolized to the active form',
    confidenceScore: 0.82,
    molecularFormula: 'C8H9NO2'
  }
};

/**
 * Suggests multiple modifications for a given drug
 * Combines predefined modifications and algorithmically generated ones when available
 */
export async function suggestDrugModifications(drugName: string): Promise<DrugModification[]> {
  const normalizedDrugName = drugName.toLowerCase().trim();
  const modifications: DrugModification[] = [];
  
  // First try our predefined modifications
  const predefinedModification = DRUG_MODIFICATIONS[normalizedDrugName];
  if (predefinedModification) {
    // Convert the predefined modification to the new format
    modifications.push({
      id: `${normalizedDrugName}-mod-1`,
      original_drug_name: predefinedModification.originalDrug,
      original_smiles: predefinedModification.originalSmiles || '',
      original_purpose: '', // Will be filled from PubChem in the route handler
      modified_smiles: predefinedModification.modifiedSmiles || '',
      description: predefinedModification.modificationDescription,
      goal: extractGoalFromDescription(predefinedModification.modificationDescription),
      benefits: predefinedModification.expectedBenefits,
      drawbacks: predefinedModification.potentialDrawbacks,
      confidence_score: predefinedModification.confidenceScore,
      mechanism: getMechanismInfo(normalizedDrugName)
    });
  }
  
  // If RDKit is enabled, try to generate additional modifications dynamically
  if (isFeatureEnabled('PYTHON_RDKIT')) {
    try {
      // Get compound info for the drug
      const compoundProps = await getCompoundProperties(drugName);
      const smiles = compoundProps?.CanonicalSMILES || await getSmilesByName(drugName);
      
      if (smiles) {
        // Generate a few different types of modifications using RDKit
        const modificationTypes = ['add_methyl', 'add_hydroxyl', 'reduce_acidity'];
        
        for (let i = 0; i < modificationTypes.length; i++) {
          try {
            const rdkitMod = await generateModificationWithRdkit(
              drugName, 
              smiles, 
              modificationTypes[i],
              compoundProps || undefined
            );
            
            if (rdkitMod) {
              modifications.push({
                id: `${normalizedDrugName}-mod-${i+2}`,
                original_drug_name: rdkitMod.originalDrug,
                original_smiles: rdkitMod.originalSmiles || '',
                modified_smiles: rdkitMod.modifiedSmiles || '',
                description: rdkitMod.modificationDescription,
                goal: extractGoalFromDescription(rdkitMod.modificationDescription),
                benefits: rdkitMod.expectedBenefits,
                drawbacks: rdkitMod.potentialDrawbacks,
                confidence_score: rdkitMod.confidenceScore
              });
            }
          } catch (error) {
            console.error(`Error generating ${modificationTypes[i]} modification:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error generating modifications with RDKit:', error);
    }
  }
  
  // If we didn't find any modifications, create a placeholder one
  if (modifications.length === 0) {
    modifications.push({
      id: `${normalizedDrugName}-generic`,
      original_drug_name: drugName,
      original_smiles: '',
      modified_smiles: '',
      description: `Generic modification suggestion for ${drugName}`,
      goal: 'improve drug properties',
      benefits: 'Potential improvements in efficacy or reduction in side effects',
      drawbacks: 'Further research and molecular design would be needed'
    });
  }
  
  return modifications;
}

/**
 * Extracts a goal statement from a modification description
 */
function extractGoalFromDescription(description: string): string {
  if (description.includes('reduce') || description.includes('decrease')) {
    return 'reduce side effects';
  }
  if (description.includes('increase') || description.includes('improve')) {
    return 'improve efficacy';
  }
  if (description.includes('solubility')) {
    return 'enhance solubility and bioavailability';
  }
  if (description.includes('metabolic') || description.includes('metabolism')) {
    return 'optimize metabolic profile';
  }
  
  return 'improve drug properties';
}

/**
 * Provides additional mechanism information for common drugs
 */
function getMechanismInfo(drugName: string): string {
  const mechanisms: Record<string, string> = {
    'aspirin': 'The modification affects the carboxylic acid group responsible for direct gastric irritation while preserving the acetyl group that inhibits cyclooxygenase enzyme.',
    'ibuprofen': 'The modification creates a prodrug that releases active ibuprofen more slowly, potentially reducing peak renal concentrations while maintaining COX inhibition.',
    'paracetamol': 'The methylation blocks the hydroxyl group that participates in CYP450-mediated conversion to the hepatotoxic NAPQI metabolite.',
    'acetaminophen': 'The methylation blocks the hydroxyl group that participates in CYP450-mediated conversion to the hepatotoxic NAPQI metabolite.'
  };
  
  return mechanisms[drugName] || '';
}

/**
 * Generates a drug modification using the RDKit API
 * Updated to take a specific modification type
 */
async function generateModificationWithRdkit(
  drugName: string, 
  smiles: string,
  modificationType: string,
  properties?: Record<string, any>
): Promise<ModificationSuggestion | null> {
  try {
    // Call the RDKit API
    const rdkitServiceUrl = process.env.RDKIT_SERVICE_URL || `${getBaseUrl()}/api/rdkit`;
    const response = await fetch(`${rdkitServiceUrl}/modify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        smiles,
        modification_type: modificationType
      }),
    });
    
    if (!response.ok) {
      throw new Error(`RDKit service error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Try IBM RXN for synthetic feasibility and reaction prediction if API key is available
    let feasibility = undefined;
    let reactionPrediction = undefined;
    
    const { ibmRxn } = getApiKeys();
    if (ibmRxn && data.modified_smiles) {
      try {
        // Get retrosynthesis feasibility
        const rxnResponse = await getRetrosynthesis(data.modified_smiles);
        feasibility = rxnResponse?.feasibility || 0.5;
        
        // Try to predict the reaction to create the modified molecule
        const modificationReaction = `${smiles}.CCBr>>[?]`;
        const prediction = await predictReaction(modificationReaction);
        if (prediction && prediction.products) {
          reactionPrediction = prediction.products;
        }
      } catch (error) {
        console.error('Error getting IBM RXN data:', error);
      }
    }
    
    // Create a modification suggestion
    return {
      originalDrug: drugName,
      originalSmiles: smiles,
      modifiedSmiles: data.modified_smiles,
      modificationDescription: getDescriptionForModification(modificationType, drugName),
      expectedBenefits: getBenefitsForModification(modificationType, drugName),
      potentialDrawbacks: 'Potential changes in pharmacokinetic profile. Further testing required.',
      confidenceScore: 0.6, // Lower confidence for algorithmic suggestions
      feasibility,
      reactionPrediction,
      molecularFormula: properties?.MolecularFormula
    };
  } catch (error) {
    console.error('Error generating modification with RDKit:', error);
    return null;
  }
}

/**
 * Gets a description for a specific modification type
 */
function getDescriptionForModification(modificationType: string, drugName: string): string {
  switch (modificationType) {
    case 'add_methyl':
      return `Addition of a methyl group to ${drugName} to alter its metabolic profile`;
    case 'add_hydroxyl':
      return `Addition of a hydroxyl group to ${drugName} to increase solubility`;
    case 'reduce_acidity':
      return `Conversion of carboxylic acid group in ${drugName} to an ester to reduce direct GI irritation`;
    default:
      return `Molecular modification of ${drugName} to improve its pharmacological profile`;
  }
}

/**
 * Gets expected benefits for a specific modification type
 */
function getBenefitsForModification(modificationType: string, drugName: string): string {
  switch (modificationType) {
    case 'add_methyl':
      return `Potentially improved metabolic stability and altered distribution profile for ${drugName}`;
    case 'add_hydroxyl':
      return `Increased hydrophilicity for ${drugName}, potentially improving solubility and reducing lipophilicity-associated toxicity`;
    case 'reduce_acidity':
      return `Reduced direct tissue irritation while maintaining core pharmacological activity of ${drugName}`;
    default:
      return `Potential improvement in the therapeutic index of ${drugName}`;
  }
}

/**
 * Extracts drug names from a user query
 * In a real implementation, this would use NLP/NER like MedCAT
 */
export function extractDrugNames(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  const drugNames: string[] = [];
  
  // Simple keyword matching for predefined drugs
  for (const drug of Object.keys(DRUG_MODIFICATIONS)) {
    if (lowerQuery.includes(drug)) {
      drugNames.push(drug);
    }
  }
  
  // Try to identify other drug names using simple pattern matching
  // This is a very basic approach and would be replaced with NLP in production
  const potentialDrugMatches = lowerQuery.match(/\b[a-z]+(?:mab|nib|zumab|tinib|ciclib|vastatin|sartan|pril|oxacin|mycin|cillin|dronate|lukast|prazole|dipine|olol|azepam|asone)\b/g);
  
  if (potentialDrugMatches) {
    for (const match of potentialDrugMatches) {
      if (!drugNames.includes(match)) {
        drugNames.push(match);
      }
    }
  }
  
  return drugNames;
}

/**
 * Formats a response based on drug modification data
 */
export function formatModificationResponse(modification: ModificationSuggestion): string {
  // Include molecular formula if available
  const formulaInfo = modification.molecularFormula 
    ? `\n\n### Molecular Formula\n${modification.molecularFormula}`
    : '';
    
  // Include synthetic feasibility if available
  const feasibilityInfo = modification.feasibility !== undefined 
    ? `\n\n### Synthetic Feasibility\n${(modification.feasibility * 100).toFixed(1)}%`
    : '';
    
  // Include IBM RXN reaction prediction if available
  const reactionInfo = modification.reactionPrediction
    ? `\n\n### Reaction Prediction\nIBM RXN AI predicted the following product for a modification reaction:\n\`${modification.reactionPrediction}\``
    : '';
    
  return `
## Modification Suggestion for ${modification.originalDrug}

### Original Structure
\`${modification.originalSmiles}\`${formulaInfo}

### Modified Structure
\`${modification.modifiedSmiles}\`

### Modification Description
${modification.modificationDescription}

### Expected Benefits
${modification.expectedBenefits}

### Potential Drawbacks
${modification.potentialDrawbacks || 'None identified.'}

### Confidence Score
${(modification.confidenceScore || 0) * 100}%${feasibilityInfo}${reactionInfo}

Note: In the visualization below, you can see the molecular structure of the modified compound.
`;
} 