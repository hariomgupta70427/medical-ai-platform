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
        "MediAI Discovery is an AI-powered platform designed to accelerate drug discovery and development. Our platform uses advanced machine learning algorithms to analyze molecular structures, predict interactions, and optimize formulations with unprecedented accuracy.",
    },
    {
      question: "How does your AI technology work?",
      answer:
        "Our AI technology combines deep learning, quantum mechanical calculations, and molecular dynamics simulations to predict how potential drug compounds will interact with target proteins. The platform analyzes vast datasets of molecular structures and properties to identify promising candidates and optimize their efficacy.",
    },
    {
      question: "Do I need technical expertise to use your platform?",
      answer:
        "No, our platform is designed with an intuitive user interface that researchers of various technical backgrounds can use. We provide comprehensive training and support to help you get the most out of our tools. For more advanced applications, our team can provide technical assistance.",
    },
    {
      question: "What types of research can benefit from your platform?",
      answer:
        "Our platform is beneficial for a wide range of research areas including drug discovery, protein structure prediction, molecular docking, ADMET prediction, and clinical trial optimization. It's particularly valuable for researchers working in pharmaceutical development, biotechnology, and academic research.",
    },
    {
      question: "How do I get started with MediAI Discovery?",
      answer:
        "You can get started by requesting a demo through our website or contacting our sales team. We offer flexible subscription plans tailored to different research needs, from individual researchers to large pharmaceutical companies. Our team will guide you through the onboarding process and provide training on how to use the platform effectively.",
    },
    {
      question: "Is my research data secure on your platform?",
      answer:
        "Yes, we take data security very seriously. All data on our platform is encrypted both in transit and at rest. We comply with industry standards for data protection and privacy regulations. You retain full ownership of your research data, and we have strict policies in place to ensure confidentiality.",
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

