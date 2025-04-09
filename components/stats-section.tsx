"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function StatsSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const stats = [
    {
      value: "75%",
      label: "Time-to-Market Reduction",
      description: "Repurposed drugs reach patients faster than traditional drug discovery",
    },
    {
      value: "90%",
      label: "Development Cost Savings",
      description: "Lower investment compared to developing new molecular entities",
    },
    {
      value: "30+",
      label: "Repurposed Drugs Identified",
      description: "Existing medications with potential new therapeutic applications",
    },
    {
      value: "3.5×",
      label: "Higher Success Rate",
      description: "Repurposed drugs have greater clinical trial success probability",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-background to-blue-50/50 dark:to-blue-950/20">
      <div className="container" ref={ref}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-600" />
                <CardContent className="pt-8">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-lg font-medium mb-2">{stat.label}</div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

