"use client"

import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useInView, useAnimation } from "framer-motion"

export function HeroSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 -z-10" />
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5 -z-10" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-400/10 dark:bg-blue-400/5 blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-400/10 dark:bg-teal-400/5 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container relative">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20 items-center">
          <div ref={ref}>
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl gradient-text mb-6">
                Revolutionizing Drug Discovery with AI
                <span className="block text-foreground">Faster, Smarter, Safer.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                Our AI-powered platform accelerates the drug discovery process by analyzing molecular structures,
                predicting interactions, and optimizing formulations with unprecedented accuracy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gradient-bg group">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/simulation">Learn More</Link>
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-teal-500/90 mix-blend-multiply" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-4/5 h-4/5">
                <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-pulse" />
                <div className="absolute inset-8 rounded-full border-4 border-white/30 animate-pulse [animation-delay:500ms]" />
                <div className="absolute inset-16 rounded-full border-4 border-white/40 animate-pulse [animation-delay:1000ms]" />

                {/* Floating molecules */}
                <div
                  className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-blue-400/80 animate-float"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full bg-teal-400/80 animate-float"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute bottom-1/4 left-1/3 w-10 h-10 rounded-full bg-green-400/80 animate-float"
                  style={{ animationDelay: "1s" }}
                ></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center animate-glow">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      AI
                    </div>
                  </div>
                </div>

                {/* DNA Strand Animation */}
                <div className="absolute top-1/2 left-0 w-full h-1 flex justify-around">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-1 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <line x1="33%" y1="75%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

