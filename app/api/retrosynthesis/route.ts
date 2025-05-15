import { NextRequest, NextResponse } from 'next/server';
import { getMockRetrosynthesisData } from './mock-data';
import * as openSourceSynthesis from '../../../lib/openSourceSynthesis';

// Create a simplified version of PubChemService to avoid import issues
class PubChemService {
  async getSmilesByName(name: string): Promise<string | null> {
    try {
      console.log(`Searching for SMILES by name: "${name}"`);
      
      // Try direct PubChem API call
      const encodedName = encodeURIComponent(name.trim());
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodedName}/property/IsomericSMILES,CanonicalSMILES/JSON`;
      
      console.log(`Fetching SMILES from URL: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MedicalAI_Platform/1.0'
        }
      });
      
      // Log response status
      console.log(`SMILES lookup response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`PubChem API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if we got valid data
      if (!data.PropertyTable || 
          !data.PropertyTable.Properties || 
          data.PropertyTable.Properties.length === 0) {
        return null;
      }
      
      // Extract SMILES
      const property = data.PropertyTable.Properties[0];
      const smiles = property.IsomericSMILES || property.CanonicalSMILES;
      
      if (!smiles) {
        return null;
      }
      
      return smiles;
    } catch (error) {
      console.error('Error fetching SMILES from PubChem:', error);
      return null;
    }
  }

  async getCompoundByName(name: string) {
    try {
      const encodedName = encodeURIComponent(name.trim());
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodedName}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,IsomericSMILES,IUPACName/JSON`;
      
      console.log(`Fetching compound data from URL: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MedicalAI_Platform/1.0'
        }
      });
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      
      if (!data.PropertyTable || 
          !data.PropertyTable.Properties || 
          data.PropertyTable.Properties.length === 0) {
        return null;
      }
      
      return {
        name: name,
        ...data.PropertyTable.Properties[0]
      };
    } catch (error) {
      console.error('Error fetching compound from PubChem:', error);
      return null;
    }
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const drugName = searchParams.get('name');
  const smiles = searchParams.get('smiles');
  const maxSteps = parseInt(searchParams.get('maxSteps') || '3', 10);

  // Start timer for tracking execution time
  const startTime = Date.now();
  console.log(`API Request: Retrosynthesis for ${drugName || smiles}`);
  
  if (!drugName && !smiles) {
    return NextResponse.json(
      { error: 'Either drug name or SMILES parameter is required' },
      { status: 400 }
    );
  }

  try {
    // If we have a drug name but no SMILES, get the SMILES from PubChem
    let targetSmiles = smiles;
    let drugInfo: any = null;

    if (!targetSmiles && drugName) {
      // Sanitize drug name - trim and handle URL encoding concerns
      const sanitizedDrugName = drugName.trim();
      
      if (sanitizedDrugName.length === 0) {
        return NextResponse.json(
          { error: 'Drug name cannot be empty' },
          { status: 400 }
        );
      }
      
      console.log(`Processing drug name request: "${sanitizedDrugName}"`);
      
      // Check for open source synthetic routes first
      const openSourceRoute = openSourceSynthesis.findByName(sanitizedDrugName) || 
                             openSourceSynthesis.findByAlternateName(sanitizedDrugName);
      
      if (openSourceRoute) {
        console.log(`Found open source synthetic route for: ${sanitizedDrugName}`);
        const formattedRoute = openSourceSynthesis.formatRoute(openSourceRoute);
        
        // Create a minimal drug info object
        drugInfo = {
          name: sanitizedDrugName,
          smiles: openSourceRoute.targetMolecule,
          source: openSourceRoute.source
        };
        
        // Skip PubChem lookup and use our known data
        targetSmiles = openSourceRoute.targetMolecule;
        
        // Return the response with open source data
        return NextResponse.json({
          drug: drugInfo,
          retrosynthesis: formattedRoute
        });
      }
      
      // If no open source route is found, try similar names
      const similarNames = openSourceSynthesis.findSimilarNames(sanitizedDrugName, 0.7);
      if (similarNames.length > 0) {
        console.log(`Found similar open source route: ${similarNames[0]} for query: ${sanitizedDrugName}`);
        const similarRoute = openSourceSynthesis.findByName(similarNames[0]);
        
        if (similarRoute) {
          const formattedRoute = openSourceSynthesis.formatRoute(similarRoute);
          
          // Create a drug info object
          drugInfo = {
            name: sanitizedDrugName,
            smiles: similarRoute.targetMolecule,
            source: similarRoute.source,
            similarMatch: similarNames[0]
          };
          
          // Use the similar route's SMILES
          targetSmiles = similarRoute.targetMolecule;
          
          // Return the response with similar open source data
          return NextResponse.json({
            drug: drugInfo,
            retrosynthesis: formattedRoute
          });
        }
      }
      
      // If no open source route is found, continue with PubChem lookup
      const pubchem = new PubChemService();
      
      try {
        // First try to get SMILES directly
        console.log(`Attempting to fetch SMILES directly for: "${sanitizedDrugName}"`);
        const directSmiles = await pubchem.getSmilesByName(sanitizedDrugName);
        
        if (directSmiles) {
          console.log(`Successfully found SMILES directly: ${directSmiles}`);
          targetSmiles = directSmiles;
          
          // Also fetch the full compound info if possible
          try {
            drugInfo = await pubchem.getCompoundByName(sanitizedDrugName);
            if (!drugInfo) {
              // If we have SMILES but couldn't get full info, create a minimal info object
              drugInfo = {
                name: sanitizedDrugName,
                canonical_smiles: directSmiles
              };
            }
          } catch (infoError) {
            console.warn('Error fetching complete drug info:', infoError);
            // Create minimal info since we at least have the SMILES
            drugInfo = {
              name: sanitizedDrugName,
              canonical_smiles: directSmiles
            };
          }
        } else {
          // If direct SMILES lookup failed, try alternative approaches
          
          // First, create a mapping of brand names to generic/chemical names
          const brandToGenericMap: Record<string, string> = {
            // Paracetamol/Acetaminophen brand names
            'tylenol': 'acetaminophen',
            'panadol': 'paracetamol',
            'crocin': 'paracetamol',
            'dolo': 'paracetamol',
            'metacin': 'paracetamol',
            'calpol': 'paracetamol',
            
            // Aspirin brand names
            'disprin': 'aspirin',
            'ecosprin': 'aspirin',
            'bufferin': 'aspirin',
            'entrophen': 'aspirin',
            'bayer': 'aspirin',
            
            // Ibuprofen brand names
            'advil': 'ibuprofen',
            'motrin': 'ibuprofen',
            'nurofen': 'ibuprofen',
            'brufen': 'ibuprofen',
            
            // Omeprazole brand names
            'prilosec': 'omeprazole',
            'losec': 'omeprazole',
            'zegerid': 'omeprazole',
            
            // Amoxicillin brand names
            'amoxil': 'amoxicillin',
            'trimox': 'amoxicillin',
            'wymox': 'amoxicillin',
            'polymox': 'amoxicillin',
          };
          
          // Define SMILES strings for common generic drugs
          const knownDrugs: Record<string, string> = {
            'paracetamol': 'CC(=O)Nc1ccc(O)cc1',
            'acetaminophen': 'CC(=O)Nc1ccc(O)cc1',
            'aspirin': 'CC(=O)Oc1ccccc1C(=O)O',
            'acetylsalicylic acid': 'CC(=O)Oc1ccccc1C(=O)O',  // Alternative name for aspirin
            'ibuprofen': 'CC(C)Cc1ccc(C(C)C(=O)O)cc1',
            'omeprazole': 'CC1=CN=C(C=C1OC)C(=O)NC1=NC=C(C)C(=O)N1C',
            'amoxicillin': 'CC1(C)SC2C(NC(=O)C(N)c3ccc(O)cc3)C(=O)N2C1C(=O)O',
            'metformin': 'CN(C)C(=N)NC(=N)N',
            'atorvastatin': 'CC(C)C1=C(C(=O)Nc2ccccc12)C(=O)C(O)Cc3ccc(F)cc3',
            'simvastatin': 'CCC(C)(C)C(=O)OC1CC(C)C=C2C=CC(C)C(CCC3CC(O)CC(=O)O3)C21',
            'lisinopril': 'NCCCCC(NC(=O)C(CC1=CC=CC=C1)NC(=O)C(C(C)CC)N)C(=O)O',
            'metoprolol': 'COCCc1ccc(OCC(O)CNC(C)C)cc1',
            'amlodipine': 'CCOC(=O)C1=C(COCCN)NC(C)=C(C(=O)OC)C1c2ccccc2Cl',
            'losartan': 'CCCCc1nc(Cl)c(CO)n1Cc2ccc(c3ccccc3c2)c4ccccc4C(=O)O'
          };
          
          // Check if the drug name is a brand name, if so, convert to generic name
          const normalizedName = sanitizedDrugName.toLowerCase();
          const genericName = brandToGenericMap[normalizedName] || normalizedName;
          
          // Now check if we have SMILES for the generic name
          if (knownDrugs[genericName]) {
            targetSmiles = knownDrugs[genericName];
            console.log(`Found SMILES through brand-to-generic mapping: ${genericName} -> ${targetSmiles}`);
            
            drugInfo = {
              name: sanitizedDrugName,
              canonical_smiles: targetSmiles
            };
          } else {
            console.log(`No SMILES found for drug: ${sanitizedDrugName}`);
            return NextResponse.json(
              { 
                error: `Could not find SMILES for drug: ${sanitizedDrugName}`,
                message: 'Please check the spelling or try an alternative name (e.g., "Acetaminophen" instead of "Paracetamol")',
                drug: {
                  name: sanitizedDrugName,
                  smiles: null
                },
                // Return empty retrosynthesis structure to avoid null errors in frontend
                retrosynthesis: {
                  paths: [],
                  targetMolecule: ""
                }
              },
              { status: 404 }
            );
          }
        }
      } catch (error) {
        console.error('Error fetching drug data from PubChem:', error);
        // Return an empty but valid structure
        return NextResponse.json(
          { 
            error: `Failed to find drug information for: ${sanitizedDrugName}`,
            message: 'PubChem service could not process this drug name. Try an alternative name.',
            drug: {
              name: sanitizedDrugName,
              smiles: null
            },
            retrosynthesis: {
              paths: [],
              targetMolecule: ""
            }
          },
          { status: 500 }
        );
      }
    }

    // Validate we have a SMILES string before proceeding
    if (!targetSmiles) {
      return NextResponse.json(
        { 
          error: 'No valid SMILES string could be obtained',
          message: 'Please provide a valid drug name or SMILES string directly',
          drug: {
            name: drugName || 'Unknown',
            smiles: null
          },
          retrosynthesis: {
            paths: [],
            targetMolecule: ""
          }
        },
        { status: 400 }
      );
    }

    // Use mock data since we don't have IBM RXN API keys
    console.log('Using mock retrosynthesis data');
    const retrosynthesisData = getMockRetrosynthesisData(drugName || '');
    
    // Ensure drug info is never null
    if (!drugInfo) {
      drugInfo = {
        name: drugName || 'Unknown Drug',
        canonical_smiles: targetSmiles
      };
    }
    
    // End timer for tracking execution time
    const endTime = Date.now();
    console.log(`API Response: Retrosynthesis completed in ${endTime - startTime}ms`);
    
    // Return the combined data with consistent structure
    return NextResponse.json({
      drug: {
        name: drugName || drugInfo.name || 'Unknown',
        smiles: targetSmiles,
        ...(drugInfo || {})
      },
      retrosynthesis: retrosynthesisData || {
        paths: [],
        targetMolecule: targetSmiles
      }
    });
  } catch (error: any) {
    // Log the error with timing info
    const endTime = Date.now();
    console.error(`API Error: Retrosynthesis failed after ${endTime - startTime}ms`, error);
    
    // Return a consistent response structure even on error
    return NextResponse.json(
      { 
        error: error.message || 'An unknown error occurred',
        message: 'There was a problem processing your request. Please try again.',
        // Always include minimally valid data structures to avoid null references
        drug: {
          name: drugName || 'Unknown',
          smiles: smiles || null
        },
        retrosynthesis: {
          paths: [],
          targetMolecule: ""
        }
      },
      { status: 500 }
    );
  }
} 