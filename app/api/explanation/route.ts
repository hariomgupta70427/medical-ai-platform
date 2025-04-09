import { NextRequest, NextResponse } from 'next/server';
import { getExampleExplanation } from '@/lib/llmService';

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
    
    // Always use example explanations for now since we're fixing the API
    const explanation = getExampleExplanation(data.original_drug_name);
    
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