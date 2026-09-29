import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  className?: string
  colorVariant?: "default" | "red" | "green" | "blue" | "amber" | "purple"
}

const colorVariants = {
  default: { bg: "bg-kenya-gray", iconBg: "bg-kenya-red/10", iconColor: "text-kenya-red", valueColor: "text-kenya-black" },
  red: { bg: "bg-red-50", iconBg: "bg-red-100", iconColor: "text-red-600", valueColor: "text-red-700" },
  green: { bg: "bg-green-50", iconBg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700" },
  blue: { bg: "bg-blue-50", iconBg: "bg-blue-100", iconColor: "text-blue-600", valueColor: "text-blue-700" },
  amber: { bg: "bg-amber-50", iconBg: "bg-amber-100", iconColor: "text-amber-600", valueColor: "text-amber-700" },
  purple: { bg: "bg-purple-50", iconBg: "bg-purple-100", iconColor: "text-purple-600", valueColor: "text-purple-700" },
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="inline-block"
    >
      {value.toLocaleString()}
    </motion.span>
  )
}

const StatsCard = function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  trend = "neutral",
  className,
  colorVariant = "default",
}: StatsCardProps) {
  const colors = colorVariants[colorVariant]
  const numericValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ""))
  const isNumeric = !isNaN(numericValue)

  const trendColor = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-500",
  }

  const trendIcon = {
    up: "↑",
    down: "↓",
    neutral: "→",
  }

  return (
    <Card className={cn("", className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-kenya-black/60">{title}</p>
            <div className="flex items-baseline gap-2">
              {isNumeric ? (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className={cn("text-2xl font-bold", colors.valueColor)}
                >
                  {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
                </motion.p>
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className={cn("text-2xl font-bold", colors.valueColor)}
                >
                  {value}
                </motion.p>
              )}
              {change && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className={cn("text-xs font-medium", trendColor[trend])}
                >
                  {trendIcon[trend]} {change}
                </motion.p>
              )}
            </div>
          </div>
          <div className={cn("rounded-full p-2.5", colors.iconBg)}>
            <Icon className={cn("h-5 w-5", colors.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatsCard