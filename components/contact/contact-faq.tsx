"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ContactFAQ() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const faqs = [
    {
      question: "What is MediAI Discovery?",
      answer:
        "MediAI Discovery is a research-focused platform that helps students and researchers explore detailed drug information, modify molecular structures, and access relevant research articles. It combines AI tools with scientific data to simplify drug analysis and support advanced medical research and study—all in one free hub.",
    },
    {
      question: "How does your AI technology work?",
      answer:
        "Our AI technology works in real-time by pulling data from multiple verified drug databases. It intelligently processes user queries and provides accurate, structured information about drugs, including usage, structure, side effects, and research articles—everything you need, instantly and in one place.",
    },
    {
      question: "Do I need technical expertise to use your platform?",
      answer:
        "No, our platform is designed with an intuitive user interface that researchers of various technical backgrounds can use. We provide comprehensive training and support to help you get the most out of our tools. For more advanced applications, our team can provide technical assistance.",
    },
    {
      question: "What types of research can benefit from your platform?",
      answer:
        "MediAI supports research in drug repurposing, molecular modification, disease-based drug analysis, pharmacology, and biomedical studies. Whether you're exploring new treatments or studying drug interactions, our platform provides tools and data to boost academic research, clinical projects, and experimental drug design.",
    },
    {
      question: "How do I get started with MediAI Discovery?",
      answer:
        "Getting started with MediAI Discovery is simple. Just visit the platform, create a free account, and start exploring. You can search any drug by name, view its full profile, edit molecular structures, ask the AI bot questions, and access research articles—all in one seamless interface.",
    },
    {
      question: " How does MediAI help in drug repurposing research?",
      answer:
        "MediAI speeds up drug repurposing by giving instant access to drug profiles, chemical structures, and related research. Researchers can test structural changes, compare drug interactions, and study past findings—saving time, cost, and boosting innovation without starting from scratch like traditional discovery methods.",
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our platform and services
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
          }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

