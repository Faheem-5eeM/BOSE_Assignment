"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ExpandableList({ items, renderItem, initialCount = 2, className }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const visibleItems = isExpanded ? items : items.slice(0, initialCount)
  const hiddenCount = items.length - initialCount

  return (
    <div className={cn("space-y-1.5", className)}>
      {visibleItems.map((item, index) => (
        <div
          key={index}
          className={cn("animate-fade-in", isExpanded && index >= initialCount && "animate-slide-down")}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {renderItem(item, index)}
        </div>
      ))}

      {hiddenCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 px-2 text-xs text-muted-foreground hover:text-primary",
            "transition-all duration-200 hover:bg-primary/5",
          )}
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1 transition-transform" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1 transition-transform" />+{hiddenCount} more
            </>
          )}
        </Button>
      )}
    </div>
  )
}
