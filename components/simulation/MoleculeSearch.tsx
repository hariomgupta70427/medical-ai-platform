"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'
import { ClientPubChemViewer } from './ClientPubChemViewer'
import { Card, CardContent } from '@/components/ui/card'

export function MoleculeSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewStyle, setViewStyle] = useState<'stick' | 'sphere' | 'line'>('stick')
  const [searchResult, setSearchResult] = useState<{
    cid: number;
    name: string;
    description?: string;
  } | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setError(null)
    
    try {
      // Use the PubChem API to search for the compound
      const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(searchQuery)}/cids/JSON`)
      
      if (!response.ok) {
        throw new Error(`Failed to find compound: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!data.IdentifierList?.CID || data.IdentifierList.CID.length === 0) {
        throw new Error(`No compounds found matching "${searchQuery}"`)
      }
      
      // Get the first CID
      const cid = data.IdentifierList.CID[0]
      
      // Get compound details
      const detailsResponse = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/description/JSON`)
      let description = ''
      
      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json()
        if (detailsData.InformationList?.Information && 
            detailsData.InformationList.Information.length > 0 && 
            detailsData.InformationList.Information[0].Description) {
          description = detailsData.InformationList.Information[0].Description
        }
      }
      
      setSearchResult({
        cid,
        name: searchQuery,
        description: description || `CID: ${cid} - No detailed description available`
      })
      
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Failed to search for compound')
      setSearchResult(null)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a molecule (e.g., ibuprofen, paracetamol)"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching || !searchQuery.trim()}
        >
          {isSearching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Search
        </Button>
      </div>
      
      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {searchResult && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">{searchResult.name}</h3>
            
            <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center mb-4">
              <ClientPubChemViewer 
                cid={searchResult.cid}
                pubchemUrl={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${searchResult.cid}/record/JSON`}
                height="100%"
                style={viewStyle}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
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
            
            {searchResult.description && (
              <div className="text-sm text-muted-foreground">
                <p>{searchResult.description}</p>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-4">
              PubChem CID: {searchResult.cid} - 
              <a 
                href={`https://pubchem.ncbi.nlm.nih.gov/compound/${searchResult.cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                View on PubChem
              </a>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 