"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ClientPubChemViewer } from "./ClientPubChemViewer"
import { MoleculeSearch } from "./MoleculeSearch"

export function SimulationHero() {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [activeTab, setActiveTab] = useState("protein")
  const [viewStyle, setViewStyle] = useState<'stick' | 'sphere' | 'line'>('stick')
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  // Handle error for PubChem viewer
  const handleViewerError = () => {
    setHasError(true)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20">
      <div className="container">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.h2
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="text-3xl font-bold tracking-tight mb-4"
          >
            Interactive Molecular Simulations
          </motion.h2>
          <motion.p
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } },
            }}
            className="text-muted-foreground max-w-2xl"
          >
            Explore molecular structures and interactions in real-time with our advanced simulation tools.
          </motion.p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative w-full">
            <TabsList className="grid grid-cols-2 w-full gap-2 pb-2 mb-6 border-b bg-background sm:flex sm:flex-wrap">
              <TabsTrigger 
                value="protein" 
                className="h-auto py-3 px-3 text-sm text-center"
              >
                Protein Folding
              </TabsTrigger>
              <TabsTrigger 
                value="binding" 
                className="h-auto py-3 px-3 text-sm text-center"
              >
                Ligand Binding
              </TabsTrigger>
              <TabsTrigger 
                value="pathway" 
                className="h-auto py-3 px-3 text-sm text-center"
              >
                Drug Pathways
              </TabsTrigger>
              <TabsTrigger 
                value="search" 
                className="h-auto py-3 px-3 text-sm text-center"
              >
                Search Molecules
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="protein">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      {hasError ? (
                        <div className="text-center p-6 text-muted-foreground">
                          <p className="mb-2">Failed to load 3D model</p>
                          <Button variant="outline" onClick={() => setHasError(false)}>Retry</Button>
                        </div>
                      ) : (
                        <ClientPubChemViewer 
                          cid={4173}
                          pubchemUrl="https://pubchem.ncbi.nlm.nih.gov/rest/pug/conformers/0000104D00000001/JSON?response_type=display"
                          height="100%"
                          style={viewStyle}
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant={viewStyle === 'stick' ? 'default' : 'outline'} 
                        onClick={() => setViewStyle('stick')}
                      >
                        Stick Model
                      </Button>
                      <Button 
                        size="sm" 
                        variant={viewStyle === 'sphere' ? 'default' : 'outline'} 
                        onClick={() => setViewStyle('sphere')}
                      >
                        Space-filling
                      </Button>
                      <Button 
                        size="sm" 
                        variant={viewStyle === 'line' ? 'default' : 'outline'} 
                        onClick={() => setViewStyle('line')}
                      >
                        Wireframe
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">Protein Folding Analysis</h3>
                    <p className="text-muted-foreground mb-6">
                      Our advanced AI algorithms predict protein folding patterns with unprecedented accuracy, 
                      enabling faster identification of potential drug targets and interactions. The visualization shows 
                      the molecular structure of Aspirin (acetylsalicylic acid), one of the most widely used medications globally.
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Carbon atoms (C)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Oxygen atoms (O)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-700"></div>
                        <span className="text-sm">Nitrogen atoms (N)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span className="text-sm">Hydrogen atoms (H)</span>
                      </div>
                    </div>
                    <Button className="w-full md:w-auto">Learn More</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="binding">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      {hasError ? (
                        <div className="text-center p-6 text-muted-foreground">
                          <p className="mb-2">Failed to load 3D model</p>
                          <Button variant="outline" onClick={() => setHasError(false)}>Retry</Button>
                        </div>
                      ) : (
                        <ClientPubChemViewer 
                          cid={2244}
                          pubchemUrl="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/2244/record/JSON"
                          height="100%"
                          style="sphere"
                        />
                      )}
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      Aspirin binding to COX-2 enzyme (space-filling model)
                    </p>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">Ligand Binding Simulation</h3>
                    <p className="text-muted-foreground mb-6">
                      Visualize and analyze how different molecules interact with target proteins, 
                      helping identify potential drug candidates more efficiently. This 3D model showcases 
                      Aspirin, which works by inhibiting the production of prostaglandins by binding to
                      COX-1 and COX-2 enzymes.
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      The visualization demonstrates the molecular structure that enables this 
                      compound to effectively bind to its target receptor, blocking the pain and
                      inflammation response.
                    </p>
                    <Button className="w-full md:w-auto">Explore Binding</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pathway">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      {hasError ? (
                        <div className="text-center p-6 text-muted-foreground">
                          <p className="mb-2">Failed to load 3D model</p>
                          <Button variant="outline" onClick={() => setHasError(false)}>Retry</Button>
                        </div>
                      ) : (
                        <ClientPubChemViewer 
                          cid={1983}
                          pubchemUrl="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/1983/record/JSON"
                          height="100%"
                          style="line"
                        />
                      )}
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      Acetaminophen (Paracetamol) - Wireframe molecular structure
                    </p>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">Metabolic Pathway Analysis</h3>
                    <p className="text-muted-foreground mb-6">
                      Study complex biological pathways and their interactions with potential drug compounds
                      to better understand therapeutic effects and side effects. This visualization shows 
                      Acetaminophen (Paracetamol), which is metabolized in the liver through multiple pathways.
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our AI platform can analyze how this and similar compounds affect multiple pathways simultaneously, 
                      predicting both beneficial effects and potential adverse reactions with unprecedented accuracy.
                    </p>
                    <Button className="w-full md:w-auto">View Pathways</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="search">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4">Search and Visualize Molecules</h3>
                <p className="text-muted-foreground mb-6">
                  Enter the name of any drug or chemical compound to visualize its 3D molecular structure.
                  Our platform connects to the PubChem database to provide accurate structural information for thousands of compounds.
                </p>
                <MoleculeSearch />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

