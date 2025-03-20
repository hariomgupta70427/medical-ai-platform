"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export function ContactHero() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="relative py-20 overflow-hidden">
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
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none">Get In Touch</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl gradient-text mb-6">
            Contact Our Team
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have questions about our platform, pricing, or partnership opportunities? Our team is here to help you.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

