import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import type { Project } from "@/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { cn, formatCurrency } from "@/lib/utils"

interface BudgetChartProps {
  project: Project
  className?: string
}

type BudgetData = {
  name: string
  value: number
  fill: string
}

const BudgetChart = function BudgetChart({ project, className }: BudgetChartProps) {
  const data: BudgetData[] = [
    { name: "Allocated", value: project.treasuryAllocation, fill: "#DC2626" },
    { name: "Disbursed", value: project.treasuryDisbursement, fill: "#2563EB" },
    { name: "Expenditure", value: project.expenditure, fill: "#16A34A" },
  ]

  const customTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload as BudgetData
    return (
      <div className="rounded-md border bg-white px-2.5 py-1.5 text-xs shadow">
        <p className="font-medium">{d.name}</p>
        <p className="text-gray-600">{formatCurrency(d.value)}</p>
      </div>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-sm">Budget Breakdown</CardTitle>
        <CardDescription className="text-xs text-kenya-black/60">
          {project.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
            <Tooltip content={customTooltip} />
            <Legend />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default BudgetChart
