"use client";

interface StatusBadgeProps {
  available: boolean;
}

export default function StatusBadge({ available }: StatusBadgeProps) {
  if (available) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/25">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Available
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400 ring-1 ring-red-500/25">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
      Taken
    </span>
  );
}
