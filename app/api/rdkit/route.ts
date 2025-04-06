import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isFeatureEnabled, getBaseUrl } from '@/lib/env';

// Function to communicate with Python RDKit API
// This will proxy requests to the Python backend if enabled
async function callRdkitService(endpoint: string, params: Record<string, any>) {
  // Check if we're using the real Python RDKit backend
  if (isFeatureEnabled('PYTHON_RDKIT')) {
    try {
      // In production, this would be a URL to your deployed Python function
      const pythonServiceUrl = process.env.RDKIT_SERVICE_URL || 'http://localhost:3001/api/rdkit';
      
      // Determine whether to use GET or POST based on the endpoint
      if (endpoint === 'visualize') {
        // Build query parameters for GET request
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          queryParams.append(key, value.toString());
        }
        
        const response = await fetch(`${pythonServiceUrl}/${endpoint}?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Accept': 'image/svg+xml',
          },
        });
        
        if (!response.ok) {
          throw new Error(`RDKit service error: ${response.statusText}`);
        }
        
        const svgContent = await response.text();
        return svgContent;
      } else {
        // For other endpoints, use POST with JSON body
        const response = await fetch(`${pythonServiceUrl}/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });
        
        if (!response.ok) {
          throw new Error(`RDKit service error: ${response.statusText}`);
        }
        
        // For SVG responses
        if (endpoint === 'depict' || endpoint === 'optimize') {
          const svgContent = await response.text();
          return svgContent;
        }
        
        // For JSON responses (property prediction, etc)
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error calling RDKit service:', error);
      throw error;
    }
  } else {
    // Fallback implementation (placeholder)
    if (endpoint === 'depict' || endpoint === 'optimize' || endpoint === 'visualize') {
      return generatePlaceholderSVG(params.smiles);
    }
    
    // Placeholder for property prediction
    return {
      predicted_properties: {
        logP: 2.5,
        tpsa: 63.6,
        hba: 2,
        hbd: 1,
        mw: 151.16,
        message: 'Note: These are placeholder predictions. Enable the Python RDKit backend for real predictions.'
      }
    };
  }
}

// Generates a placeholder SVG when the Python backend is not available
function generatePlaceholderSVG(smiles: string): string {
  // Truncate SMILES if it's too long
  const displaySmiles = smiles.length > 30 ? smiles.substring(0, 27) + '...' : smiles;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="300" height="150" viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="150" fill="#f8f9fa" rx="10" ry="10" />
  <text x="150" y="45" font-family="Arial" font-size="14" text-anchor="middle">Molecule Visualization</text>
  <text x="150" y="65" font-family="Arial" font-size="10" text-anchor="middle">(RDKit Python backend not enabled)</text>
  <text x="150" y="95" font-family="monospace" font-size="10" text-anchor="middle" fill="#3b82f6">${displaySmiles}</text>
  <text x="150" y="130" font-family="Arial" font-size="8" text-anchor="middle">Enable PYTHON_RDKIT in your .env file</text>
  <text x="150" y="140" font-family="Arial" font-size="8" text-anchor="middle">and deploy the Python backend</text>
</svg>`;
}

// API route to generate molecule visualization
export async function GET(request: NextRequest) {
  try {
    // Get parameters from the URL
    const url = new URL(request.url);
    const smiles = url.searchParams.get('smiles');
    const width = parseInt(url.searchParams.get('width') || '300', 10);
    const height = parseInt(url.searchParams.get('height') || '200', 10);
    
    if (!smiles) {
      return NextResponse.json(
        { error: 'SMILES parameter is required' },
        { status: 400 }
      );
    }
    
    // Call the RDKit service using the visualize endpoint instead of depict
    // The visualize endpoint supports GET requests with query parameters
    const svgContent = await callRdkitService('visualize', {
      smiles,
      width,
      height,
    });
    
    return new NextResponse(svgContent, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (error) {
    console.error('Error generating molecule visualization:', error);
    return NextResponse.json(
      { error: 'Failed to generate molecule visualization' },
      { status: 500 }
    );
  }
}

// API route to predict molecular properties
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { smiles } = body;
    
    if (!smiles) {
      return NextResponse.json(
        { error: 'SMILES parameter is required' },
        { status: 400 }
      );
    }
    
    // Call the RDKit service for property prediction
    const properties = await callRdkitService('properties', { smiles });
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error predicting molecular properties:', error);
    return NextResponse.json(
      { error: 'Failed to predict molecular properties' },
      { status: 500 }
    );
  }
} 