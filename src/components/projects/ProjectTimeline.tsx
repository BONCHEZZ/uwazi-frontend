import type { Milestone } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock, Flag } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface ProjectTimelineProps {
  milestones: Milestone[]
}

const ProjectTimeline = function ProjectTimeline({ milestones }: ProjectTimelineProps) {
  const sorted = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Flag className="h-4 w-4 text-kenya-red" />
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          ref={ref}
          className="relative ml-4 space-y-6 border-l border-dashed border-kenya-border pl-8 pb-2"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {sorted.map((milestone, index) => {
            const isCompleted = milestone.completed
            const isNext = !isCompleted && index === sorted.findIndex((m) => !m.completed)

            return (
              <motion.div
                key={milestone.id}
                variants={itemVariants}
                className="relative"
              >
                <div
                  className={cn(
                    "absolute -left-8 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted
                      ? "border-green-500 bg-green-50 text-green-600 shadow-sm"
                      : isNext
                      ? "border-kenya-red bg-red-50 text-kenya-red shadow-sm shadow-red-100"
                      : "border-gray-300 bg-gray-50 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : isNext ? (
                    <Clock className="h-5 w-5 animate-pulse" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-sm">{milestone.title}</h4>
                    <Badge
                      variant={
                        isCompleted ? "success" : isNext ? "default" : "secondary"
                      }
                      className={cn(
                        "text-xs shrink-0",
                        isCompleted ? "" : isNext ? "border-kenya-red text-kenya-red" : "border-gray-300 text-gray-500"
                      )}
                    >
                      {isCompleted ? "Completed" : isNext ? "In Progress" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-xs text-kenya-black/60 font-medium">
                    {new Date(milestone.date).toLocaleDateString("en-KE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-kenya-black/70 leading-relaxed">
                    {milestone.description}
                  </p>
                  {isNext && (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-kenya-red font-medium">
                      <Clock className="h-3 w-3" />
                      Next milestone
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </CardContent>
    </Card>
  )
}

export default ProjectTimeline
