"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { 
  Atom, 
  Brain, 
  LineChart, 
  Zap, 
  Shield, 
  Database,
  FlaskConical,
  Microscope
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SimulationFeatures() {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const features = [
    {
      icon: Atom,
      title: "Quantum Mechanics",
      description:
        "Utilize quantum mechanical calculations to model electron distributions and bond energies with high precision.",
      color: "blue",
    },
    {
      icon: Brain,
      title: "Deep Learning Models",
      description:
        "Our neural networks are trained on millions of molecular interactions to predict outcomes with unprecedented accuracy.",
      color: "teal",
    },
    {
      icon: LineChart,
      title: "Real-time Analysis",
      description: "Visualize simulation results in real-time with interactive charts and 3D molecular renderings.",
      color: "green",
    },
    {
      icon: Zap,
      title: "Accelerated Computing",
      description: "GPU-optimized algorithms process complex simulations up to 100x faster than traditional methods.",
      color: "amber",
    },
    {
      icon: Shield,
      title: "Validated Results",
      description: "All predictions are validated against experimental data with comprehensive confidence scoring.",
      color: "red",
    },
    {
      icon: Database,
      title: "Comprehensive Database",
      description:
        "Access our database of over 2 million compounds and 50,000 protein structures for your simulations.",
      color: "purple",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container" ref={ref}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6 } },
          }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Advanced Simulation Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with molecular modeling to deliver unprecedented insights
          </p>
        </motion.div>

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
              className="card-hover"
            >
              <Card className="h-full border-none shadow-md">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
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
    </section>
  )
}

