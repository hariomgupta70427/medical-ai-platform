import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SimulationHero } from "@/components/simulation/simulation-hero"
import { SimulationDemo } from "@/components/simulation/simulation-demo"
import { SimulationFeatures } from "@/components/simulation/simulation-features"
import { SimulationCTA } from "@/components/simulation/simulation-cta"

export const metadata: Metadata = {
  title: "AI-Powered Simulations | MediAI Discovery",
  description: "Explore our advanced molecular simulations and AI-driven predictions for drug discovery and testing.",
}

export default function SimulationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <SimulationHero />
        <SimulationFeatures />
        <SimulationDemo />
        <SimulationCTA />
      </main>
      <Footer />
    </div>
  )
}

