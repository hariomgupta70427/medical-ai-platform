"use client"

import { useState } from 'react'
import { ClientPubChemViewer } from './ClientPubChemViewer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ViewerControllerProps {
  cid: number
  pubchemUrl: string
  name: string
  description: string
}

export function ViewerController({ cid, pubchemUrl, name, description }: ViewerControllerProps) {
  const [viewStyle, setViewStyle] = useState<'stick' | 'sphere' | 'line'>('stick')
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            <ClientPubChemViewer 
              cid={cid} 
              pubchemUrl={pubchemUrl}
              height="100%"
              style={viewStyle}
            />
          </div>
          
          <div className="flex flex-col space-y-3">
            <p className="text-sm font-medium">{name}</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant={viewStyle === 'stick' ? 'default' : 'outline'} 
                onClick={() => setViewStyle('stick')}
              >
                Stick Model
              </Button>
              <Button 
                size="sm" 
                variant={viewStyle === 'sphere' ? 'default' : 'outline'} 
                onClick={() => setViewStyle('sphere')}
              >
                Space-filling
              </Button>
              <Button 
                size="sm" 
                variant={viewStyle === 'line' ? 'default' : 'outline'} 
                onClick={() => setViewStyle('line')}
              >
                Wireframe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 