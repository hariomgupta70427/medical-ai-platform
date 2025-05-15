/**
 * Open Source Synthesis Database
 * This module provides access to synthetic routes sourced from open databases and publications
 */

import { type RetrosynthesisPath, type ReactionStep } from '../types/synthTypes';

export interface SyntheticRoute {
  drugName: string;
  alternateNames: string[];
  targetMolecule: string;
  paths: RetrosynthesisPath[];
  source: string; // Reference to the publication
  validated: boolean; // Whether the route has been validated
}

// Database of open source synthetic routes
const openSourceRoutes: SyntheticRoute[] = [
  // DNDi OSN derived routes
  {
    drugName: 'benzoxazole amide derivative',
    alternateNames: ['benzoxazole antileishmanial', 'leishmania benzoxazole'],
    targetMolecule: 'C1=CC=C2C(=C1)OC(=N2)C(=O)NC3=CC=CC=C3',
    paths: [
      {
        confidence: 0.82,
        steps: [
          {
            reactants: ['C1=CC=C2C(=C1)OC(=N2)C(=O)Cl', 'NH2C3=CC=CC=C3'],
            products: ['C1=CC=C2C(=C1)OC(=N2)C(=O)NC3=CC=CC=C3'],
            reagents: ['Triethylamine', 'THF'],
            conditions: 'Room temperature, 12h',
            description: 'Nucleophilic acyl substitution between benzoxazole acid chloride and aniline to form the amide bond.'
          },
          {
            reactants: ['C1=CC=C2C(=C1)OC(=N2)C(=O)OH', 'SOCl2'],
            products: ['C1=CC=C2C(=C1)OC(=N2)C(=O)Cl', 'SO2', 'HCl'],
            reagents: [],
            conditions: 'Reflux, 60°C, 3h',
            description: 'Conversion of carboxylic acid to acid chloride using thionyl chloride.'
          }
        ]
      }
    ],
    source: 'Journal of Chemical Education (2022) - Open Synthesis Network research in an undergraduate laboratory: Development of benzoxazole amide derivatives against leishmania parasite',
    validated: true
  },
  {
    drugName: 'n-pyrazolyl urea',
    alternateNames: ['pyrazole urea', 'antileishmanial pyrazolyl urea'],
    targetMolecule: 'CC1=CC(=NN1C)NC(=O)NC2=CC=CC=C2',
    paths: [
      {
        confidence: 0.85,
        steps: [
          {
            reactants: ['CC1=CC(=NN1C)NH2', 'O=C=NC2=CC=CC=C2'],
            products: ['CC1=CC(=NN1C)NC(=O)NC2=CC=CC=C2'],
            reagents: ['DMF'],
            conditions: 'Room temperature, 24h',
            description: 'Formation of urea linkage between pyrazole and isocyanate to create antileishmanial compound.'
          }
        ]
      }
    ],
    source: 'ChemMedChem (2024) - N-Pyrazolyl- and N-Triazolylamines and -Ureas as antileishmanial and antitrypanosomal drugs',
    validated: true
  },
  {
    drugName: 'disubstituted quinazolinone',
    alternateNames: ['4-quinazolinone', 'antileishmanial quinazolinone'],
    targetMolecule: 'CC1=NC2=CC=CC=C2C(=O)N1C',
    paths: [
      {
        confidence: 0.78,
        steps: [
          {
            reactants: ['C1=CC=C2C(=C1)C(=O)NC(=N2)C', 'CH3I'],
            products: ['CC1=NC2=CC=CC=C2C(=O)N1C'],
            reagents: ['K2CO3', 'DMF'],
            conditions: '50°C, 6h',
            description: 'Regioselective N-alkylation of quinazolinone using methyl iodide and base.'
          }
        ]
      }
    ],
    source: 'Organic and Biomolecular Chemistry (2024) - Preparation of N2,N4-disubstituted 4-quinazolinones facilitated by regioselective N-alkylation',
    validated: true
  }
];

/**
 * Find a synthetic route by drug name
 * @param name Drug name to search for
 * @returns Synthetic route or null if not found
 */
export function findByName(name: string): SyntheticRoute | null {
  const normalizedName = name.toLowerCase().trim();
  return openSourceRoutes.find(route => 
    route.drugName.toLowerCase() === normalizedName
  ) || null;
}

/**
 * Find a synthetic route by any of its alternate names
 * @param name Alternate name to search for
 * @returns Synthetic route or null if not found
 */
export function findByAlternateName(name: string): SyntheticRoute | null {
  const normalizedName = name.toLowerCase().trim();
  return openSourceRoutes.find(route => 
    route.alternateNames.some(alt => alt.toLowerCase() === normalizedName)
  ) || null;
}

/**
 * Find drug names similar to the provided query
 * @param query Query string to match against
 * @param threshold Similarity threshold (0-1), higher means closer match required
 * @returns Array of similar drug names
 */
export function findSimilarNames(query: string, threshold: number = 0.7): string[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  return openSourceRoutes
    .map(route => {
      // Check main name similarity
      const mainSimilarity = calculateSimilarity(normalizedQuery, route.drugName.toLowerCase());
      
      // Check alternate names similarity
      const altSimilarities = route.alternateNames.map(alt => 
        calculateSimilarity(normalizedQuery, alt.toLowerCase())
      );
      
      // Get maximum similarity
      const maxSimilarity = Math.max(mainSimilarity, ...altSimilarities);
      
      return { 
        name: route.drugName,
        similarity: maxSimilarity 
      };
    })
    .filter(result => result.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .map(result => result.name);
}

/**
 * Convert an open source route to the format expected by the application
 * @param route The open source synthetic route
 * @returns Formatted retrosynthesis data
 */
export function formatRoute(route: SyntheticRoute) {
  return {
    paths: route.paths,
    targetMolecule: route.targetMolecule
  };
}

/**
 * Calculate similarity between two strings (simple implementation)
 * For production, consider using a proper algorithm like Levenshtein distance
 * @param str1 First string
 * @param str2 Second string
 * @returns Similarity score (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  // Simple case: exact match
  if (str1 === str2) return 1;
  
  // Check if one contains the other
  if (str1.includes(str2) || str2.includes(str1)) {
    const longerLength = Math.max(str1.length, str2.length);
    const shorterLength = Math.min(str1.length, str2.length);
    return shorterLength / longerLength;
  }
  
  // Check for word overlap
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  let matches = 0;
  for (const word of words1) {
    if (words2.includes(word)) matches++;
  }
  
  return matches / Math.max(words1.length, words2.length);
} 