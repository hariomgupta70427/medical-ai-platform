"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Search, Database, FlaskRoundIcon as Flask, Dna, Brain, LineChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const features = [
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Powerful search capabilities with real-time suggestions for drug names, proteins, and formulations.",
    },
    {
      icon: Database,
      title: "Comprehensive Database",
      description:
        "Access detailed information on drug mechanisms, chemical compositions, and AI-predicted effectiveness.",
    },
    {
      icon: Flask,
      title: "Virtual Testing",
      description: "Simulate drug interactions and effects in a virtual environment before physical testing.",
    },
    {
      icon: Dna,
      title: "Molecular Analysis",
      description: "Advanced analysis of molecular structures to identify potential therapeutic compounds.",
    },
    {
      icon: Brain,
      title: "AI Predictions",
      description: "Machine learning algorithms that predict drug efficacy and potential side effects.",
    },
    {
      icon: LineChart,
      title: "Data Visualization",
      description: "Interactive charts and graphs to visualize complex drug testing data and results.",
    },
  ]

  return (
    <section id="features" className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Accelerate Your Research with AI</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with comprehensive drug data to revolutionize the discovery
            process.
          </p>
        </div>

        <div ref={ref}>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <Card className="h-full border-none shadow-md hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

