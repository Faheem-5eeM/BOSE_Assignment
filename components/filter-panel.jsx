"use client"

import { useState } from "react"
import { X, Plus, Filter, Search, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { allJobTitles, allStages, allCompanies } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { StageBadge } from "./stage-badge"

const filterFieldOptions = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "jobTitle", label: "Job Title" },
  { value: "stage", label: "Stage" },
  { value: "company", label: "Company" },
  { value: "salaryMin", label: "Min Salary (LPA)" },
  { value: "salaryMax", label: "Max Salary (LPA)" },
  { value: "appliedDateFrom", label: "Applied From" },
  { value: "appliedDateTo", label: "Applied To" },
]

export function FilterPanel({ filters, onFiltersChange, onApplyFilters, onClearFilters }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const addFilter = () => {
    const newFilter = {
      id: `filter-${Date.now()}`,
      field: "name",
      operator: "contains",
      value: "",
    }
    onFiltersChange([...filters, newFilter])
  }

  const removeFilter = (id) => {
    onFiltersChange(filters.filter((f) => f.id !== id))
  }

  const updateFilter = (id, updates) => {
    onFiltersChange(filters.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const renderFilterValueInput = (filter) => {
    switch (filter.field) {
      case "jobTitle":
        return (
          <Select value={filter.value} onValueChange={(value) => updateFilter(filter.id, { value })}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background border-border/50">
              <SelectValue placeholder="Select job" />
            </SelectTrigger>
            <SelectContent>
              {allJobTitles.map((job) => (
                <SelectItem key={job} value={job}>
                  {job}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "stage":
        return (
          <Select value={filter.value} onValueChange={(value) => updateFilter(filter.id, { value })}>
            <SelectTrigger className="w-full sm:w-[150px] bg-background border-border/50">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {allStages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  <StageBadge stage={stage} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "company":
        return (
          <Select value={filter.value} onValueChange={(value) => updateFilter(filter.id, { value })}>
            <SelectTrigger className="w-full sm:w-[160px] bg-background border-border/50">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {allCompanies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "salaryMin":
      case "salaryMax":
        return (
          <Input
            type="number"
            placeholder="Amount in LPA"
            value={filter.value}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            className="w-full sm:w-[140px] bg-background border-border/50"
          />
        )
      case "appliedDateFrom":
      case "appliedDateTo":
        return (
          <Input
            type="date"
            value={filter.value}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            className="w-full sm:w-[160px] bg-background border-border/50"
          />
        )
      default:
        return (
          <Input
            placeholder="Enter value"
            value={filter.value}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            className="w-full sm:w-[180px] bg-background border-border/50"
          />
        )
    }
  }

  return (
    <div className="border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Filter className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold">Filters</span>
          {filters.length > 0 && (
            <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary border-0">
              {filters.length} active
            </Badge>
          )}
        </div>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", isExpanded && "rotate-180")}
        />
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-4 pb-4 border-t border-border/50 pt-4">
          <div className="space-y-3">
            {filters.map((filter, index) => (
              <div
                key={filter.id}
                className="flex flex-wrap items-center gap-2 bg-secondary/30 p-3 rounded-lg animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Select
                  value={filter.field}
                  onValueChange={(value) => updateFilter(filter.id, { field: value, value: "" })}
                >
                  <SelectTrigger className="w-full sm:w-[140px] bg-background border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterFieldOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-xs text-muted-foreground px-2 hidden sm:inline">
                  {filter.field.includes("salary") || filter.field.includes("Date")
                    ? filter.field.includes("Min") || filter.field.includes("From")
                      ? "≥"
                      : "≤"
                    : "contains"}
                </span>

                {renderFilterValueInput(filter)}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-auto sm:ml-0"
                  onClick={() => removeFilter(filter.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {filters.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8 flex flex-col items-center gap-3">
                <Sparkles className="h-8 w-8 text-muted-foreground/50" />
                <p>No filters applied. Add filters to narrow your search.</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={addFilter}
              className="gap-1.5 bg-transparent hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            >
              <Plus className="h-4 w-4" />
              Add Filter
            </Button>

            <div className="flex-1" />

            {filters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear All
              </Button>
            )}

            <Button
              size="sm"
              onClick={onApplyFilters}
              className="gap-1.5 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Search className="h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
