import { NextRequest, NextResponse } from 'next/server';
// Dynamic import of RDKit
const RDKit = require('@rdkit/rdkit');

// Initialize RDKit
let rdkit: any = null;
let rdkitPromise: Promise<any> | null = null;

// Cache for previously processed molecules
const moleculeCache: Record<string, string> = {};

// Function to initialize RDKit once and reuse
async function getRDKit() {
  if (rdkit) return rdkit;
  
  if (!rdkitPromise) {
    // Use the initRDKitModule function from the imported module
    rdkitPromise = RDKit.initRDKitModule();
  }
  
  try {
    rdkit = await rdkitPromise;
    return rdkit;
  } catch (error) {
    console.error('Failed to initialize RDKit:', error);
    throw new Error('Failed to initialize molecular visualization library');
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const smiles = url.searchParams.get('smiles');
  const width = parseInt(url.searchParams.get('width') || '300');
  const height = parseInt(url.searchParams.get('height') || '200');
  
  if (!smiles) {
    return NextResponse.json(
      { error: 'SMILES parameter is required' },
      { status: 400 }
    );
  }

  // Check if molecule is in cache
  const cacheKey = `${smiles}-${width}x${height}`;
  if (moleculeCache[cacheKey]) {
    return new NextResponse(moleculeCache[cacheKey], {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  }

  try {
    // Try to fetch from PubChem first (more reliable for common molecules)
    try {
      const encodedSmiles = encodeURIComponent(smiles);
      const pubchemUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodedSmiles}/PNG?image_size=${width}x${height}`;
      
      const pubchemPromise = fetch(pubchemUrl);
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error('PubChem request timed out')), 2000); // Reduced from 3000ms to 2000ms
      });
      
      const result = await Promise.race([pubchemPromise, timeoutPromise]);
      if (result && 'ok' in result && result.ok) {
        const blob = await result.blob();
        const buffer = await blob.arrayBuffer();
        
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400'
          }
        });
      }
    } catch (e) {
      // Continue to RDKit rendering
    }

    // If PubChem fails, use RDKit
    const rdk = await getRDKit();
    
    try {
      // Validate the SMILES by attempting to create a molecule
      const mol = rdk.get_mol(smiles);
      
      if (!mol || mol.is_null()) {
        return NextResponse.json(
          { error: 'Invalid SMILES string' },
          { status: 400 }
        );
      }
      
      // Generate SVG
      const svg = mol.get_svg(width, height);
      
      // Clean up the molecule object
      mol.delete(); 
      
      // Cache the result
      moleculeCache[cacheKey] = svg;
      
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    } catch (error: any) {
      // Generate a fallback SVG with the SMILES as text
      const fallbackSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <rect width="100%" height="100%" fill="#f8f9fa" rx="10" ry="10" />
          <text x="50%" y="50%" font-family="Arial" font-size="12" text-anchor="middle" fill="#6c757d">
            ${smiles.length > 30 ? `${smiles.substring(0, 27)}...` : smiles}
          </text>
        </svg>
      `;
      
      return new NextResponse(fallbackSvg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }
  } catch (error: any) {
    console.error('Molecule visualization error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to generate molecule visualization' },
      { status: 500 }
    );
  }
} 