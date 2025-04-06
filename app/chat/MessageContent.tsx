'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import remarkGfm from 'remark-gfm';
import MoleculeVisualizer from '@/components/MoleculeVisualizer';

interface MessageContentProps {
  message: Message;
  className?: string;
}

// Regular expression to match SMILES notation surrounded by backticks
const SMILES_REGEX = /`([^`]+)`/g;

export function MessageContent({ message, className }: MessageContentProps) {
  const content = message.content;

  // Extract SMILES strings from the content
  const detectedSmiles: string[] = [];
  let match;
  while ((match = SMILES_REGEX.exec(content)) !== null) {
    // Check if it's likely a SMILES string (contains typical chemical symbols)
    const potentialSmiles = match[1];
    if (/[CNOPS]|[=#\-\(\)]/.test(potentialSmiles)) {
      detectedSmiles.push(potentialSmiles);
    }
  }

  return (
    <div className={cn("prose dark:prose-invert", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
      
      {/* Display molecular visualizations if SMILES strings are detected */}
      {detectedSmiles.length > 0 && (
        <div className="mt-4 space-y-4">
          {detectedSmiles.map((smiles, index) => (
            <div key={index} className="border rounded-md p-2 bg-gray-50 dark:bg-gray-800">
              <h4 className="text-sm font-medium mb-2">Molecular Structure Visualization</h4>
              <MoleculeVisualizer 
                smiles={smiles} 
                width={400} 
                height={300}
                className="mx-auto"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">{smiles}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageContent; 