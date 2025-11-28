"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ExpandableList } from "./expandable-list"
import { InlineEdit } from "./inline-edit"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 50

export function DataTable({ data, selectedIds, onSelectionChange, onCandidateClick, onUpdateCandidate }) {
  const [sortConfig, setSortConfig] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const parentRef = useRef(null)

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      let aValue, bValue

      if (sortConfig.field === "primaryJob") {
        aValue = a.jobs[0]?.stage || ""
        bValue = b.jobs[0]?.stage || ""
      } else if (sortConfig.field === "expectedSalary") {
        aValue = a.expectedSalary
        bValue = b.expectedSalary
      } else if (sortConfig.field === "appliedDate") {
        aValue = new Date(a.appliedDate).getTime()
        bValue = new Date(b.appliedDate).getTime()
      } else {
        aValue = a[sortConfig.field] || ""
        bValue = b[sortConfig.field] || ""
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  // Pagination
  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedData.slice(start, start + PAGE_SIZE)
  }, [sortedData, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [data.length])

  // Virtual scrolling
  const rowVirtualizer = useVirtualizer({
    count: paginatedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10,
  })

  const handleSort = (field) => {
    setSortConfig((current) => {
      if (current?.field === field) {
        if (current.direction === "asc") return { field, direction: "desc" }
        return null
      }
      return { field, direction: "asc" }
    })
  }

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === paginatedData.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(paginatedData.map((c) => c.id)))
    }
  }, [paginatedData, selectedIds.size, onSelectionChange])

  const handleSelectRow = useCallback(
    (id) => {
      const newSelection = new Set(selectedIds)
      if (newSelection.has(id)) {
        newSelection.delete(id)
      } else {
        newSelection.add(id)
      }
      onSelectionChange(newSelection)
    },
    [selectedIds, onSelectionChange],
  )

  const SortButton = ({ field, children }) => {
    const isActive = sortConfig?.field === field
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 gap-1.5 -ml-2 font-semibold transition-all",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
        onClick={() => handleSort(field)}
      >
        {children}
        {isActive ? (
          sortConfig.direction === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
        )}
      </Button>
    )
  }

  const startItem = (currentPage - 1) * PAGE_SIZE + 1
  const endItem = Math.min(currentPage * PAGE_SIZE, sortedData.length)

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
      {/* Desktop Table Header */}
      <div className="hidden lg:grid grid-cols-[48px_1.5fr_1.5fr_1fr_1fr_100px_100px_120px] gap-4 px-4 py-3 bg-secondary/30 border-b border-border/50 text-sm">
        <div className="flex items-center justify-center">
          <Checkbox
            checked={selectedIds.size === paginatedData.length && paginatedData.length > 0}
            onCheckedChange={handleSelectAll}
          />
        </div>
        <SortButton field="name">Candidate</SortButton>
        <div className="font-semibold text-muted-foreground flex items-center">Jobs & Stage</div>
        <div className="font-semibold text-muted-foreground flex items-center">Education</div>
        <SortButton field="currentCompany">Company</SortButton>
        <SortButton field="appliedDate">Applied</SortButton>
        <SortButton field="expectedSalary">Salary</SortButton>
        <div className="font-semibold text-muted-foreground flex items-center">Contact</div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-secondary/30 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selectedIds.size === paginatedData.length && paginatedData.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm font-semibold">Select All</span>
        </div>
        <div className="flex gap-2">
          <SortButton field="name">Name</SortButton>
          <SortButton field="appliedDate">Date</SortButton>
        </div>
      </div>

      {/* Table Body with Virtual Scrolling */}
      <div ref={parentRef} className="overflow-auto" style={{ height: "calc(100vh - 420px)", minHeight: "400px" }}>
        {paginatedData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No candidates found matching your filters.
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const candidate = paginatedData[virtualRow.index]
              const isSelected = selectedIds.has(candidate.id)
              const initials = candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()

              return (
                <div
                  key={candidate.id}
                  className={cn(
                    "absolute top-0 left-0 w-full border-b border-border/30 transition-all duration-200 cursor-pointer",
                    "hover:bg-secondary/30",
                    isSelected && "bg-primary/5 hover:bg-primary/10",
                  )}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  onClick={() => onCandidateClick(candidate)}
                >
                  {/* Desktop Row */}
                  <div className="hidden lg:grid grid-cols-[48px_1.5fr_1.5fr_1fr_1fr_100px_100px_120px] gap-4 px-4 py-3 h-full items-center">
                    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectRow(candidate.id)}
                        className="transition-transform hover:scale-110"
                      />
                    </div>

                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-background shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{candidate.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center overflow-hidden">
                      <ExpandableList
                        items={candidate.jobs}
                        renderItem={(job) => (
                          <div className="flex items-center gap-2">
                            <span className="text-sm truncate max-w-[100px]">{job.jobTitle}</span>
                            <InlineEdit
                              value={job.stage}
                              type="stage"
                              onSave={(newStage) => {
                                const updatedJobs = candidate.jobs.map((j) =>
                                  j.id === job.id ? { ...j, stage: newStage } : j,
                                )
                                onUpdateCandidate(candidate.id, { jobs: updatedJobs })
                              }}
                            />
                          </div>
                        )}
                      />
                    </div>

                    <div className="flex items-center overflow-hidden">
                      <ExpandableList
                        items={candidate.education}
                        renderItem={(edu) => (
                          <div className="text-sm">
                            <span className="truncate block max-w-[150px] font-medium">{edu.degree}</span>
                            <span className="text-muted-foreground text-xs">{edu.institution}</span>
                          </div>
                        )}
                      />
                    </div>

                    <div className="flex items-center">
                      <span className="text-sm truncate font-medium">{candidate.currentCompany}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      {new Date(candidate.appliedDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>

                    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                      <InlineEdit
                        value={candidate.expectedSalary}
                        type="salary"
                        onSave={(newSalary) => {
                          onUpdateCandidate(candidate.id, { expectedSalary: Number(newSalary) })
                        }}
                      />
                    </div>

                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground truncate">{candidate.mobile}</span>
                    </div>
                  </div>

                  {/* Mobile Row */}
                  <div className="lg:hidden p-4 h-full">
                    <div className="flex items-start gap-3">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={isSelected} onCheckedChange={() => handleSelectRow(candidate.id)} />
                      </div>
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-sm font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold">{candidate.name}</p>
                            <p className="text-xs text-muted-foreground">{candidate.currentCompany}</p>
                          </div>
                          <InlineEdit
                            value={candidate.jobs[0]?.stage || "Applied"}
                            type="stage"
                            onSave={(newStage) => {
                              const updatedJobs = candidate.jobs.map((j, idx) =>
                                idx === 0 ? { ...j, stage: newStage } : j,
                              )
                              onUpdateCandidate(candidate.id, { jobs: updatedJobs })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>₹{(candidate.expectedSalary / 100000).toFixed(1)}L</span>
                          <span>•</span>
                          <span>
                            {new Date(candidate.appliedDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border/50 bg-secondary/20">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {sortedData.length > 0 ? startItem : 0}-{endItem}
          </span>{" "}
          of <span className="font-semibold text-foreground">{sortedData.length.toLocaleString()}</span> candidates
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm px-3 font-medium">
            {currentPage} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
