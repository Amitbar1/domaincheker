"use client";

import { useState } from "react";

const LANGUAGES = [
  "English",
  "French",
  "German",
  "Spanish",
  "Arabic",
  "Portuguese",
  "Italian",
  "Dutch",
  "Japanese",
];

const TLDS = [
  ".com",
  ".net",
  ".io",
  ".co",
  ".ai",
  ".trade",
  ".finance",
  ".capital",
  ".fr",
  ".de",
  ".es",
  ".it",
  ".nl",
  ".eu",
  ".uk",
  ".org",
];

export interface SearchFormData {
  audience: string;
  keywords: string;
  tlds: string[];
  language: string;
  budgetLimit: number;
  creativeDirection: string;
}

interface SearchFormProps {
  onSubmit: (data: SearchFormData) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [audience, setAudience] = useState("French");
  const [keywords, setKeywords] = useState("Trading, FX, Crypto");
  const [selectedTlds, setSelectedTlds] = useState<string[]>([".com"]);
  const [language, setLanguage] = useState("French");
  const [budgetLimit, setBudgetLimit] = useState(40);
  const [creativeDirection, setCreativeDirection] = useState("");

  const toggleTld = (tld: string) => {
    setSelectedTlds((prev) =>
      prev.includes(tld) ? prev.filter((t) => t !== tld) : [...prev, tld]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTlds.length === 0) return;
    onSubmit({ audience, keywords, tlds: selectedTlds, language, budgetLimit, creativeDirection });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Audience */}
        <div className="space-y-2">
          <label
            htmlFor="audience"
            className="block text-sm font-medium text-gray-300"
          >
            Target Audience
          </label>
          <input
            id="audience"
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g., French, European, Global"
            className="w-full rounded-lg border border-card-border bg-card px-4 py-2.5 text-foreground placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            required
          />
        </div>

        {/* Industry Keywords */}
        <div className="space-y-2">
          <label
            htmlFor="keywords"
            className="block text-sm font-medium text-gray-300"
          >
            Industry Keywords
          </label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., Trading, FX, Crypto"
            className="w-full rounded-lg border border-card-border bg-card px-4 py-2.5 text-foreground placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            required
          />
        </div>

        {/* Preferred TLDs (multi-select) */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-300">
            Domain Extensions
            <span className="ml-2 text-xs text-muted font-normal">
              ({selectedTlds.length} selected)
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {TLDS.map((t) => {
              const isSelected = selectedTlds.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTld(t)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-mono font-medium border transition-all duration-150 ${
                    isSelected
                      ? "bg-accent/20 border-accent text-accent ring-1 ring-accent/30"
                      : "bg-card border-card-border text-muted hover:border-gray-500 hover:text-gray-300"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {selectedTlds.length === 0 && (
            <p className="text-xs text-red-400">
              Select at least one extension
            </p>
          )}
        </div>

        {/* Language Toggle */}
        <div className="space-y-2">
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-300"
          >
            Naming Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border border-card-border bg-card px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Creative Direction */}
      <div className="space-y-2">
        <label
          htmlFor="creativeDirection"
          className="block text-sm font-medium text-gray-300"
        >
          Creative Direction
          <span className="ml-2 text-xs text-muted font-normal">
            (optional)
          </span>
        </label>
        <textarea
          id="creativeDirection"
          value={creativeDirection}
          onChange={(e) => setCreativeDirection(e.target.value)}
          placeholder={"Give the AI specific instructions or examples, e.g.:\n- Use animal names (like FalconTrade, BullVault)\n- Short 5-letter made-up words\n- Names inspired by Greek mythology\n- Combine speed + trust (like SwiftLedger)"}
          rows={3}
          className="w-full rounded-lg border border-card-border bg-card px-4 py-2.5 text-foreground placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors resize-y text-sm"
        />
      </div>

      {/* Budget Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-300"
          >
            Budget Limit
          </label>
          <span className="text-sm font-mono font-semibold text-accent">
            &euro;{budgetLimit}
          </span>
        </div>
        <input
          id="budget"
          type="range"
          min={5}
          max={100}
          step={5}
          value={budgetLimit}
          onChange={(e) => setBudgetLimit(Number(e.target.value))}
          className="w-full h-2 bg-card-border rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-xs text-muted">
          <span>&euro;5</span>
          <span>&euro;100</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating Domain Names...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Generate Domain Names
          </>
        )}
      </button>
    </form>
  );
}
