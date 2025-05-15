/**
 * Types for synthetic routes and retrosynthesis
 */

export interface ReactionStep {
  reactants: string[];
  products: string[];
  reagents?: string[];
  conditions?: string;
  description?: string;
  reactionType?: string;
  temperature?: string;
  catalysts?: string[];
  solvent?: string;
  yieldPercentage?: number;
  timeRequired?: string;
}

export interface RetrosynthesisPath {
  steps: ReactionStep[];
  confidence: number;
}

export interface RetrosynthesisData {
  paths: RetrosynthesisPath[];
  targetMolecule: string;
}

export interface DrugInfo {
  name: string;
  smiles: string;
  cid?: string;
  molecular_formula?: string;
  molecular_weight?: number;
  iupac_name?: string;
}

export interface ApiResponse {
  drug: DrugInfo;
  retrosynthesis: RetrosynthesisData;
  error?: string;
  message?: string;
} 