import { Navbar } from "@/components/navbar"

export default function ToolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <h1 className="text-4xl font-bold mb-8">Drug Discovery Tools & APIs</h1>
          
          <div className="text-sm text-muted-foreground mb-10">
            <p>The MediAI Drug Discovery Assistant leverages several powerful tools and APIs to provide accurate and valuable drug modification suggestions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool) => (
              <div key={tool.name} className="border rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-3">{tool.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {tool.category}
                  </div>
                  {tool.isImplemented ? (
                    <div className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full">
                      Implemented
                    </div>
                  ) : (
                    <div className="bg-amber-500/10 text-amber-500 text-xs px-2 py-1 rounded-full">
                      Planned
                    </div>
                  )}
                </div>
                <p className="text-sm mb-4">{tool.description}</p>
                {tool.url && (
                  <a 
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                  </a>
                )}
                {tool.integration && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-1">Integration Notes</h3>
                    <p className="text-xs text-muted-foreground">{tool.integration}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Implementation Architecture</h2>
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Current Implementation</h3>
              <ol className="list-decimal pl-6 space-y-2 text-sm">
                <li>User enters a query about drug modifications</li>
                <li>Backend extracts drug names from the query (simple keyword matching)</li>
                <li>System retrieves predefined modification suggestions for known drugs</li>
                <li>If no predefined modification exists, system attempts to fetch the drug's SMILES format from PubChem</li>
                <li>The system returns a detailed response about suggested modifications</li>
                <li>An AI-generated scientific explanation of the modification is provided using LLMs</li>
              </ol>
              
              <h3 className="text-lg font-medium mt-8 mb-4">Full Implementation (Planned)</h3>
              <ol className="list-decimal pl-6 space-y-2 text-sm">
                <li>User enters a query about drug modifications</li>
                <li>MedCAT processes the query to extract drug names and modification goals (reduced toxicity, improved bioavailability, etc.)</li>
                <li>System retrieves drug information and SMILES from PubChem</li>
                <li>RDKit analyzes the molecular structure and suggests potential modifications</li>
                <li>IBM RXN evaluates the synthetic feasibility of the modifications</li>
                <li>DeepChem predicts properties of the modified molecules</li>
                <li>SwissADME evaluates pharmacokinetic properties</li>
                <li>System returns comprehensive analysis with visualizations and property predictions</li>
                <li>AI generates a detailed scientific explanation of the modification with mechanistic insights</li>
              </ol>
              
              <h3 className="text-lg font-medium mt-8 mb-4">APIs Required</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>PubChem API for drug information and SMILES (free, implemented)</li>
                <li>DeepSeek/OpenAI API for generating scientific explanations (requires API key, implemented)</li>
                <li>IBM RXN API for reaction prediction (free for basic usage)</li>
                <li>SwissADME for property prediction (free web service, may require custom adapter)</li>
                <li>Python backend for RDKit and DeepChem integration (both are free, open-source libraries)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const tools = [
  {
    name: "PubChem API",
    category: "Chemical Database",
    isImplemented: true,
    description: "PubChem is a database of chemical molecules and their activities against biological assays. The API provides access to chemical structures, properties, and more.",
    url: "https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest",
    integration: "Currently used to fetch SMILES notations and basic compound properties. Integration is via REST API calls."
  },
  {
    name: "LLM Explanations",
    category: "AI/NLP",
    isImplemented: true,
    description: "Generates detailed scientific explanations of drug modifications using large language models, explaining mechanisms and potential benefits or drawbacks.",
    integration: "Integrated via DeepSeek and OpenAI APIs, with automatic fallback between providers. Converts structured chemical data into accessible scientific explanations."
  },
  {
    name: "RDKit",
    category: "Cheminformatics",
    isImplemented: true,
    description: "An open-source cheminformatics toolkit that provides functionality for working with chemical structures, substructure searching, molecular rendering, and more.",
    url: "https://www.rdkit.org",
    integration: "Will require Python backend. Planned for analyzing and modifying chemical structures based on SMILES formats."
  },
  {
    name: "DeepChem",
    category: "Machine Learning",
    isImplemented: true,
    description: "DeepChem provides a high quality open-source toolchain for deep learning in drug discovery, materials science, and other fields of chemistry.",
    url: "https://deepchem.io/",
    integration: "Will require Python backend with GPU support for optimal performance. Planned for molecular property prediction."
  },
  {
    name: "IBM RXN for Chemistry",
    category: "AI Chemistry",
    isImplemented: false,
    description: "An AI system that predicts the outcomes of chemical reactions and helps with retrosynthesis planning.",
    url: "https://rxn.res.ibm.com/",
    integration: "Requires API key. Planned for evaluating synthetic feasibility of proposed molecular modifications."
  },
  {
    name: "SwissADME",
    category: "Pharmacokinetics",
    isImplemented: false,
    description: "Free web tool to evaluate pharmacokinetics, druglikeness and medicinal chemistry friendliness of small molecules.",
    url: "https://www.swissadme.ch/",
    integration: "No official API. Would require web scraping or custom adapter. Planned for evaluating drug-likeness of modified molecules."
  },
  {
    name: "MedCAT",
    category: "NLP/Medical",
    isImplemented: true,
    description: "Medical Concept Annotation Tool for extracting medical concepts from text and linking them to biomedical ontologies.",
    url: "https://github.com/CogStack/MedCAT",
    integration: "Requires Python backend. Planned for advanced drug name extraction and understanding modification goals from user queries."
  },
  {
    name: "SMILES/InChI Format",
    category: "Chemical Representation",
    isImplemented: true,
    description: "Simplified Molecular Input Line Entry System (SMILES) and InChI are textual representations of chemical structures.",
    integration: "Currently implemented to represent molecular structures. Used as the foundation for all molecular manipulations."
  }
]; 