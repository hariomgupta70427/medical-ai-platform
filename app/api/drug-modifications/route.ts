import { NextRequest, NextResponse } from 'next/server';
import { suggestDrugModifications } from '@/lib/drugModification';
import { generateExplanation } from '@/lib/llmService';
import { getCompoundByName } from '@/lib/pubchem';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds timeout

export async function POST(req: NextRequest) {
  try {
    const { query, drugName } = await req.json();

    if (!query && !drugName) {
      return NextResponse.json(
        { error: 'Query or drug name is required' },
        { status: 400 }
      );
    }

    // Use the provided drug name or extract it from the query
    const targetDrug = drugName || extractDrugName(query);
    
    if (!targetDrug) {
      return NextResponse.json(
        { error: 'Could not identify a valid drug name' },
        { status: 400 }
      );
    }

    // Get modification suggestions
    const modifications = await suggestDrugModifications(targetDrug);
    
    if (!modifications || modifications.length === 0) {
      return NextResponse.json(
        { error: 'No modification suggestions available for this drug' },
        { status: 404 }
      );
    }

    // Get drug information from PubChem
    const drugInfo = await getCompoundByName(targetDrug);
    
    // Generate a scientific explanation for the first modification
    const firstMod = modifications[0];
    
    const explanationData = {
      original_drug_name: targetDrug,
      original_smiles: drugInfo?.CanonicalSMILES || "",
      original_formula: drugInfo?.MolecularFormula || "",
      original_purpose: drugInfo?.description || firstMod.original_purpose || "Not available",
      modified_smiles: firstMod.modified_smiles || "",
      modification_description: firstMod.description || "",
      modification_goal: firstMod.goal || "improve drug properties",
      expected_benefits: firstMod.benefits || "potential therapeutic benefits",
      potential_drawbacks: firstMod.drawbacks || "",
      swissadme_summary: firstMod.swissadme_data || "",
      database_summary: firstMod.database_info || "",
      toxicity_info: firstMod.toxicity_data || "",
      mechanistic_insight: firstMod.mechanism || ""
    };
    
    let explanation = "";
    
    try {
      explanation = await generateExplanation(explanationData);
    } catch (error) {
      console.error("Error generating explanation:", error);
      explanation = "Could not generate explanation. Please try again later.";
    }

    return NextResponse.json({
      drug: targetDrug,
      drugInfo,
      modifications,
      explanation
    });
  } catch (error) {
    console.error('Error processing drug modification request:', error);
    return NextResponse.json(
      { error: 'Failed to process drug modification request' },
      { status: 500 }
    );
  }
}

function extractDrugName(query: string): string | null {
  if (!query) return null;
  
  const commonDrugs = [
    'aspirin', 'ibuprofen', 'acetaminophen', 'paracetamol', 'lisinopril',
    'metformin', 'atorvastatin', 'simvastatin', 'amlodipine', 'amoxicillin',
    'hydrochlorothiazide', 'losartan', 'albuterol', 'fluticasone', 'omeprazole',
    'gabapentin', 'metoprolol', 'levothyroxine', 'fluoxetine', 'sertraline'
  ];
  
  const lowerQuery = query.toLowerCase();
  
  for (const drug of commonDrugs) {
    if (lowerQuery.includes(drug)) {
      return drug;
    }
  }
  
  return null;
}
