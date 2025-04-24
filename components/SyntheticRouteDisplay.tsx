"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, DownloadIcon, AlertCircleIcon, ArrowRightIcon, SearchIcon, RefreshCcw, Eye, CheckCircle2, BookOpenIcon, BeakerIcon, FlaskConicalIcon, ThermometerIcon } from 'lucide-react';
import MoleculeVisualizer from './MoleculeVisualizer';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Extend jsPDF with the lastAutoTable property added by jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY?: number;
    };
  }
}

interface SyntheticRouteDisplayProps {
  drugName: string;
  smiles?: string;
  maxSteps?: number;
}

interface ReactionStep {
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

interface RetrosynthesisPath {
  steps: ReactionStep[];
  confidence: number;
}

interface RetrosynthesisData {
  paths: RetrosynthesisPath[];
  targetMolecule: string;
}

interface DrugInfo {
  name: string;
  smiles: string;
  cid?: string;
  molecular_formula?: string;
  molecular_weight?: number;
  iupac_name?: string;
}

interface ApiResponse {
  drug: DrugInfo;
  retrosynthesis: RetrosynthesisData;
  error?: string;
  message?: string;
}

interface ReactionType {
  name: string;
  description: string;
}

function classifyReactionType(step: ReactionStep): ReactionType {
  const description = step.description?.toLowerCase() || '';
  
  if (description.includes('esterification') || 
      (description.includes('acid') && description.includes('alcohol')) ||
      description.includes('transesterification')) {
    return { 
      name: 'Esterification', 
      description: 'Formation of an ester by reacting an alcohol with an acid' 
    };
  }
  
  if (description.includes('acylation') || 
      description.includes('acetyl') || 
      description.includes('acetylation') ||
      description.includes('anhydride') && description.includes('acid')) {
    return { 
      name: 'Acylation', 
      description: 'Addition of an acyl group to a compound' 
    };
  }
  
  if (description.includes('hydrolysis')) {
    return { 
      name: 'Hydrolysis', 
      description: 'Breaking of a chemical bond by addition of water' 
    };
  }
  
  if (description.includes('reduction') || description.includes('hydrogen') || description.includes('pd/c')) {
    return { 
      name: 'Reduction', 
      description: 'The gain of electrons or hydrogen, or the loss of oxygen' 
    };
  }
  
  if (description.includes('carbonylation') || description.includes('co')) {
    return { 
      name: 'Carbonylation', 
      description: 'Introduction of a carbonyl group (C=O) into a molecule' 
    };
  }
  
  if (description.includes('addition') || description.includes('cyanide')) {
    return { 
      name: 'Addition', 
      description: 'Addition of atoms or groups to a molecule' 
    };
  }
  
  if (description.includes('dehydration')) {
    return { 
      name: 'Dehydration', 
      description: 'Removal of water from a molecule' 
    };
  }

  return { 
    name: 'Chemical Reaction', 
    description: 'A process that results in the transformation of one set of chemical substances to another' 
  };
}

function extractTemperature(conditions: string | undefined): string {
  if (!conditions) return 'Room temperature';
  
  const tempRegex = /(\d+)[°℃]\s*C|(\d+)-(\d+)[°℃]\s*C/i;
  const roomTempRegex = /room\s+temp/i;
  
  if (roomTempRegex.test(conditions)) {
    return 'Room temperature (20-25°C)';
  }
  
  const match = conditions.match(tempRegex);
  if (match) {
    if (match[1]) {
      return `${match[1]}°C`;
    } else if (match[2] && match[3]) {
      return `${match[2]}-${match[3]}°C`;
    }
  }
  
  return 'Not specified';
}

function extractCatalysts(step: ReactionStep): string[] {
  const catalysts: string[] = [];
  const reagents = step.reagents || [];
  const description = step.description?.toLowerCase() || '';
  const conditions = step.conditions?.toLowerCase() || '';
  
  const knownCatalysts = ['pd/c', 'pd', 'pt', 'ni', 'h2so4', 'hcl', 'naoh', 'pyridine', 'h+'];
  
  reagents.forEach(reagent => {
    const lowerReagent = reagent.toLowerCase();
    if (knownCatalysts.some(cat => lowerReagent.includes(cat))) {
      catalysts.push(reagent);
    }
  });
  
  knownCatalysts.forEach(cat => {
    if (description.includes(cat) && !catalysts.includes(cat)) {
      catalysts.push(cat);
    }
    if (conditions.includes(cat) && !catalysts.includes(cat)) {
      catalysts.push(cat);
    }
  });
  
  return catalysts;
}

function getSmilesName(smiles: string): string {
  if (smiles.includes('CC(=O)O')) return 'Acetic acid';
  if (smiles.includes('CC(=O)Cl')) return 'Acetyl chloride';
  if (smiles.includes('CC(=O)OC(=O)C')) return 'Acetic anhydride';
  if (smiles.includes('O=C(O)c1ccccc1O')) return 'Salicylic acid';
  if (smiles.includes('CC(=O)Oc1ccccc1C(=O)O')) return 'Aspirin';
  if (smiles.includes('CCO')) return 'Ethanol';
  if (smiles.includes('CC(=O)OCC')) return 'Ethyl acetate';
  if (smiles.includes('Nc1ccc(O)cc1')) return '4-Aminophenol';
  if (smiles.includes('CC(=O)Nc1ccc(O)cc1')) return 'Paracetamol';
  if (smiles.includes('HCl')) return 'Hydrogen chloride';
  if (smiles.includes('CC(C)Cc1ccc(C(C)C(=O)O)cc1')) return 'Ibuprofen';
  
  return smiles.length > 15 ? `${smiles.substring(0, 12)}...` : smiles;
}

export default function SyntheticRouteDisplay({ 
  drugName, 
  smiles, 
  maxSteps = 3
}: SyntheticRouteDisplayProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 
  const [activeTab, setActiveTab] = useState<string>("route-0");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const router = useRouter();
  
  // References to the components we want to capture for PDF
  const synthesisRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    if (!drugName && !smiles) {
      setError("Please provide either a drug name or SMILES string.");
      setIsLoading(false);
      return;
    }

    const fetchSyntheticRoute = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setErrorMessage(null);
        
        console.log(`Searching for synthetic route data for: ${drugName || smiles}`);
        
        const params = new URLSearchParams();
        if (drugName) params.set('name', drugName);
        if (smiles) params.set('smiles', smiles);
        if (maxSteps) params.set('maxSteps', maxSteps.toString());
        
        const apiUrl = `/api/retrosynthesis?${params.toString()}`;
        console.log(`Fetching data from: ${apiUrl}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        try {
          const response = await fetch(apiUrl, {
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          console.log(`API response status: ${response.status} ${response.statusText}`);
          
          const result = await response.json();
          
          console.log('API Response:', result);
          
          if (!response.ok) {
            throw new Error(result.error || `Server responded with status: ${response.status}`);
          }
          
          if (!result.drug || !result.drug.smiles) {
            console.error('Missing drug information in response:', result);
            throw new Error('Response is missing required drug information');
          }
          
          if (!result.retrosynthesis || !result.retrosynthesis.paths || result.retrosynthesis.paths.length === 0) {
            console.warn('Response has no retrosynthesis paths:', result);
          }
          
          setData(result);
          
          if (result.error) {
            setError(result.error);
            setErrorMessage(result.message || 'Please try a different drug name or check your spelling.');
          }
        } catch (fetchError) {
          if (fetchError.name === 'AbortError') {
            throw new Error('Request timed out after 30 seconds. Please try again later.');
          }
          throw fetchError;
        }
      } catch (error: any) {
        console.error('Error fetching synthetic route:', error);
        setError(error.message || 'An error occurred while fetching synthetic route data');
        setErrorMessage('Please try again or use a different drug name. Some drug names may not be recognized.');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSyntheticRoute();
  }, [drugName, smiles, maxSteps, retryCount]);

  // PDF generation function with proper watermark
  const handleDownloadPDF = async () => {
    if (!data) return;
    
    try {
      setIsGeneratingPdf(true);
      
      // Initialize PDF with A4 size
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Get current active tab index
      const currentRouteIndex = parseInt(activeTab.split('-')[1], 10);
      const currentPath = data.retrosynthesis.paths[currentRouteIndex];
      
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text(`Synthetic Route for ${data.drug.name}`, 14, 20);
      
      // Add confidence score
      doc.setFontSize(12);
      doc.text(`Confidence Score: ${(currentPath.confidence * 100).toFixed(1)}%`, 14, 30);
      
      // Add drug details using a table - simplified approach without image
      doc.setFontSize(14);
      doc.text("Target Molecule Information", 14, 40);
      
      const drugInfoRows = [];
      drugInfoRows.push(["SMILES", data.drug.smiles]);
      
      if (data.drug.molecular_formula) {
        drugInfoRows.push(["Formula", data.drug.molecular_formula]);
      }
      
      if (data.drug.molecular_weight) {
        drugInfoRows.push(["Molecular Weight", `${data.drug.molecular_weight} g/mol`]);
      }
      
      if (data.drug.iupac_name) {
        drugInfoRows.push(["IUPAC Name", data.drug.iupac_name]);
      }
      
      // Use the imported autoTable function directly
      autoTable(doc, {
        startY: 45,
        head: [["Property", "Value"]],
        body: drugInfoRows,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        margin: { top: 45 }
      });
      
      // Get the final Y position after the table
      let yPos = (doc as any).lastAutoTable?.finalY || 100;
      
      // Overview of synthesis
      doc.setFontSize(14);
      doc.text("Synthesis Overview", 14, yPos + 10);
      doc.setFontSize(11);
      
      const startingMaterials = currentPath.steps[currentPath.steps.length - 1].reactants
        .map(r => getSmilesName(r))
        .join(" and ");
      
      const overviewText = `This route synthesizes ${data.drug.name} in ${currentPath.steps.length} steps starting from ${startingMaterials}. The final product is formed with an estimated ${(currentPath.confidence * 100).toFixed(1)}% confidence.`;
      
      // Multi-line text - Split text to ensure it fits within page width
      const splitText = doc.splitTextToSize(overviewText, 180);
      doc.text(splitText, 14, yPos + 20);
      
      yPos += 20 + (splitText.length * 6); // Adjust yPos based on number of text lines
      
      // Add each reaction step
      doc.setFontSize(14);
      doc.text("Synthesis Steps", 14, yPos + 5);
      
      yPos += 10;
      
      // Process steps in reverse order (starting materials to product)
      const stepsInOrder = [...currentPath.steps].reverse();
      
      for (let i = 0; i < stepsInOrder.length; i++) {
        const step = stepsInOrder[i];
        const reactionType = classifyReactionType(step);
        
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 15;
        }
        
        // Add step header with step number and reaction type
        doc.setFontSize(12);
        doc.setTextColor(41, 128, 185);
        doc.text(`Step ${i + 1}: ${reactionType.name}`, 14, yPos + 5);
        doc.setTextColor(0, 0, 0);
        
        // Reactants info
        doc.setFontSize(10);
        doc.text("Reactants:", 14, yPos + 12);
        const reactantsText = step.reactants.map(r => getSmilesName(r)).join(", ");
        doc.text(reactantsText, 40, yPos + 12);
        
        // Conditions
        doc.text("Conditions:", 14, yPos + 18);
        const conditionsText = step.conditions || "Not specified";
        doc.text(conditionsText, 40, yPos + 18);
        
        // Reagents if any
        let currentY = yPos + 24;
        if (step.reagents && step.reagents.length > 0) {
          doc.text("Reagents:", 14, currentY);
          doc.text(step.reagents.join(", "), 40, currentY);
          currentY += 6; // Extra space for reagents
        }
        
        // Products
        doc.text("Products:", 14, currentY);
        const productsText = step.products.map(p => getSmilesName(p)).join(", ");
        doc.text(productsText, 40, currentY);
        currentY += 6;
        
        // Description
        if (step.description) {
          doc.text("Details:", 14, currentY);
          const descriptionLines = doc.splitTextToSize(step.description, 160);
          doc.text(descriptionLines, 40, currentY);
          currentY += (descriptionLines.length * 5);
          
          // Add simple explanation
          doc.setTextColor(100, 100, 100);
          doc.text("In simple terms:", 14, currentY);
          
          let simpleExplanation = "";
          if (reactionType.name === 'Acylation') {
            simpleExplanation = `We're adding an acetyl group (from ${step.reactants.map(r => getSmilesName(r)).join(' and ')}) to create ${step.products.map(p => getSmilesName(p)).join(' and ')}.`;
          } else if (reactionType.name === 'Esterification') {
            simpleExplanation = `We're combining an acid and an alcohol to form an ester bond in ${step.products.map(p => getSmilesName(p)).join(' and ')}.`;
          } else if (reactionType.name === 'Hydrolysis') {
            simpleExplanation = `We're breaking down the molecule using water to create ${step.products.map(p => getSmilesName(p)).join(' and ')}.`;
          } else if (reactionType.name === 'Reduction') {
            simpleExplanation = `We're adding hydrogen to the molecule to reduce it into ${step.products.map(p => getSmilesName(p)).join(' and ')}.`;
          } else if (reactionType.name === 'Carbonylation') {
            simpleExplanation = `We're inserting a carbon monoxide group into the molecule to form ${step.products.map(p => getSmilesName(p)).join(' and ')}.`;
          } else {
            simpleExplanation = `We're transforming the starting materials into ${step.products.map(p => getSmilesName(p)).join(' and ')} through a chemical reaction.`;
          }
          
          const simpleLines = doc.splitTextToSize(simpleExplanation, 160);
          doc.text(simpleLines, 40, currentY);
          currentY += (simpleLines.length * 5);
          doc.setTextColor(0, 0, 0);
        }
        
