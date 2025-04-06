import { NextRequest, NextResponse } from 'next/server';
import { PubChemService } from "@/lib/pubchem";
import { getEnv } from "@/lib/env";

const RDKIT_SERVICE_URL = getEnv('RDKIT_SERVICE_URL') || 'http://localhost:5000';

// Helper function to check if a string contains a valid SVG
function isValidSvg(content: string): boolean {
  return content.trim().startsWith('<svg') && content.includes('</svg>');
}

async function callRdKitService(smiles: string) {
  try {
    const params = new URLSearchParams({
      smiles,
      width: '400',
      height: '300',
      addStereoAnnotation: 'true',
      bondLineWidth: '2.0'
    });

    const url = `${RDKIT_SERVICE_URL}/visualize?${params}`;
    console.log(`Calling RDKit service at: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'image/svg+xml'
      },
    });

    if (!response.ok) {
      throw new Error(`RDKit service returned ${response.status}`);
    }

    const svgContent = await response.text();
    
    // Verify we got valid SVG content
    if (!isValidSvg(svgContent)) {
      throw new Error('Invalid SVG content received from RDKit service');
    }
    
    return svgContent;
  } catch (error) {
    console.error('RDKit service error:', error);
    throw error;
  }
}

async function getPubChemSvg(smiles: string) {
  try {
    const pubchem = new PubChemService();
    const compound = await pubchem.getCompoundBySmiles(smiles);
    
    if (compound && compound.cid) {
      return `https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${compound.cid}&t=l`;
    }
    throw new Error('Could not find compound in PubChem');
  } catch (error) {
    console.error('PubChem error:', error);
    throw error;
  }
}

// Generate a placeholder SVG
function generatePlaceholderSvg(message: string, smiles: string) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="100%" height="100%" fill="#f8f9fa" />
      <text x="50%" y="50%" font-family="Arial" font-size="14" text-anchor="middle" fill="#6c757d">
        ${message}
      </text>
      <text x="50%" y="65%" font-family="Arial" font-size="12" text-anchor="middle" fill="#6c757d">
        SMILES: ${smiles}
      </text>
    </svg>
  `;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const smiles = searchParams.get('smiles');

  if (!smiles) {
    return NextResponse.json(
      { error: 'SMILES parameter is required' },
      { status: 400 }
    );
  }

  // Check if RDKIT_SERVICE_URL is set
  const isRdKitEnabled = !!RDKIT_SERVICE_URL;
  console.log(`RDKit service ${isRdKitEnabled ? 'enabled' : 'disabled'}`);

  try {
    // Try RDKit service first if enabled
    if (isRdKitEnabled) {
      try {
        const svgContent = await callRdKitService(smiles);
        return new NextResponse(svgContent, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400'
          },
        });
      } catch (rdkitError) {
        console.error('RDKit service failed, falling back to PubChem:', rdkitError);
        // Fall through to PubChem fallback
      }
    }

    // Try PubChem as fallback
    try {
      const pubchemUrl = await getPubChemSvg(smiles);
      return NextResponse.redirect(pubchemUrl);
    } catch (pubChemError) {
      console.error('PubChem fallback failed:', pubChemError);
      // Fall through to placeholder
    }

    // If all else fails, return a placeholder SVG
    const placeholderSvg = generatePlaceholderSvg('Visualization service unavailable', smiles);
    return new NextResponse(placeholderSvg, {
      headers: {
        'Content-Type': 'image/svg+xml'
      },
    });
  } catch (error) {
    console.error('Error generating molecule visualization:', error);
    return NextResponse.json(
      { error: 'Failed to generate molecule visualization' },
      { status: 500 }
    );
  }
}

async function callPubChemVisualization(smiles: string, width: number, height: number) {
  // Convert SMILES to URL-encoded format for PubChem
  const encodedSmiles = encodeURIComponent(smiles);
  
  // Use PubChem's PUG View API to get a PNG image
  // This will return an SVG that redirects to the PubChem image
  const svgRedirect = `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <image width="${width}" height="${height}" href="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodedSmiles}/PNG?image_size=${width}x${height}" />
  </svg>`;
  
  return new NextResponse(svgRedirect, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}

function generatePlaceholderSVG(smiles: string): string {
  // Truncate SMILES if it's too long
  const displaySmiles = smiles.length > 30 ? smiles.substring(0, 27) + '...' : smiles;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="300" height="150" viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="150" fill="#f8f9fa" rx="10" ry="10" />
  <text x="150" y="45" font-family="Arial" font-size="14" text-anchor="middle">Molecule Visualization</text>
  <text x="150" y="65" font-family="Arial" font-size="10" text-anchor="middle">(Visualization service unavailable)</text>
  <text x="150" y="95" font-family="monospace" font-size="10" text-anchor="middle" fill="#3b82f6">${displaySmiles}</text>
  <text x="150" y="130" font-family="Arial" font-size="8" text-anchor="middle">Unable to connect to RDKit service</text>
  <text x="150" y="140" font-family="Arial" font-size="8" text-anchor="middle">Please verify that the Python service is running</text>
</svg>`;
} 