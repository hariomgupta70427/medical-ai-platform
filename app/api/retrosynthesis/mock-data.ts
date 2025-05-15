/**
 * Mock retrosynthesis data for testing
 * This provides example responses similar to what would be returned from the IBM RXN API
 */

import * as openSourceSynthesis from '../../../lib/openSourceSynthesis';

// Mock retrosynthesis data for Aspirin
export const mockAspirinRetrosynthesis = {
  paths: [
    {
      confidence: 0.87,
      steps: [
        {
          reactants: ["CC(=O)OC(=O)C", "O=C(O)c1ccccc1O"],
          products: ["CC(=O)Oc1ccccc1C(=O)O", "CC(=O)O"],
          reagents: ["H2SO4"],
          conditions: "Heat, 85°C",
          description: "Acetic anhydride reacts with salicylic acid under acidic conditions to form aspirin and acetic acid through an esterification reaction."
        }
      ]
    },
    {
      confidence: 0.75,
      steps: [
        {
          reactants: ["CC(=O)Cl", "O=C(O)c1ccccc1O"],
          products: ["CC(=O)Oc1ccccc1C(=O)O", "HCl"],
          reagents: ["Pyridine"],
          conditions: "Room temperature",
          description: "Acetyl chloride reacts with salicylic acid in the presence of pyridine to form aspirin and HCl through an acylation reaction."
        }
      ]
    },
    {
      confidence: 0.62,
      steps: [
        {
          reactants: ["CC(=O)OCC", "O=C(O)c1ccccc1O"],
          products: ["CC(=O)Oc1ccccc1C(=O)O", "CCO"],
          reagents: ["H+", "Heat"],
          conditions: "Acidic, 60-70°C",
          description: "Ethyl acetate and salicylic acid undergo transesterification to form aspirin and ethanol under acidic conditions and heat."
        }
      ]
    }
  ],
  targetMolecule: "CC(=O)Oc1ccccc1C(=O)O"
};

// Mock retrosynthesis data for Paracetamol
export const mockParacetamolRetrosynthesis = {
  paths: [
    {
      confidence: 0.91,
      steps: [
        {
          reactants: ["CC(=O)Cl", "Nc1ccc(O)cc1"],
          products: ["CC(=O)Nc1ccc(O)cc1", "HCl"],
          reagents: ["NaOH"],
          conditions: "Basic conditions, 0-5°C",
          description: "Acetyl chloride reacts with 4-aminophenol under basic conditions to form paracetamol."
        }
      ]
    },
    {
      confidence: 0.83,
      steps: [
        {
          reactants: ["CC(=O)OC(=O)C", "Nc1ccc(O)cc1"],
          products: ["CC(=O)Nc1ccc(O)cc1", "CC(=O)OH"],
          reagents: [],
          conditions: "Room temperature",
          description: "Acetic anhydride reacts with 4-aminophenol to form paracetamol and acetic acid."
        }
      ]
    },
    {
      confidence: 0.72,
      steps: [
        {
          reactants: ["O=Nc1ccc(OC(=O)C)cc1"],
          products: ["CC(=O)Nc1ccc(O)cc1"],
          reagents: ["H2", "Pd/C"],
          conditions: "Room temperature, Pressure",
          description: "Reduction of p-nitroacetanilide to paracetamol using hydrogen and a palladium catalyst."
        },
        {
          reactants: ["O=Nc1ccc(O)cc1", "CC(=O)OC(=O)C"],
          products: ["O=Nc1ccc(OC(=O)C)cc1", "CC(=O)OH"],
          reagents: [],
          conditions: "Room temperature",
          description: "Acetic anhydride reacts with 4-nitrophenol to form p-nitroacetanilide."
        }
      ]
    }
  ],
  targetMolecule: "CC(=O)Nc1ccc(O)cc1"
};

// Mock retrosynthesis data for Ibuprofen
export const mockIbuprofenRetrosynthesis = {
  paths: [
    {
      confidence: 0.89,
      steps: [
        {
          reactants: ["CC(C)Cc1ccc(C(C)COC(C)=O)cc1"],
          products: ["CC(C)Cc1ccc(C(C)C(=O)O)cc1", "CH3OH"],
          reagents: ["NaOH", "H2O"],
          conditions: "Basic hydrolysis, 60-70°C",
          description: "Hydrolysis of the ester intermediate to form ibuprofen under basic conditions."
        },
        {
          reactants: ["CC(C)Cc1ccc(C(C)I)cc1", "CO"],
          products: ["CC(C)Cc1ccc(C(C)COC(C)=O)cc1"],
          reagents: ["Pd(OAc)2", "CO", "CH3OH"],
          conditions: "80°C, 300 psi",
          description: "Carbonylation of the iodide intermediate to form the ester precursor to ibuprofen."
        },
        {
          reactants: ["CC(C)Cc1ccc(C=C)cc1"],
          products: ["CC(C)Cc1ccc(C(C)I)cc1"],
          reagents: ["HI", "ROOR"],
          conditions: "25°C",
          description: "Anti-Markovnikov addition of HI to p-isobutylstyrene."
        }
      ]
    },
    {
      confidence: 0.76,
      steps: [
        {
          reactants: ["CC(C)Cc1ccc(C(C))cc1"],
          products: ["CC(C)Cc1ccc(C(C)C(=O)O)cc1"],
          reagents: ["KMnO4", "NaOH"],
          conditions: "80-90°C",
          description: "Oxidation of p-isobutylcumene to form ibuprofen through side-chain oxidation."
        }
      ]
    }
  ],
  targetMolecule: "CC(C)Cc1ccc(C(C)C(=O)O)cc1"
};

