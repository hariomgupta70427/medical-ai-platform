"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import MoleculeVisualizer from '@/components/MoleculeVisualizer';
import { Skeleton } from '@/components/ui/skeleton';
import { Beaker } from 'lucide-react';

interface DrugExplanationCardProps {
  drugName: string;
  originalSmiles: string;
  modifiedSmiles: string;
  explanation: string;
  isLoading?: boolean;
  provider?: string;
}

export function DrugExplanationCard({
  drugName,
  originalSmiles,
  modifiedSmiles,
  explanation,
  isLoading = false,
  provider = 'ai'
}: DrugExplanationCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating Scientific Explanation...
          </CardTitle>
          <CardDescription>
            We're analyzing the molecular structure and preparing a detailed explanation
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              This might take a few moments as we perform a comprehensive analysis
            </p>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          {drugName} Modification Analysis
        </CardTitle>
        <CardDescription>
          Scientific explanation of molecular modifications and expected effects
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Molecule comparison section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Original Structure</h3>
            <MoleculeVisualizer 
              smiles={originalSmiles} 
              width={300} 
              height={200}
              title="Original"
              className="bg-card"
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Modified Structure</h3>
            <MoleculeVisualizer 
              smiles={modifiedSmiles} 
              width={300} 
              height={200}
              title="Modified"
              className="bg-card"
            />
          </div>
        </div>
        
        {/* Explanation text section */}
        <div className="pt-2">
          <h3 className="text-sm font-medium mb-2">Scientific Explanation</h3>
          {isLoading ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Beaker className="h-4 w-4 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Generating scientific explanation...</p>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : explanation ? (
            <div className="text-sm text-muted-foreground whitespace-pre-line prose prose-sm max-w-none">
              <ReactMarkdown>
                {explanation}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="p-4 border rounded text-center text-sm text-muted-foreground">
              Click "Generate Explanation" to analyze this drug modification
            </div>
          )}
        </div>
      </CardContent>
      
      {provider && !isLoading && explanation && (
        <CardFooter className="border-t px-6 py-3">
          <p className="text-xs text-muted-foreground">
            Generated using {provider === 'demo' ? 'example templates' : `${provider} model`}
          </p>
        </CardFooter>
      )}
    </Card>
  );
} 