"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
      title: "Quantum Computing Applications in Drug Discovery",
      description:
        "Exploring how quantum computing can accelerate computational chemistry and molecular simulations for drug discovery.",
      date: "Mar 2, 2025",
      author: "Dr. Robert Chang",
      category: "Technology",
      categoryColor: "blue",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "AI-Powered Protein Structure Prediction",
      description:
        "How our deep learning models are revolutionizing protein structure prediction with unprecedented accuracy.",
      date: "Feb 28, 2025",
      author: "Dr. Lisa Patel",
      category: "Research",
      categoryColor: "teal",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Ethical Considerations in AI-Driven Drug Development",
      description:
        "Examining the ethical implications and responsible practices in using AI for pharmaceutical research.",
      date: "Feb 25, 2025",
      author: "Prof. David Martinez",
      category: "Ethics",
      categoryColor: "purple",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Accelerating Clinical Trials with Predictive Analytics",
      description:
        "How machine learning is helping to optimize patient selection and trial design for faster, more effective clinical trials.",
      date: "Feb 22, 2025",
      author: "Dr. Jennifer Kim",
      category: "Clinical",
      categoryColor: "green",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "The Role of Generative AI in Novel Drug Design",
      description:
        "Exploring how generative models are creating entirely new molecular structures with desired therapeutic properties.",
      date: "Feb 18, 2025",
      author: "Dr. Michael Thompson",
      category: "Innovation",
      categoryColor: "amber",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Combining Traditional Medicine with AI Discovery",
      description:
        "How we're using AI to analyze traditional medicinal compounds and discover new applications for established remedies.",
      date: "Feb 15, 2025",
      author: "Dr. Aisha Rahman",
      category: "Research",
      categoryColor: "teal",
      image: "/placeholder.svg?height=200&width=400",
    },
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
              className="card-hover"
            >
              <Card className="h-full overflow-hidden flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`bg-${article.categoryColor}-100 text-${article.categoryColor}-800 dark:bg-${article.categoryColor}-900/30 dark:text-${article.categoryColor}-400 hover:bg-${article.categoryColor}-200 dark:hover:bg-${article.categoryColor}-900/40 border-none`}
                    >
                      {article.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3 mt-2">{article.description}</CardDescription>
                </CardHeader>
                <CardFooter className="border-t pt-4 flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    {article.date}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-1 h-4 w-4" />
                    {article.author}
                  </div>
                </CardFooter>
              </Card>
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