        // Update yPos for next step
        yPos = currentY + 10;
        
        // Add separator line between steps
        if (i < stepsInOrder.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.line(14, yPos, 196, yPos);
          yPos += 5;
        }
      }
      
      // Add final product section
      doc.setFontSize(14);
      doc.setTextColor(0, 128, 0);
      doc.text("Final Product", 14, yPos + 10);
      doc.setTextColor(0, 0, 0);
      
      doc.setFontSize(12);
      doc.text(`${data.drug.name}`, 14, yPos + 20);
      
      if (data.drug.molecular_formula) {
        doc.setFontSize(10);
        doc.text(`Formula: ${data.drug.molecular_formula}`, 14, yPos + 26);
      }
      
      if (data.drug.molecular_weight) {
        doc.setFontSize(10);
        doc.text(`Molecular Weight: ${data.drug.molecular_weight} g/mol`, 14, yPos + 32);
      }
      
      // Add MediAI watermark to bottom right corner of each page
      const pageCount = doc.getNumberOfPages();
      for (let j = 1; j <= pageCount; j++) {
        doc.setPage(j);
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        doc.text("Made By MediAI", doc.internal.pageSize.getWidth() - 35, doc.internal.pageSize.getHeight() - 10);
      }
      
      // Save the PDF with a clean filename
      const cleanName = data.drug.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      doc.save(`${cleanName}_synthetic_route.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // More detailed error reporting to help debugging
      let errorMessage = 'Failed to generate PDF. Please try again.';
      if (error instanceof Error) {
        errorMessage = `PDF generation failed: ${error.message}`;
        console.error(error.stack);
      }
      
      alert(errorMessage);
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  
  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <RefreshCcw className="h-4 w-4 animate-spin" />
            <CardTitle>Searching compound data...</CardTitle>
          </div>
          <CardDescription>
            Looking for {drugName || smiles} in chemical databases
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
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle className="font-medium">Error: {error}</AlertTitle>
        <AlertDescription className="mt-2">
          <p>{errorMessage || 'An unexpected error occurred.'}</p>
          
          <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry} 
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => window.open(`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(drugName || smiles || '')}`, '_blank')}
            >
              <SearchIcon className="h-4 w-4" />
              Search on PubChem
            </Button>
            {smiles && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open(`https://pubchem.ncbi.nlm.nih.gov/compound/${encodeURIComponent(smiles)}#section=3D-Conformer`, '_blank')}
              >
                <Eye className="h-4 w-4" />
                View 3D Structure
              </Button>
            )}
          </div>
          
          <div className="mt-4 text-sm">
            <p>Try alternatives:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Check for spelling errors</li>
              <li>Use alternative names (e.g., "Acetaminophen" instead of "Paracetamol")</li>
              <li>Use chemical names instead of brand names</li>
              <li>Try a SMILES string directly if you have it</li>
            </ul>
            
            {error.includes("Could not find SMILES") && (
              <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <p className="font-medium text-amber-800 dark:text-amber-200">Try these alternative names:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {drugName?.toLowerCase().includes('paracetamol') && (
                    <Button variant="outline" size="sm" onClick={() => {
                      setRetryCount(prev => prev + 1);
                      router.push(`/synthetic-route?query=acetaminophen`);
                    }}>
                      Acetaminophen
                    </Button>
                  )}
                  {drugName?.toLowerCase().includes('acetaminophen') && (
                    <Button variant="outline" size="sm" onClick={() => {
                      setRetryCount(prev => prev + 1);
                      router.push(`/synthetic-route?query=paracetamol`);
                    }}>
                      Paracetamol
                    </Button>
                  )}
                  {drugName?.toLowerCase().includes('aspirin') && (
                    <Button variant="outline" size="sm" onClick={() => {
                      setRetryCount(prev => prev + 1);
                      router.push(`/synthetic-route?query=acetylsalicylic%20acid`);
                    }}>
                      Acetylsalicylic acid
                    </Button>
                  )}
                  {drugName?.toLowerCase().includes('advil') && (
                    <Button variant="outline" size="sm" onClick={() => {
                      setRetryCount(prev => prev + 1);
                      router.push(`/synthetic-route?query=ibuprofen`);
                    }}>
                      Ibuprofen
                    </Button>
                  )}
                  {drugName?.toLowerCase().includes('tylenol') && (
                    <Button variant="outline" size="sm" onClick={() => {
                      setRetryCount(prev => prev + 1);
                      router.push(`/synthetic-route?query=acetaminophen`);
                    }}>
                      Acetaminophen
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || !data.retrosynthesis || !data.retrosynthesis.paths || data.retrosynthesis.paths.length === 0) {
    return (
      <Alert>
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>No synthetic routes found</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            We couldn't find any synthetic routes for {drugName || smiles}. This could be because the molecule is too complex, or the API doesn't have data for this compound.
          </p>
          
          <div className="mt-4 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry} 
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => window.open(`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(drugName || smiles || '')}`, '_blank')}
            >
              <SearchIcon className="h-4 w-4" />
              Search on PubChem
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Synthetic Route for {data.drug.name}</h2>
        <Button 
          onClick={handleDownloadPDF} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? (
            <>
              <RefreshCcw className="h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <DownloadIcon size={16} />
              Download PDF
            </>
          )}
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Target Molecule</CardTitle>
          <CardDescription>
            {data.drug.iupac_name || data.drug.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <MoleculeVisualizer 
              smiles={data.drug.smiles} 
              width={300} 
              height={200} 
              title="Molecular Structure"
            />
          </div>
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">SMILES</p>
                <p className="text-sm font-mono break-all">{data.drug.smiles}</p>
              </div>
              {data.drug.molecular_formula && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Molecular Formula</p>
                  <p className="text-sm">{data.drug.molecular_formula}</p>
                </div>
              )}
              {data.drug.molecular_weight && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Molecular Weight</p>
                  <p className="text-sm">{data.drug.molecular_weight} g/mol</p>
                </div>
              )}
              {data.drug.cid && (
                <div>
                  <p className="text-sm font-medium text-gray-500">PubChem CID</p>
                  <p className="text-sm">{data.drug.cid}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 w-full md:w-auto">
          {data.retrosynthesis.paths.slice(0, 3).map((path, index) => (
            <TabsTrigger key={`route-${index}`} value={`route-${index}`} className="px-4 py-2">
              Route {index + 1} ({(path.confidence * 100).toFixed(0)}%)
            </TabsTrigger>
          ))}
        </TabsList>

        {data.retrosynthesis.paths.slice(0, 3).map((path, pathIndex) => (
          <TabsContent key={`route-content-${pathIndex}`} value={`route-${pathIndex}`} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Synthetic Route {pathIndex + 1}</CardTitle>
                    <CardDescription>
                      Confidence score: {(path.confidence * 100).toFixed(1)}%
                    </CardDescription>
                  </div>
                  <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                    <CheckCircle2 className="text-green-500 mr-2 h-4 w-4" />
                    <span className="text-green-700 dark:text-green-300 text-sm font-medium">
                      {path.steps.length} Step{path.steps.length !== 1 ? 's' : ''} Synthesis
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="space-y-8" 
                  ref={el => {
                    if (!synthesisRefs.current) synthesisRefs.current = [];
                    synthesisRefs.current[pathIndex] = el;
                  }}
                >
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <BookOpenIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-semibold text-blue-700 dark:text-blue-300">Synthesis Overview</h3>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      This route synthesizes {data.drug.name} in {path.steps.length} steps starting from 
                      {path.steps[path.steps.length - 1].reactants.map((r, i) => 
                        ` ${getSmilesName(r)}${i < path.steps[path.steps.length - 1].reactants.length - 1 ? ' and' : ''}`
                      )}. The final product is formed with an estimated {(path.confidence * 100).toFixed(1)}% confidence.
                    </p>
                  </div>
                
                  {path.steps.slice().reverse().map((step, stepIndex) => {
                    const reactionType = classifyReactionType(step);
                    const temperature = extractTemperature(step.conditions);
                    const catalysts = extractCatalysts(step);
                    
                    return (
                      <div key={`step-${stepIndex}`} className="border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center mb-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                          <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground w-8 h-8 mr-3">
                            {stepIndex + 1}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">Step {stepIndex + 1}: {reactionType.name}</h3>
                            <p className="text-sm text-muted-foreground">{reactionType.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col">
                          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-4 mb-4">
                            <h4 className="text-md font-medium mb-3 flex items-center">
                              <BeakerIcon className="h-4 w-4 mr-2 text-blue-500" /> 
                              Reactants & Starting Materials
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {step.reactants.map((reactant, i) => (
                                <div key={`reactant-${i}`} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                                  <MoleculeVisualizer 
                                    key={`reactant-viz-${i}`}
                                    smiles={reactant}
                                    width={180}
                                    height={120}
                                    title={getSmilesName(reactant)}
                                  />
                                  <div className="mt-2 text-center">
                                    <p className="text-sm font-medium">{getSmilesName(reactant)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-center my-4">
                            <div className="w-1/3 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
                            <div className="mx-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <FlaskConicalIcon className="h-4 w-4 mr-2 text-yellow-500" /> 
                                Reaction Conditions
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div className="flex items-center">
                                  <ThermometerIcon className="h-4 w-4 mr-1 text-red-400" />
                                  <span className="text-gray-700 dark:text-gray-300">Temperature:</span>
                                  <span className="ml-1 font-medium">{temperature}</span>
                                </div>
                                {catalysts.length > 0 && (
                                  <div className="flex items-center">
                                    <span className="text-gray-700 dark:text-gray-300">Catalyst:</span>
                                    <span className="ml-1 font-medium">{catalysts.join(', ')}</span>
                                  </div>
                                )}
                                {step.conditions && (
                                  <div className="flex items-center col-span-2">
                                    <span className="text-gray-700 dark:text-gray-300">Conditions:</span>
                                    <span className="ml-1 font-medium">{step.conditions}</span>
                                  </div>
                                )}
                                {step.reagents && step.reagents.length > 0 && (
                                  <div className="flex items-center col-span-2">
                                    <span className="text-gray-700 dark:text-gray-300">Reagents:</span>
                                    <span className="ml-1 font-medium">{step.reagents.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="w-1/3 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
                          </div>
                          
                          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 mt-4">
                            <h4 className="text-md font-medium mb-3 flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> 
                              Products{stepIndex === path.steps.length - 1 ? ' (Final)' : ' (Intermediate)'}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {step.products.map((product, i) => (
                                <div key={`product-${i}`} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                                  <MoleculeVisualizer 
                                    key={`product-viz-${i}`}
                                    smiles={product}
                                    width={180}
                                    height={120}
                                    title={getSmilesName(product)}
                                  />
                                  <div className="mt-2 text-center">
                                    <p className="text-sm font-medium">{getSmilesName(product)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {step.description && (
                            <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <BookOpenIcon className="h-4 w-4 mr-2 text-indigo-500" /> 
                                Reaction Explanation
                              </h4>
                              <p className="text-sm">{step.description}</p>
                              
                              <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800">
                                <p className="text-sm italic">
                                  <span className="font-medium">In simple terms:</span> {
                                    reactionType.name === 'Acylation' ? 
                                      `We're adding an acetyl group (from ${step.reactants.map(r => getSmilesName(r)).join(' and ')}) to create ${step.products.map(p => getSmilesName(p)).join(' and ')}.` :
                                    reactionType.name === 'Esterification' ?
                                      `We're combining an acid and an alcohol to form an ester bond in ${step.products.map(p => getSmilesName(p)).join(' and ')}.` :
                                    reactionType.name === 'Hydrolysis' ?
                                      `We're breaking down the molecule using water to create ${step.products.map(p => getSmilesName(p)).join(' and ')}.` :
                                    reactionType.name === 'Reduction' ?
                                      `We're adding hydrogen to the molecule to reduce it into ${step.products.map(p => getSmilesName(p)).join(' and ')}.` :
                                    reactionType.name === 'Carbonylation' ?
                                      `We're inserting a carbon monoxide group into the molecule to form ${step.products.map(p => getSmilesName(p)).join(' and ')}.` :
                                      `We're transforming the starting materials into ${step.products.map(p => getSmilesName(p)).join(' and ')} through a chemical reaction.`
                                  }
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="border-2 rounded-lg p-6 border-green-300 bg-green-50 dark:bg-green-900/30 dark:border-green-800">
                    <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Final Product: {data.drug.name}</h3>
                        <p className="text-green-700 dark:text-green-400">
                          The synthesis is complete after {path.steps.length} steps with {(path.confidence * 100).toFixed(1)}% confidence.
                        </p>
                      </div>
                      <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                      </div>
                    </div>
                    
                    <div className="flex justify-center my-4">
                      <MoleculeVisualizer 
                        smiles={data.drug.smiles}
                        width={250}
                        height={180}
                        title={data.drug.name}
                      />
                    </div>
                    
                    {data.drug.molecular_formula && (
                      <div className="text-center mt-2">
                        <span className="font-medium">Formula:</span> {data.drug.molecular_formula}
                        {data.drug.molecular_weight && (
                          <span className="ml-4"><span className="font-medium">MW:</span> {data.drug.molecular_weight} g/mol</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Hidden watermark for PDFs */}
      <div className="fixed bottom-2 right-2 text-gray-300 text-xs opacity-30 pointer-events-none">
        Made By MediAI
      </div>
    </div>
  );
} 