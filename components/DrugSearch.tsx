"use client"

import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Search, ExternalLink, Info, ThumbsUp, ThumbsDown, Pill, Beaker, Microscope, Dna, AlertTriangle } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Compound {
  cid: number;
  name: string;
  synonyms?: string[];
  description?: string;
  pharmacology?: string;
  image_url?: string;
  image_url_3d?: string;
  pubchem_url?: string;
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

// Helper function to safely render HTML content
const renderHTML = (html?: string) => {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export function DrugSearch() {
  const [query, setQuery] = useState('')
  const [compounds, setCompounds] = useState<Compound[]>([])
  const [selectedCompound, setSelectedCompound] = useState<Compound | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchTimeout = useRef<NodeJS.Timeout>()

  // Helper functions to check if a tab has data to display
  const hasPhysicalData = () => {
    if (!selectedCompound) return false;
    return selectedCompound.xlogp !== undefined || 
           selectedCompound.tpsa !== undefined || 
           selectedCompound.exact_mass !== undefined;
  };

  const hasClinicalData = () => {
    if (!selectedCompound) return false;
    return !!selectedCompound.pharmacology || 
           !!selectedCompound.indications || 
           !!selectedCompound.mechanism_of_action || 
           !!selectedCompound.drug_classes || 
           !!selectedCompound.metabolism || 
           !!selectedCompound.absorption || 
           !!selectedCompound.half_life ||
           !!selectedCompound.routes_of_elimination ||
           !!selectedCompound.drug_interactions ||
           !!selectedCompound.food_interactions;
  };

  const hasSafetyData = () => {
    if (!selectedCompound) return false;
    return !!selectedCompound.toxicity || 
           !!selectedCompound.adverse_effects;
  };

  // Determine which tab to show by default
  const getDefaultTab = () => {
    if (hasClinicalData()) return "clinical";
    if (hasSafetyData()) return "safety";
    if (hasPhysicalData()) return "physical";
    return "chemical"; // Always have chemical tab as fallback
  };

  // Check if we have sections data
  const hasSectionsData = () => {
    return selectedCompound?.sections && Object.keys(selectedCompound.sections).length > 0;
  };

  useEffect(() => {
    if (query.length >= 2) {
      // Clear previous timeout
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }

      // Set new timeout
      searchTimeout.current = setTimeout(async () => {
        setIsLoading(true)
        setError(null)
        try {
          console.log('Fetching compounds for query:', query)
          const response = await fetch(`/api/pubchem?query=${encodeURIComponent(query)}`, {
            headers: {
              'Cache-Control': 'no-cache'
            }
          })
          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch compounds')
          }
          
          console.log('Received compounds:', data)
          
          if (data.compounds && data.compounds.length > 0) {
            setCompounds(data.compounds)
          } else {
            setCompounds([])
            setError(`No results found for "${query}". Try a different drug name.`)
          }
        } catch (err) {
          console.error('Error fetching compounds:', err)
          setError(err instanceof Error ? err.message : 'Failed to fetch compounds')
          setCompounds([])
        } finally {
          setIsLoading(false)
        }
      }, 300) // Debounce for 300ms
    } else {
      setCompounds([])
    }
  }, [query])

  const handleCompoundSelect = async (compound: Compound) => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('Fetching details for compound:', compound.cid)
      const response = await fetch(`/api/pubchem?cid=${compound.cid}`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch compound details')
      }
      
      if (!data.compound) {
        throw new Error('No compound data received')
      }
      
      console.log('Received compound details:', data)
      setSelectedCompound({
        ...data.compound,
        name: data.compound.name || compound.name // Use compound name from data or fallback to search result
      })
      setQuery('')
      setCompounds([])
    } catch (err) {
      console.error('Error fetching compound details:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch compound details')
      setSelectedCompound(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for a drug or compound..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}

      {compounds.length > 0 && (
        <Card className="mt-2">
          <ScrollArea className="h-[200px]">
            <div className="p-2">
              {compounds.map((compound) => (
                <Button
                  key={compound.cid}
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => handleCompoundSelect(compound)}
                >
                  {compound.name} (CID: {compound.cid})
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      {isLoading && (
        <div className="mt-4 flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Searching PubChem database...</span>
        </div>
      )}

      {!isLoading && error && compounds.length === 0 && !selectedCompound && (
        <div className="mt-4 p-4 border border-yellow-200 bg-yellow-50 text-yellow-800 rounded-md">
          <p>{error}</p>
          <p className="text-sm mt-2">
            Try searching with the generic name (e.g., "paracetamol" instead of "Tylenol") 
            or chemical name of the drug.
          </p>
        </div>
      )}

      {!isLoading && compounds.length === 0 && query.length >= 2 && !error && !selectedCompound && (
        <div className="mt-4 p-4 border border-blue-200 bg-blue-50 text-blue-800 rounded-md">
          <p>Type at least 2 characters to search for a drug.</p>
          <p className="text-sm mt-2">
            For best results, use generic drug names like "aspirin", "ibuprofen", or "paracetamol".
          </p>
        </div>
      )}

      {selectedCompound && (
        <div className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{selectedCompound.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {selectedCompound.iupac_name || 'No IUPAC name available'}
                  </CardDescription>
                  <div className="mt-2">
                    <Badge variant="outline" className="mr-2">CID: {selectedCompound.cid}</Badge>
                    {selectedCompound.molecular_formula && (
                      <Badge variant="outline" className="mr-2">MF: {selectedCompound.molecular_formula}</Badge>
                    )}
                    {selectedCompound.molecular_weight && (
                      <Badge variant="outline">
                        MW: {typeof selectedCompound.molecular_weight === 'number' 
                          ? selectedCompound.molecular_weight.toFixed(2) 
                          : parseFloat(String(selectedCompound.molecular_weight)).toFixed(2)} g/mol
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto" 
                    onClick={() => {
                      if (selectedCompound.pubchem_url) {
                        window.open(selectedCompound.pubchem_url, '_blank', 'noopener,noreferrer');
                      } else {
                        window.open(`https://pubchem.ncbi.nlm.nih.gov/compound/${selectedCompound.cid}`, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on PubChem
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center space-y-4">
                  {selectedCompound.image_url && (
                    <div className="border rounded-md p-2 bg-white">
                      <img 
                        src={selectedCompound.image_url} 
                        alt={`Structure of ${selectedCompound.name}`} 
                        className="max-w-full h-auto"
                      />
                      <p className="text-center text-sm text-muted-foreground mt-2">2D Structure</p>
                    </div>
                  )}
                  {selectedCompound.image_url_3d && (
                    <div className="border rounded-md p-2 bg-white">
                      <img 
                        src={selectedCompound.image_url_3d} 
                        alt={`3D structure of ${selectedCompound.name}`} 
                        className="max-w-full h-auto"
                      />
                      <p className="text-center text-sm text-muted-foreground mt-2">3D Conformer</p>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  {selectedCompound.description && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Description
                      </h3>
                      <div className="text-sm">
                        {renderHTML(selectedCompound.description)}
                      </div>
                    </div>
                  )}
                  
                  {selectedCompound.synonyms && selectedCompound.synonyms.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Alternative Names</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompound.synonyms.map((synonym, index) => (
                          <Badge key={index} variant="secondary">{synonym}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedCompound.created_date && (
                    <div className="text-sm text-muted-foreground mt-4">
                      Created Date: {new Date(selectedCompound.created_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              <Tabs defaultValue={getDefaultTab()} className="mt-6">
                <TabsList className={cn("grid mb-4", {
                  "grid-cols-6": hasClinicalData() && hasSafetyData() && hasPhysicalData() && hasSectionsData(),
                  "grid-cols-5": (hasClinicalData() && hasSafetyData() && hasPhysicalData() && !hasSectionsData()) ||
                               (hasClinicalData() && hasSafetyData() && !hasPhysicalData() && hasSectionsData()) ||
                               (hasClinicalData() && !hasSafetyData() && hasPhysicalData() && hasSectionsData()) ||
                               (!hasClinicalData() && hasSafetyData() && hasPhysicalData() && hasSectionsData()),
                  "grid-cols-4": (!hasClinicalData() && !hasSafetyData() && hasPhysicalData() && hasSectionsData()) || 
                                (!hasClinicalData() && hasSafetyData() && !hasPhysicalData() && hasSectionsData()) ||
                                (hasClinicalData() && !hasSafetyData() && !hasPhysicalData() && hasSectionsData()) ||
                                (hasClinicalData() && hasSafetyData() && hasPhysicalData() && !hasSectionsData()),
                  "grid-cols-3": (!hasClinicalData() && !hasSafetyData() && !hasPhysicalData() && hasSectionsData()) ||
                                (!hasClinicalData() && !hasSafetyData() && hasPhysicalData() && !hasSectionsData()) ||
                                (!hasClinicalData() && hasSafetyData() && !hasPhysicalData() && !hasSectionsData()) ||
                                (hasClinicalData() && !hasSafetyData() && !hasPhysicalData() && !hasSectionsData()),
                  "grid-cols-2": !hasClinicalData() && !hasSafetyData() && !hasPhysicalData() && !hasSectionsData()
                })}>
                  <TabsTrigger value="chemical" className="flex items-center">
                    <Beaker className="h-4 w-4 mr-2" />
                    Chemical Details
                  </TabsTrigger>
                  
                  {hasPhysicalData() && (
                    <TabsTrigger value="physical" className="flex items-center">
                      <Microscope className="h-4 w-4 mr-2" />
                      Physical Properties
                    </TabsTrigger>
                  )}
                  
                  <TabsTrigger value="identifiers" className="flex items-center">
                    <Dna className="h-4 w-4 mr-2" />
                    Identifiers
                  </TabsTrigger>
                  
                  {hasClinicalData() && (
                    <TabsTrigger value="clinical" className="flex items-center">
                      <Pill className="h-4 w-4 mr-2" />
                      Clinical Info
                    </TabsTrigger>
                  )}
                  
                  {hasSafetyData() && (
                    <TabsTrigger value="safety" className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Safety
                    </TabsTrigger>
                  )}
                  
                  {hasSectionsData() && (
                    <TabsTrigger value="all_data" className="flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      All Data
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="chemical" className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Basic Information</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm text-muted-foreground">Molecular Formula</dt>
                          <dd className="font-mono">{selectedCompound.molecular_formula || 'Not available'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Molecular Weight</dt>
                          <dd>{selectedCompound.molecular_weight ? 
                              `${typeof selectedCompound.molecular_weight === 'number' 
                                ? selectedCompound.molecular_weight.toFixed(2) 
                                : parseFloat(String(selectedCompound.molecular_weight)).toFixed(2)} g/mol` 
                              : 'Not available'}</dd>
                        </div>
                        {(selectedCompound.h_bond_donor_count !== undefined || 
                          selectedCompound.h_bond_acceptor_count !== undefined || 
                          selectedCompound.rotatable_bond_count !== undefined) && (
                          <>
                            {selectedCompound.h_bond_donor_count !== undefined && (
                              <div>
                                <dt className="text-sm text-muted-foreground">H-Bond Donors</dt>
                                <dd>{selectedCompound.h_bond_donor_count}</dd>
                              </div>
                            )}
                            {selectedCompound.h_bond_acceptor_count !== undefined && (
                              <div>
                                <dt className="text-sm text-muted-foreground">H-Bond Acceptors</dt>
                                <dd>{selectedCompound.h_bond_acceptor_count}</dd>
                              </div>
                            )}
                            {selectedCompound.rotatable_bond_count !== undefined && (
                              <div>
                                <dt className="text-sm text-muted-foreground">Rotatable Bonds</dt>
                                <dd>{selectedCompound.rotatable_bond_count}</dd>
                              </div>
                            )}
                          </>
                        )}
                      </dl>
                    </div>
                    
                    {selectedCompound.complexity !== undefined && (
                      <div>
                        <h3 className="font-semibold mb-2">Molecular Properties</h3>
                        <dl className="space-y-2">
                          {selectedCompound.complexity !== undefined && (
                            <div>
                              <dt className="text-sm text-muted-foreground">Complexity</dt>
                              <dd>{typeof selectedCompound.complexity === 'number'
                                ? selectedCompound.complexity.toFixed(2)
                                : parseFloat(String(selectedCompound.complexity)).toFixed(2)}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {hasPhysicalData() && (
                  <TabsContent value="physical" className="p-4 border rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(selectedCompound.xlogp !== undefined || selectedCompound.tpsa !== undefined || selectedCompound.exact_mass !== undefined) && (
                        <div>
                          <h3 className="font-semibold mb-2">Physical Properties</h3>
                          <dl className="space-y-2">
                            {selectedCompound.xlogp !== undefined && (
                              <div>
                                <dt className="text-sm text-muted-foreground">XLogP</dt>
                                <dd>{typeof selectedCompound.xlogp === 'number' 
                                  ? selectedCompound.xlogp.toFixed(2)
                                  : parseFloat(String(selectedCompound.xlogp)).toFixed(2)}</dd>
                              </div>
                            )}
                            {selectedCompound.tpsa !== undefined && (
                              <div>
                                <dt className="text-sm text-muted-foreground">TPSA</dt>
                                <dd>{`${typeof selectedCompound.tpsa === 'number'
                                  ? selectedCompound.tpsa.toFixed(2)
                                  : parseFloat(String(selectedCompound.tpsa)).toFixed(2)} Å²`}</dd>
                              </div>
                            )}
                            {selectedCompound.exact_mass !== undefined && (
                              <div>
                                <dt className="text-sm text-muted-foreground">Exact Mass</dt>
                                <dd>{`${typeof selectedCompound.exact_mass === 'number'
                                  ? selectedCompound.exact_mass.toFixed(2)
                                  : parseFloat(String(selectedCompound.exact_mass)).toFixed(2)} Da`}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
                
                <TabsContent value="identifiers" className="p-4 border rounded-md">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Chemical Identifiers</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm text-muted-foreground">IUPAC Name</dt>
                          <dd className="break-words">{selectedCompound.iupac_name || 'Not available'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">SMILES</dt>
                          <dd className="break-all font-mono text-sm">{selectedCompound.canonical_smiles || 'Not available'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Isomeric SMILES</dt>
                          <dd className="break-all font-mono text-sm">{selectedCompound.isomeric_smiles || 'Not available'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">InChI</dt>
                          <dd className="break-all font-mono text-sm">{selectedCompound.inchi || 'Not available'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">InChIKey</dt>
                          <dd className="break-all font-mono text-sm">{selectedCompound.inchikey || 'Not available'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </TabsContent>
                
                {hasClinicalData() && (
                  <TabsContent value="clinical" className="p-4 border rounded-md">
                    <div className="space-y-6">
                      {selectedCompound.drug_classes && (
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center">
                            <Pill className="h-4 w-4 mr-1" />
                            Drug Classes
                          </h3>
                          {selectedCompound.drug_classes.includes('<') ? (
                            <div className="text-sm">
                              {renderHTML(selectedCompound.drug_classes)}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedCompound.drug_classes.split(/[,;]/).map((className, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {className.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {selectedCompound.indications && (
                        <div>
                          <h3 className="font-semibold mb-2">Indications/Uses</h3>
                          <div className="text-sm">
                            {renderHTML(selectedCompound.indications)}
                          </div>
                        </div>
                      )}
                      
                      {selectedCompound.pharmacology && (
                        <div>
                          <h3 className="font-semibold mb-2">Pharmacology</h3>
                          <div className="text-sm">
                            {renderHTML(selectedCompound.pharmacology)}
                          </div>
                        </div>
                      )}
                      
                      {selectedCompound.mechanism_of_action && (
                        <div>
                          <h3 className="font-semibold mb-2">Mechanism of Action</h3>
                          <div className="text-sm">
                            {renderHTML(selectedCompound.mechanism_of_action)}
                          </div>
                        </div>
                      )}
                      
                      {selectedCompound.metabolism && (
                        <div>
                          <h3 className="font-semibold mb-2">Metabolism</h3>
                          <div className="text-sm">
                            {renderHTML(selectedCompound.metabolism)}
                          </div>
                        </div>
                      )}
                      
                      {selectedCompound.absorption && (
                        <div>
                          <h3 className="font-semibold mb-2">Absorption & Distribution</h3>
                          <div className="text-sm">
                            {renderHTML(selectedCompound.absorption)}
                          </div>
                        </div>
                      )}
                      
                      {selectedCompound.half_life && (
                        <div>
                          <h3 className="font-semibold mb-2">Half Life</h3>
                          <div className="text-sm">
                            {renderHTML(selectedCompound.half_life)}
                          </div>
                        </div>
                      )}
                      
                      {selectedCompound.routes_of_elimination && (
                        <div>
                          <h3 className="font-semibold mb-2">Routes of Elimination</h3>
                          <div className="text-sm">
                            {renderHTML(selectedCompound.routes_of_elimination)}
                          </div>
                        </div>
                      )}
                      
                      {selectedCompound.drug_interactions && (
                        <div>
                          <h3 className="font-semibold mb-2">Drug Interactions</h3>
                          <div className="text-sm">
                            {renderHTML(selectedCompound.drug_interactions)}
                          </div>
                        </div>
                      )}
                      
                      {selectedCompound.food_interactions && (
                        <div>
                          <h3 className="font-semibold mb-2">Food Interactions</h3>
                          <div className="text-sm">
                            {renderHTML(selectedCompound.food_interactions)}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
                
                {hasSafetyData() && (
                  <TabsContent value="safety" className="p-4 border rounded-md">
                    <div className="space-y-6">
                      {selectedCompound.toxicity && (
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Toxicity
                          </h3>
                          <div className="text-sm">
                            {renderHTML(selectedCompound.toxicity)}
                          </div>
                        </div>
                      )}
                      
                      {selectedCompound.adverse_effects && (
                        <div>
                          <h3 className="font-semibold mb-2">Adverse Effects</h3>
                          <div className="text-sm">
                            {renderHTML(selectedCompound.adverse_effects)}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
                
                {hasSectionsData() && (
                  <TabsContent value="all_data" className="p-4 border rounded-md">
                    <div className="space-y-6">
                      <h3 className="font-semibold mb-4">All Available PubChem Data</h3>
                      
                      <div className="grid grid-cols-1 gap-6">
                        {Object.entries(selectedCompound.sections || {}).map(([sectionName, sectionData]) => (
                          <div key={sectionName} className="border rounded-md p-4">
                            <h4 className="font-medium mb-3 text-lg">{sectionName}</h4>
                            <div className="space-y-4">
                              {Object.entries(sectionData).map(([dataName, dataValue]) => (
                                <div key={`${sectionName}-${dataName}`}>
                                  <h5 className="font-medium text-sm text-muted-foreground mb-1">{dataName}</h5>
                                  <div className="text-sm">
                                    {renderHTML(dataValue)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>This tab shows all available data from PubChem for this compound. Some information might be redundant with other tabs but may contain additional details not shown elsewhere.</p>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setSelectedCompound(null)}>
              Back to Search
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 