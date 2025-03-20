"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"

export function PartnerSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const partners = [
    { name: "BioGenetics", logo: "/placeholder.svg?height=60&width=180" },
    { name: "PharmaCore", logo: "/placeholder.svg?height=60&width=180" },
    { name: "MediTech", logo: "/placeholder.svg?height=60&width=180" },
    { name: "GenomeX", logo: "/placeholder.svg?height=60&width=180" },
    { name: "NeuroChem", logo: "/placeholder.svg?height=60&width=180" },
    { name: "LifeScience", logo: "/placeholder.svg?height=60&width=180" },
  ]

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
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold mb-2">Trusted by Leading Research Institutions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We collaborate with top pharmaceutical companies and research institutions worldwide
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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="flex justify-center"
            >
              <div className="h-12 w-32 bg-background rounded-md flex items-center justify-center p-2 shadow-sm">
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  className="max-h-full max-w-full opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

