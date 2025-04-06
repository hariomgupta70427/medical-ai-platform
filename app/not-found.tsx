import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full text-center space-y-5">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-2xl font-medium text-muted-foreground">Page not found</h2>
          
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            
            <Button variant="default" size="lg" asChild>
              <Link href="/chat">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Chat
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 