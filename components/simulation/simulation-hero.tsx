"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Dna, Microscope, FlaskRoundIcon as Flask } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function SimulationHero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    // Set loaded state after component mount with a slight delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden hero-section">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 -z-10" />

      {/* Simple background elements */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        <div className="absolute top-1/3 left-1/5 w-72 h-72 rounded-full bg-blue-400/10 dark:bg-blue-400/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-teal-400/10 dark:bg-teal-400/5 blur-3xl"></div>
      </div>

      <div className="container relative" ref={ref}>
        <div className="max-w-3xl mx-auto text-center">
          <div className={`hero-animation ${isLoaded ? 'loaded' : ''}`}>
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 border-none font-medium">
              Advanced Technology
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl gradient-text mb-6">
              AI-Powered Molecular Simulations
            </h1>
            <p className="text-xl text-foreground dark:text-slate-200 mb-8 max-w-2xl mx-auto font-medium">
              Experience the future of drug discovery with our cutting-edge AI simulations. Visualize molecular
              interactions, predict binding affinities, and accelerate your research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-bg group">
                Try Demo Simulation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                Explore Features
              </Button>
            </div>
          </div>

          <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 hero-animation ${isLoaded ? 'loaded' : ''}`} style={{ transitionDelay: "200ms" }}>
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center mb-4 mx-auto">
                <Dna className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-white">Protein Folding</h3>
              <p className="text-foreground/80 dark:text-slate-200">
                Predict protein structures with 92% accuracy using our advanced neural networks
              </p>
            </div>

            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-800 flex items-center justify-center mb-4 mx-auto">
                <Microscope className="h-6 w-6 text-teal-600 dark:text-teal-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-white">Molecular Docking</h3>
              <p className="text-foreground/80 dark:text-slate-200">Simulate binding interactions between drugs and target proteins</p>
            </div>

            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-800 flex items-center justify-center mb-4 mx-auto">
                <Flask className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-white">ADMET Prediction</h3>
              <p className="text-foreground/80 dark:text-slate-200">
                Predict absorption, distribution, metabolism, excretion, and toxicity profiles
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

