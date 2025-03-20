"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { ArrowRight, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ResearchFeatured() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="py-16 bg-muted/30">
      <div className="container" ref={ref}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6 } },
          }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Research</h2>
          <p className="text-muted-foreground">Highlighting our most significant breakthroughs and discoveries</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
          }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        >
          <div className="lg:col-span-3 relative overflow-hidden rounded-xl shadow-lg group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
            <img
              src="/placeholder.svg?height=500&width=800"
              alt="AI-Driven Breakthrough in Cancer Drug Discovery"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <Badge className="mb-3 bg-primary hover:bg-primary/90">Research Spotlight</Badge>
              <h3 className="text-2xl font-bold text-white mb-2">AI-Driven Breakthrough in Cancer Drug Discovery</h3>
              <p className="text-white/80 mb-4 line-clamp-2">
                Our AI platform has identified a novel compound showing promising results in targeting specific cancer
                cell mutations with minimal side effects.
              </p>
              <div className="flex items-center text-white/70 text-sm mb-4">
                <div className="flex items-center mr-4">
                  <Calendar className="mr-1 h-4 w-4" />
                  Mar 15, 2025
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  Dr. Sarah Chen
                </div>
              </div>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-foreground">
                Read Full Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-background rounded-xl shadow-md p-6 border border-border/50 h-1/2 flex flex-col">
              <Badge className="w-fit mb-3 bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/40 border-none">
                Technology
              </Badge>
              <h3 className="text-xl font-bold mb-2">Machine Learning Models Improve Drug Efficacy Prediction</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                New advancements in our ML algorithms have increased prediction accuracy by 15%, accelerating the drug
                development pipeline.
              </p>
              <div className="flex items-center text-muted-foreground text-sm mt-auto">
                <div className="flex items-center mr-4">
                  <Calendar className="mr-1 h-4 w-4" />
                  Mar 10, 2025
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  Dr. James Wilson
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl shadow-md p-6 border border-border/50 h-1/2 flex flex-col">
              <Badge className="w-fit mb-3 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 border-none">
                Trends
              </Badge>
              <h3 className="text-xl font-bold mb-2">The Future of Personalized Medicine Through AI</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                How artificial intelligence is enabling truly personalized treatment plans based on individual genetic
                profiles.
              </p>
              <div className="flex items-center text-muted-foreground text-sm mt-auto">
                <div className="flex items-center mr-4">
                  <Calendar className="mr-1 h-4 w-4" />
                  Mar 5, 2025
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  Dr. Emily Rodriguez
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

