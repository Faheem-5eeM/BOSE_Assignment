"use client"

import { SearchX, Users, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState({ type, onClearFilters }) {
  const configs = {
    "no-results": {
      icon: SearchX,
      title: "No results found",
      description: "Try adjusting your search or filter criteria to find candidates.",
      action: onClearFilters ? (
        <Button variant="outline" onClick={onClearFilters} className="gap-2 mt-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Clear Filters
        </Button>
      ) : null,
    },
    "no-candidates": {
      icon: Users,
      title: "No candidates yet",
      description: "Start by adding candidates to your recruitment pipeline.",
      action: null,
    },
    "filtered-empty": {
      icon: Filter,
      title: "No matching candidates",
      description: "No candidates match your current filter criteria.",
      action: onClearFilters ? (
        <Button variant="outline" onClick={onClearFilters} className="gap-2 mt-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Clear All Filters
        </Button>
      ) : null,
    },
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="p-5 bg-secondary/50 rounded-2xl mb-5 animate-scale-in">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{config.title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{config.description}</p>
      {config.action}
    </div>
  )
}
