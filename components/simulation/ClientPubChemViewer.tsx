"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the PubChemViewer component with ssr disabled
const PubChemViewer = dynamic(() => import('./PubChemViewer'), { 
  ssr: false,
  loading: () => (
    <div 
      style={{ 
        width: '100%', 
        height: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      className="bg-muted/20 rounded-lg border border-border/50"
    >
      <div className="animate-pulse text-muted-foreground flex flex-col items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
        <span>Loading 3D model...</span>
      </div>
    </div>
  )
})

interface ClientPubChemViewerProps {
  cid?: number
  pubchemUrl?: string
  width?: string
  height?: string
  style?: string
}

export function ClientPubChemViewer(props: ClientPubChemViewerProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Only mount component on client-side to avoid SSR issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div 
        style={{ 
          width: props.width || '100%', 
          height: props.height || '350px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className="bg-muted/20 rounded-lg border border-border/50"
      >
        <div className="animate-pulse text-muted-foreground flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
          <span>Loading 3D model...</span>
        </div>
      </div>
    )
  }

  return <PubChemViewer {...props} />
} 