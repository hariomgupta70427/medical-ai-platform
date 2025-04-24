/**
 * Mock retrosynthesis data for testing
 * This provides example responses similar to what would be returned from the IBM RXN API
 */

// Mock retrosynthesis data for Aspirin
export const mockAspirinRetrosynthesis = {
  paths: [
    {
      confidence: 0.87,
      steps: [
        {
          reactants: ["CC(=O)OC(=O)O", "O=C(O)c1ccccc1O"],
          products: ["CC(=O)Oc1ccccc1C(=O)O", "CC(=O)O"],
          reagents: ["H2SO4"],
          conditions: "Heat, 85°C",
          description: "Acetic anhydride reacts with salicylic acid under acidic conditions to form aspirin and acetic acid."
        }
      ]
    },
    {
      confidence: 0.75,
      steps: [
        {
          reactants: ["O=C(Cl)C", "O=C(O)c1ccccc1O"],
          products: ["CC(=O)Oc1ccccc1C(=O)O", "HCl"],
          reagents: ["Pyridine"],
          conditions: "Room temperature",
          description: "Acetyl chloride reacts with salicylic acid in the presence of pyridine to form aspirin and HCl."
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
          description: "Ethyl acetate and salicylic acid undergo transesterification to form aspirin and ethanol."
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
          reactants: ["CC(C)Cc1ccc(C(C)C(=O)O)cc1", "O"],
          products: ["CC(C)Cc1ccc(C(C)C(=O)O)cc1"],
          reagents: ["H+", "H2O"],
          conditions: "Acidic hydrolysis",
          description: "Hydrolysis of the nitrile intermediate to form ibuprofen."
        },
        {
          reactants: ["CC(C)Cc1ccc(C(C)C#N)cc1"],
          products: ["CC(C)Cc1ccc(C(C)C(=O)O)cc1"],
          reagents: ["H+", "H2O"],
          conditions: "Acidic hydrolysis",
          description: "Hydrolysis of the nitrile intermediate to form ibuprofen."
        },
        {
          reactants: ["CC(C)Cc1ccc(C=O)cc1", "CH3CN"],
          products: ["CC(C)Cc1ccc(C(C)C#N)cc1"],
          reagents: ["NaCN", "H+"],
          conditions: "Room temperature",
          description: "Addition of hydrogen cyanide to p-isobutylbenzaldehyde followed by dehydration."
        }
      ]
    },
    {
      confidence: 0.76,
      steps: [
        {
          reactants: ["CC(C)Cc1ccc(C(C)Cl)cc1", "CO"],
          products: ["CC(C)Cc1ccc(C(C)C(=O)O)cc1", "HCl"],
          reagents: ["CO", "Pd"],
          conditions: "100°C, 200 psi",
          description: "Carbonylation of p-isobutylbenzyl chloride to form ibuprofen."
        }
      ]
    }
  ],
  targetMolecule: "CC(C)Cc1ccc(C(C)C(=O)O)cc1"
};

// Function to get mock data based on drug name
export function getMockRetrosynthesisData(drugName: string) {
  const normalizedName = drugName.toLowerCase().trim();

  if (normalizedName.includes('aspirin') || normalizedName.includes('acetylsalicylic')) {
    return mockAspirinRetrosynthesis;
  } else if (normalizedName.includes('paracetamol') || normalizedName.includes('acetaminophen')) {
    return mockParacetamolRetrosynthesis;
  } else if (normalizedName.includes('ibuprofen')) {
    return mockIbuprofenRetrosynthesis;
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