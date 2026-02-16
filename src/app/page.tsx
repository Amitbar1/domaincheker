"use client";

import { useState } from "react";
import SearchForm, { SearchFormData } from "@/components/SearchForm";
import ResultsTable, { DomainResult } from "@/components/ResultsTable";

export default function Dashboard() {
  const [results, setResults] = useState<DomainResult[]>([]);
  const [budgetLimit, setBudgetLimit] = useState(40);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleGenerate = async (formData: SearchFormData) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    setBudgetLimit(formData.budgetLimit);
    setHasSearched(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setResults(data.domains);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-card-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-accent"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Domain Strategy Dashboard
                </h1>
                <p className="text-xs text-muted">
                  AI-Powered Brand Naming for Trading Companies
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-400 ring-1 ring-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gemini 1.5 Flash
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Form Card */}
        <section className="rounded-xl border border-card-border bg-card p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-foreground">
              Naming Engine
            </h2>
            <p className="text-sm text-muted mt-1">
              Configure your brand criteria and let Gemini generate tailored
              domain names for your trading brand.
            </p>
          </div>
          <SearchForm onSubmit={handleGenerate} isLoading={isLoading} />
        </section>

        {/* Error Display */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-400 mt-0.5 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-400">
                  Generation Failed
                </h3>
                <p className="text-sm text-red-300/80 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {(isLoading || results.length > 0) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Domain Results
                </h2>
                <p className="text-sm text-muted mt-1">
                  {isLoading
                    ? "Generating and checking domain availability..."
                    : `Showing domains within your \u20AC${budgetLimit} budget`}
                </p>
              </div>
            </div>
            <ResultsTable
              results={results}
              budgetLimit={budgetLimit}
              isLoading={isLoading}
            />
          </section>
        )}

        {/* Empty State */}
        {!isLoading && !hasSearched && (
          <div className="rounded-xl border border-dashed border-card-border p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-muted/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-semibold text-foreground">
              Ready to discover your next brand
            </h3>
            <p className="mt-2 text-sm text-muted max-w-md mx-auto">
              Fill in the criteria above and click &ldquo;Generate Domain
              Names&rdquo; to get AI-powered domain suggestions tailored to your
              trading brand.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-card-border mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-muted text-center">
            Domain Strategy Dashboard &bull; Powered by Google Gemini &bull;
            Prices shown are estimates from the domain checker service
          </p>
        </div>
      </footer>
    </div>
  );
}
