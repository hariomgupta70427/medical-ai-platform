"use client"

import { DrugSearch } from "@/components/DrugSearch"
import { Navbar } from "@/components/navbar"

export default function DrugsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <div className="container mx-auto flex flex-1 flex-col px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Drug Search</h1>
            <p className="text-muted-foreground mt-2">
              Search for drugs and compounds using PubChem database. Get detailed information about molecular structures, properties, and identifiers.
            </p>
          </div>
          <DrugSearch />
        </div>
      </main>
    </div>
  )
} 