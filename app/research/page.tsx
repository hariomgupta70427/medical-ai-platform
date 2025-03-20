import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ResearchHero } from "@/components/research/research-hero"
import { ResearchGrid } from "@/components/research/research-grid"
import { ResearchCategories } from "@/components/research/research-categories"
import { ResearchFeatured } from "@/components/research/research-featured"
import { ResearchNewsletter } from "@/components/research/research-newsletter"

export const metadata: Metadata = {
  title: "Research & Insights | MediAI Discovery",
  description: "Explore the latest research, breakthroughs, and insights in AI-powered drug discovery and development.",
}

export default function ResearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ResearchHero />
        <ResearchCategories />
        <ResearchFeatured />
        <ResearchGrid />
        <ResearchNewsletter />
      </main>
      <Footer />
    </div>
  )
}

