"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

// Remove Three.js components for now to fix the error
// We'll add them back later when the site is working

export function SimulationSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [activeTab, setActiveTab] = useState("protein")

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="py-16 bg-muted/50">
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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="protein">Protein Folding</TabsTrigger>
            <TabsTrigger value="binding">Ligand Binding</TabsTrigger>
            <TabsTrigger value="pathway">Pathway Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="protein">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src="https://cdn.rcsb.org/images/structures/examples/protein-folding.gif" 
                      alt="Protein Folding Simulation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">Protein Folding Analysis</h3>
                    <p className="text-muted-foreground mb-6">
                      Our advanced AI algorithms predict protein folding patterns with unprecedented accuracy, 
                      enabling faster identification of potential drug targets and interactions.
                    </p>
                    <Button>Learn More</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="binding">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src="https://cdn.rcsb.org/images/structures/examples/ligand-binding.gif" 
                      alt="Ligand Binding Simulation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">Ligand Binding Simulation</h3>
                    <p className="text-muted-foreground mb-6">
                      Visualize and analyze how different molecules interact with target proteins, 
                      helping identify potential drug candidates more efficiently.
                    </p>
                    <Button>Explore Binding</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pathway">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src="https://cdn.rcsb.org/images/structures/examples/pathway-analysis.gif" 
                      alt="Pathway Analysis"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">Metabolic Pathway Analysis</h3>
                    <p className="text-muted-foreground mb-6">
                      Study complex biological pathways and their interactions with potential drug compounds
                      to better understand therapeutic effects and side effects.
                    </p>
                    <Button>View Pathways</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

