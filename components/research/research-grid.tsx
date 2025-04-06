"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function ResearchGrid() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const articles = [
    {
      title: "Repurposed Drugs: Current Trends in Drug Discovery",
      description:
        "Drug repurposing explores new uses for existing or rejected drugs to treat different conditions, offering faster development, lower costs, and known safety. It’s a rising trend in drug discovery with huge potential for addressing unmet medical needs.",
      date: "09 December 2024",
      author: "Gatadi Srikanth, Durga Prasad Beda and Niggula Praveen Kumar",
      category: "Market Analysis",
      categoryColor: "blue",
      image: "https://tse3.mm.bing.net/th?id=OIP.faUOXn-h_e0wYBVplrAwXQHaEa&pid=Api&P=0&h=220",
      link: "https://www.intechopen.com/chapters/1194348"
    },
    {
      title: " How drug repurposing can advance drug discovery: challenges and opportunities",
      description:
        "Traditional drug discovery takes 10–17 years, costs up to $3B, and has low success rates. Drug repurposing is faster (3–12 years), cheaper (~$300M), and less risky.",
      date: "2024",
      author: "Luca Pinzi, Nicolò Bisi, Giulio Rastelli",
      category: "Revise Report",
      categoryColor: "teal",
      image: "https://th.bing.com/th/id/OIP.I9Ey8NBU_CQdJcI6b21iOwHaEK?w=299&h=180&c=7&r=0&o=5&pid=1.7",
      link: "https://www.frontiersin.org/journals/drug-discovery/articles/10.3389/fddsv.2024.1460100/full"
    },
    {
      title: "Drug Repurposing of Generic Drugs: Challenges and the Potential Role for Government",
      description:
        "Current drug repurposing research struggles with funding, and even successful trials often lack commercial backing due to low financial incentives.",
      date: "july,2023",
      author: "Appl Health Econ Health Policy",
      category: "revise report",
      categoryColor: "purple",
      image: "https://www.lifearc.org/wp-content/uploads/2021/02/1967_D21_0517_FR.jpg",
      link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10627937/"
    },
    {
      title: "The drug repurposing market for emerging infectious diseases is projected to hit $47.8 billion by 2034.",
      description:
        "The global drug repurposing market is rapidly growing. Pharma companies now see big potential in using old drugs for new diseases.",
      date: "20 November, 2024",
      author: "Transparency Market Research",
      category: "Market analysis",
      categoryColor: "orange",
      image: "https://cdn.open-pr.com/L/b/Lb20392196_g.jpg",
      link: "https://www.openpr.com/news/3747239/drug-repurposing-market-opportunities-in-tackling-emerging"
    },
    {
      title: "Application of artificial intelligence and machine learning in drug repurposing",
      description:
        "AI and machine learning now power smart, data-driven drug repurposing by analyzing massive biomedical data. New tech like network mining and NLP is unlocking fresh strategies and insights.",
      date: "31 March, 2024",
      author: "Sudhir K. Ghandikota ,Anil G Jegga",
      category: "Research paper",
      categoryColor: "green",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO5Hgv8x4tgTeqaWItXnucyCVSdYlDalQkSA&s",
      link: "https://www.sciencedirect.com/science/article/abs/pii/S1877117324000851?via%3Dihub"
    },
    {
      title: "Data-driven drug discovery for drug repurposing",
      description:
        "Computational drug repurposing is a key data-driven method to find and rank new uses for drugs by analyzing drug, gene, and disease profiles strategically.",
      date: " 2023",
      author: "Ryuta Saito et al. Nihon Yakurigaku Zasshi",
      category: "Revise report",
      categoryColor: "red",
      image: "https://th.bing.com/th/id/OIP.2WHTgAq8AM3QYey1sYKFtAHaE8?w=211&h=180&c=7&r=0&o=5&pid=1.7",
      link: "https://pubmed.ncbi.nlm.nih.gov/36596476/"
    }
  ]

  return (
    <section className="py-20" ref={ref}>
      <div className="container">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6 } },
          }}
          className="flex justify-between items-center mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Latest Articles</h2>
            <p className="text-muted-foreground">Stay updated with our newest research and insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {articles.map((article, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              initial="hidden"
              animate={controls}
              transition={{ delay: index * 0.1 }}
            >
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardHeader className="p-0">
                    <div className="relative aspect-video">
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-4">
                      <Badge
                        className={`bg-${article.categoryColor}-100 text-${article.categoryColor}-800 dark:bg-${article.categoryColor}-900/30 dark:text-${article.categoryColor}-400 hover:bg-${article.categoryColor}-200 dark:hover:bg-${article.categoryColor}-900/40 border-none`}
                      >
                        {article.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardTitle className="line-clamp-2 px-4">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3 mt-2 px-4">{article.description}</CardDescription>
                  <CardFooter className="flex justify-between items-center px-4 py-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {article.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="w-4 h-4 mr-2" />
                      {article.author}
                    </div>
                  </CardFooter>
                </Card>
              </a>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg">
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