// Mock retrosynthesis data for Omeprazole
export const mockOmeprazoleRetrosynthesis = {
  paths: [
    {
      confidence: 0.88,
      steps: [
        {
          reactants: ["CC1=CN=C(C=C1OC)C(=O)Cl", "C1=NC=C(C)C(=O)N1C"],
          products: ["CC1=CN=C(C=C1OC)C(=O)NC1=NC=C(C)C(=O)N1C"],
          reagents: ["NEt3"],
          conditions: "0-5°C, THF",
          description: "Nucleophilic acyl substitution between the acid chloride and pyrimidine ring to form the key amide bond in omeprazole."
        },
        {
          reactants: ["CC1=CN=C(C=C1OC)C(=O)OH", "SOCl2"],
          products: ["CC1=CN=C(C=C1OC)C(=O)Cl", "SO2", "HCl"],
          reagents: [],
          conditions: "Reflux, 70°C",
          description: "Conversion of the carboxylic acid to an acid chloride using thionyl chloride."
        }
      ]
    },
    {
      confidence: 0.75,
      steps: [
        {
          reactants: ["CC1=CN=C(C=C1OH)C(=O)NC1=NC=C(C)C(=O)N1C", "CH3I"],
          products: ["CC1=CN=C(C=C1OC)C(=O)NC1=NC=C(C)C(=O)N1C", "HI"],
          reagents: ["K2CO3"],
          conditions: "Basic conditions, 50°C",
          description: "Methylation of the hydroxyl group to form the methoxy group in omeprazole."
        }
      ]
    }
  ],
  targetMolecule: "CC1=CN=C(C=C1OC)C(=O)NC1=NC=C(C)C(=O)N1C"
};

// Mock retrosynthesis data for Amoxicillin
export const mockAmoxicillinRetrosynthesis = {
  paths: [
    {
      confidence: 0.82,
      steps: [
        {
          reactants: ["CC1(C)SC2C(N)C(=O)N2C1C(=O)O", "OC(=O)C(N)c1ccc(O)cc1"],
          products: ["CC1(C)SC2C(NC(=O)C(N)c3ccc(O)cc3)C(=O)N2C1C(=O)O"],
          reagents: ["DCC", "HOBt"],
          conditions: "0°C to RT, DMF",
          description: "Peptide coupling of 6-aminopenicillanic acid (6-APA) with p-hydroxyphenylglycine to form amoxicillin."
        }
      ]
    },
    {
      confidence: 0.71,
      steps: [
        {
          reactants: ["CC1(C)SC2C(NC(=O)COC(=O)C)C(=O)N2C1C(=O)O", "H2NC(c1ccc(O)cc1)C(=O)O"],
          products: ["CC1(C)SC2C(NC(=O)C(N)c3ccc(O)cc3)C(=O)N2C1C(=O)O", "CH3COOH"],
          reagents: ["Enzyme"],
          conditions: "30-35°C, pH 7.0",
          description: "Enzymatic synthesis via acyl transfer from a penicillin G derivative to p-hydroxyphenylglycine."
        }
      ]
    }
  ],
  targetMolecule: "CC1(C)SC2C(NC(=O)C(N)c3ccc(O)cc3)C(=O)N2C1C(=O)O"
};

// Mock retrosynthesis data for Metformin
export const mockMetforminRetrosynthesis = {
  paths: [
    {
      confidence: 0.95,
      steps: [
        {
          reactants: ["CN(C)C(=N)Cl", "NH2C(=N)NH2"],
          products: ["CN(C)C(=N)NC(=N)N", "HCl"],
          reagents: ["NaOH"],
          conditions: "60-70°C, basic conditions",
          description: "Nucleophilic substitution between dimethylcyanoimide chloride and guanidine to form metformin."
        }
      ]
    },
    {
      confidence: 0.83,
      steps: [
        {
          reactants: ["CN(C)C#N", "NH2C(=N)NH2"],
          products: ["CN(C)C(=N)NC(=N)N"],
          reagents: ["HCl", "NaOCH3"],
          conditions: "80°C, methanol",
          description: "Addition of guanidine to dimethylcyanamide followed by tautomerization to form metformin."
        }
      ]
    }
  ],
  targetMolecule: "CN(C)C(=N)NC(=N)N"
};

