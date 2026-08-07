import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import Sidebar from "@/components/layout/sidebar"
import StatsCard from "@/components/dashboard/StatsCard"
import ChartCard from "@/components/dashboard/ChartCard"
import { DataTable } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  FileText,
  Bell,
  Calendar,
  Download,
  Plus,
  Save,
  Send,
  Flag,
  DollarSign,
  Package,
  ClipboardList,
} from "lucide-react"
import { cn, formatCurrency, formatPercent } from "@/lib/utils"
import { useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts"

function GovernmentDashboard() {
  const { data: _stats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: api.getDashboardStats,
  })

  const { data: budgetData = [] } = useQuery({
    queryKey: ["budgetSummaries"],
    queryFn: api.getBudgetSummaries,
  })

  const { data: allProjects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.getProjects(),
  })

  const [milestoneTitle, setMilestoneTitle] = useState("")
  const [milestoneDate, setMilestoneDate] = useState("")
  const [milestoneDesc, setMilestoneDesc] = useState("")
  const [selectedProject, setSelectedProject] = useState("")

  const totalBudget = budgetData.reduce((sum, b) => sum + b.allocated, 0)
  const totalDisbursed = budgetData.reduce((sum, b) => sum + b.disbursed, 0)
  const totalExpenditure = budgetData.reduce((sum, b) => sum + b.expenditure, 0)
  const totalRemaining = budgetData.reduce((sum, b) => sum + b.remaining, 0)

  const activeProjects = allProjects.filter((p) => p.status === "construction")
  const completedProjects = allProjects.filter((p) => p.status === "completed")
  const highRiskProjects = allProjects.filter((p) => p.riskLevel === "high")

  return (
    <div className="flex min-h-screen bg-kenya-gray">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-kenya-black">Government Dashboard</h1>
              <p className="text-sm text-kenya-black/60 mt-1">Performance overview and project management</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Budget"
              value={formatCurrency(totalBudget)}
              change={`${formatPercent((totalDisbursed / totalBudget) * 100)} disbursed`}
              icon={DollarSign}
              trend="up"
              colorVariant="blue"
            />
            <StatsCard
              title="Active Projects"
              value={activeProjects.length}
              change={`${completedProjects.length} completed`}
              icon={Package}
              trend="up"
              colorVariant="green"
            />
            <StatsCard
              title="Total Expenditure"
              value={formatCurrency(totalExpenditure)}
              change={`${formatCurrency(totalRemaining)} remaining`}
              icon={TrendingUp}
              trend="neutral"
              colorVariant="amber"
            />
            <StatsCard
              title="High Risk Projects"
              value={highRiskProjects.length}
              change="Requires attention"
              icon={Flag}
              trend={highRiskProjects.length > 0 ? "down" : "neutral"}
              colorVariant="red"
            />
          </div>

          {/* Project Management Table */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-kenya-black flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-kenya-red" />
                Project Management
              </h2>
            </div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <DataTable
                  columns={[
                    {
                      header: "Project",
                      accessorKey: "title",
                      cell: (row: any) => (
                        <div>
                          <div className="font-medium text-kenya-black">{row.title}</div>
                          <div className="text-xs text-kenya-black/50">{row.county}</div>
                        </div>
                      ),
                    },
                    {
                      header: "Code",
                      accessorKey: "code",
                      cell: (row: any) => (
                        <span className="text-kenya-black/60 font-mono text-xs">{row.code}</span>
                      ),
                    },
                    {
                      header: "Status",
                      accessorKey: "status",
                      cell: (row: any) => {
                        const status = row.status
                        return (
                          <Badge
                            variant={
                              status === "completed"
                                ? "success"
                                : status === "construction"
                                ? "default"
                                : status === "planning"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {status}
                          </Badge>
                        )
                      },
                    },
                    {
                      accessorKey: "progress",
                      header: "Progress",
                      cell: (row: any) => {
                        const progress = row.progress
                        return (
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="w-16 h-2" />
                            <span className="text-xs font-medium">{progress}%</span>
                          </div>
                        )
                      },
                    },
                    {
                      accessorKey: "budget",
                      header: "Budget",
                      cell: (row: any) => (
                        <span className="text-sm">{formatCurrency(row.budget)}</span>
                      ),
                    },
                    {
                      accessorKey: "riskLevel",
                      header: "Risk",
                      cell: (row: any) => {
                        const risk = row.riskLevel
                        return (
                          <Badge
                            variant={
                              risk === "high"
                                ? "danger"
                                : risk === "medium"
                                ? "warning"
                                : "success"
                            }
                          >
                            {risk}
                          </Badge>
                        )
                      },
                    },
                     {
                       id: "actions",
                       accessorKey: "id",
                       header: "Actions",
                       cell: (row: any) => (
                         <Button variant="ghost" size="sm" asChild>
                           <a href={`/project/${row.id}`}>View</a>
                         </Button>
                       ),
                     },
                  ]}
                  data={allProjects}
                  filterPlaceholder="Search projects..."
                  filterKey="title"
                />
              </CardContent>
            </Card>
          </section>

          {/* Budget Summaries with Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard title="Budget Summary" description="Allocation vs expenditure by category">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis tickFormatter={(v) => `${(v / 1e9).toFixed(0)}B`} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="allocated" fill="#111c2d" name="Allocated" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="disbursed" fill="#DE2910" name="Disbursed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenditure" fill="#16a34a" name="Expenditure" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Budget Breakdown" description="Distribution by category">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      dataKey="allocated"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {budgetData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={["#111c2d", "#DE2910", "#16a34a", "#F0F5F9", "#3b82f6", "#f59e0b"][index % 6]} />
                       ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Document Management & Milestone Update */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Document Management */}
            <section>
              <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-kenya-red" />
                Document Management
              </h2>
              <Card>
                <CardContent className="p-4 space-y-3">
                  {allProjects.slice(0, 4).map((project) => (
                    <div key={project.id} className="flex items-center justify-between py-2 border-b border-kenya-border last:border-0">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-kenya-red/60" />
                        <div>
                          <p className="text-sm font-medium text-kenya-black">{project.title}</p>
                          <p className="text-xs text-kenya-black/50">{project.documents.length} documents</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Milestone Update Form */}
            <section>
              <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-kenya-red" />
                Milestone Update
              </h2>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="milestone-project">Project</Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {allProjects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="milestone-title">Milestone Title</Label>
                    <Input
                      id="milestone-title"
                      placeholder="e.g., Phase 1 Completion"
                      value={milestoneTitle}
                      onChange={(e) => setMilestoneTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="milestone-date">Target Date</Label>
                    <Input
                      id="milestone-date"
                      type="date"
                      value={milestoneDate}
                      onChange={(e) => setMilestoneDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="milestone-desc">Description</Label>
                    <Textarea
                      id="milestone-desc"
                      placeholder="Describe the milestone..."
                      value={milestoneDesc}
                      onChange={(e) => setMilestoneDesc(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => { setMilestoneTitle(""); setMilestoneDate(""); setMilestoneDesc(""); setSelectedProject("") }}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Milestone
                    </Button>
                    <Button variant="outline">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Progress Reporting */}
          <section>
            <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-kenya-red" />
              Progress Reporting
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {allProjects.slice(0, 3).map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-kenya-black/60">Overall Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-3" />
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-kenya-black/50">Budget:</span>{" "}
                          <span className="font-medium">{formatCurrency(project.budget)}</span>
                        </div>
                        <div>
                          <span className="text-kenya-black/50">Spent:</span>{" "}
                          <span className="font-medium">{formatCurrency(project.expenditure)}</span>
                        </div>
                        <div>
                          <span className="text-kenya-black/50">Verification:</span>{" "}
                          <span className="font-medium">{project.verificationScore}/100</span>
                        </div>
                        <div>
                          <span className="text-kenya-black/50">Risk:</span>{" "}
                          <Badge variant={project.riskLevel === "high" ? "danger" : project.riskLevel === "medium" ? "warning" : "success"} className="text-[10px]">
                            {project.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-kenya-red" />
              Notifications
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-kenya-border">
                  {[
                    { title: "Budget Alert", message: "Nairobi-Mombasa Expressway budget utilization at 85%", time: "2 hours ago", read: false },
                    { title: "Milestone Complete", message: "Phase 1 of Kisumu Hospital Upgrade completed", time: "1 day ago", read: false },
                    { title: "Document Uploaded", message: "New EIA report for Mombasa Port Modernization", time: "2 days ago", read: true },
                    { title: "Contractor Update", message: "Wabtec Construction submitted monthly report", time: "3 days ago", read: true },
                  ].map((notif, i) => (
                    <div key={i} className={cn("flex items-start gap-3 p-3", !notif.read && "bg-kenya-gray/30")}>
                      <div className={cn("h-2 w-2 rounded-full mt-2 shrink-0", notif.read ? "bg-gray-300" : "bg-kenya-red")} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-kenya-black">{notif.title}</p>
                        <p className="text-sm text-kenya-black/60">{notif.message}</p>
                        <p className="text-xs text-kenya-black/40 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}

export default GovernmentDashboard