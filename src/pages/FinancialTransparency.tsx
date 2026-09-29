import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import type { Project } from "@/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import MoneyFlow from "@/components/finance/MoneyFlow"
import ChartCard from "@/components/dashboard/ChartCard"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  TrendingUp,
  Building,
  Calendar,
  Landmark,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn, formatCurrency } from "@/lib/utils"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"

function FinancialTransparency() {
  const [selectedCounty, setSelectedCounty] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [budgetPage, setBudgetPage] = useState(1)

  const { data: allProjects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => api.getProjects(),
  })

  const {
    data: allCountyBudgetRecords = [],
    isPending: isCountyBudgetPending,
    isError: isCountyBudgetError,
  } = useQuery({
    queryKey: ["countyBudgetRecords", "all"],
    queryFn: () => api.getAllCountyBudgetRecords(),
  })

  // The CBIRR export is small enough to paginate in the browser; every page
  // spans counties rather than being clipped to the tail of the export.
  const BUDGET_PAGE_SIZE = 20
  const tableRows = useMemo(() => {
    const rows = selectedCounty === "all"
      ? allCountyBudgetRecords
      : allCountyBudgetRecords.filter((record) => record.county === selectedCounty)
    return rows
  }, [allCountyBudgetRecords, selectedCounty])

  const totalTablePages = Math.max(1, Math.ceil(tableRows.length / BUDGET_PAGE_SIZE))
  const safeBudgetPage = Math.min(budgetPage, totalTablePages)
  const visibleRows = tableRows.slice(
    (safeBudgetPage - 1) * BUDGET_PAGE_SIZE,
    safeBudgetPage * BUDGET_PAGE_SIZE,
  )

  const filtered = useMemo(() => {
    return allProjects.filter((p) => {
      if (selectedCounty !== "all" && p.county !== selectedCounty) return false
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false
      return true
    })
  }, [allProjects, selectedCounty, selectedCategory])

  const aggregate = useMemo(() => {
    const totalBudget = filtered.reduce((s, p) => s + p.budget, 0)
    const totalAllocation = filtered.reduce((s, p) => s + p.treasuryAllocation, 0)
    const totalDisbursed = filtered.reduce((s, p) => s + p.treasuryDisbursement, 0)
    const totalExpenditure = filtered.reduce((s, p) => s + p.expenditure, 0)

    const byCategory = {} as Record<string, { budget: number; count: number }>
    filtered.forEach((p) => {
      if (!byCategory[p.category]) byCategory[p.category] = { budget: 0, count: 0 }
      byCategory[p.category].budget += p.budget
      byCategory[p.category].count += 1
    })

    const byCounty = {} as Record<string, { budget: number; count: number }>
    filtered.forEach((p) => {
      if (!byCounty[p.county]) byCounty[p.county] = { budget: 0, count: 0 }
      byCounty[p.county].budget += p.budget
      byCounty[p.county].count += 1
    })

    const byStatus = {} as Record<string, number>
    filtered.forEach((p) => {
      byStatus[p.status] = (byStatus[p.status] || 0) + 1
    })

    return {
      totalBudget,
      totalAllocation,
      totalDisbursed,
      totalExpenditure,
      byCategory,
      byCounty,
      byStatus,
    }
  }, [filtered])

  const categoryData = Object.entries(aggregate.byCategory).map(([name, val]) => ({
    name,
    value: val.budget,
    count: val.count,
  }))

  const statusData = Object.entries(aggregate.byStatus).map(([name, value]) => ({
    name,
    value,
    fill: statusColors[name as Project["status"]],
  }))

  const financialMetrics = [
    { label: "Total Budget", value: formatCurrency(aggregate.totalBudget), icon: Landmark, color: "text-kenya-red" },
    { label: "Treasury Allocation", value: formatCurrency(aggregate.totalAllocation), icon: Building, color: "text-blue-600" },
    { label: "Total Disbursed", value: formatCurrency(aggregate.totalDisbursed), icon: Calendar, color: "text-amber-600" },
    { label: "Total Expenditure", value: formatCurrency(aggregate.totalExpenditure), icon: TrendingUp, color: "text-green-600" },
  ]

  return (
    <div className="min-h-screen bg-kenya-gray py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kenya-black">Financial Transparency</h1>
            <p className="text-sm text-kenya-black/60">
              Track public funds across all infrastructure projects
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="County" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {Array.from(new Set(allProjects.map((p) => p.county))).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.from(new Set(allProjects.map((p) => p.category))).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4"
        >
          {financialMetrics.map((m) => (
            <Card key={m.label}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-xs text-kenya-black/60 mb-1">
                  <m.icon className={cn("h-3 w-3", m.color)} />
                  <span>{m.label}</span>
                </div>
                <p className="text-lg font-bold text-kenya-black">{m.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Budget by Category"
            description="Total project budgets across sectors"
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="value" fill="#DC2626" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Projects by Status"
            description="Count of projects by current status"
          >
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    fontSize: "11px",
                  }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" height={36} />
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {statusData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="lg:col-span-2">
            <MoneyFlow project={allProjects[0]} />
          </div>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm">County Budget Implementation</CardTitle>
              <CardDescription className="text-xs text-kenya-black/60">
                County Governments Budget Implementation Review Report records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCountyBudgetPending ? (
                <p className="py-6 text-center text-sm text-kenya-black/60">Loading county budget records...</p>
              ) : isCountyBudgetError ? (
                <p className="py-6 text-center text-sm text-red-600">Unable to load county budget records.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-xs">
                      <thead className="border-b text-kenya-black/60">
                        <tr>
                          <th className="px-2 py-2 font-medium">County</th>
                          <th className="px-2 py-2 font-medium">Report period</th>
                          <th className="px-2 py-2 font-medium">Classification</th>
                          <th className="px-2 py-2 text-right font-medium">Assembly approved</th>
                          <th className="px-2 py-2 text-right font-medium">Assembly spent</th>
                          <th className="px-2 py-2 text-right font-medium">Executive approved</th>
                          <th className="px-2 py-2 text-right font-medium">Executive spent</th>
                          <th className="px-2 py-2 text-right font-medium">Absorption</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRows.map((record) => (
                          <tr key={record.id} className="border-b last:border-0">
                            <td className="px-2 py-2 font-medium">{record.county}</td>
                            <td className="px-2 py-2">{record.fiscalYear} {record.period}</td>
                            <td className="px-2 py-2">{record.classification}</td>
                            <td className="px-2 py-2 text-right">{record.approvedBudgetAssembly === null ? "—" : formatCurrency(record.approvedBudgetAssembly)}</td>
                            <td className="px-2 py-2 text-right">{record.expenditureAssembly === null ? "—" : formatCurrency(record.expenditureAssembly)}</td>
                            <td className="px-2 py-2 text-right">{record.approvedBudgetExecutive === null ? "—" : formatCurrency(record.approvedBudgetExecutive)}</td>
                            <td className="px-2 py-2 text-right">{record.expenditureExecutive === null ? "—" : formatCurrency(record.expenditureExecutive)}</td>
                            <td className="px-2 py-2 text-right">
                              Assembly {record.absorptionAssembly === null ? "—" : `${record.absorptionAssembly}%`}
                              <br />
                              Executive {record.absorptionExecutive === null ? "—" : `${record.absorptionExecutive}%`}
                            </td>
                          </tr>
                        ))}
                        {visibleRows.length === 0 && (
                          <tr>
                            <td colSpan={8} className="px-2 py-6 text-center text-kenya-black/60">
                              No county budget records match the current filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xs text-kenya-black/60">
                      Page {safeBudgetPage} of {totalTablePages}
                      {tableRows.length > 0 ? ` · ${tableRows.length} records` : ""}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled={safeBudgetPage <= 1} onClick={() => setBudgetPage((page) => page - 1)}>
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={safeBudgetPage >= totalTablePages}
                        onClick={() => setBudgetPage((page) => page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm">Top Projects by Budget</CardTitle>
              <CardDescription className="text-xs text-kenya-black/60">
                Largest infrastructure projects by allocated budget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...filtered]
                  .sort((a, b) => b.budget - a.budget)
                  .slice(0, 5)
                  .map((proj) => (
                    <div
                      key={proj.id}
                      className="flex items-center justify-between rounded-md border border-kenya-border p-3"
                    >
                      <div>
                        <p className="font-medium text-sm">{proj.title}</p>
                        <p className="text-xs text-kenya-black/60">
                          {proj.county} · {proj.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(proj.budget)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(proj.progress)}% complete
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const statusColors: Record<string, string> = {
  planning: "#F59E0B",
  procurement: "#F59E0B",
  construction: "#DC2626",
  completed: "#16A34A",
  "on-hold": "#6B7280",
}

export default FinancialTransparency