// Mock retrosynthesis data for Atorvastatin (Lipitor)
export const mockAtorvastatinRetrosynthesis = {
  paths: [
    {
      confidence: 0.78,
      steps: [
        {
          reactants: ["CC(C)c1ccccc1", "FC(F)(F)c1ccccc1C=O", "NC(C(=O)O)Cc1ccccc1"],
          products: ["CC(C)C1=C(C(=O)Nc2ccccc12)C(=O)C(O)Cc3ccc(F)cc3"],
          reagents: ["LDA", "ZnCl2"],
          conditions: "-78°C, THF",
          description: "Asymmetric aldol reaction and cyclization to form the core structure of atorvastatin."
        },
        {
          reactants: ["CC(C)C1=C(C(=O)Nc2ccccc12)C(=O)C(O)Cc3ccc(F)cc3", "HO"],
          products: ["CC(C)C1=C(C(=O)Nc2ccccc12)C(=O)C(O)Cc3ccc(F)cc3"],
          reagents: ["CaCl2"],
          conditions: "pH 7.0-7.5, 35°C",
          description: "Calcium salt formation to produce the final pharmaceutical form of atorvastatin calcium."
        }
      ]
    }
  ],
  targetMolecule: "CC(C)C1=C(C(=O)Nc2ccccc12)C(=O)C(O)Cc3ccc(F)cc3"
};

// Mock retrosynthesis data for Losartan
export const mockLosartanRetrosynthesis = {
  paths: [
    {
      confidence: 0.87,
      steps: [
        {
          reactants: ["CCCCc1nc(Cl)c(CO)n1", "Cc2ccc(c3ccccc3c2)c4ccccc4C(=O)O"],
          products: ["CCCCc1nc(Cl)c(CO)n1Cc2ccc(c3ccccc3c2)c4ccccc4C(=O)O"],
          reagents: ["K2CO3"],
          conditions: "80°C, DMF",
          description: "N-alkylation reaction to connect the imidazole ring to the biphenyl moiety, forming the complete losartan structure."
        },
        {
          reactants: ["CCCCCCl", "c1nc(Cl)c(CO)n1H"],
          products: ["CCCCc1nc(Cl)c(CO)n1", "HCl"],
          reagents: ["NaH"],
          conditions: "25°C, DMF",
          description: "Alkylation of the imidazole nitrogen with a butyl halide to introduce the n-butyl group."
        }
      ]
    }
  ],
  targetMolecule: "CCCCc1nc(Cl)c(CO)n1Cc2ccc(c3ccccc3c2)c4ccccc4C(=O)O"
};

// Function to get mock data based on drug name
export function getMockRetrosynthesisData(drugName: string) {
  const normalizedName = drugName.toLowerCase().trim();

  // First, check for an open source synthesis route from our database
  const openSourceRoute = openSourceSynthesis.findByName(normalizedName) || 
                         openSourceSynthesis.findByAlternateName(normalizedName);
  
  if (openSourceRoute) {
    console.log(`Using open source route for ${normalizedName} from ${openSourceRoute.source}`);
    return openSourceSynthesis.formatRoute(openSourceRoute);
  }
  
  // If no open source route found, check for similar names
  const similarNames = openSourceSynthesis.findSimilarNames(normalizedName, 0.7);
  if (similarNames.length > 0) {
    const similarRoute = openSourceSynthesis.findByName(similarNames[0]);
    if (similarRoute) {
      console.log(`Using similar open source route (${similarNames[0]}) for ${normalizedName}`);
      return openSourceSynthesis.formatRoute(similarRoute);
    }
  }

  // If no open source route found, use our predefined mock data
  if (normalizedName.includes('aspirin') || normalizedName.includes('acetylsalicylic')) {
    return mockAspirinRetrosynthesis;
  } else if (normalizedName.includes('paracetamol') || normalizedName.includes('acetaminophen')) {
    return mockParacetamolRetrosynthesis;
  } else if (normalizedName.includes('ibuprofen')) {
    return mockIbuprofenRetrosynthesis;
  } else if (normalizedName.includes('omeprazole')) {
    return mockOmeprazoleRetrosynthesis;
  } else if (normalizedName.includes('amoxicillin')) {
    return mockAmoxicillinRetrosynthesis;
  } else if (normalizedName.includes('metformin')) {
    return mockMetforminRetrosynthesis;
  } else if (normalizedName.includes('atorvastatin') || normalizedName.includes('lipitor')) {
    return mockAtorvastatinRetrosynthesis;
  } else if (normalizedName.includes('losartan')) {
    return mockLosartanRetrosynthesis;
  }
  
  // Default mock data for unknown drugs
  return {
    paths: [
      {
        confidence: 0.85,
        steps: [
          {
            reactants: ["CCOC(=O)C", "NCC(O)=O"],
            products: ["CCOC(=O)CNCC(O)=O"],
            reagents: ["NaOEt"],
            conditions: "Basic conditions, 25°C",
            description: "Generic alkylation reaction"
          }
        ]
      }
    ],
    targetMolecule: "CCOC(=O)CNCC(O)=O"
  };
} 