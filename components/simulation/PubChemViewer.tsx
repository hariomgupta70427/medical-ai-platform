"use client"

import { useEffect, useRef, useState } from "react"

interface PubChemViewerProps {
  cid?: number
  pubchemUrl?: string
  width?: string
  height?: string
  style?: string
}

export function PubChemViewer({ 
  cid = 4173, // Default to aspirin CID
  pubchemUrl = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/conformers/0000104D00000001/JSON?response_type=display",
  width = "100%", 
  height = "350px",
  style = "stick" // Options: stick, sphere, line
}: PubChemViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || !viewerRef.current) return;
    
    let viewer: any = null;
    let $3Dmol: any = null;
    
    const initMolecule = async () => {
      try {
        setIsLoading(true)
        
        // Access 3DMol from the global scope (added via script in layout.tsx)
        if (window.$3Dmol) {
          $3Dmol = window.$3Dmol;
          
          const config = {
            backgroundColor: "white",
            antialias: true,
            disableFog: true
          }
    
          // Initialize the viewer
          viewer = $3Dmol.createViewer(viewerRef.current, config);
          
          try {
            // Method 1: Direct CID loading
            await new Promise<void>((resolve, reject) => {
              viewer.addModel(null, "pdb", { keepH: true });
              $3Dmol.download(`cid:${cid}`, viewer, {}, function(m: any) {
                try {
                  const styleConfig = getStyleConfig(style);
                  viewer.setStyle({}, styleConfig);
                  viewer.addSurface($3Dmol.SurfaceType.VDW, {
                    opacity: 0.7,
                    colorscheme: 'whiteCarbon'
                  });
                  viewer.zoomTo();
                  viewer.render();
                  viewer.spin(true);
                  setIsLoading(false);
                  resolve();
                } catch (err) {
                  reject(err);
                }
              });
            });
          } catch (err) {
            console.error("Failed to load from CID, trying direct URL:", err);
            try {
              // Method 2: Try using the direct URL
              const response = await fetch(pubchemUrl);
              const data = await response.json();
              
              viewer.addModel(JSON.stringify(data), "json", { keepH: true });
              const styleConfig = getStyleConfig(style);
              viewer.setStyle({}, styleConfig);
              viewer.addSurface($3Dmol.SurfaceType.VDW, {
                opacity: 0.7,
                colorscheme: 'whiteCarbon'
              });
              viewer.zoomTo();
              viewer.render();
              viewer.spin(true);
              setIsLoading(false);
            } catch (error) {
              console.error("Failed to load molecule:", error);
              setError("Failed to load 3D model");
              setIsLoading(false);
            }
          }
        } else {
          setError("3DMol library not loaded");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error initializing 3D viewer:", err);
        setError("Failed to initialize 3D viewer");
        setIsLoading(false);
      }
    };
    
    // Small delay to ensure scripts are loaded
    const timer = setTimeout(() => {
      initMolecule();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      if (viewer) {
        viewer.spin(false);
      }
    };
  }, [cid, pubchemUrl, style]);
  
  // Helper function to get style configuration
  const getStyleConfig = (styleType: string) => {
    switch(styleType) {
      case 'sphere':
        return { sphere: { colorscheme: 'cyanCarbon' } };
      case 'line':
        return { line: { colorscheme: 'cyanCarbon' } };
      case 'stick':
      default:
        return { stick: { radius: 0.15, colorscheme: 'cyanCarbon' } };
    }
  };

  return (
    <div className="relative" style={{ width, height }}>
      <div 
        ref={viewerRef} 
        style={{ 
          width: "100%", 
          height: "100%",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "0.5rem",
          overflow: "hidden"
        }}
        className="bg-muted/20"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70">
          <div className="text-red-500 text-center p-4">
            <p>{error}</p>
            <p className="text-sm mt-2">Please refresh the page to try again</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Also export as default for dynamic import
export default PubChemViewer; 