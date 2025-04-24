'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Navbar } from '../components/navbar'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full text-center space-y-5">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-red-500 h-8 w-8" />
          </div>
          
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          
          <p className="text-muted-foreground">
            Sorry, an unexpected error occurred. Our team has been notified.
          </p>
          
          {error.message && (
            <div className="bg-muted/50 p-4 rounded-md text-sm text-left overflow-auto max-h-40">
              <p className="font-mono">{error.message}</p>
            </div>
          )}
          
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/">
                Home
              </Link>
            </Button>
            
            <Button variant="default" size="lg" onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
