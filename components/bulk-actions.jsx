"use client"

import { useState } from "react"
import { CheckSquare, UserCheck, ArrowRight, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { allStages } from "@/lib/mock-data"
import { StageBadge } from "./stage-badge"

export function BulkActions({ selectedCount, onChangeStage, onMarkReviewed, onDelete, onClearSelection }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedStage, setSelectedStage] = useState("")

  if (selectedCount === 0) return null

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-xl animate-slide-up backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <CheckSquare className="h-4 w-4" />
          <span>{selectedCount} selected</span>
        </div>

        <div className="h-5 w-px bg-border hidden sm:block" />

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedStage}
            onValueChange={(value) => {
              setSelectedStage(value)
              onChangeStage(value)
              setSelectedStage("")
            }}
          >
            <SelectTrigger className="h-9 w-[150px] bg-background/80 text-sm">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3.5 w-3.5" />
                <SelectValue placeholder="Change Stage" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {allStages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  <StageBadge stage={stage} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 bg-background/80 hover:bg-accent/10 hover:text-accent"
            onClick={onMarkReviewed}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mark Reviewed</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 bg-background/80"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={onClearSelection}
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidates</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} candidate(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete()
                setShowDeleteConfirm(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
