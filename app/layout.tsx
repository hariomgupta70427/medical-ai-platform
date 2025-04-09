import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MediAI Discovery - AI-Powered Drug Discovery Platform",
  description: "Revolutionizing drug discovery with AI - faster, smarter, safer.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} min-h-screen bg-background`}>
        {/* jQuery is required for 3DMol.js */}
        <Script 
          src="https://code.jquery.com/jquery-3.6.4.min.js"
          strategy="beforeInteractive"
          integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8="
          crossOrigin="anonymous"
        />
        
        {/* 3DMol.js for molecular visualization */}
        <Script 
          src="https://3Dmol.org/build/3Dmol-min.js"
          strategy="beforeInteractive"
        />
        
        {/* Initialize 3DMol for components */}
        <Script
          id="3dmol-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.$3Dmol) {
                console.log('3DMol successfully loaded');
              } else {
                console.error('3DMol failed to load properly');
              }
            `,
          }}
        />
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}