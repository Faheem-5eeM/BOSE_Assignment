"use client"

import { useState, useMemo, useCallback } from "react"
import { Users, Briefcase, TrendingUp, DollarSign, Sparkles } from "lucide-react"
import { FilterPanel } from "@/components/filter-panel"
import { DataTable } from "@/components/data-table"
import { BulkActions } from "@/components/bulk-actions"
import { CandidateModal } from "@/components/candidate-modal"
import { SearchBar } from "@/components/search-bar"
import { EmptyState } from "@/components/empty-state"
import { ThemeToggle } from "@/components/theme-toggle"
import { Meteors } from "@/components/ui/meteors"
import { mockCandidates } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function CandidateManagement() {
  const [candidates, setCandidates] = useState(mockCandidates)
  const [filters, setFilters] = useState([])
  const [appliedFilters, setAppliedFilters] = useState([])
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredCandidates = useMemo(() => {
    let result = candidates

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.currentCompany.toLowerCase().includes(query) ||
          c.jobs.some((j) => j.jobTitle.toLowerCase().includes(query)),
      )
    }

    if (appliedFilters.length === 0) return result

    return result.filter((candidate) => {
      return appliedFilters.every((filter) => {
        const value = filter.value
        if (!value && value !== 0) return true

        switch (filter.field) {
          case "name":
            return candidate.name.toLowerCase().includes(String(value).toLowerCase())
          case "email":
            return candidate.email.toLowerCase().includes(String(value).toLowerCase())
          case "jobTitle":
            return candidate.jobs.some((job) => job.jobTitle.toLowerCase().includes(String(value).toLowerCase()))
          case "stage":
            return candidate.jobs.some((job) => job.stage === value)
          case "company":
            return candidate.currentCompany.toLowerCase().includes(String(value).toLowerCase())
          case "salaryMin":
            return candidate.expectedSalary >= Number(value) * 100000
          case "salaryMax":
            return candidate.expectedSalary <= Number(value) * 100000
          case "appliedDateFrom":
            return new Date(candidate.appliedDate) >= new Date(String(value))
          case "appliedDateTo":
            return new Date(candidate.appliedDate) <= new Date(String(value))
          default:
            return true
        }
      })
    })
  }, [candidates, appliedFilters, searchQuery])

  const stats = useMemo(() => {
    const activeHires = candidates.filter((c) =>
      c.jobs.some((j) => j.stage === "Offer" || j.stage === "Interview" || j.stage === "Technical"),
    ).length
    const hired = candidates.filter((c) => c.jobs.some((j) => j.stage === "Hired")).length
    const avgSalary = Math.round(candidates.reduce((acc, c) => acc + c.expectedSalary, 0) / candidates.length / 100000)

    return { total: candidates.length, activeHires, hired, avgSalary }
  }, [candidates])

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters([...filters])
    setSelectedIds(new Set())
    toast({
      title: "Filters Applied",
      description: `Found ${filteredCandidates.length} matching candidates`,
    })
  }, [filters, filteredCandidates.length, toast])

  const handleClearFilters = useCallback(() => {
    setFilters([])
    setAppliedFilters([])
    setSearchQuery("")
    setSelectedIds(new Set())
  }, [])

  const handleUpdateCandidate = useCallback(
    (id, updates) => {
      setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
      toast({ title: "Updated", description: "Changes saved successfully" })
    },
    [toast],
  )

  const handleBulkStageChange = useCallback(
    (stage) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (selectedIds.has(c.id)) {
            return { ...c, jobs: c.jobs.map((j, idx) => (idx === 0 ? { ...j, stage } : j)) }
          }
          return c
        }),
      )
      toast({ title: "Stage Updated", description: `${selectedIds.size} candidates moved to ${stage}` })
      setSelectedIds(new Set())
    },
    [selectedIds, toast],
  )

  const handleBulkDelete = useCallback(() => {
    setCandidates((prev) => prev.filter((c) => !selectedIds.has(c.id)))
    toast({ title: "Deleted", description: `${selectedIds.size} candidates removed`, variant: "destructive" })
    setSelectedIds(new Set())
  }, [selectedIds, toast])

  const handleMarkReviewed = useCallback(() => {
    toast({ title: "Marked as Reviewed", description: `${selectedIds.size} candidates marked` })
    setSelectedIds(new Set())
  }, [selectedIds, toast])

  const hasFiltersOrSearch = appliedFilters.length > 0 || searchQuery.trim() !== ""

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Meteors number={40} />
      </div>

      {/* Header - Added glass effect for better visibility over meteors */}
      <header className="border-b border-border/50 bg-card/80 glass backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Hirely</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Candidate Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search candidates..."
                className="w-full sm:w-72 lg:w-80"
              />
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium">{filteredCandidates.length.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Total Candidates"
            value={stats.total.toLocaleString()}
            color="primary"
            delay={0}
          />
          <StatCard
            icon={<Briefcase className="h-5 w-5" />}
            label="Active Pipeline"
            value={stats.activeHires.toLocaleString()}
            color="warning"
            delay={1}
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Hired"
            value={stats.hired.toLocaleString()}
            color="success"
            delay={2}
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5" />}
            label="Avg. Salary"
            value={`₹${stats.avgSalary} LPA`}
            color="accent"
            delay={3}
          />
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Bulk Actions */}
        <BulkActions
          selectedCount={selectedIds.size}
          onChangeStage={handleBulkStageChange}
          onMarkReviewed={handleMarkReviewed}
          onDelete={handleBulkDelete}
          onClearSelection={() => setSelectedIds(new Set())}
        />

        {/* Data Table or Empty State */}
        {filteredCandidates.length === 0 ? (
          <div className="border border-border/50 rounded-xl bg-card/80 glass backdrop-blur-sm">
            <EmptyState
              type={hasFiltersOrSearch ? "filtered-empty" : "no-candidates"}
              onClearFilters={hasFiltersOrSearch ? handleClearFilters : undefined}
            />
          </div>
        ) : (
          <DataTable
            data={filteredCandidates}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onCandidateClick={(candidate) => {
              setSelectedCandidate(candidate)
              setModalOpen(true)
            }}
            onUpdateCandidate={handleUpdateCandidate}
          />
        )}

        <CandidateModal candidate={selectedCandidate} open={modalOpen} onOpenChange={setModalOpen} />
      </main>

      <Toaster />
    </div>
  )
}

function StatCard({ icon, label, value, color, delay }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    success: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    accent: "bg-accent/10 text-accent border-accent/20",
  }

  const iconBg = {
    primary: "bg-primary/15",
    warning: "bg-amber-500/15",
    success: "bg-green-500/15",
    accent: "bg-accent/15",
  }

  return (
    <div
      className={`bg-card/80 glass backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-slide-up stagger-${delay + 1}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${iconBg[color]} ${colorClasses[color].split(" ")[1]}`}>{icon}</div>
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
          <p className="text-lg sm:text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}
