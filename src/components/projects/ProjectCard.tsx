import { memo } from "react"
import { Link } from "react-router-dom"
import type { Project } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Calendar, Bookmark, Camera, MessageSquare, Flag, Building2, Landmark, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useAppStore } from "@/stores/useAppStore"
import { cn, formatCurrency } from "@/lib/utils"

interface ProjectCardProps {
  project: Project
}

const statusColors = {
  planning: "border-blue-500 bg-blue-50 text-blue-700",
  procurement: "border-amber-500 bg-amber-50 text-amber-700",
  construction: "border-kenya-red bg-red-50 text-kenya-red-dark",
  completed: "border-green-500 bg-green-50 text-green-700",
  "on-hold": "border-gray-400 bg-gray-100 text-gray-600",
}

const statusLabels = {
  planning: "Planned",
  procurement: "Procurement",
  construction: "Ongoing",
  completed: "Completed",
  "on-hold": "Delayed",
}

const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  const { toggleBookmark, isBookmarked } = useAppStore()
  const bookmarked = isBookmarked(project.id)
  const statusKey = project.status as keyof typeof statusColors

  const photoCount = project.images.length + project.communityUploads.filter((u) => u.type === "photo").length
  const commentCount = project.comments.length
  const reportCount = project.communityUploads.length
  const lastUpdated = project.officialUpdates.length
    ? project.officialUpdates[project.officialUpdates.length - 1].date
    : project.startDate

  return (
    <Link to={`/project/${project.id}`}>
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="group h-full cursor-pointer transition-all hover:shadow-lg border-kenya-border">
          <div className="relative overflow-hidden">
            <motion.img
              src={project.images[0] ?? "/placeholder.png"}
              alt={project.title}
              className="h-44 w-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 flex gap-1">
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleBookmark(project.id)
                }}
                className="rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm"
                aria-label={bookmarked ? "Remove bookmark" : "Bookmark project"}
              >
                <Bookmark
                  className={cn("h-4 w-4", bookmarked && "fill-kenya-red text-kenya-red")}
                />
              </motion.button>
            </div>
            <div className="absolute bottom-2 left-2 flex gap-1.5">
              <Badge className="bg-white/90 text-kenya-black border-0 text-xs font-medium">
                {project.category}
              </Badge>
              <Badge className={cn("text-xs border-0", statusColors[statusKey])} variant="default">
                {statusLabels[statusKey]}
              </Badge>
            </div>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="text-base leading-tight line-clamp-2">{project.title}</CardTitle>
            <CardDescription className="line-clamp-2 text-sm">
              {project.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-kenya-black/60">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{project.county}</span>
              <span>·</span>
              <span className="truncate">{project.code}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-kenya-black/60">
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{project.implementingMinistry}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-kenya-black/60">
              <Calendar className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {new Date(project.expectedCompletion).toLocaleDateString("en-KE", { month: "short", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1 ml-auto">
                <Clock className="h-3 w-3" />
                {new Date(lastUpdated).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-kenya-black/60">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-kenya-border/50">
              <div>
                <p className="text-kenya-black/50">Budget</p>
                <p className="font-semibold text-kenya-black">{formatCurrency(project.budget)}</p>
              </div>
              <div>
                <p className="text-kenya-black/50">Spent</p>
                <p className="font-semibold text-kenya-red">{formatCurrency(project.expenditure)}</p>
              </div>
              <div>
                <p className="text-kenya-black/50">Remaining</p>
                <p className="font-semibold text-kenya-green">{formatCurrency(project.remainingBalance)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-kenya-black/60 border-t border-kenya-border/50 pt-2">
              <span className="flex items-center gap-1">
                <Camera className="h-3 w-3" />
                {photoCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {commentCount}
              </span>
              <span className="flex items-center gap-1">
                <Flag className="h-3 w-3" />
                {reportCount}
              </span>
              <span className="flex items-center gap-1">
                <Landmark className="h-3 w-3" />
                {formatCurrency(project.treasuryDisbursement)}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
})

ProjectCard.displayName = "ProjectCard"

export default ProjectCard
