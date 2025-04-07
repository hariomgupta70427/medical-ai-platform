"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { ArrowRight, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

const articles = [
  {
    title: "Drug repurposing: a promising tool to accelerate the drug discovery process",
    description: "Drug repurposing has gained importance in identifying new therapeutic uses for already-available drugs. Typically, repurposing can be achieved serendipitously or through systematic approaches.",
    date: "June, 2019",
    author: "Vineela Parvathaneni",
    category: "Research",
    image: "https://www.brainvire.com/blog/wp-content/uploads/2024/02/ai-in-diagnosis.jpg",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11920972/#"
  },
  {
    title: "A New Market Access Path for Repurposed Drugs",
    description: "Repurposed drugs present the promise of enabling patients' access to much-needed therapies sooner and at a lower cost.",
    date: "Mar 14, 2014",
    author: "Dominique Pahud",
    category: "Technology",
    image: "https://th.bing.com/th/id/OIP.qCatdR5VGK1Un8JQnFMuUQHaEh?rs=1&pid=ImgDetMain",
    link: "https://www.kauffman.org/reports/a-new-market-access-path-for-repurposed-drugs/"
  },
  {
    title: "Artificial intelligence to deep learning: machine intelligence approach for drug discovery",
    description: "Drug designing and development is an important area of research for pharmaceutical companies and chemical scientists.",
    date: "April 12, 2021",
    author: "Rohan Gupta, Devesh Srivastava",
    category: "Industry Trends",
    image: "https://biomedical-sciences.uq.edu.au/files/9019/RG.jpg",
    link: "https://link.springer.com/article/10.1007/s11030-021-10217-3"
  }
]

export function BlogSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section id="blog" className="py-20 bg-muted/30">
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Latest Research & Insights</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest breakthroughs and advancements in AI-powered drug discovery.
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
                staggerChildren: 0.2,
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
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary hover:bg-primary/90">{article.category}</Badge>
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
          <Button variant="outline" size="lg" asChild>
            <Link href="/research">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

