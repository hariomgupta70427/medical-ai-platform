"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, X, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/simulation", label: "Simulation" },
    { href: "/research", label: "Research" },
    { href: "/contact", label: "Contact" },
    { href: "/chat", label: "Chat" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-600">
              <div className="absolute inset-1 rounded-full bg-background"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-teal-400 to-blue-600"></div>
            </div>
            <span className="hidden font-bold sm:inline-block">MediAI Discovery</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search database..."
              className="rounded-full bg-background pl-8 pr-4 py-2 text-sm ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            />
          </div>
          <ModeToggle />
          <Button size="sm" className="gradient-bg" asChild>
            <Link href="/chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Chat Now</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 border-b",
          isMenuOpen ? "max-h-64" : "max-h-0 border-b-0",
        )}
      >
        <nav className="container py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "py-2 px-4 rounded-md text-sm font-medium transition-colors",
                pathname === link.href ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 mt-2 border-t flex items-center">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <input
              type="search"
              placeholder="Search database..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
        </nav>
      </div>
    </header>
  )
}

