"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TestimonialSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const testimonials = [
    {
      quote:
        "MediAI Discovery has transformed our research process. We've reduced our drug discovery timeline by 60% while increasing our success rate significantly.",
      name: "Dr. Sarah Johnson",
      title: "Research Director, PharmaTech Inc.",
      avatar: "https://th.bing.com/th/id/OIP.9RihUOnsbyqOf4KH10BLLgHaHa?rs=1&pid=ImgDetMain",
    },
    {
      quote:
        "The AI-powered simulations have allowed us to test hypotheses that would have taken months in just days. This platform is revolutionizing how we approach drug development.",
      name: "Prof. Michael Chen",
      title: "Head of Molecular Biology, University Research Center",
      avatar: "https://cdn3.iconfinder.com/data/icons/science-collection/383/scientist-512.png",
    },
    {
      quote:
        "The accuracy of the predictions from MediAI Discovery has been remarkable. We've been able to identify promising compounds that our traditional methods missed entirely.",
      name: "Dr. Emily Rodriguez",
      title: "Chief Scientific Officer, BioGenetics",
      avatar: "https://cdn3d.iconscout.com/3d/premium/thumb/old-scientist-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--science-research-profession-pack-people-icons-8179539.png",
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 molecule-bg">
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What Researchers Are Saying</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from scientists and researchers who are using our platform to accelerate their discoveries
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
          }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <Quote className="h-12 w-12 text-primary/20 mb-6" />

              <div className="relative h-[200px]">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-500 flex flex-col ${
                      index === activeIndex
                        ? "opacity-100 translate-x-0"
                        : index < activeIndex
                          ? "opacity-0 -translate-x-full"
                          : "opacity-0 translate-x-full"
                    }`}
                  >
                    <p className="text-xl mb-8 italic">"{testimonial.quote}"</p>
                    <div className="mt-auto flex items-center">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="outline" size="icon" onClick={prevTestimonial}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === activeIndex ? "w-8 bg-primary" : "w-2 bg-primary/30"
                      }`}
                      onClick={() => setActiveIndex(index)}
                    />
                  ))}
                </div>
                <Button variant="outline" size="icon" onClick={nextTestimonial}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

