import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import Sidebar from "@/components/layout/sidebar"
import StatsCard from "@/components/dashboard/StatsCard"
import ChartCard from "@/components/dashboard/ChartCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
  FileText,
  Download,
  Plus,
  BarChart3,
  Shield,
  Eye,
  UserCheck,
  ClipboardList,
  Calendar,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts"

function OversightDashboard() {
  const { data: riskData = [] } = useQuery({
    queryKey: ["riskIndicators"],
    queryFn: api.getRiskIndicators,
  })

  const { data: auditData = [] } = useQuery({
    queryKey: ["auditChecklist"],
    queryFn: api.getAuditChecklist,
  })

  const { data: verificationData = [] } = useQuery({
    queryKey: ["verificationQueue"],
    queryFn: api.getVerificationQueue,
  })

  const { data: contractData = [] } = useQuery({
    queryKey: ["contractMonitoring"],
    queryFn: api.getContractMonitoring,
  })

  const { data: fraudData = [] } = useQuery({
    queryKey: ["fraudIndicators"],
    queryFn: api.getFraudIndicators,
  })

  const { data: inspectionData = [] } = useQuery({
    queryKey: ["inspectionSchedules"],
    queryFn: api.getInspectionSchedules,
  })

  const { data: reportsData = [] } = useQuery({
    queryKey: ["reports"],
    queryFn: api.getReports,
  })

  const { data: _allProjects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.getProjects(),
  })

  const highRiskCount = riskData.filter((r) => r.level === "high").length
  const mediumRiskCount = riskData.filter((r) => r.level === "medium").length
  const lowRiskCount = riskData.filter((r) => r.level === "low").length

  const auditComplete = auditData.filter((a) => a.status === "complete").length

  const fraudCritical = fraudData.filter((f) => f.severity === "critical").length
  const fraudHigh = fraudData.filter((f) => f.severity === "high").length

  const riskChartData = [
    { name: "Week 1", risks: 3, resolved: 1 },
    { name: "Week 2", risks: 5, resolved: 2 },
    { name: "Week 3", risks: 4, resolved: 3 },
    { name: "Week 4", risks: 6, resolved: 2 },
    { name: "Week 5", risks: 3, resolved: 4 },
    { name: "Week 6", risks: 2, resolved: 3 },
  ]

  const verificationChartData = [
    { name: "Pending", value: verificationData.filter((v) => v.status === "pending").length, color: "#DE2910" },
    { name: "In Review", value: verificationData.filter((v) => v.status === "review").length, color: "#f59e0b" },
    { name: "Verified", count: verificationData.filter((v) => v.status === "verified").length, color: "#16a34a" },
    { name: "Rejected", count: verificationData.filter((v) => v.status === "rejected").length, color: "#6b7280" },
  ]

  return (
    <div className="flex min-h-screen bg-kenya-gray">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-kenya-black">Oversight Dashboard</h1>
              <p className="text-sm text-kenya-black/60 mt-1">Risk monitoring, audit, and compliance oversight</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Reports
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Audit
              </Button>
            </div>
          </div>

          {/* Risk Overview KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="High Risk Projects"
              value={highRiskCount}
              change="Requires immediate attention"
              icon={AlertTriangle}
              trend="down"
              colorVariant="red"
            />
            <StatsCard
              title="Medium Risk"
              value={mediumRiskCount}
              change="Under monitoring"
              icon={Flag}
              trend="neutral"
              colorVariant="amber"
            />
            <StatsCard
              title="Low Risk"
              value={lowRiskCount}
              change="All clear"
              icon={CheckCircle}
              trend="up"
              colorVariant="green"
            />
            <StatsCard
              title="Fraud Alerts"
              value={fraudCritical + fraudHigh}
              change={`${fraudCritical} critical`}
              icon={Shield}
              trend={fraudCritical > 0 ? "down" : "up"}
              colorVariant="red"
            />
          </div>

          {/* Risk Monitoring Dashboard */}
          <section>
            <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-kenya-red" />
              Risk Monitoring
            </h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ChartCard title="Risk Trends" description="Weekly risk indicators over time">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="risks" stroke="#DE2910" name="New Risks" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="resolved" stroke="#16a34a" name="Resolved" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Risk Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {riskData.map((risk) => (
                    <div key={risk.id} className="flex items-start gap-3 p-3 rounded-lg border border-kenya-border hover:bg-kenya-gray/20 transition-colors">
                      <div className={cn(
                        "h-3 w-3 rounded-full mt-1.5 shrink-0",
                        risk.level === "high" ? "bg-red-500" : risk.level === "medium" ? "bg-amber-500" : "bg-green-500"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-kenya-black truncate">{risk.project}</p>
                          <Badge variant={risk.level === "high" ? "danger" : risk.level === "medium" ? "warning" : "success"} className="text-[10px]">
                            {risk.level}
                          </Badge>
                        </div>
                        <p className="text-xs text-kenya-black/60 mt-1">{risk.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={risk.score} className="h-1.5 flex-1" />
                          <span className="text-xs font-medium text-kenya-black/50">{risk.score}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Audit Preparation Checklist */}
          <section>
            <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-kenya-red" />
              Audit Preparation Checklist
            </h2>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Progress value={(auditComplete / auditData.length) * 100} className="w-32 h-2" />
                    <span className="text-xs text-kenya-black/60">
                      {auditComplete} of {auditData.length} complete
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {auditData.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-kenya-border hover:bg-kenya-gray/20 transition-colors">
                      <Checkbox checked={item.status === "complete"} className="data-[state=checked]:bg-kenya-red data-[state=checked]:border-kenya-red" />
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm",
                          item.status === "complete" ? "text-kenya-black/70 line-through" : "text-kenya-black font-medium"
                        )}>
                          {item.item}
                        </p>
                        <p className="text-xs text-kenya-black/50">
                          {item.assignedTo} · Due: {item.dueDate}
                        </p>
                      </div>
                      <Badge
                        variant={
                          item.status === "complete" ? "success" : item.status === "in-progress" ? "default" : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {item.status.replace("-", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Project Verification Queue */}
          <section>
            <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-kenya-red" />
              Project Verification Queue
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-kenya-border bg-kenya-gray/50">
                        <th className="text-left px-4 py-3 font-medium text-kenya-black/70">Project</th>
                        <th className="text-left px-4 py-3 font-medium text-kenya-black/70">Type</th>
                        <th className="text-left px-4 py-3 font-medium text-kenya-black/70">Submitted By</th>
                        <th className="text-left px-4 py-3 font-medium text-kenya-black/70">Date</th>
                        <th className="text-left px-4 py-3 font-medium text-kenya-black/70">Priority</th>
                        <th className="text-left px-4 py-3 font-medium text-kenya-black/70">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-kenya-black/70">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-kenya-border">
                      {verificationData.map((item) => (
                        <tr key={item.id} className="hover:bg-kenya-gray/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-kenya-black">{item.project}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">{item.type}</Badge>
                          </td>
                          <td className="px-4 py-3 text-kenya-black/60">{item.submittedBy}</td>
                          <td className="px-4 py-3 text-kenya-black/50 text-xs">
                            {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={item.priority === "high" ? "danger" : item.priority === "medium" ? "warning" : "secondary"} className="text-[10px]">
                              {item.priority}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={item.status === "pending" ? "default" : item.status === "review" ? "warning" : "success"} className="text-[10px]">
                              {item.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Citizen Submissions Review */}
          <section>
            <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-kenya-red" />
              Citizen Submissions Review
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {verificationData.slice(0, 3).map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-kenya-red/10 text-kenya-red">
                          {item.submittedBy.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-kenya-black">{item.submittedBy}</p>
                        <p className="text-xs text-kenya-black/50">{item.type} submission</p>
                      </div>
                    </div>
                    <p className="text-sm text-kenya-black/70 mb-3">{item.project}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant={item.status === "pending" ? "default" : item.status === "review" ? "warning" : "success"} className="text-[10px]">
                        {item.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Contract Monitoring & Fraud Indicators */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Contract Monitoring */}
            <section>
              <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-kenya-red" />
                Contract Monitoring
              </h2>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-kenya-border bg-kenya-gray/50">
                          <th className="text-left px-3 py-2 font-medium text-kenya-black/70">Contractor</th>
                          <th className="text-left px-3 py-2 font-medium text-kenya-black/70">Project</th>
                          <th className="text-left px-3 py-2 font-medium text-kenya-black/70">Progress</th>
                          <th className="text-left px-3 py-2 font-medium text-kenya-black/70">On Track</th>
                          <th className="text-left px-3 py-2 font-medium text-kenya-black/70">Risk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-kenya-border">
                        {contractData.map((contract) => (
                          <tr key={contract.id} className="hover:bg-kenya-gray/30 transition-colors">
                            <td className="px-3 py-2 font-medium text-kenya-black text-xs">{contract.contractor}</td>
                            <td className="px-3 py-2 text-kenya-black/60 text-xs truncate max-w-[120px]">{contract.project}</td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-1">
                                <Progress value={contract.progress} className="w-12 h-1.5" />
                                <span className="text-[10px]">{contract.progress}%</span>
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              {contract.onSchedule ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                              )}
                            </td>
                            <td className="px-3 py-2">
                              <Badge variant={contract.riskLevel === "high" ? "danger" : contract.riskLevel === "medium" ? "warning" : "success"} className="text-[10px]">
                                {contract.riskLevel}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Fraud Indicators */}
            <section>
              <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-kenya-red" />
                Fraud Indicators
              </h2>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-kenya-border">
                    {fraudData.map((indicator) => (
                      <div key={indicator.id} className="p-3 hover:bg-kenya-gray/20 transition-colors">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={indicator.severity === "critical" ? "danger" : indicator.severity === "high" ? "warning" : indicator.severity === "medium" ? "default" : "secondary"} className="text-[10px]">
                              {indicator.severity}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">{indicator.type}</Badge>
                          </div>
                          <Badge variant={indicator.status === "flagged" ? "danger" : indicator.status === "investigating" ? "warning" : "secondary"} className="text-[10px]">
                            {indicator.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-kenya-black">{indicator.project}</p>
                        <p className="text-xs text-kenya-black/60">{indicator.description}</p>
                        <p className="text-xs text-kenya-black/40 mt-1">
                          {formatDistanceToNow(new Date(indicator.date), { addSuffix: true })}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Inspection Schedules & Analytics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Inspection Schedules */}
            <section>
              <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-kenya-red" />
                Inspection Schedules
              </h2>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-kenya-border">
                    {inspectionData.map((inspection) => (
                      <div key={inspection.id} className="flex items-center gap-3 p-3 hover:bg-kenya-gray/20 transition-colors">
                        <div className={cn(
                          "h-2 w-2 rounded-full shrink-0",
                          inspection.status === "scheduled" ? "bg-kenya-red" : inspection.status === "pending" ? "bg-amber-500" : "bg-green-500"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-kenya-black truncate">{inspection.project}</p>
                          <p className="text-xs text-kenya-black/50">
                            {inspection.inspector} · {inspection.type}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-medium text-kenya-black">
                            {format(new Date(inspection.date), "MMM d, yyyy")}
                          </p>
                          <Badge variant={inspection.status === "scheduled" ? "default" : "secondary"} className="text-[10px]">
                            {inspection.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Analytics Charts */}
            <section>
              <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-kenya-red" />
                Analytics
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <ChartCard title="Verification Status" description="Distribution of verification results">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={verificationChartData}
                           dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          labelLine={false}
                           label={({ name, value }: { name?: string; value: number }) => `${name || ''}: ${value}`}
                        >
                          {verificationChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard title="Project Progress Trend" description="Monthly progress across active projects">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { month: "Jan", progress: 35 },
                        { month: "Feb", progress: 42 },
                        { month: "Mar", progress: 48 },
                        { month: "Apr", progress: 55 },
                        { month: "May", progress: 62 },
                        { month: "Jun", progress: 68 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="progress" stroke="#DE2910" fill="#DE2910" fillOpacity={0.1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>
            </section>
          </div>

          {/* Reports Generation */}
          <section>
            <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-kenya-red" />
              Reports
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-kenya-border">
                  {reportsData.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 hover:bg-kenya-gray/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-kenya-gray flex items-center justify-center">
                          <FileText className="h-5 w-5 text-kenya-red" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-kenya-black">{report.title}</p>
                          <p className="text-xs text-kenya-black/50">
                            {report.type} · {report.generatedBy} · {report.format}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={report.status === "published" ? "success" : "secondary"} className="text-[10px]">
                          {report.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
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

export default OversightDashboard