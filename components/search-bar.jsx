"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2, Command } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SearchBar({ value, onChange, placeholder = "Search candidates...", className, isLoading = false }) {
  const [localValue, setLocalValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleChange = (newValue) => {
    setLocalValue(newValue)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onChange(newValue), 300)
  }

  const handleClear = () => {
    setLocalValue("")
    onChange("")
    inputRef.current?.focus()
  }

  return (
    <div className={cn("relative group", className)}>
      <div
        className={cn(
          "absolute inset-0 rounded-lg transition-all duration-300 -z-10",
          isFocused ? "bg-primary/5 scale-105" : "bg-transparent scale-100",
        )}
      />
      <Search
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
          isFocused ? "text-primary" : "text-muted-foreground",
        )}
      />
      <Input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          "pl-10 pr-20 h-10 bg-secondary/50 border-border/50 transition-all duration-300",
          "focus:bg-background focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5",
        )}
        data-search-input
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {isLoading ? (
          <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
        ) : localValue ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={handleClear}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="h-3 w-3" />K
          </kbd>
        )}
      </div>
    </div>
  )
}
