"use client";

import StatusBadge from "./StatusBadge";
import BuyButton from "./BuyButton";

export interface DomainResult {
  domain: string;
  available: boolean;
  price: number;
  currency: string;
}

interface ResultsTableProps {
  results: DomainResult[];
  budgetLimit: number;
  isLoading: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border border-card-border bg-card p-4"
        >
          <div className="h-5 w-48 rounded bg-gray-800 animate-shimmer" />
          <div className="h-5 w-20 rounded-full bg-gray-800 animate-shimmer" />
          <div className="ml-auto h-5 w-16 rounded bg-gray-800 animate-shimmer" />
          <div className="h-8 w-24 rounded-lg bg-gray-800 animate-shimmer" />
        </div>
      ))}
    </div>
  );
}

export default function ResultsTable({
  results,
  budgetLimit,
  isLoading,
}: ResultsTableProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (results.length === 0) {
    return null;
  }

  const available = results.filter(
    (r) => r.available && r.price <= budgetLimit
  );
  const availableCount = results.filter((r) => r.available).length;
  const takenCount = results.length - availableCount;

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted">Total checked:</span>
          <span className="font-semibold text-foreground">
            {results.length}
          </span>
        </div>
        <div className="h-4 w-px bg-card-border" />
        <div className="flex items-center gap-2">
          <span className="text-muted">Available:</span>
          <span className="font-semibold text-emerald-400">
            {availableCount}
          </span>
        </div>
        <div className="h-4 w-px bg-card-border" />
        <div className="flex items-center gap-2">
          <span className="text-muted">Taken:</span>
          <span className="font-semibold text-red-400">{takenCount}</span>
        </div>
        <div className="h-4 w-px bg-card-border" />
        <div className="flex items-center gap-2">
          <span className="text-muted">Within budget:</span>
          <span className="font-semibold text-accent">
            {available.length}
          </span>
        </div>
      </div>

      {/* Table - only available domains within budget */}
      <div className="overflow-hidden rounded-xl border border-card-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-card-border bg-card">
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Domain Name
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Status
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Est. Price
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {available.map((result) => (
              <tr
                key={result.domain}
                className="group transition-colors hover:bg-white/[0.02]"
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-medium text-foreground">
                    {result.domain}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge available={result.available} />
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-semibold text-emerald-400">
                    &euro;{result.price.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <BuyButton domain={result.domain} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {available.length === 0 && (
          <div className="px-6 py-12 text-center text-muted">
            No available domains found within your &euro;{budgetLimit} budget.
            Try increasing the budget or changing your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
