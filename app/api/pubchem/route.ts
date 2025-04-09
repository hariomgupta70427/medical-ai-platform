import { NextResponse } from 'next/server';

interface PubChemCompound {
  cid: number;
  name: string;
  iupac_name?: string;
  molecular_formula?: string;
  molecular_weight?: number;
  canonical_smiles?: string;
  isomeric_smiles?: string;
  inchi?: string;
  inchikey?: string;
  xlogp?: number;
  exact_mass?: number;
  monoisotopic_mass?: number;
  tpsa?: number;
  complexity?: number;
  h_bond_donor_count?: number;
  h_bond_acceptor_count?: number;
  rotatable_bond_count?: number;
  heavy_atom_count?: number;
  isotope_atom_count?: number;
  atom_stereo_count?: number;
  defined_atom_stereo_count?: number;
  undefined_atom_stereo_count?: number;
  bond_stereo_count?: number;
  defined_bond_stereo_count?: number;
  undefined_bond_stereo_count?: number;
  covalent_unit_count?: number;
  created_date?: string;
  modified_date?: string;
  synonyms?: string[];
  description?: string;
  pharmacology?: string;
  image_url?: string;
  image_url_3d?: string;
  pubchem_url?: string;
  indications?: string;
  toxicity?: string;
  drug_classes?: string;
  mechanism_of_action?: string;
  metabolism?: string;
  absorption?: string;
  half_life?: string;
  routes_of_elimination?: string;
  drug_interactions?: string;
  food_interactions?: string;
  adverse_effects?: string;
  sections?: Record<string, Record<string, string>>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const cid = searchParams.get('cid');

  if (!query && !cid) {
    return NextResponse.json(
      { error: 'Query parameter or CID is required' },
      { status: 400 }
    );
  }

