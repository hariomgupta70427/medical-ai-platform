"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

// Dynamically import Three.js components with SSR disabled
const ThreeComponents = dynamic(() => import('./ThreeComponents'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-background/50">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  )
})

// This function is not used anymore as we're importing ThreeComponents directly
function MoleculeModel() {
  return null;
}

export function SimulationDemo() {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [activeTab, setActiveTab] = useState("interactive")
  const [rotationSpeed, setRotationSpeed] = useState(1)
  const [bondLength, setBondLength] = useState(2)
  const [atomSize, setAtomSize] = useState(1)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  // Only render Three.js components on the client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="py-20">
      <div className="container" ref={ref}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6 } },
          }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Interactive Molecular Simulation</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our interactive 3D molecular visualization and simulation tools
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
            }}
            className="h-[500px] rounded-xl overflow-hidden shadow-xl border border-border/50"
          >
            {isMounted ? (
              <ThreeComponents 
                rotationSpeed={rotationSpeed} 
                bondLength={bondLength} 
                atomSize={atomSize} 
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-background/50">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.4 } },
            }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="relative w-full overflow-x-auto pb-2">
                <TabsList className="flex min-w-full w-max border-b bg-background">
                  <TabsTrigger 
                    value="interactive" 
                    className="flex-1 min-w-[130px] h-auto py-3 px-2 text-[13px] text-center whitespace-nowrap"
                  >
                    Interactive Controls
                  </TabsTrigger>
                  <TabsTrigger 
                    value="binding" 
                    className="flex-1 min-w-[130px] h-auto py-3 px-2 text-[13px] text-center whitespace-nowrap"
                  >
                    Binding Analysis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="properties" 
                    className="flex-1 min-w-[130px] h-auto py-3 px-2 text-[13px] text-center whitespace-nowrap"
                  >
                    Molecular Properties
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="mt-6">
                <TabsContent value="interactive" className="space-y-6 data-[state=active]:block">
                  <Card className="border shadow-sm">
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-6">Adjust Molecular Parameters</h3>

                      <div className="space-y-8">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm font-medium">Rotation Speed</label>
                            <span className="text-sm text-muted-foreground">{rotationSpeed.toFixed(1)}</span>
                          </div>
                          <Slider
                            value={[rotationSpeed]}
                            min={0}
                            max={5}
                            step={0.1}
                            onValueChange={(value) => setRotationSpeed(value[0])}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm font-medium">Bond Length</label>
                            <span className="text-sm text-muted-foreground">{bondLength.toFixed(1)} Å</span>
                          </div>
                          <Slider
                            value={[bondLength]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(value) => setBondLength(value[0])}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm font-medium">Atom Size</label>
                            <span className="text-sm text-muted-foreground">{atomSize.toFixed(1)}</span>
                          </div>
                          <Slider
                            value={[atomSize]}
                            min={0.5}
                            max={1.5}
                            step={0.1}
                            onValueChange={(value) => setAtomSize(value[0])}
                          />
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setRotationSpeed(1)
                            setBondLength(2)
                            setAtomSize(1)
                          }}
                        >
                          Reset Values
                        </Button>
                        <Button className="gradient-bg">Apply Changes</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="binding" className="space-y-4 data-[state=active]:block">
                  <Card className="border shadow-sm">
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-2">Binding Affinity Analysis</h3>
                      <p className="text-muted-foreground mb-4">
                        Our AI predicts binding affinity between this molecule and target proteins.
                      </p>

                      <div className="space-y-4 mb-6">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">ACE2 Receptor</span>
                            <span className="font-bold text-green-600 dark:text-green-400">High Affinity</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-green-600 dark:bg-green-400 h-2.5 rounded-full"
                              style={{ width: "87%" }}
                            ></div>
                          </div>
                          <div className="mt-1 text-xs text-right text-muted-foreground">Binding score: 87%</div>
                        </div>

                        <div className="p-4 rounded-lg bg-muted/50">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">SARS-CoV-2 Spike Protein</span>
                            <span className="font-bold text-amber-600 dark:text-amber-400">Medium Affinity</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-amber-600 dark:bg-amber-400 h-2.5 rounded-full"
                              style={{ width: "62%" }}
                            ></div>
                          </div>
                          <div className="mt-1 text-xs text-right text-muted-foreground">Binding score: 62%</div>
                        </div>

                        <div className="p-4 rounded-lg bg-muted/50">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Dopamine Receptor D2</span>
                            <span className="font-bold text-red-600 dark:text-red-400">Low Affinity</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div className="bg-red-600 dark:bg-red-400 h-2.5 rounded-full" style={{ width: "23%" }}></div>
                          </div>
                          <div className="mt-1 text-xs text-right text-muted-foreground">Binding score: 23%</div>
                        </div>
                      </div>

                      <Button className="w-full">View Detailed Analysis</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="properties" className="space-y-4 data-[state=active]:block">
                  <Card className="border shadow-sm">
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-2">Molecular Properties</h3>
                      <p className="text-muted-foreground mb-4">
                        AI-predicted physicochemical properties and drug-likeness scores.
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <div className="font-medium">Molecular Weight</div>
                          <div className="text-2xl font-bold text-primary">342.4 g/mol</div>
                        </div>
                        <div className="rounded-lg bg-primary/10 p-3">
                          <div className="font-medium">LogP</div>
                          <div className="text-2xl font-bold text-primary">2.34</div>
                        </div>
                        <div className="rounded-lg bg-primary/10 p-3">
                          <div className="font-medium">H-Bond Donors</div>
                          <div className="text-2xl font-bold text-primary">2</div>
                        </div>
                        <div className="rounded-lg bg-primary/10 p-3">
                          <div className="font-medium">H-Bond Acceptors</div>
                          <div className="text-2xl font-bold text-primary">5</div>
                        </div>
                      </div>

                      <h4 className="font-medium mb-2">Drug-likeness Scores</h4>
                      <div className="space-y-3 mb-6">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Lipinski Rule of 5</span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Compliant</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-green-600 dark:bg-green-400 h-2 rounded-full"
                              style={{ width: "100%" }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Veber Rules</span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Compliant</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-green-600 dark:bg-green-400 h-2 rounded-full"
                              style={{ width: "100%" }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Bioavailability Score</span>
                            <span className="text-sm">0.85</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full">Export Properties</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

