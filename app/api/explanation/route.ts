import { NextRequest, NextResponse } from 'next/server';
import { generateExplanation, DrugModificationData, LLMProvider, getExampleExplanation } from '@/lib/llmService';
import { generateDrugModificationExplanation } from '@/lib/deepseek';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds timeout

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Check if demo mode is enabled or required fields are missing
    const demoMode = data.demo_mode === true;
    const hasRequiredFields = data.original_drug_name && data.original_smiles && data.modified_smiles;
    
    if (!hasRequiredFields) {
      return NextResponse.json(
        { error: 'Missing required fields: original_drug_name, original_smiles, modified_smiles' },
        { status: 400 }
      );
    }
    
    let explanation = '';
    
    // If demo mode, use predefined example explanations
    if (demoMode) {
      explanation = getExampleExplanation(data.original_drug_name);
    } else {
      // Otherwise, generate explanation using the DeepSeek API
      explanation = await generateDrugModificationExplanation({
        original_drug_name: data.original_drug_name,
        original_smiles: data.original_smiles,
        original_formula: data.original_formula || '',
        original_purpose: data.original_purpose || 'Medication',
        modified_smiles: data.modified_smiles,
        modified_formula: data.modified_formula,
        modification_description: data.modification_description || 'Chemical modification',
        modification_goal: data.modification_goal || 'Improve drug properties',
        expected_benefits: data.expected_benefits || 'Enhanced therapeutic properties',
        potential_drawbacks: data.potential_drawbacks,
        swissadme_summary: data.swissadme_summary,
        database_summary: data.database_summary,
        toxicity_info: data.toxicity_info,
        mechanistic_insight: data.mechanistic_insight
      });
    }
    
    return NextResponse.json({
      explanation,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error generating explanation:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation', details: error.message || String(error) },
      { status: 500 }
    );
  }
} 