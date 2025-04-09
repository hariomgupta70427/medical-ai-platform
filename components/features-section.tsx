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
      title: "Drug Candidate Screening",
      description:
        "AI-powered screening of existing medications to identify those with potential for treating different conditions.",
    },
    {
      icon: Database,
      title: "Multi-Disease Database",
      description:
        "Comprehensive database mapping drugs to multiple diseases based on mechanism of action and molecular targets.",
    },
    {
      icon: Flask,
      title: "In-Silico Validation",
      description: "Virtual testing of repurposed drugs against new disease targets before moving to clinical trials.",
    },
    {
      icon: Dna,
      title: "Target Pathway Analysis",
      description: "Identification of shared biological pathways between different diseases for effective drug repurposing.",
    },
    {
      icon: Brain,
      title: "Polypharmacology Prediction",
      description: "Advanced algorithms that predict how existing drugs may affect multiple biological targets simultaneously.",
    },
    {
      icon: LineChart,
      title: "Clinical Success Probability",
      description: "Data-driven assessment of repurposed drug candidates' likelihood of clinical trial success.",
    },
  ]

  return (
    <section id="features" className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Reimagine Drug Development Through Repurposing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform leverages AI to identify and validate new uses for existing medications, offering a faster, more cost-effective path to new treatments.
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

