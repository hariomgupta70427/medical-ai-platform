"use client"

import { useState } from 'react'
import { Navbar } from "@/components/navbar"
import { DrugExplanationCard } from "@/components/DrugExplanationCard"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getExampleExplanation } from '@/lib/llmService'
import { FlaskConical, Beaker, Search } from 'lucide-react'

const DRUGS = [
  { name: "Aspirin", smiles: "CC(=O)OC1=CC=CC=C1C(=O)O", modifiedSmiles: "CC(=O)OC1=CC=CC=C1C(=O)OCCO" },
  { name: "Ibuprofen", smiles: "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O", modifiedSmiles: "CC(C)CC1=CC=C(C=C1)C(C)C(=O)OCOC(=O)C(C)C" },
  { name: "Paracetamol", smiles: "CC(=O)NC1=CC=C(C=C1)O", modifiedSmiles: "CC(=O)NC1=CC=C(C=C1)OC" }
]

export default function DemoExplanation() {
  const [selectedDrug, setSelectedDrug] = useState(DRUGS[0])
  const [customDrug, setCustomDrug] = useState({ name: "", smiles: "", modifiedSmiles: "" })
  const [isGenerating, setIsGenerating] = useState(false)
  const [explanation, setExplanation] = useState("")
  const [currentMode, setCurrentMode] = useState<'preset' | 'custom'>('preset')

  const generateExplanation = async (drug = selectedDrug) => {
    setIsGenerating(true)
    setExplanation("")
    
    try {
      // Call the actual API endpoint instead of just using local examples
      const response = await fetch('/api/explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          original_drug_name: drug.name,
          original_smiles: drug.smiles,
          original_formula: drug.name === 'Aspirin' ? 'C9H8O4' : 
                            drug.name === 'Ibuprofen' ? 'C13H18O2' : 
                            drug.name === 'Paracetamol' ? 'C8H9NO2' : '',
          original_purpose: drug.name === 'Aspirin' ? 'Anti-inflammatory and analgesic drug used for pain relief, fever reduction, and prevention of cardiovascular events' :
                            drug.name === 'Ibuprofen' ? 'Non-steroidal anti-inflammatory drug (NSAID) used for pain relief, fever reduction, and reducing inflammation' :
                            drug.name === 'Paracetamol' ? 'Analgesic and antipyretic drug used for pain relief and fever reduction' : 'Medication',
          modified_smiles: drug.modifiedSmiles,
          modification_description: drug.name === 'Aspirin' ? 'Addition of a glycol ester group to reduce direct contact with gastric mucosa' :
                                   drug.name === 'Ibuprofen' ? 'Creation of a dimer structure with a cleavable linker' :
                                   drug.name === 'Paracetamol' ? 'Methylation of the phenolic hydroxyl group to create a prodrug form' : 'Chemical modification',
          modification_goal: drug.name === 'Aspirin' ? 'Reduce gastric irritation' :
                             drug.name === 'Ibuprofen' ? 'Reduce kidney toxicity' :
                             drug.name === 'Paracetamol' ? 'Reduce liver toxicity' : 'Improve drug properties',
          expected_benefits: drug.name === 'Aspirin' ? 'Reduced gastrointestinal irritation while maintaining anti-inflammatory and anti-platelet effects' :
                             drug.name === 'Ibuprofen' ? 'Reduced direct COX inhibition in the kidneys, potentially reducing renal side effects' :
                             drug.name === 'Paracetamol' ? 'Reduced formation of the hepatotoxic metabolite N-acetyl-p-benzoquinone imine (NAPQI)' : 'Improved therapeutic index',
          // Use the API by default, not demo mode
          demo_mode: false
        })
      });

      if (!response.ok) {
        console.error(`API request failed: ${response.statusText}`);
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      setExplanation(data.explanation);
      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating explanation:", error);
      // Fallback to local examples if API fails
      setTimeout(() => {
        console.log("Falling back to example explanation");
        setExplanation(getExampleExplanation(drug.name));
        setIsGenerating(false);
      }, 1000);
    }
  }

  const handleDrugSelect = (drug: typeof DRUGS[0]) => {
    setSelectedDrug(drug)
    setExplanation("")
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customDrug.name && customDrug.smiles && customDrug.modifiedSmiles) {
      setCurrentMode('custom')
      
      // Call the API with the custom drug data
      const customFormula = customDrug.name === 'Aspirin' ? 'C9H8O4' : 
                             customDrug.name === 'Ibuprofen' ? 'C13H18O2' : 
                             customDrug.name === 'Paracetamol' ? 'C8H9NO2' : '';
                             
      // Create a customDrugData object with the same structure as what we use for preset drugs
      const customDrugData = {
        name: customDrug.name,
        smiles: customDrug.smiles,
        modifiedSmiles: customDrug.modifiedSmiles
      };
      
      generateExplanation(customDrugData);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Drug Modification Explainer</h1>
            <p className="text-lg text-muted-foreground">
              Generate detailed scientific explanations for drug modifications
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Tabs defaultValue="preset" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preset" onClick={() => setCurrentMode('preset')}>
                    <FlaskConical className="h-4 w-4 mr-2" />
                    Preset Drugs
                  </TabsTrigger>
                  <TabsTrigger value="custom" onClick={() => setCurrentMode('custom')}>
                    <Beaker className="h-4 w-4 mr-2" />
                    Custom Input
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="preset">
                  <Card>
                    <CardHeader>
                      <CardTitle>Select a Drug</CardTitle>
                      <CardDescription>
                        Choose from our preset examples to see a modification explanation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {DRUGS.map((drug) => (
                        <div 
                          key={drug.name}
                          className={`p-4 border rounded-md cursor-pointer hover:border-primary transition-colors ${
                            selectedDrug.name === drug.name ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => handleDrugSelect(drug)}
                        >
                          <div className="font-medium">{drug.name}</div>
                          <div className="text-xs text-muted-foreground mt-1 truncate">
                            {drug.smiles}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => generateExplanation()}
                        disabled={isGenerating}
                      >
                        {isGenerating ? <Beaker className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Generate Explanation
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="custom">
                  <Card>
                    <CardHeader>
                      <CardTitle>Custom Drug Input</CardTitle>
                      <CardDescription>
                        Enter your own drug details to generate an explanation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCustomSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="drugName">Drug Name</Label>
                          <Input
                            id="drugName"
                            placeholder="e.g., Aspirin"
                            value={customDrug.name}
                            onChange={(e) => setCustomDrug({...customDrug, name: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="originalSmiles">Original SMILES</Label>
                          <Input
                            id="originalSmiles"
                            placeholder="e.g., CC(=O)OC1=CC=CC=C1C(=O)O"
                            value={customDrug.smiles}
                            onChange={(e) => setCustomDrug({...customDrug, smiles: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="modifiedSmiles">Modified SMILES</Label>
                          <Input
                            id="modifiedSmiles"
                            placeholder="e.g., CC(=O)OC1=CC=CC=C1C(=O)OCCO"
                            value={customDrug.modifiedSmiles}
                            onChange={(e) => setCustomDrug({...customDrug, modifiedSmiles: e.target.value})}
                            required
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isGenerating || !customDrug.name || !customDrug.smiles || !customDrug.modifiedSmiles}
                        >
                          {isGenerating ? <Beaker className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Generate Custom Explanation
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">How It Works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="text-sm space-y-2 list-decimal pl-4">
                      <li>Select a preset drug or enter custom SMILES</li>
                      <li>Our AI analyzes the molecular changes</li>
                      <li>Receive a detailed scientific explanation</li>
                      <li>View molecular visualizations side-by-side</li>
                    </ol>
                    <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-xs text-amber-800">
                        This is a demo using predefined examples. In the full version, explanations are generated using AI models based on your specific inputs.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-2">
              {currentMode === 'preset' ? (
                <DrugExplanationCard
                  drugName={selectedDrug.name}
                  originalSmiles={selectedDrug.smiles}
                  modifiedSmiles={selectedDrug.modifiedSmiles}
                  explanation={explanation}
                  isLoading={isGenerating}
                  provider="demo"
                />
              ) : (
                <DrugExplanationCard
                  drugName={customDrug.name}
                  originalSmiles={customDrug.smiles}
                  modifiedSmiles={customDrug.modifiedSmiles}
                  explanation={explanation}
                  isLoading={isGenerating}
                  provider="demo"
                />
              )}

              {!explanation && !isGenerating && (
                <Card className="w-full">
                  <CardContent className="flex flex-col items-center justify-center min-h-[400px] py-12">
                    <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Explanation Generated</h3>
                    <p className="text-center text-muted-foreground max-w-md">
                      Select a drug from the list or enter your custom drug details, then click "Generate Explanation" to see the analysis.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 