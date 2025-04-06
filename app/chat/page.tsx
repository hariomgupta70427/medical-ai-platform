"use client"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendIcon, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm MediAI Assistant. How can I help you with your medical research today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response (would be replaced with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a placeholder response. The actual AI functionality will be implemented later.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <div className="container mx-auto flex flex-1 flex-col max-w-4xl px-4 py-8">
          <div className="flex flex-1 flex-col rounded-lg border shadow-sm bg-card overflow-hidden">
            <div className="p-4 border-b">
              <h1 className="text-xl font-semibold">MediAI Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Your AI-powered assistant for medical research and drug discovery
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-4 rounded-lg p-4",
                    message.role === "user"
                      ? "bg-primary/10 ml-12"
                      : "bg-muted mr-12"
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {message.role === "assistant" ? (
                      <Bot className="h-5 w-5 text-primary" />
                    ) : (
                      <User className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="prose prose-sm dark:prose-invert">
                      {message.content}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-4 rounded-lg bg-muted p-4 mr-12">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="prose prose-sm dark:prose-invert">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]"></div>
                        <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]"></div>
                        <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.6s]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>
            
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <SendIcon className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 