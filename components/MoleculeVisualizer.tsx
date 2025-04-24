"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface MoleculeVisualizerProps {
  smiles: string;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
  shouldAnimate?: boolean;
}

// Global cache for molecule images to avoid re-fetching
const imageCache: Record<string, string> = {};

// Common molecule SMILES to direct URLs mapping for faster loading
const commonMoleculeUrls: Record<string, string> = {
  // Aspirin
  "CC(=O)Oc1ccccc1C(=O)O": "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=2244&t=l",
  // Paracetamol
  "CC(=O)Nc1ccc(O)cc1": "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=1983&t=l", 
  // Ibuprofen
  "CC(C)Cc1ccc(C(C)C(=O)O)cc1": "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=3672&t=l",
  // Acetic acid
  "CC(=O)O": "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=176&t=l",
  // Salicylic acid
  "O=C(O)c1ccccc1O": "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=338&t=l",
  // Acetic anhydride
  "CC(=O)OC(=O)C": "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=7918&t=l",
  // Acetyl chloride
  "CC(=O)Cl": "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=6089&t=l",
  // 4-aminophenol
  "Nc1ccc(O)cc1": "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=4628&t=l"
};

// Queue for processing multiple molecule visualizations
const pendingRequests: Set<string> = new Set();
const maxConcurrentRequests = 8; // Increased from 4 to 8 to speed up loading
let activeRequests = 0;

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
  const [fallbackMethod, setFallbackMethod] = useState<'direct' | 'cached' | 'api' | 'placeholder'>('cached');
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to encode SMILES for URL
  const encodeSmilesForUrl = useCallback((smiles: string): string => {
    return encodeURIComponent(smiles);
  }, []);

  // Function to get direct PubChem URL
  const getDirectPubChemUrl = useCallback((smiles: string): string => {
    const encodedSmiles = encodeSmilesForUrl(smiles);
    return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodedSmiles}/PNG?image_size=${width}x${height}`;
  }, [encodeSmilesForUrl, width, height]);

  // Function to process the visualization queue
  const processQueue = useCallback(() => {
    if (activeRequests >= maxConcurrentRequests || pendingRequests.size === 0) return;
    
    // Find the next pending SMILES to process
    const iterator = pendingRequests.values();
    const nextSmiles = iterator.next().value;
    
    if (nextSmiles) {
      pendingRequests.delete(nextSmiles);
      activeRequests++;
      
      // If this is our SMILES, we've started processing it
      if (nextSmiles === smiles) {
        setQueuePosition(null);
      }
    }
  }, [smiles]);

  // Cleanup function for timeouts
  const cleanupTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!smiles) {
      setIsLoading(false);
      setError('No SMILES string provided');
      return;
    }

    // Clean up any existing timeouts
    cleanupTimeouts();

    // First check if we have this molecule in our common molecules mapping
    if (commonMoleculeUrls[smiles]) {
      setImageUrl(commonMoleculeUrls[smiles]);
      setIsLoading(false);
      return;
    }

    // Then check if image is already in cache
    if (imageCache[smiles]) {
      setImageUrl(imageCache[smiles]);
      setIsLoading(false);
      return;
    }

    // Add to pending queue if not already processing
    if (!pendingRequests.has(smiles) && activeRequests >= maxConcurrentRequests) {
      pendingRequests.add(smiles);
      setQueuePosition(pendingRequests.size);
      return;
    }

    // If we can process this request now, add it to active
    if (activeRequests < maxConcurrentRequests) {
      activeRequests++;
    } else {
      pendingRequests.add(smiles);
      setQueuePosition(pendingRequests.size);
      return;
    }

    const fetchMoleculeImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try our API directly as primary approach (faster than PubChem for most cases)
        const apiUrl = `/api/molecule?smiles=${encodeSmilesForUrl(smiles)}&width=${width}&height=${height}`;
        
        try {
          const controller = new AbortController();
          timeoutRef.current = setTimeout(() => controller.abort(), 2000); // Reduced from 3000ms to 2000ms
          
          const response = await fetch(apiUrl, { signal: controller.signal });
          
          cleanupTimeouts();
          
          if (response.ok) {
            const imageData = await response.text();
            if (imageData && imageData.includes('<svg')) {
              // Use a safer method to encode SVG for data URL
              const encoded = encodeURIComponent(imageData)
                .replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)));
              const dataUrl = `data:image/svg+xml;utf8,${encoded}`;
              imageCache[smiles] = dataUrl; // Cache the result
              setImageUrl(dataUrl);
              setIsLoading(false);
              activeRequests--;
              processQueue(); // Process next in queue
              return;
            }
          }
        } catch (error) {
          cleanupTimeouts();
          console.warn('API request failed, trying direct PubChem URL:', error);
          // Continue to direct PubChem URL below
        }
        
        // Try direct PubChem URL as fallback
        try {
          const directUrl = getDirectPubChemUrl(smiles);
          const controller = new AbortController();
          timeoutRef.current = setTimeout(() => controller.abort(), 2000); // Reduced from 3000ms to 2000ms
          
          const checkResponse = await fetch(directUrl, { 
            method: 'HEAD',
            signal: controller.signal
          });
          
          cleanupTimeouts();
          
          if (checkResponse.ok) {
            imageCache[smiles] = directUrl; // Cache the result
            setImageUrl(directUrl);
            setFallbackMethod('direct'); // Remember this worked for next time
            setIsLoading(false);
            activeRequests--;
            processQueue(); // Process next in queue
            return;
          }
        } catch (error) {
          cleanupTimeouts();
          console.warn('All image methods failed, using placeholder:', error);
        }
        
        // If we get here, both methods failed
        setError('Could not visualize molecule');
        setIsLoading(false);
        activeRequests--;
        processQueue(); // Process next in queue
      } catch (error: any) {
        cleanupTimeouts();
        console.error('Error in molecule visualization:', error);
        setError(error.message || 'Failed to load molecule visualization');
        setIsLoading(false);
        activeRequests--;
        processQueue(); // Process next in queue
      }
    };

    fetchMoleculeImage();
    
    // Cleanup
    return () => {
      cleanupTimeouts();
      if (pendingRequests.has(smiles)) {
        pendingRequests.delete(smiles);
      }
    };
  }, [smiles, width, height, encodeSmilesForUrl, getDirectPubChemUrl, processQueue, cleanupTimeouts]);

  // Function to generate a placeholder SVG
  const generatePlaceholderSvg = () => {
    let shortSmiles = smiles;
    if (smiles.length > 20) {
      shortSmiles = `${smiles.substring(0, 17)}...`;
    }
    
    // Generate a simple SVG with chemical name if we can derive it
    let chemicalName = shortSmiles;
    if (smiles === "CC(=O)Oc1ccccc1C(=O)O") chemicalName = "Aspirin";
    else if (smiles === "CC(=O)Nc1ccc(O)cc1") chemicalName = "Paracetamol";
    else if (smiles === "CC(C)Cc1ccc(C(C)C(=O)O)cc1") chemicalName = "Ibuprofen";
    else if (smiles === "CC(=O)O") chemicalName = "Acetic acid";
    else if (smiles === "O=C(O)c1ccccc1O") chemicalName = "Salicylic acid";
    
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="#f8f9fa" rx="10" ry="10" />
        <text x="50%" y="45%" font-family="Arial" font-size="14" text-anchor="middle" fill="#6c757d">
          ${chemicalName}
        </text>
        <text x="50%" y="60%" font-family="Arial" font-size="10" text-anchor="middle" fill="#6c757d">
          (Loading failed)
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
              {queuePosition !== null ? (
                <div className="text-center">
                  <Skeleton className="rounded-md" style={{ width: `${width}px`, height: `${height}px` }} />
                  <p className="text-xs text-gray-500 mt-1">
                    In queue ({queuePosition})
                  </p>
                </div>
              ) : (
                <Skeleton className="rounded-md" style={{ width: `${width}px`, height: `${height}px` }} />
              )}
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
                  // Remove from cache if it failed
                  if (imageCache[smiles] === imageUrl) {
                    delete imageCache[smiles];
                  }
                }}
                loading="lazy" // Use native lazy loading
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