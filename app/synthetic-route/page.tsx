"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SyntheticRouteDisplay from '@/components/SyntheticRouteDisplay';
import { SearchIcon, HelpCircleIcon, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navbar } from '@/components/navbar';

// Add a function to get PubChem direct image URL
function getPubChemImageUrl(name: string) {
  return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/PNG`;
}

// Add more brand name suggestions to the existing DRUG_SUGGESTIONS array
const DRUG_SUGGESTIONS = [
  'Aspirin',
  'Paracetamol',
  'Acetaminophen',
  'Ibuprofen',
  'Omeprazole',
  'Amoxicillin',
  'Tylenol',
  'Advil',
  'Disprin',
  'Crocin'
];

// Add a mapping for brand to generic names for UI suggestions
const BRAND_TO_GENERIC: Record<string, string> = {
  'Tylenol': 'Acetaminophen',
  'Panadol': 'Paracetamol',
  'Crocin': 'Paracetamol',
  'Disprin': 'Aspirin',
  'Advil': 'Ibuprofen',
  'Motrin': 'Ibuprofen',
  'Nurofen': 'Ibuprofen'
};

export default function SyntheticRoutePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchCompleted, setIsSearchCompleted] = useState(!!initialQuery);
  const [directVisualization, setDirectVisualization] = useState<boolean>(false);
  const [visualizedDrug, setVisualizedDrug] = useState<string | null>(null);

  // Update suggestions when search query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = DRUG_SUGGESTIONS.filter(drug => 
        drug.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      
      setFilteredSuggestions(filtered);
      // Only show suggestions if we have matches and user has typed something
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Handle form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const query = searchQuery.trim();
    if (!query) {
      setSearchError('Please enter a drug name to search');
      return;
    }
    
    setIsLoading(true);
    setSearchError(null);
    setIsSearchCompleted(false);

    // Update URL with search query
    const params = new URLSearchParams();
    params.set('query', query);
    
    // Use a setTimeout to show loading state briefly before navigation
    // This prevents the loading state from being missed if navigation is too quick
    setTimeout(() => {
      router.push(`/synthetic-route?${params.toString()}`);
      setIsLoading(false);
      setIsSearchCompleted(true);
    }, 100);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    
    // Set loading state
    setIsLoading(true);
    setSearchError(null);
    setIsSearchCompleted(false);
    
    // Automatically search with this suggestion
    const params = new URLSearchParams();
    params.set('query', suggestion);
    
    setTimeout(() => {
      router.push(`/synthetic-route?${params.toString()}`);
      setIsLoading(false);
      setIsSearchCompleted(true);
    }, 100);
  };

  // Add a function to view the drug structure directly
  const handleDirectVisualization = (drugName: string) => {
    setVisualizedDrug(drugName);
    setDirectVisualization(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Synthetic Route Analysis</h1>
          <p className="text-muted-foreground mb-6">
            Search for a drug to see its synthetic pathway and chemical reactions.
          </p>
          
          {/* Search Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search for a Drug</CardTitle>
              <CardDescription>
                Enter a drug name to see its synthetic route. Try common drugs like Aspirin, Paracetamol, or Ibuprofen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <div className="relative flex-grow">
                    <Input
                      type="text"
                      placeholder="Enter drug name (e.g., Aspirin, Paracetamol)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                      autoComplete="off"
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <SearchIcon size={18} />
                      )}
                    </div>
                  </div>
                  
                  {/* Drug name suggestions */}
                  {showSuggestions && !isLoading && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                      <ul className="py-1">
                        {filteredSuggestions.map((suggestion, index) => (
                          <li 
                            key={index}
                            className="px-4 py-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading || !searchQuery.trim()}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Search Synthetic Route'
                  )}
                </Button>
                
                {searchError && (
                  <Alert variant="destructive">
                    <AlertDescription>{searchError}</AlertDescription>
                  </Alert>
                )}
                
                {/* Help text */}
                <div className="flex items-start gap-2 mt-4 text-sm text-muted-foreground">
                  <HelpCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>Try both common and chemical names. If "Paracetamol" doesn't work, try "Acetaminophen" instead.</p>
                    <p className="mt-1">For best results, use precise chemical names rather than brand names.</p>
                  </div>
                </div>
              </form>
              
              {/* Example buttons for quick access */}
              <div className="mt-6 border-t pt-4">
                <p className="text-sm font-medium mb-2">Quick Examples:</p>
                <div className="flex flex-wrap gap-2">
                  {['Aspirin', 'Paracetamol', 'Ibuprofen', 'Amoxicillin'].map((drug) => (
                    <Button 
                      key={drug} 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSuggestionClick(drug)}
                    >
                      {drug}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Brand name visualizer */}
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-medium mb-2">See Brand/Generic Relationships:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(BRAND_TO_GENERIC).slice(0, 4).map(([brand, generic]) => (
                    <Button 
                      key={brand} 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        handleDirectVisualization(generic);
                      }}
                    >
                      {brand} → {generic}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading state for results */}
          {isLoading && initialQuery && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <CardTitle>Searching for {initialQuery}...</CardTitle>
                </div>
                <CardDescription>
                  Fetching chemical data and synthetic routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Skeleton className="h-[200px] w-full rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Display results when search is complete */}
          {initialQuery && !isLoading && isSearchCompleted && (
            <SyntheticRouteDisplay drugName={initialQuery} />
          )}
          
          {/* Information card for empty state */}
          {!initialQuery && !isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>How Synthetic Route Analysis Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Synthetic route analysis breaks down the chemical reactions needed to synthesize a drug from simpler starting materials.
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Enter a drug name in the search box</li>
                  <li>Our system converts the drug name to a SMILES chemical representation</li>
                  <li>The retrosynthesis engine analyzes possible synthesis pathways</li>
                  <li>Multiple potential routes are displayed with reagents and conditions</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-4">
                  This feature uses PubChem for chemical data and IBM RXN for Chemistry for retrosynthesis analysis.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Direct PubChem visualization */}
          {directVisualization && visualizedDrug && (
            <div className="mt-6 border rounded p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">{visualizedDrug} Structure</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setDirectVisualization(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="flex flex-col items-center">
                <img 
                  src={getPubChemImageUrl(visualizedDrug)} 
                  alt={`Chemical structure of ${visualizedDrug}`}
                  className="max-w-full h-auto max-h-[200px] mb-2 border rounded"
                  onError={(e) => {
                    // If image fails to load, show a message
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const errorMsg = document.createElement('p');
                      errorMsg.textContent = `Could not load structure for ${visualizedDrug}`;
                      errorMsg.className = 'text-sm text-red-500';
                      parent.appendChild(errorMsg);
                    }
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set('query', visualizedDrug);
                      router.push(`/synthetic-route?${params.toString()}`);
                    }}
                  >
                    View Synthetic Route
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(visualizedDrug)}`, '_blank')}
                  >
                    View on PubChem
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 