"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ResearchHero() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="relative py-20 overflow-hiddenen">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 -z-10" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        <div className="absolute top-1/3 left-1/5 w-72 h-72 rounded-full bg-blue-400/10 dark:bg-blue-400/5 blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-teal-400/10 dark:bg-teal-400/5 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="container relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="max-w-3xl mx-auto text-center"
        >
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none">Latest Research</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl gradient-text mb-6">
            Insights & Breakthroughs
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore the latest research, articles, and breakthroughs in AI-powered drug discovery and development.
          </p>

          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="search"
              placeholder="Search articles, topics, or keywords..."
              className="block w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            />
            <Button className="absolute right-1.5 top-1.5 gradient-bg">Search</Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

