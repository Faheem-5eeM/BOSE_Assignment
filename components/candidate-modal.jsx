"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { StageBadge } from "./stage-badge"
import { Mail, Phone, GraduationCap, Briefcase, Calendar, IndianRupee, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CandidateModal({ candidate, open, onOpenChange }) {
  if (!candidate) return null

  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Candidate Profile</DialogTitle>
        </DialogHeader>

        {/* Header with gradient */}
        <div className="relative h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
          <div className="absolute -bottom-10 left-6">
            <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="px-6 pb-6 pt-14 space-y-6">
          {/* Name and Company */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{candidate.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{candidate.currentCompany}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2 self-start bg-transparent">
              <ExternalLink className="h-4 w-4" />
              View Full Profile
            </Button>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href={`mailto:${candidate.email}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              {candidate.email}
            </a>
            <a
              href={`tel:${candidate.mobile}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              {candidate.mobile}
            </a>
          </div>

          <Separator />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-secondary/30 rounded-xl p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1.5">
                <IndianRupee className="h-4 w-4" />
                Expected Salary
              </div>
              <p className="text-2xl font-bold">₹{(candidate.expectedSalary / 100000).toFixed(1)} LPA</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1.5">
                <Calendar className="h-4 w-4" />
                Applied On
              </div>
              <p className="text-2xl font-bold">
                {new Date(candidate.appliedDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1.5">
                <Briefcase className="h-4 w-4" />
                Applications
              </div>
              <p className="text-2xl font-bold">{candidate.jobs.length}</p>
            </div>
          </div>

          {/* Jobs Applied */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <Briefcase className="h-4 w-4 text-primary" />
              Jobs Applied ({candidate.jobs.length})
            </h3>
            <div className="space-y-2">
              {candidate.jobs.map((job, index) => (
                <div
                  key={job.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-all animate-slide-up gap-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div>
                    <p className="font-semibold">{job.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      Applied: {new Date(job.appliedDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <StageBadge stage={job.stage} size="md" />
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <GraduationCap className="h-4 w-4 text-primary" />
              Education ({candidate.education.length})
            </h3>
            <div className="space-y-2">
              {candidate.education.map((edu, index) => (
                <div
                  key={edu.id}
                  className="p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-all animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground">
                    {edu.institution} • {edu.year}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
