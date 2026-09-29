import type { Project } from "@/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn, formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"

interface MoneyFlowProps {
  project: Project
  className?: string
}

type Stage = {
  label: string
  amount: number
  percentage: number
  color: string
  bg: string
}

const MoneyFlow = function MoneyFlow({ project, className }: MoneyFlowProps) {
  const totalAllocation = project.treasuryAllocation
  const totalDisbursement = project.treasuryDisbursement
  const totalExpenditure = project.expenditure
  const remaining = project.remainingBalance

  const stages: Stage[] = [
    {
      label: "Expenditure",
      amount: totalExpenditure,
      percentage: totalAllocation > 0 ? (totalExpenditure / totalAllocation) * 100 : 0,
      color: "text-green-600",
      bg: "bg-green-500",
    },
    {
      label: "Disbursement",
      amount: totalDisbursement,
      percentage: totalAllocation > 0 ? (totalDisbursement / totalAllocation) * 100 : 0,
      color: "text-blue-600",
      bg: "bg-blue-500",
    },
    {
      label: "Allocated",
      amount: totalAllocation,
      percentage: 100,
      color: "text-kenya-red",
      bg: "bg-kenya-red",
    },
  ]

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-sm">Money Flow</CardTitle>
        <CardDescription className="text-xs text-kenya-black/60">
          {project.code} — Treasury allocation through to actual expenditure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{stage.label}</span>
                <span className="text-sm font-medium">
                  {formatCurrency(stage.amount)}
                  <span className="text-kenya-black/50">
                    {" "}
                    · {stage.percentage.toFixed(1)}% of allocation
                  </span>
                </span>
              </div>
              <Progress value={Math.min(stage.percentage, 100)} className="h-3">
                <div
                  className={cn("h-full", stage.bg)}
                  style={{ width: `${Math.min(stage.percentage, 100)}%` }}
                />
              </Progress>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 text-center md:grid-cols-4">
          {[
            { label: "Allocation", value: totalAllocation, color: "text-kenya-red" },
            { label: "Disbursed", value: totalDisbursement, color: "text-blue-600" },
            { label: "Spent", value: totalExpenditure, color: "text-green-600" },
            { label: "Remaining", value: remaining, color: "text-gray-600" },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="text-xs text-kenya-black/60">{item.label}</p>
              <p className={cn("text-sm font-bold", item.color)}>
                {formatCurrency(item.value)}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Badge variant={totalExpenditure > totalDisbursement ? "danger" : "success"}>
            {totalExpenditure > totalDisbursement
              ? "Over expenditure detected"
              : "Within budget"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default MoneyFlow
