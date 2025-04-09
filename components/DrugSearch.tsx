"use client"

import { useState, useEffect, useRef } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { Loader2, Search, ExternalLink, Info, Pill, Beaker, Microscope, Dna, AlertTriangle, FileText, BookOpen } from 'lucide-react'
import { cn } from '../lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

interface Compound {
  cid: number;
  name: string;
  molecular_formula?: string;
  molecular_weight?: number | string;
  canonical_smiles?: string;
  iupac_name?: string;
  inchikey?: string;
  // Physical properties
  xlogp?: number;
  exact_mass?: number;
  monoisotopic_mass?: number;
  tpsa?: number;
  complexity?: number;
  h_bond_donor_count?: number;
  h_bond_acceptor_count?: number;
  rotatable_bond_count?: number;
  heavy_atom_count?: number;
  // Additional information
  created_date?: string;
  synonyms?: string[];
  description?: string;
  pharmacology?: string;
  // Clinical information
  indications?: string;
  drug_classes?: string;
  mechanism_of_action?: string;
  metabolism?: string;
  absorption?: string;
  half_life?: string;
  // Safety information
  toxicity?: string;
  adverse_effects?: string;
  drug_interactions?: string;
  food_interactions?: string;
  // All detailed sections
  sections?: Record<string, Record<string, string>>;
}

interface DrugSearchProps {
  // Add any props if needed
}

