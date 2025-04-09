"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MoleculeVisualizerProps {
  smiles: string;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
  shouldAnimate?: boolean;
}

export default function MoleculeVisualizer({ 
  smiles, 
  width = 300, 
  height = 200, 
  title, 
  className = '',
  shouldAnimate = false
}: MoleculeVisualizerProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackMethod, setFallbackMethod] = useState<'api' | 'direct' | 'placeholder'>('api');

  // Function to encode SMILES for URL
  const encodeSmilesForUrl = (smiles: string): string => {
    return encodeURIComponent(smiles);
  };

  // Function to get direct PubChem URL
  const getDirectPubChemUrl = (smiles: string): string => {
    const encodedSmiles = encodeSmilesForUrl(smiles);
    return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodedSmiles}/PNG?image_size=${width}x${height}`;
  };

  useEffect(() => {
    if (!smiles) {
      setIsLoading(false);
      setError('No SMILES string provided');
      return;
    }

    const fetchMoleculeImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (fallbackMethod === 'api') {
          // Try our API first
          const apiUrl = `/api/molecule?smiles=${encodeSmilesForUrl(smiles)}&width=${width}&height=${height}`;
          console.log('Fetching molecule visualization from API:', apiUrl);
          
          try {
            const response = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) }); // 10 second timeout
            
            if (!response.ok) {
              console.warn('API failed, falling back to direct PubChem:', response.statusText);
              setFallbackMethod('direct');
              // Continue to direct method below
            } else {
              const imageData = await response.text();
              if (imageData && imageData.includes('<svg')) {
                setImageUrl(`data:image/svg+xml;base64,${btoa(imageData)}`);
                setIsLoading(false);
                return;
              } else {
                console.warn('Invalid SVG from API, falling back to direct PubChem');
                setFallbackMethod('direct');
                // Continue to direct method below
              }
            }
          } catch (error) {
            console.warn('API request failed, falling back to direct PubChem:', error);
            setFallbackMethod('direct');
            // Continue to direct method below
          }
        }
        
        if (fallbackMethod === 'direct' || fallbackMethod === 'api') {
          // Try direct PubChem URL if API fails or we're starting with direct
          const directUrl = getDirectPubChemUrl(smiles);
          console.log('Trying direct PubChem URL:', directUrl);
          
          try {
            // Just check if the URL is valid by making a HEAD request
            const checkResponse = await fetch(directUrl, { 
              method: 'HEAD',
              signal: AbortSignal.timeout(5000) // 5 second timeout
            });
            
            if (checkResponse.ok) {
              setImageUrl(directUrl);
              setFallbackMethod('direct'); // Remember this worked for next time
              setIsLoading(false);
              return;
            } else {
              console.warn('Direct PubChem URL failed:', checkResponse.statusText);
              setFallbackMethod('placeholder');
              // Continue to placeholder below
            }
          } catch (error) {
            console.warn('Direct PubChem request failed:', error);
            setFallbackMethod('placeholder');
            // Continue to placeholder below
          }
        }
        
        // If we get here, both methods failed
        setError('Could not visualize molecule');
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error in molecule visualization:', error);
        setError(error.message || 'Failed to load molecule visualization');
        setIsLoading(false);
      }
    };

    fetchMoleculeImage();
  }, [smiles, width, height, fallbackMethod]);

  // Function to generate a placeholder SVG
  const generatePlaceholderSvg = () => {
    const shortSmiles = smiles.length > 20 ? `${smiles.substring(0, 17)}...` : smiles;
    
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="#f8f9fa" rx="10" ry="10" />
        <text x="50%" y="45%" font-family="Arial" font-size="14" text-anchor="middle" fill="#6c757d">
          Molecule Visualization
        </text>
        <text x="50%" y="55%" font-family="Arial" font-size="10" text-anchor="middle" fill="#6c757d">
          ${shortSmiles}
        </text>
      </svg>
    `;
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="flex flex-col items-center p-4">
        {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
        
        <div className="relative w-full" style={{ minHeight: `${height}px` }}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Skeleton className="rounded-md" style={{ width: `${width}px`, height: `${height}px` }} />
            </div>
          ) : error ? (
            <div 
              className="flex flex-col items-center justify-center w-full h-full" 
              dangerouslySetInnerHTML={{ __html: generatePlaceholderSvg() }}
            />
          ) : imageUrl ? (
            <div className="flex justify-center items-center w-full">
              <img 
                src={imageUrl}
                alt={title || "Molecule visualization"}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: `${height}px`,
                  transform: shouldAnimate ? `rotate(${Math.random() * 360}deg)` : 'none',
                  transition: shouldAnimate ? 'transform 2s ease-in-out' : 'none'
                }}
                onError={() => {
                  console.error('Image failed to load:', imageUrl);
                  setError('Image failed to load');
                  setImageUrl(null);
                }}
              />
            </div>
          ) : (
            <div 
              className="flex flex-col items-center justify-center w-full h-full" 
              dangerouslySetInnerHTML={{ __html: generatePlaceholderSvg() }}
            />
          )}
        </div>
        
        {/* Optional small SMILES display below the visualization */}
        {!isLoading && !error && (
          <div className="w-full mt-2 overflow-hidden">
            <p className="text-xs text-gray-500 text-center truncate" title={smiles}>
              {smiles.length > 30 ? `${smiles.substring(0, 27)}...` : smiles}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 