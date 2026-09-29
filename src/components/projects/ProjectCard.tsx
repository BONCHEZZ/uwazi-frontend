import { memo } from "react"
import { Link } from "react-router-dom"
import type { Project } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Bookmark } from "lucide-react"
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

const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  const { toggleBookmark, isBookmarked } = useAppStore()
  const bookmarked = isBookmarked(project.id)
  const statusKey = project.status as keyof typeof statusColors

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
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-white/90 text-kenya-black border-0 text-xs font-medium">
                {project.category}
              </Badge>
            </div>
          </div>

          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base leading-tight line-clamp-2">{project.title}</CardTitle>
              <Badge className={cn("text-xs shrink-0", statusColors[statusKey])} variant="default">
                {project.status}
              </Badge>
            </div>
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
              <Calendar className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {new Date(project.startDate).toLocaleDateString("en-KE", { month: "short", year: "numeric" })}
                {" → "}
                {new Date(project.expectedCompletion).toLocaleDateString("en-KE", { month: "short", year: "numeric" })}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-kenya-black/60">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-kenya-border/50">
              <span className="text-kenya-black/60">Budget</span>
              <span className="font-semibold text-kenya-black">{formatCurrency(project.budget)}</span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="w-full"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleBookmark(project.id)
              }}
            >
              <Bookmark className="h-3 w-3 mr-1" />
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
})

ProjectCard.displayName = "ProjectCard"

export default ProjectCard
