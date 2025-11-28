"use client"

import { cn } from "@/lib/utils"

const stageStyles = {
  Applied: { bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  Screening: { bg: "bg-amber-500/15", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  Interview: { bg: "bg-orange-500/15", text: "text-orange-600 dark:text-orange-400", dot: "bg-orange-500" },
  Technical: { bg: "bg-violet-500/15", text: "text-violet-600 dark:text-violet-400", dot: "bg-violet-500" },
  Offer: { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  Hired: { bg: "bg-green-500/15", text: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
  Rejected: { bg: "bg-red-500/15", text: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
}

export function StageBadge({ stage, size = "sm" }) {
  const styles = stageStyles[stage] || stageStyles.Applied

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 hover:scale-105",
        styles.bg,
        styles.text,
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
      )}
    >
      <span className={cn("rounded-full animate-pulse", styles.dot, size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2")} />
      {stage}
    </span>
  )
}
