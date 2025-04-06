"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { ArrowRight, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function ResearchFeatured() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

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
          className="mb-10"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Research</h2>
          <p className="text-muted-foreground">Highlighting our most significant breakthroughs and discoveries</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
          }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        >
          <Link href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11920972/#" className="lg:col-span-3 relative overflow-hidden rounded-xl shadow-lg group block">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
            <img
              src="https://www.brainvire.com/blog/wp-content/uploads/2024/02/ai-in-diagnosis.jpg"
              alt="Drug repurposing: a promising tool to accelerate the drug discovery process
"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <Badge className="mb-3 bg-primary hover:bg-primary/90">Market Analysis</Badge>
              <h3 className="text-2xl font-bold text-white mb-2">Drug repurposing: a promising tool to accelerate the drug discovery process
              </h3>
              <p className="text-white/80 mb-4 line-clamp-2">
              drug repurposing has gained importance in identifying new therapeutic uses for already-available drugs. Typically, repurposing can be achieved serendipitously (unintentional fortunate observations) or through systematic approaches. Numerous strategies to discover new indications for FDA-approved drugs are discussed in this article

              </p>
              <div className="flex items-center text-white/70 text-sm mb-4">
                <div className="flex items-center mr-4">
                  <Calendar className="mr-1 h-4 w-4" />
                  June, 2019
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  Vineela Parvathaneni 
                </div>
              </div>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-foreground">
                Read Full Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Link>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="https://www.kauffman.org/reports/a-new-market-access-path-for-repurposed-drugs/" className="bg-background rounded-xl shadow-md p-6 border border-border/50 h-1/2 flex flex-col hover:shadow-lg transition-shadow">
              <Badge className="w-fit mb-3 bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/40 border-none">
                Technology
              </Badge>
              <h3 className="text-xl font-bold mb-2"> A New Market Access Path for Repurposed Drugs
              </h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">
              Repurposed drugs present the promise of enabling patients’ access to much-needed therapies sooner and at a lower cost.
              </p>
              <div className="flex items-center text-muted-foreground text-sm mt-auto">
                <div className="flex items-center mr-4">
                  <Calendar className="mr-1 h-4 w-4" />
                  Mar 14, 2014
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  Dominique Pahud

                </div>
              </div>
            </Link>

            <Link href="https://link.springer.com/article/10.1007/s11030-021-10217-3" className="bg-background rounded-xl shadow-md p-6 border border-border/50 h-1/2 flex flex-col hover:shadow-lg transition-shadow">
              <Badge className="w-fit mb-3 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 border-none">
                Industry Trends
              </Badge>
              <h3 className="text-xl font-bold mb-2">Artificial intelligence to deep learning: machine intelligence approach for drug discovery</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">
              Drug designing and development is an important area of research for pharmaceutical companies and chemical scientists. However, low efficacy, off-target delivery, time consumption, and high cost impose a hurdle and challenges that impact drug design and discovery
              </p>
              <div className="flex items-center text-muted-foreground text-sm mt-auto">
                <div className="flex items-center mr-4">
                  <Calendar className="mr-1 h-4 w-4" />
                  April 12, 2021
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  Rohan Gupta, Devesh Srivastava
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

