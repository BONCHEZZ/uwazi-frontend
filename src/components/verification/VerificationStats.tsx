import type { ElementType } from "react"
import type { Project } from "@/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { CheckCircle, Clock, AlertTriangle, HelpCircle } from "lucide-react"

interface VerificationStatsProps {
  project: Project
  className?: string
}

type StatItem = {
  label: string
  value: number
  total: number
  color: string
  icon: ElementType
}

const VerificationStats = function VerificationStats({
  project,
  className,
}: VerificationStatsProps) {
  const score = project.verificationScore
  const totalComments = project.comments.length
  const totalUploads = project.communityUploads.length
  const verifiedUploads = project.communityUploads.filter(
    (u) => u.verificationStatus === "verified"
  ).length

  const stats: StatItem[] = [
    {
      label: "Verification Score",
      value: score,
      total: 100,
      color: score >= 75 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-600",
      icon: CheckCircle,
    },
    {
      label: "Community Uploads",
      value: totalUploads,
      total: Math.max(totalUploads, 10),
      color: "text-blue-600",
      icon: HelpCircle,
    },
    {
      label: "Verified Evidence",
      value: verifiedUploads,
      total: Math.max(totalUploads, 10),
      color: "text-green-600",
      icon: CheckCircle,
    },
    {
      label: "Community Comments",
      value: totalComments,
      total: Math.max(totalComments, 50),
      color: "text-purple-600",
      icon: Clock,
    },
  ]

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-sm">Verification Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <stat.icon className={cn("h-3 w-3", stat.color)} />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <span className="text-xs font-bold">{stat.value}</span>
              </div>
              <Progress value={(stat.value / stat.total) * 100} className="h-1.5">
                <div
                  className="h-full bg-kenya-red"
                  style={{ width: `${(stat.value / stat.total) * 100}%` }}
                />
              </Progress>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium">Risk Level: </span>
            <Badge
              variant={
                project.riskLevel === "low"
                  ? "success"
                  : project.riskLevel === "medium"
                  ? "warning"
                  : "danger"
              }
              className="text-xs"
            >
              {project.riskLevel.toUpperCase()}
            </Badge>
          </div>
        </div>

        {project.verificationScore < 50 && (
          <p className="text-xs text-kenya-black/60">
            This project has a low verification score. Citizen reports are
            essential for improving transparency.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default VerificationStats