  try {
    if (query) {
      // Search for compounds by name
      const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/cids/JSON`;
      console.log('Searching PubChem with URL:', searchUrl);
      
      const searchResponse = await fetch(searchUrl, { 
        headers: { 
          'User-Agent': 'MedicalAI_Platform/1.0 (https://github.com/yourusername/medical-ai-platform; youremail@example.com)'
        }
      });
      const searchText = await searchResponse.text();
      console.log('PubChem search response:', searchText);
      
      // Handle "No CID found" error gracefully
      if (searchResponse.status === 404) {
        console.log('No compounds found for query:', query);
        return NextResponse.json({ compounds: [] });
      }
      
      if (!searchResponse.ok) {
        throw new Error(`PubChem search failed: ${searchResponse.status} ${searchResponse.statusText} - ${searchText}`);
      }

      let searchData;
      try {
        searchData = JSON.parse(searchText);
      } catch (e) {
        console.error('Failed to parse PubChem response:', e);
        throw new Error('Invalid response from PubChem API');
      }
      
      if (!searchData.IdentifierList || !searchData.IdentifierList.CID) {
        console.log('No compounds found for query:', query);
        return NextResponse.json({ compounds: [] });
      }

      // Use batch endpoint to get multiple compounds at once for better performance
      let cids = searchData.IdentifierList.CID.slice(0, 5).join(",");
      const batchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cids}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,InChIKey,IUPACName/JSON`;
      
      try {
        console.log('Fetching batch details for CIDs:', cids);
        const batchResponse = await fetch(batchUrl, {
          headers: { 
            'User-Agent': 'MedicalAI_Platform/1.0'
          }
        });
        const batchText = await batchResponse.text();
        
        if (!batchResponse.ok) {
          console.warn('Failed to fetch batch data, falling back to individual fetches');
          // Continue with individual fetches below
        } else {
          try {
            const batchData = JSON.parse(batchText);
            if (batchData.PropertyTable && batchData.PropertyTable.Properties) {
              // Get titles in a separate batch call
              const titleUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cids}/title/JSON`;
              let titleMap: Record<string, string> = {};
              
              try {
                const titleResponse = await fetch(titleUrl);
                if (titleResponse.ok) {
                  const titleData = await titleResponse.json();
                  if (titleData.InformationList && titleData.InformationList.Information) {
                    titleData.InformationList.Information.forEach((info: any) => {
                      if (info.CID && info.Title) {
                        titleMap[info.CID] = info.Title;
                      }
                    });
                  }
                }
              } catch (e) {
                console.warn('Failed to fetch compound titles:', e);
              }
              
              const compounds = batchData.PropertyTable.Properties.map((prop: any) => {
                return {
                  cid: prop.CID,
                  name: titleMap[prop.CID] || query,
                  ...prop
                };
              });
              
              return NextResponse.json({ compounds });
            }
          } catch (e) {
            console.error('Failed to parse batch response:', e);
            // Continue with individual fetches below
          }
        }
      } catch (e) {
        console.warn('Batch request failed, falling back to individual fetches:', e);
        // Continue with individual fetches below
      }

      // Get simplified information for each compound - only get basic properties to avoid BadRequest errors
      const compounds = await Promise.all(
        searchData.IdentifierList.CID.slice(0, 5).map(async (cid: number) => {
          // Use a simplified property list to avoid 400 BadRequest errors
          const detailUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,InChIKey,IUPACName/JSON`;
          
          console.log('Fetching details for CID:', cid);
          const detailResponse = await fetch(detailUrl, {
            headers: { 
              'User-Agent': 'MedicalAI_Platform/1.0'
            }
          });
          const detailText = await detailResponse.text();
          
          if (!detailResponse.ok) {
            console.warn(`Failed to fetch details for CID ${cid}: ${detailResponse.status} ${detailResponse.statusText} - ${detailText}`);
            // Return basic compound info even if details fail
            return {
              cid,
              name: query
            };
          }

          let detailData;
          try {
            detailData = JSON.parse(detailText);
          } catch (e) {
            console.error('Failed to parse PubChem detail response:', e);
            // Return basic compound info even if details fail
            return {
              cid,
              name: query
            };
          }

          if (!detailData.PropertyTable || !detailData.PropertyTable.Properties || !detailData.PropertyTable.Properties[0]) {
            console.warn(`Invalid property data for CID ${cid}`);
            return {
              cid,
              name: query
            };
          }

          // Get compound title (actual name) from PubChem
          let titleData;
          try {
            const titleResponse = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/title/JSON`);
            if (titleResponse.ok) {
              const titleText = await titleResponse.text();
              titleData = JSON.parse(titleText);
            }
          } catch (e) {
            console.warn(`Could not fetch title for CID ${cid}:`, e);
          }

          const compound = {
            cid,
            name: titleData?.InformationList?.Information?.[0]?.Title || query,
            ...detailData.PropertyTable.Properties[0]
          };
          
          // Convert property names to match our interface
          return mapPubChemPropertiesToCompound(compound);
        })
      );

      return NextResponse.json({ compounds });
    } else if (cid) {
      // Get detailed information for a specific compound by CID using richer property sets
      const detailUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,IsomericSMILES,InChI,InChIKey,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,IUPACName,CreatedDate,Complexity,CovalentUnitCount,HeavyAtomCount,MonoisotopicMass,ExactMass,Title,IsotopeAtomCount,AtomStereoCount,DefinedAtomStereoCount,UndefinedAtomStereoCount,BondStereoCount,DefinedBondStereoCount,UndefinedBondStereoCount/JSON`;
      
      console.log('Fetching details for CID:', cid);
      const detailResponse = await fetch(detailUrl, {
        headers: { 
          'User-Agent': 'MedicalAI_Platform/1.0'
        }
      });
      const detailText = await detailResponse.text();
      console.log('PubChem detail response:', detailText);

      if (!detailResponse.ok) {
        // Try with an even more simplified property list
        console.log('Retrying with fewer properties...');
        const fallbackUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,InChIKey,IUPACName/JSON`;
        
        const fallbackResponse = await fetch(fallbackUrl, {
          headers: { 
            'User-Agent': 'MedicalAI_Platform/1.0'
          }
        });
        const fallbackText = await fallbackResponse.text();
        
        if (!fallbackResponse.ok) {
          throw new Error(`Failed to fetch details for CID ${cid}: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
        }
        
        let fallbackData;
        try {
          fallbackData = JSON.parse(fallbackText);
        } catch (e) {
          throw new Error('Invalid response from PubChem API');
        }
        
        if (!fallbackData.PropertyTable || !fallbackData.PropertyTable.Properties || !fallbackData.PropertyTable.Properties[0]) {
          throw new Error(`Invalid property data for CID ${cid}`);
        }
        
        // Get compound title (actual name)
        let titleData;
        try {
          const titleResponse = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/title/JSON`);
          if (titleResponse.ok) {
            const titleText = await titleResponse.text();
            titleData = JSON.parse(titleText);
          }
        } catch (e) {
          console.warn(`Could not fetch title for CID ${cid}:`, e);
        }
        
        const compoundName = titleData?.InformationList?.Information?.[0]?.Title || `Compound CID ${cid}`;
        
        // Get synonyms (alternative names)
        let synonyms: string[] = [];
        try {
          const synonymsUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/synonyms/JSON`;
          const synonymsResponse = await fetch(synonymsUrl, {
            headers: { 
              'User-Agent': 'MedicalAI_Platform/1.0'
            }
          });
          
          if (synonymsResponse.ok) {
            const synonymsData = await synonymsResponse.json();
            if (synonymsData.InformationList?.Information?.[0]?.Synonym) {
              synonyms = synonymsData.InformationList.Information[0].Synonym.slice(0, 20); // Get top 20 synonyms
            }
          }
        } catch (e) {
          console.warn('Failed to fetch synonyms:', e);
        }
        
        const compoundData = {
          cid: parseInt(cid),
          name: compoundName,
          synonyms,
          description: fallbackData.PropertyTable.Properties[0].Description,
          pharmacology: fallbackData.PropertyTable.Properties[0].Pharmacology,
          indications: fallbackData.PropertyTable.Properties[0].Indications,
          toxicity: fallbackData.PropertyTable.Properties[0].Toxicity,
          drug_classes: fallbackData.PropertyTable.Properties[0].DrugClasses,
          mechanism_of_action: fallbackData.PropertyTable.Properties[0].MechanismOfAction,
          metabolism: fallbackData.PropertyTable.Properties[0].Metabolism,
          absorption: fallbackData.PropertyTable.Properties[0].Absorption,
          half_life: fallbackData.PropertyTable.Properties[0].HalfLife,
          routes_of_elimination: fallbackData.PropertyTable.Properties[0].RoutesOfElimination,
          drug_interactions: fallbackData.PropertyTable.Properties[0].DrugInteractions,
          food_interactions: fallbackData.PropertyTable.Properties[0].FoodInteractions,
          adverse_effects: fallbackData.PropertyTable.Properties[0].AdverseEffects,
          image_url: `https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${cid}&t=l`,
          image_url_3d: `https://pubchem.ncbi.nlm.nih.gov/image/imagefly.cgi?cid=${cid}&width=300&height=300`,
          pubchem_url: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
          ...fallbackData.PropertyTable.Properties[0],
          sections: {} as Record<string, Record<string, string>>
        };
        
        // Get comprehensive record data using PUG View
        try {
          // Fetch the COMPLETE record data rather than limiting by sections
          const fullRecordUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON`;
          console.log('Fetching full record data:', fullRecordUrl);
          
          const fullRecordResponse = await fetch(fullRecordUrl, {
            headers: { 
              'User-Agent': 'MedicalAI_Platform/1.0'
            }
          });
          
          if (fullRecordResponse.ok) {
            const fullRecordData = await fullRecordResponse.json();
            
            if (fullRecordData?.Record?.Section) {
              console.log('Successfully retrieved complete compound record data');
              
              // Store all section data to provide complete access to all information
              const sectionData: Record<string, Record<string, string>> = {};
              
              // Process all sections to extract ALL available data
              const processAllPubChemSections = (sections: any[], parentHeading: string = '') => {
                for (const section of sections) {
                  const sectionHeading = section.TOCHeading;
                  const fullHeading = parentHeading ? `${parentHeading} > ${sectionHeading}` : sectionHeading;
                  
                  console.log('Processing section:', fullHeading);
                  
                  // Extract information from this section if available
                  if (section.Information) {
                    for (const info of section.Information) {
                      if (info.Value?.StringWithMarkup?.[0]?.String) {
                        const infoName = info.Name || 'General';
                        const infoValue = info.Value.StringWithMarkup[0].String;
                        
                        console.log(`Found information: ${infoName} (${fullHeading})`, infoValue.substring(0, 50) + '...');
                        
                        // Store information based on section and info name
                        if (fullHeading.includes('Names and Identifiers')) {
                          if (infoName.includes('IUPAC Name') && !compoundData.description) {
                            compoundData.description = infoValue;
                          } else if (infoName.includes('Description') || infoName.includes('Record Description')) {
                            compoundData.description = infoValue;
                          }
                        }
                        else if (fullHeading.includes('Pharmacology')) {
                          if (infoName.includes('Pharmacology') || infoName === 'General') {
                            compoundData.pharmacology = infoValue;
                          } else if (infoName.includes('Mechanism') || fullHeading.includes('Mechanism of Action')) {
                            compoundData.mechanism_of_action = infoValue;
                          } else if (infoName.includes('Metabolism') || fullHeading.includes('Metabolism')) {
                            compoundData.metabolism = infoValue;
                          } else if (infoName.includes('Absorption') || infoName.includes('Distribution') || fullHeading.includes('Absorption')) {
                            compoundData.absorption = infoValue;
                          } else if (infoName.includes('Half Life') || fullHeading.includes('Half Life')) {
                            compoundData.half_life = infoValue;
                          } else if (infoName.includes('Elimination') || fullHeading.includes('Elimination')) {
                            compoundData.routes_of_elimination = infoValue;
                          } else if (infoName.includes('Therapeutic Uses') || infoName.includes('Indication') || fullHeading.includes('Uses')) {
                            compoundData.indications = infoValue;
                          }
                        }
                        else if (fullHeading.includes('Drug Information') || fullHeading.includes('Medication Information')) {
                          if (infoName.includes('Drug Class') || fullHeading.includes('Classification')) {
                            compoundData.drug_classes = infoValue;
                          } else if (infoName.includes('Drug Interaction') || fullHeading.includes('Drug Interaction')) {
                            compoundData.drug_interactions = infoValue;
                          } else if (infoName.includes('Food Interaction') || fullHeading.includes('Food Interaction')) {
                            compoundData.food_interactions = infoValue;
                          }
                        }
                        else if (fullHeading.includes('Toxicity') || fullHeading.includes('Safety') || fullHeading.includes('Hazards')) {
                          if (infoName.includes('Toxicity') || infoName === 'General' || infoName.includes('Summary')) {
                            compoundData.toxicity = infoValue;
                          } else if (infoName.includes('Side Effect') || infoName.includes('Adverse') || fullHeading.includes('Adverse Effects')) {
                            compoundData.adverse_effects = infoValue;
                          }
                        }
                        else if (fullHeading.includes('Chemical and Physical Properties')) {
                          // Additional physical properties can be stored here
                          if (!compoundData.description && (infoName.includes('Physical Description') || infoName.includes('Appearance'))) {
                            compoundData.description = infoValue;
                          }
                        }
                        
                        // Add full section data to store all available information
                        if (!sectionData[fullHeading]) {
                          sectionData[fullHeading] = {};
                        }
                        sectionData[fullHeading][infoName] = infoValue;
                      }
                    }
                  }
                  
                  // Process any nested sections recursively
                  if (section.Section && section.Section.length > 0) {
                    processAllPubChemSections(section.Section, fullHeading);
                  }
                }
              };
              
              // Start processing from the top level
              processAllPubChemSections(fullRecordData.Record.Section);
              
              // Add full section data to compound data
              compoundData.sections = sectionData;
            }
          }
        } catch (e) {
          console.warn('Failed to fetch full record information:', e);
          return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Failed to fetch data from PubChem' },
            { status: 500 }
          );
        }

        return NextResponse.json({ 
          compound: mapPubChemPropertiesToCompound(compoundData) 
        });
      }
    }
  } catch (error) {
    console.error('PubChem API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data from PubChem' },
      { status: 500 }
    );
  }
}

// Map PubChem API property names to our interface property names
export function mapPubChemPropertiesToCompound(data: any): PubChemCompound {
  const result: Partial<PubChemCompound> = {
    cid: data.cid || data.CID,
    name: data.name || data.Title || `Compound ${data.cid || data.CID}`,
  };
  
  // Direct property mapping from input data
  const directProps = [
    'synonyms', 'description', 'pharmacology', 'image_url', 'image_url_3d', 
    'pubchem_url', 'indications', 'toxicity', 'drug_classes', 'mechanism_of_action',
    'metabolism', 'absorption', 'half_life', 'routes_of_elimination',
    'drug_interactions', 'food_interactions', 'adverse_effects', 'sections'
  ];
  
  directProps.forEach(prop => {
    if (data[prop] !== undefined) {
      (result as any)[prop] = data[prop];
    }
  });
  
  const propertyMap: Record<string, keyof PubChemCompound> = {
    IUPACName: 'iupac_name',
    MolecularFormula: 'molecular_formula',
    MolecularWeight: 'molecular_weight',
    CanonicalSMILES: 'canonical_smiles',
    IsomericSMILES: 'isomeric_smiles',
    InChI: 'inchi',
    InChIKey: 'inchikey',
    XLogP: 'xlogp',
    ExactMass: 'exact_mass',
    MonoisotopicMass: 'monoisotopic_mass',
    TPSA: 'tpsa',
    Complexity: 'complexity',
    HBondDonorCount: 'h_bond_donor_count',
    HBondAcceptorCount: 'h_bond_acceptor_count',
    RotatableBondCount: 'rotatable_bond_count',
    HeavyAtomCount: 'heavy_atom_count',
    IsotopeAtomCount: 'isotope_atom_count',
    AtomStereoCount: 'atom_stereo_count',
    DefinedAtomStereoCount: 'defined_atom_stereo_count',
    UndefinedAtomStereoCount: 'undefined_atom_stereo_count',
    BondStereoCount: 'bond_stereo_count',
    DefinedBondStereoCount: 'defined_bond_stereo_count',
    UndefinedBondStereoCount: 'undefined_bond_stereo_count',
    CovalentUnitCount: 'covalent_unit_count',
    CreatedDate: 'created_date',
    ModifiedDate: 'modified_date'
  };
  
  // Map all available properties
  Object.entries(propertyMap).forEach(([pubchemKey, ourKey]) => {
    if (data[pubchemKey] !== undefined) {
      (result as any)[ourKey] = data[pubchemKey];
    }
  });
  
  return result as PubChemCompound;
} 