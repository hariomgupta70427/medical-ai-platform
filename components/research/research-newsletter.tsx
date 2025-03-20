"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ResearchNewsletter() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 -z-10" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-secondary/10 dark:bg-secondary/5 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
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
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Subscribe to Our Research Newsletter</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get the latest research, breakthroughs, and insights delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Your email address" className="h-12" />
            <Button className="gradient-bg h-12 sm:w-auto">Subscribe</Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
        </motion.div>
      </div>
    </section>
  )
}

