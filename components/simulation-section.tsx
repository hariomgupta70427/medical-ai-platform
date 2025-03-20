"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

function MoleculeModel() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[2, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[-1.5, 1, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#f43f5e" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[-1, -1.5, 0.5]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[-0.75, 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[-0.5, -0.75, 0.25]} rotation={[Math.PI / 8, 0, -Math.PI / 3]}>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      <Environment preset="studio" />
    </>
  )
}

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
    <section id="simulation" className="py-20 bg-gradient-to-b from-background to-teal-50/50 dark:to-teal-950/20">
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">AI-Powered Simulations</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visualize and interact with molecular structures in real-time, powered by our advanced AI algorithms.
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
            className="h-[400px] rounded-xl overflow-hidden shadow-xl"
          >
            <Canvas>
              <MoleculeModel />
            </Canvas>
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
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="protein">Protein Folding</TabsTrigger>
                <TabsTrigger value="enzyme">Enzyme Interactions</TabsTrigger>
                <TabsTrigger value="prediction">AI Predictions</TabsTrigger>
              </TabsList>
              <TabsContent value="protein" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-2">Protein Folding Analysis</h3>
                    <p className="text-muted-foreground mb-4">
                      Our AI predicts protein folding patterns with over 92% accuracy, enabling faster identification of
                      potential drug targets.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <div className="font-medium">Folding Accuracy</div>
                        <div className="text-2xl font-bold text-primary">92.7%</div>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-3">
                        <div className="font-medium">Processing Time</div>
                        <div className="text-2xl font-bold text-primary">3.2s</div>
                      </div>
                    </div>
                    <Button className="w-full">Explore Protein Analysis</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="enzyme" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-2">Enzyme Interaction Simulation</h3>
                    <p className="text-muted-foreground mb-4">
                      Visualize how enzymes interact with potential drug compounds, predicting binding affinity and
                      catalytic effects.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <div className="font-medium">Binding Prediction</div>
                        <div className="text-2xl font-bold text-primary">89.3%</div>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-3">
                        <div className="font-medium">Simulation Speed</div>
                        <div className="text-2xl font-bold text-primary">5.7s</div>
                      </div>
                    </div>
                    <Button className="w-full">View Enzyme Simulations</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="prediction" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-2">AI-Driven Efficacy Predictions</h3>
                    <p className="text-muted-foreground mb-4">
                      Our machine learning models analyze molecular structures to predict therapeutic efficacy and
                      potential side effects.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <div className="font-medium">Efficacy Prediction</div>
                        <div className="text-2xl font-bold text-primary">87.5%</div>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-3">
                        <div className="font-medium">Side Effect Detection</div>
                        <div className="text-2xl font-bold text-primary">94.1%</div>
                      </div>
                    </div>
                    <Button className="w-full">Explore AI Predictions</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

