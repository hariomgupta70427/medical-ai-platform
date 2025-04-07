"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Mail, MapPin, Phone, Clock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactInfo() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
      }}
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          <p className="text-muted-foreground mb-8">
            Our team is available to answer your questions and provide support. Feel free to reach out through any of
            the following channels.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4 mt-1">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Office Location</h3>
              <p className="text-muted-foreground">
              Plot No. 3, Knowledge Park II
                <br />
                Greater Noida, Uttar Pradesh 201306
                <br />
                India
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4 mt-1">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Phone</h3>
              <p className="text-muted-foreground">
                Main: +91 9818381004
                <br />
                Support: +91 8306164181
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4 mt-1">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <p className="text-muted-foreground">
                General Inquiries: keshav5678kunj@gmail.com 
                <br />
                Support: mamta.talati@lsp.edu.in 
                <br />
                Partnerships: guptahariom045@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4 mt-1">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Business Hours</h3>
              <p className="text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM (PST)
                <br />
                Saturday - Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t">
          <h3 className="font-medium mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>

        <div className="pt-6 border-t">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4 mt-1">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Looking for a demo?</h3>
              <p className="text-muted-foreground mb-4">
                Schedule a personalized demonstration of our platform with one of our product specialists.
              </p>
              <Button className="gradient-bg">Schedule a Demo</Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

