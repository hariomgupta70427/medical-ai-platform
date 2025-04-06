"use client"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendIcon, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from 'react-markdown'

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
      content: "Hello! I'm MediAI Assistant. How can I help you with your drug discovery or molecular optimization research today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(`Failed to get response: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log("Received response:", data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const aiMessage: Message = {
        id: data.id || (Date.now() + 1).toString(),
        content: data.content,
        role: "assistant",
        timestamp: new Date(data.timestamp),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      
      let errorMessage = "I'm sorry, I encountered an error while processing your request. Please try again later.";
      if (error instanceof Error) {
        errorMessage = `I'm sorry, I encountered an error: ${error.message}`;
      }
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  const extractSmiles = (content: string): string | null => {
    const smilesRegex = /`([^`]+)`/g;
    const matches = [...content.matchAll(smilesRegex)];
    
    for (const match of matches) {
      const potentialSmiles = match[1];
      if (/^[A-Za-z0-9@+\-=\\\/()\[\]\.#]*$/.test(potentialSmiles) && 
          /[A-Z]/.test(potentialSmiles) && 
          /[\(\)=]/.test(potentialSmiles)) {
        return potentialSmiles;
      }
    }
    
    return null;
  };

  const formatTime = (date: Date) => {
    if (!isClient) return "";
    
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <div className="container mx-auto flex flex-1 flex-col max-w-4xl px-4 py-8">
          <div className="flex flex-1 flex-col rounded-lg border shadow-sm bg-card overflow-hidden">
            <div className="p-4 border-b">
              <h1 className="text-xl font-semibold">MediAI Drug Discovery Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Your AI-powered assistant for drug discovery, molecular optimization, and medicinal chemistry
              </p>
              <div className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                <p>Try asking:</p>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>"Tell me about Aspirin and its mechanism of action"</li>
                  <li>"What are the side effects of Paracetamol?"</li>
                  <li>"How does Ibuprofen work in the body?"</li>
                </ul>
              </div>
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
                      {message.role === "assistant" ? (
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                    {message.role === "assistant" && extractSmiles(message.content) && (
                      <div className="mt-4 border border-border rounded-md p-2 bg-background/50">
                        <p className="text-xs font-medium mb-1">Molecule Visualization:</p>
                        <img 
                          src={`/api/molecule?smiles=${encodeURIComponent(extractSmiles(message.content)!)}`}
                          alt="Molecule visualization"
                          className="w-full h-auto max-w-xs mx-auto"
                        />
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
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
                  placeholder="Ask about drugs, medications, or molecular structures..."
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