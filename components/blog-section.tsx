"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { ArrowRight, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function BlogSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const articles = [
    {
      title: "AI-Driven Breakthrough in Cancer Drug Discovery",
      description:
        "Our AI platform has identified a novel compound showing promising results in targeting specific cancer cell mutations.",
      date: "Mar 15, 2025",
      author: "Dr. Sarah Chen",
      category: "Research",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Machine Learning Models Improve Drug Efficacy Prediction",
      description:
        "New advancements in our ML algorithms have increased prediction accuracy by 15%, accelerating the drug development pipeline.",
      date: "Mar 10, 2025",
      author: "Dr. James Wilson",
      category: "Technology",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "The Future of Personalized Medicine Through AI",
      description:
        "How artificial intelligence is enabling truly personalized treatment plans based on individual genetic profiles.",
      date: "Mar 5, 2025",
      author: "Dr. Emily Rodriguez",
      category: "Trends",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <section id="blog" className="py-20">
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
                    src={article.image || "/placeholder.svg"}
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
          <Button variant="outline" size="lg">
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

