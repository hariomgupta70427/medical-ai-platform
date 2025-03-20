"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Dna, Brain, FlaskRoundIcon as Flask, Microscope, LineChart, Users } from "lucide-react"
import Link from "next/link"

export function ResearchCategories() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const categories = [
    {
      name: "Molecular Biology",
      icon: Dna,
      color: "blue",
      count: 42,
    },
    {
      name: "AI & Machine Learning",
      icon: Brain,
      color: "teal",
      count: 38,
    },
    {
      name: "Drug Development",
      icon: Flask,
      color: "green",
      count: 31,
    },
    {
      name: "Clinical Research",
      icon: Microscope,
      color: "amber",
      count: 27,
    },
    {
      name: "Data Analysis",
      icon: LineChart,
      color: "red",
      count: 24,
    },
    {
      name: "Industry Trends",
      icon: Users,
      color: "purple",
      count: 19,
    },
  ]

  return (
    <section className="py-12">
      <div className="container" ref={ref}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <Link
                href="#"
                className="flex flex-col items-center p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background hover:shadow-md transition-all duration-200 h-full"
              >
                <div
                  className={`w-12 h-12 rounded-full bg-${category.color}-100 dark:bg-${category.color}-900/30 flex items-center justify-center mb-3`}
                >
                  <category.icon className={`h-6 w-6 text-${category.color}-600 dark:text-${category.color}-400`} />
                </div>
                <h3 className="text-sm font-medium text-center">{category.name}</h3>
                <span className="text-xs text-muted-foreground mt-1">{category.count} articles</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

