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
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        
        // Construct the API URL with query parameters
        const apiUrl = `/api/molecule?smiles=${encodeURIComponent(smiles)}&width=${width}&height=${height}`;
        
        console.log('Fetching molecule visualization from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch molecule visualization: ${response.statusText}`);
        }
        
        const svgData = await response.text();
        
        // Check if we received a valid SVG
        if (!svgData || !svgData.includes('<svg')) {
          throw new Error('Invalid SVG data received from API');
        }
        
        setSvgContent(svgData);
      } catch (error: any) {
        console.error('Error fetching molecule visualization:', error);
        setError(error.message || 'Failed to load molecule visualization');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoleculeImage();
  }, [smiles, width, height]);

  const getRandomRotation = () => {
    // Generate a random rotation for animation effect
    return `rotate(${Math.random() * 360}deg)`;
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
            <div className="flex flex-col items-center justify-center w-full h-full text-red-500 text-sm">
              <p>Error: {error}</p>
              <p className="text-xs mt-1 text-gray-500">{smiles}</p>
            </div>
          ) : (
            <div 
              className="molecule-container flex justify-center items-center w-full" 
              style={{ 
                minHeight: `${height}px`,
                transform: shouldAnimate ? getRandomRotation() : 'none',
                transition: shouldAnimate ? 'transform 2s ease-in-out' : 'none'
              }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
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