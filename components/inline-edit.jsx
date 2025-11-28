"use client"

import { useState, useRef, useEffect } from "react"
import { Check, X, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { allStages } from "@/lib/mock-data"
import { StageBadge } from "./stage-badge"
import { cn } from "@/lib/utils"

export function InlineEdit({ value, onSave, type = "text", className }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave()
    else if (e.key === "Escape") handleCancel()
  }

  if (type === "stage") {
    return (
      <div className={cn("group relative", className)} onClick={(e) => e.stopPropagation()}>
        {isEditing ? (
          <div className="animate-scale-in">
            <Select
              value={editValue}
              onValueChange={(newValue) => {
                setEditValue(newValue)
                onSave(newValue)
                setIsEditing(false)
              }}
            >
              <SelectTrigger className="h-7 w-[130px] bg-background border-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    <StageBadge stage={stage} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div
            className="flex items-center gap-1.5 cursor-pointer rounded-lg px-1.5 py-0.5 -mx-1.5 transition-all duration-200 hover:bg-secondary"
            onClick={() => setIsEditing(true)}
          >
            <StageBadge stage={value} />
            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </div>
        )}
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <Input
          ref={inputRef}
          type={type === "number" || type === "salary" ? "number" : "text"}
          value={editValue}
          onChange={(e) =>
            setEditValue(type === "number" || type === "salary" ? Number(e.target.value) : e.target.value)
          }
          onKeyDown={handleKeyDown}
          className="h-7 w-[100px] bg-background text-sm border-primary/30"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-green-500 hover:text-green-400 hover:bg-green-500/10"
          onClick={handleSave}
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-red-500 hover:text-red-400 hover:bg-red-500/10"
          onClick={handleCancel}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    )
  }

  const displayValue = type === "salary" ? `₹${(Number(value) / 100000).toFixed(1)}L` : value

  return (
    <div
      className={cn(
        "group flex items-center gap-1.5 cursor-pointer rounded-lg px-1.5 py-0.5 -mx-1.5",
        "transition-all duration-200 hover:bg-secondary",
        className,
      )}
      onClick={(e) => {
        e.stopPropagation()
        setIsEditing(true)
      }}
    >
      <span className="truncate font-medium">{displayValue}</span>
      <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0" />
    </div>
  )
}
