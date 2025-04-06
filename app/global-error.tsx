'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-5">
            <h1 className="text-3xl font-bold">Fatal Application Error</h1>
            
            <p className="text-gray-600">
              Sorry, the application encountered a critical error and couldn't continue.
            </p>
            
            {error.message && (
              <div className="bg-gray-100 p-4 rounded-md text-sm text-left overflow-auto max-h-40">
                <p className="font-mono">{error.message}</p>
              </div>
            )}
            
            <div className="pt-6">
              <Button
                onClick={reset}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 