/**
 * PubChem API Utilities
 * Uses PubChem PUG REST API (no API key required)
 * Documentation: https://pubchemdocs.ncbi.nlm.nih.gov/pug-rest
 * 
 * Usage Policy: Keep requests under 5 per second to avoid being temporarily blocked
 */

// PubChem API base URL
const PUBCHEM_API_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

// Simple rate limiter to prevent exceeding PubChem's usage policy
const requestQueue: Array<() => Promise<any>> = [];
let isProcessing = false;

function enqueueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    
    processQueue();
  });
}

async function processQueue() {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  
  const request = requestQueue.shift();
  if (request) {
    try {
      await request();
    } catch (error) {
      console.error('Error processing PubChem request:', error);
    }
    
    // Wait 250ms between requests (max 4 requests per second to stay safely under the limit)
    setTimeout(() => {
      isProcessing = false;
      processQueue();
    }, 250);
  } else {
    isProcessing = false;
  }
}

/**
 * PubChem Service Class
 * Provides methods to interact with PubChem API
 */
export class PubChemService {
  /**
   * Get SMILES notation for a compound by name
   * @param name The name of the compound
   * @returns SMILES notation
   */
  async getSmilesByName(name: string): Promise<string | null> {
    return enqueueRequest(async () => {
      try {
        // First, get the compound CID (PubChem Compound ID)
        const url = `${PUBCHEM_API_BASE}/compound/name/${encodeURIComponent(name)}/cids/TXT`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log(`Compound not found: ${name}`);
            return null;
          }
          throw new Error(`PubChem API error: ${response.statusText}`);
        }
        
        const cid = await response.text();
        
        if (!cid || cid.trim() === '') {
          return null;
        }
        
        // Now get the SMILES for this CID
        const smilesUrl = `${PUBCHEM_API_BASE}/compound/cid/${cid.trim()}/property/CanonicalSMILES/TXT`;
        
        const smilesResponse = await fetch(smilesUrl);
        
        if (!smilesResponse.ok) {
          throw new Error(`PubChem API error: ${smilesResponse.statusText}`);
        }
        
        const smiles = await smilesResponse.text();
        return smiles.trim();
      } catch (error) {
        console.error('Error fetching SMILES from PubChem:', error);
        return null;
      }
    });
  }

  /**
   * Get molecular formula for a compound by name
   * @param name The name of the compound
   * @returns Molecular formula
   */
  async getMolecularFormula(name: string): Promise<string | null> {
    return enqueueRequest(async () => {
      try {
        // First, get the compound CID
        const url = `${PUBCHEM_API_BASE}/compound/name/${encodeURIComponent(name)}/cids/TXT`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log(`Compound not found: ${name}`);
            return null;
          }
          throw new Error(`PubChem API error: ${response.statusText}`);
        }
        
        const cid = await response.text();
        
        if (!cid || cid.trim() === '') {
          return null;
        }
        
        // Now get the molecular formula for this CID
        const formulaUrl = `${PUBCHEM_API_BASE}/compound/cid/${cid.trim()}/property/MolecularFormula/TXT`;
        
        const formulaResponse = await fetch(formulaUrl);
        
        if (!formulaResponse.ok) {
          throw new Error(`PubChem API error: ${formulaResponse.statusText}`);
        }
        
        const formula = await formulaResponse.text();
        return formula.trim();
      } catch (error) {
        console.error('Error fetching molecular formula from PubChem:', error);
        return null;
      }
    });
  }

  /**
   * Get molecular weight for a compound by name
   * @param name The name of the compound
   * @returns Molecular weight
   */
  async getMolecularWeight(name: string): Promise<number | null> {
    return enqueueRequest(async () => {
      try {
        // First, get the compound CID
        const url = `${PUBCHEM_API_BASE}/compound/name/${encodeURIComponent(name)}/cids/TXT`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log(`Compound not found: ${name}`);
            return null;
          }
          throw new Error(`PubChem API error: ${response.statusText}`);
        }
        
        const cid = await response.text();
        
        if (!cid || cid.trim() === '') {
          return null;
        }
        
        // Now get the molecular weight for this CID
        const weightUrl = `${PUBCHEM_API_BASE}/compound/cid/${cid.trim()}/property/MolecularWeight/TXT`;
        
        const weightResponse = await fetch(weightUrl);
        
        if (!weightResponse.ok) {
          throw new Error(`PubChem API error: ${weightResponse.statusText}`);
        }
        
        const weight = await weightResponse.text();
        return parseFloat(weight.trim());
      } catch (error) {
        console.error('Error fetching molecular weight from PubChem:', error);
        return null;
      }
    });
  }

  /**
   * Get a compound's CID by name
   * @param name The name of the compound
   * @returns PubChem Compound ID (CID)
   */
  async getCompoundCID(name: string): Promise<string | null> {
    return enqueueRequest(async () => {
      try {
        const url = `${PUBCHEM_API_BASE}/compound/name/${encodeURIComponent(name)}/cids/TXT`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log(`Compound not found: ${name}`);
            return null;
          }
          throw new Error(`PubChem API error: ${response.statusText}`);
        }
        
        const cid = await response.text();
        return cid.trim();
      } catch (error) {
        console.error('Error fetching CID from PubChem:', error);
        return null;
      }
    });
  }

  /**
   * Get multiple properties for a compound by name
   * @param name The name of the compound
   * @returns Object containing compound properties
   */
  async getCompoundProperties(name: string): Promise<Record<string, any> | null> {
    return enqueueRequest(async () => {
      try {
        const cid = await this.getCompoundCID(name);
        
        if (!cid) {
          return null;
        }
        
        // Get multiple properties at once
        const properties = [
          'MolecularFormula',
          'MolecularWeight',
          'CanonicalSMILES',
          'XLogP',
          'TPSA',
          'HBondDonorCount',
          'HBondAcceptorCount',
          'RotatableBondCount'
        ];
        
        const propertiesUrl = `${PUBCHEM_API_BASE}/compound/cid/${cid}/property/${properties.join(',')}/JSON`;
        
        const propertiesResponse = await fetch(propertiesUrl);
        
        if (!propertiesResponse.ok) {
          throw new Error(`PubChem API error: ${propertiesResponse.statusText}`);
        }
        
        const data = await propertiesResponse.json();
        
        if (!data.PropertyTable || !data.PropertyTable.Properties || data.PropertyTable.Properties.length === 0) {
          return null;
        }
        
        return data.PropertyTable.Properties[0];
      } catch (error) {
        console.error('Error fetching compound properties from PubChem:', error);
        return null;
      }
    });
  }

  /**
   * Get compound information by name, including CID and properties
   * @param name The name of the compound
   * @returns Compound information
   */
  async getCompoundByName(name: string) {
    const cid = await this.getCompoundCID(name);
    if (!cid) return null;
    
    const properties = await this.getCompoundPropertiesByCID(cid);
    return {
      cid,
      ...properties
    };
  }

  /**
   * Get compound information by SMILES string
   * @param smiles The SMILES string
   * @returns Compound information
   */
  async getCompoundBySmiles(smiles: string) {
    return enqueueRequest(async () => {
      try {
        const url = `${PUBCHEM_API_BASE}/compound/smiles/${encodeURIComponent(smiles)}/cids/TXT`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log(`Compound not found for SMILES: ${smiles}`);
            return null;
          }
          throw new Error(`PubChem API error: ${response.statusText}`);
        }
        
        const cid = await response.text();
        
        if (!cid || cid.trim() === '') {
          return null;
        }
        
        const properties = await this.getCompoundPropertiesByCID(cid.trim());
        return {
          cid: cid.trim(),
          ...properties
        };
      } catch (error) {
        console.error('Error fetching compound by SMILES from PubChem:', error);
        return null;
      }
    });
  }

  /**
   * Get compound properties by CID
   * @param cid The PubChem Compound ID
   * @returns Compound properties
   */
  async getCompoundPropertiesByCID(cid: string | number) {
    return enqueueRequest(async () => {
      try {
        const properties = [
          'MolecularFormula',
          'MolecularWeight',
          'CanonicalSMILES',
          'XLogP',
          'TPSA',
          'HBondDonorCount',
          'HBondAcceptorCount',
          'RotatableBondCount'
        ];
        
        const propertiesUrl = `${PUBCHEM_API_BASE}/compound/cid/${cid}/property/${properties.join(',')}/JSON`;
        
        const propertiesResponse = await fetch(propertiesUrl);
        
        if (!propertiesResponse.ok) {
          throw new Error(`PubChem API error: ${propertiesResponse.statusText}`);
        }
        
        const data = await propertiesResponse.json();
        
        if (!data.PropertyTable || !data.PropertyTable.Properties || data.PropertyTable.Properties.length === 0) {
          return null;
        }
        
        return data.PropertyTable.Properties[0];
      } catch (error) {
        console.error('Error fetching compound properties from PubChem:', error);
        return null;
      }
    });
  }

  /**
   * Search for compounds by name or other identifier
   * @param query The search query
   * @returns Array of compounds
   */
  async searchCompound(query: string) {
    return enqueueRequest(async () => {
      try {
        const url = `${PUBCHEM_API_BASE}/compound/name/${encodeURIComponent(query)}/JSON`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            return [];
          }
          throw new Error(`PubChem API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.PC_Compounds || data.PC_Compounds.length === 0) {
          return [];
        }
        
        return data.PC_Compounds;
      } catch (error) {
        console.error('Error searching compounds from PubChem:', error);
        return [];
      }
    });
  }
}

// Legacy standalone functions that use the new class internally
const pubchemService = new PubChemService();

/**
 * Get SMILES notation for a compound by name
 * @param name The name of the compound
 * @returns SMILES notation
 */
export async function getSmilesByName(name: string): Promise<string | null> {
  return pubchemService.getSmilesByName(name);
}

/**
 * Get molecular formula for a compound by name
 * @param name The name of the compound
 * @returns Molecular formula
 */
export async function getMolecularFormula(name: string): Promise<string | null> {
  return pubchemService.getMolecularFormula(name);
}

/**
 * Get molecular weight for a compound by name
 * @param name The name of the compound
 * @returns Molecular weight
 */
export async function getMolecularWeight(name: string): Promise<number | null> {
  return pubchemService.getMolecularWeight(name);
}

/**
 * Get a compound's CID by name
 * @param name The name of the compound
 * @returns PubChem Compound ID (CID)
 */
export async function getCompoundCID(name: string): Promise<string | null> {
  return pubchemService.getCompoundCID(name);
}

/**
 * Get multiple properties for a compound by name
 * @param name The name of the compound
 * @returns Object containing compound properties
 */
export async function getCompoundProperties(name: string): Promise<Record<string, any> | null> {
  return pubchemService.getCompoundProperties(name);
}

/**
 * Get compound information by name, including CID and properties
 * @param name The name of the compound
 * @returns Compound information
 */
export async function getCompoundByName(name: string) {
  return pubchemService.getCompoundByName(name);
}

/**
 * Get compound properties by CID
 * @param cid The PubChem Compound ID
 * @returns Compound properties
 */
export async function getCompoundPropertiesByCID(cid: string | number) {
  return pubchemService.getCompoundPropertiesByCID(cid);
}

/**
 * Search for compounds by name or other identifier
 * @param query The search query
 * @returns Array of compounds
 */
export async function searchCompound(query: string) {
  return pubchemService.searchCompound(query);
} 