export function DrugSearch(props: DrugSearchProps) {
  const [query, setQuery] = useState('');
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [selectedCompound, setSelectedCompound] = useState<Compound | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to check if the compound has physical data
  const hasPhysicalData = () => {
    if (!selectedCompound) return false;
    return !!(
      selectedCompound.xlogp !== undefined ||
      selectedCompound.tpsa !== undefined ||
      selectedCompound.h_bond_donor_count !== undefined ||
      selectedCompound.h_bond_acceptor_count !== undefined ||
      selectedCompound.rotatable_bond_count !== undefined ||
      selectedCompound.complexity !== undefined
    );
  };

  // Function to check if the compound has clinical data
  const hasClinicalData = () => {
    if (!selectedCompound) return false;
    return !!(
      selectedCompound.pharmacology ||
      selectedCompound.indications ||
      selectedCompound.drug_classes ||
      selectedCompound.mechanism_of_action ||
      selectedCompound.metabolism ||
      selectedCompound.absorption ||
      selectedCompound.half_life
    );
  };

  // Function to check if the compound has safety data
  const hasSafetyData = () => {
    if (!selectedCompound) return false;
    return !!(
      selectedCompound.toxicity ||
      selectedCompound.adverse_effects ||
      selectedCompound.drug_interactions ||
      selectedCompound.food_interactions
    );
  };

  // Function to check if the compound has detailed sections data
  const hasSectionsData = () => {
    if (!selectedCompound?.sections) return false;
    return Object.keys(selectedCompound.sections).length > 0;
  };

  // Function to determine which tab should be shown by default
  const getDefaultTab = () => {
    if (hasClinicalData()) return "clinical";
    if (hasSafetyData()) return "safety";
    if (hasPhysicalData()) return "physical";
    return "chemical";
  };

  useEffect(() => {
    // Generate image URL for the selected compound
    if (selectedCompound?.cid) {
      setImageUrl(`https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${selectedCompound.cid}&t=l`);
    } else {
      setImageUrl(null);
    }
  }, [selectedCompound]);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    if (query.length >= 2) {
      setLoading(true);
      setError(null);
      
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/pubchem?query=${encodeURIComponent(query)}`);
          if (!response.ok) {
            throw new Error(`Search failed: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          setCompounds(data.compounds || []);
          if (data.compounds.length === 0) {
            setError(`No compounds found for "${query}"`);
          }
        } catch (e) {
          console.error('Error searching compounds:', e);
          setError('Failed to fetch compounds. Please try again.');
        } finally {
          setLoading(false);
        }
      }, 500);
    } else {
      setCompounds([]);
    }
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleCompoundSelect = async (compound: Compound) => {
    setSelectedCompound(compound);
    setLoadingDetails(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/pubchem?cid=${compound.cid}`);
      if (!response.ok) {
        throw new Error(`Failed to get details: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.compound) {
        setSelectedCompound(data.compound);
      } else {
        setError('No detailed information available for this compound');
      }
    } catch (e) {
      console.error('Error fetching compound details:', e);
      setError('Failed to fetch compound details. Please try again.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const renderProperty = (label: string, value: any) => {
    if (value === undefined || value === null || value === '') return null;
    
    return (
      <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100 last:border-0">
        <span className="text-sm font-medium">{label}:</span>
        <span className="text-sm col-span-2">{value}</span>
      </div>
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  const renderSections = () => {
    if (!selectedCompound?.sections) return null;

    // Group sections by main category
    const mainCategories: Record<string, string[]> = {};
    
    // List of safety-related keywords to filter out
    const safetyKeywords = [
      'Toxicity', 
      'Safety', 
      'Hazards', 
      'Side Effects', 
      'Adverse Effects',
      'Contraindications',
      'Warnings'
    ];
    
    Object.keys(selectedCompound.sections).forEach(section => {
      // Skip sections that contain safety-related keywords
      if (safetyKeywords.some(keyword => section.includes(keyword))) {
        return;
      }
      
      const parts = section.split('>').map(p => p.trim());
      const mainCategory = parts[0];
      
      if (!mainCategories[mainCategory]) {
        mainCategories[mainCategory] = [];
      }
      
      if (!mainCategories[mainCategory].includes(section)) {
        mainCategories[mainCategory].push(section);
      }
    });

    return (
      <div className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(mainCategories).map(([category, sections], idx) => (
            <AccordionItem key={idx} value={category}>
              <AccordionTrigger className="text-md font-medium">
                {category}
              </AccordionTrigger>
              <AccordionContent>
                {sections.map((section, sIdx) => {
                  const sectionInfo = selectedCompound.sections?.[section];
                  if (!sectionInfo) return null;
                  
                  const subSection = section.includes('>') ? section.split('>').slice(1).join(' > ').trim() : '';
                  
                  return (
                    <div key={sIdx} className="mb-4">
                      {subSection && <h4 className="text-sm font-semibold mb-2">{subSection}</h4>}
                      {Object.entries(sectionInfo).map(([key, value], vIdx) => (
                        <div key={vIdx} className="mb-2">
                          {key !== 'General' && <span className="text-sm font-medium block">{key}:</span>}
                          <p className="text-sm whitespace-pre-line">{value}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  };

  return (
    <div className="drug-search-container">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Compounds</CardTitle>
            <CardDescription>Enter a drug name or compound</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for a drug..."
                  className="pl-8"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuery('')}
                disabled={!query}
              >
                ×
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 p-2 bg-red-50 text-red-600 rounded-md text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center mt-8 mb-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : compounds.length > 0 ? (
              <ScrollArea className="h-[200px] mt-4 pr-3">
                <div className="space-y-2">
                  {compounds.map((compound) => (
                    <Card
                      key={compound.cid}
                      className={cn(
                        "cursor-pointer hover:bg-accent transition-colors",
                        selectedCompound?.cid === compound.cid && "bg-accent"
                      )}
                      onClick={() => handleCompoundSelect(compound)}
                    >
                      <CardContent className="p-3">
                        <div className="font-medium">{compound.name}</div>
                        {compound.molecular_formula && (
                          <div className="text-sm text-muted-foreground">
                            {compound.molecular_formula}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : query.length >= 2 ? (
              <div className="text-center mt-8 text-muted-foreground">
                No compounds found. Try a different search.
              </div>
            ) : (
              <div className="text-center mt-8 text-muted-foreground">
                Enter at least 2 characters to search
              </div>
            )}
          </CardContent>
        </Card>
        
        {loadingDetails ? (
          <div className="h-[500px] flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedCompound ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedCompound.name}</CardTitle>
                  {selectedCompound.molecular_formula && (
                    <CardDescription className="mt-1">
                      {selectedCompound.molecular_formula}
                      {selectedCompound.molecular_weight && ` · ${typeof selectedCompound.molecular_weight === 'number' ? selectedCompound.molecular_weight.toFixed(2) : selectedCompound.molecular_weight} g/mol`}
                    </CardDescription>
                  )}
                  {selectedCompound.iupac_name && (
                    <CardDescription className="mt-1 text-xs italic">
                      IUPAC: {selectedCompound.iupac_name}
                    </CardDescription>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <a 
                    href={`https://pubchem.ncbi.nlm.nih.gov/compound/${selectedCompound.cid}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    PubChem <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {imageUrl && (
                  <div className="flex justify-center md:w-1/4">
                    <img 
                      src={imageUrl} 
                      alt={selectedCompound.name} 
                      className="max-w-full h-auto max-h-60 rounded-md"
                    />
                  </div>
                )}
                <div className={imageUrl ? "md:w-3/4" : "w-full"}>
                  <Tabs defaultValue={getDefaultTab()}>
                    <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${hasSectionsData() ? 5 : 4}, minmax(0, 1fr))` }}>
                      <TabsTrigger value="chemical" className="flex items-center gap-1">
                        <Beaker className="h-4 w-4" /> Chemical
                      </TabsTrigger>
                      {hasPhysicalData() && (
                        <TabsTrigger value="physical" className="flex items-center gap-1">
                          <Microscope className="h-4 w-4" /> Physical
                        </TabsTrigger>
                      )}
                      {hasClinicalData() && (
                        <TabsTrigger value="clinical" className="flex items-center gap-1">
                          <Pill className="h-4 w-4" /> Clinical
                        </TabsTrigger>
                      )}
                      {hasSafetyData() && (
                        <TabsTrigger value="safety" className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" /> Safety
                        </TabsTrigger>
                      )}
                      {hasSectionsData() && (
                        <TabsTrigger value="all-data" className="flex items-center gap-1">
                          <FileText className="h-4 w-4" /> All Data
                        </TabsTrigger>
                      )}
                    </TabsList>
                    
                    <TabsContent value="chemical" className="pt-4">
                      <ScrollArea className="h-[400px] pr-3">
                        {renderProperty("IUPAC Name", selectedCompound.iupac_name)}
                        {renderProperty("Canonical SMILES", selectedCompound.canonical_smiles)}
                        {renderProperty("InChI Key", selectedCompound.inchikey)}
                        {renderProperty("Created Date", formatDate(selectedCompound.created_date))}
                        
                        {selectedCompound.synonyms && selectedCompound.synonyms.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                            <span className="text-sm font-medium">Synonyms:</span>
                            <div className="text-sm col-span-2 flex flex-wrap gap-1">
                              {selectedCompound.synonyms.map((synonym, index) => (
                                <Badge key={index} variant="secondary">{synonym}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedCompound.description && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Description</h4>
                            <p className="text-sm whitespace-pre-line">{selectedCompound.description}</p>
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>
                    
                    {hasPhysicalData() && (
                      <TabsContent value="physical" className="pt-4">
                        <ScrollArea className="h-[400px] pr-3">
                          {renderProperty("XLogP", selectedCompound.xlogp)}
                          {renderProperty("Topological Polar Surface Area", selectedCompound.tpsa && `${selectedCompound.tpsa} Å²`)}
                          {renderProperty("H-Bond Donor Count", selectedCompound.h_bond_donor_count)}
                          {renderProperty("H-Bond Acceptor Count", selectedCompound.h_bond_acceptor_count)}
                          {renderProperty("Rotatable Bond Count", selectedCompound.rotatable_bond_count)}
                          {renderProperty("Heavy Atom Count", selectedCompound.heavy_atom_count)}
                          {renderProperty("Exact Mass", selectedCompound.exact_mass)}
                          {renderProperty("Monoisotopic Mass", selectedCompound.monoisotopic_mass)}
                          {renderProperty("Complexity", selectedCompound.complexity)}
                        </ScrollArea>
                      </TabsContent>
                    )}
                    
                    {hasClinicalData() && (
                      <TabsContent value="clinical" className="pt-4">
                        <ScrollArea className="h-[400px] pr-3">
                          {selectedCompound.pharmacology && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Pharmacology</h4>
                              <p className="text-sm whitespace-pre-line">{selectedCompound.pharmacology}</p>
                            </div>
                          )}
                          
                          {selectedCompound.indications && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Indications</h4>
                              <p className="text-sm whitespace-pre-line">{selectedCompound.indications}</p>
                            </div>
                          )}
                          
                          {selectedCompound.drug_classes && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Drug Classes</h4>
                              <p className="text-sm whitespace-pre-line">{selectedCompound.drug_classes}</p>
                            </div>
                          )}
                          
                          {selectedCompound.mechanism_of_action && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Mechanism of Action</h4>
                              <p className="text-sm whitespace-pre-line">{selectedCompound.mechanism_of_action}</p>
                            </div>
                          )}
                          
                          {selectedCompound.metabolism && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Metabolism</h4>
                              <p className="text-sm whitespace-pre-line">{selectedCompound.metabolism}</p>
                            </div>
                          )}
                          
                          {selectedCompound.absorption && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Absorption</h4>
                              <p className="text-sm whitespace-pre-line">{selectedCompound.absorption}</p>
                            </div>
                          )}
                          
                          {selectedCompound.half_life && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Half-life</h4>
                              <p className="text-sm whitespace-pre-line">{selectedCompound.half_life}</p>
                            </div>
                          )}
                        </ScrollArea>
                      </TabsContent>
                    )}
                    
                    {hasSafetyData() && (
                      <TabsContent value="safety" className="pt-4">
                        <ScrollArea className="h-[400px] pr-3">
                          {selectedCompound.toxicity && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Toxicity</h4>
                              <p className="text-sm whitespace-pre-line">{selectedCompound.toxicity}</p>
                            </div>
                          )}
                          
                          {selectedCompound.adverse_effects && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Adverse Effects</h4>
                              <p className="text-sm whitespace-pre-line">{selectedCompound.adverse_effects}</p>
                            </div>
                          )}
                          
                          {selectedCompound.drug_interactions && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Drug Interactions</h4>
                              <p className="text-sm whitespace-pre-line">{selectedCompound.drug_interactions}</p>
                            </div>
                          )}
                          
                          {selectedCompound.food_interactions && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Food Interactions</h4>
                              <p className="text-sm whitespace-pre-line">{selectedCompound.food_interactions}</p>
                            </div>
                          )}
                        </ScrollArea>
                      </TabsContent>
                    )}
                    
                    {hasSectionsData() && (
                      <TabsContent value="all-data" className="pt-4">
                        <ScrollArea className="h-[400px] pr-3">
                          {renderSections()}
                        </ScrollArea>
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-[300px] flex flex-col justify-center items-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center max-w-md px-4">
              Search for a drug or compound and select it from the list to view detailed information
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
