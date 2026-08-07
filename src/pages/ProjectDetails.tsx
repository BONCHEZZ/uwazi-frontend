import { useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import ImageViewer from "@/components/gallery/ImageViewer"
import VideoPlayer from "@/components/gallery/VideoPlayer"
import ProjectTimeline from "@/components/projects/ProjectTimeline"
import MoneyFlow from "@/components/finance/MoneyFlow"
import BudgetChart from "@/components/finance/BudgetChart"
import CommentSection from "@/components/discussions/CommentSection"
import VerificationStats from "@/components/verification/VerificationStats"
import VerificationForm from "@/components/verification/VerificationForm"
import {
  MapPin,
  Calendar,
  Bookmark,
  Download,
  Share2,
  Building,
  User,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Camera,
  Clock,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn, formatCurrency, formatPercent } from "@/lib/utils"
import { useAppStore } from "@/stores/useAppStore"


const statusColors = {
  planning: "border-amber-500 bg-amber-50 text-amber-700",
  procurement: "border-blue-500 bg-blue-50 text-blue-700",
  construction: "border-kenya-red bg-red-50 text-kenya-red-dark",
  completed: "border-green-500 bg-green-50 text-green-700",
  "on-hold": "border-gray-400 bg-gray-100 text-gray-600",
} as const

const riskColors = {
  low: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-red-100 text-red-700 border-red-200",
} as const

function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const { toggleBookmark, isBookmarked } = useAppStore()
  const bookmarked = id ? isBookmarked(id) : false

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => (id ? api.getProject(id) : Promise.resolve(undefined)),
    staleTime: 60000,
    enabled: !!id,
  })

  const { data: contractor } = useQuery({
    queryKey: ["contractor", project?.contractorId],
    queryFn: () =>
      project?.contractorId ? api.getContractor(project.contractorId) : Promise.resolve(undefined),
    enabled: !!project?.contractorId,
  })

  const { data: relatedProjects = [] } = useQuery({
    queryKey: ["related-projects", project?.county, project?.category],
    queryFn: async () => {
      if (!project) return []
      const all = await api.getProjects()
      return all
        .filter(
          (p) =>
            p.id !== project.id &&
            (p.county === project.county || p.category === project.category)
        )
        .slice(0, 3)
    },
    enabled: !!project,
  })

  const budgetUtilization = useMemo(() => {
    if (!project) return 0
    return project.treasuryAllocation > 0
      ? (project.expenditure / project.treasuryAllocation) * 100
      : 0
  }, [project])

  const disbursementUtilization = useMemo(() => {
    if (!project) return 0
    return project.treasuryDisbursement > 0
      ? (project.expenditure / project.treasuryDisbursement) * 100
      : 0
  }, [project])

  const daysRemaining = useMemo(() => {
    if (!project) return 0
    const expected = new Date(project.expectedCompletion)
    const now = new Date()
    const diff = expected.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }, [project])

  if (projectLoading || !project) {
    return (
      <div className="min-h-screen bg-kenya-gray pb-12">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statusKey = project.status as keyof typeof statusColors
  const riskKey = project.riskLevel as keyof typeof riskColors

  return (
    <div className="min-h-screen bg-kenya-gray pb-12">
      <div className="container mx-auto px-4 py-6">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1 text-xs text-kenya-black/60">
            <li>
              <Link to="/projects" className="hover:text-kenya-red flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Projects
              </Link>
            </li>
            <li>/</li>
            <li className="text-kenya-black font-medium truncate max-w-xs">{project.title}</li>
          </ol>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-kenya-black">{project.title}</h1>
                <Badge className={cn("border text-xs", statusColors[statusKey])} variant="default">
                  {project.status}
                </Badge>
                <Badge className={cn("border text-xs", riskColors[riskKey])} variant="default">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {project.riskLevel} risk
                </Badge>
              </div>
              <p className="text-sm text-kenya-black/60 font-mono">{project.code}</p>
              <p className="text-sm text-kenya-black/80 max-w-3xl">{project.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant={bookmarked ? "default" : "outline"}
                size="sm"
                onClick={() => toggleBookmark(project.id)}
              >
                <Bookmark className="h-4 w-4 mr-1" />
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="mb-6">
          <ImageViewer
            images={project.images}
            alt={project.title}
            className="h-48 sm:h-64 md:h-80"
            thumbnailClassName="h-full"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          {[
            { icon: MapPin, label: "County", value: project.county },
            { icon: MapPin, label: "Constituency", value: project.constituency },
            { icon: MapPin, label: "Ward", value: project.ward },
            { icon: Building, label: "Ministry", value: project.implementingMinistry },
            { icon: User, label: "Contractor", value: contractor?.name ?? "Not assigned" },
            { icon: Calendar, label: "Start Date", value: new Date(project.startDate).toLocaleDateString("en-KE") },
            { icon: Calendar, label: "Expected Completion", value: new Date(project.expectedCompletion).toLocaleDateString("en-KE") },
            { icon: Clock, label: "Days Remaining", value: `${daysRemaining} days` },
            { icon: TrendingUp, label: "Progress", value: `${project.progress}%` },
            { icon: ShieldCheck, label: "Verification", value: `${project.verificationScore}%` },
            { icon: FileText, label: "Category", value: project.category },
            { icon: DollarSign, label: "Budget", value: formatCurrency(project.budget) },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <Card className="h-full">
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-center gap-2 text-xs text-kenya-black/60 mb-1">
                    <item.icon className="h-3 w-3 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <p className="text-sm font-medium truncate" title={item.value}>
                    {item.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Budget Overview</CardTitle>
              <CardDescription>Treasury allocation and utilization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-kenya-black/60">Total Allocation</span>
                  <span className="font-semibold">{formatCurrency(project.treasuryAllocation)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-kenya-black/60">Disbursed</span>
                  <span className="font-semibold">{formatCurrency(project.treasuryDisbursement)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-kenya-black/60">Expenditure</span>
                  <span className="font-semibold">{formatCurrency(project.expenditure)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-kenya-black/60">Remaining</span>
                  <span className="font-semibold text-kenya-green">{formatCurrency(project.remainingBalance)}</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-kenya-black/60">Budget Utilization</span>
                  <span className="font-medium">{formatPercent(budgetUtilization)}</span>
                </div>
                <Progress value={budgetUtilization} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-kenya-black/60">Disbursement Utilization</span>
                  <span className="font-medium">{formatPercent(disbursementUtilization)}</span>
                </div>
                <Progress value={disbursementUtilization} className="h-2" indicatorClassName="bg-kenya-green" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm">Risk & Verification</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-kenya-black/60">Verification Score</span>
                  <span className="font-medium">{project.verificationScore}%</span>
                </div>
                <Progress value={project.verificationScore} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-kenya-black/60">Risk Level</span>
                  <span className={cn("font-medium capitalize px-2 py-0.5 rounded text-xs", riskColors[riskKey])}>
                    {project.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-kenya-black/60">
                  Risk assessment based on contractor history, budget utilization, and verification data.
                </p>
              </div>
            </CardContent>
          </Card>

          {contractor && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Contractor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-medium">{contractor.name}</p>
                <div className="flex items-center justify-between text-xs text-kenya-black/60">
                  <span>Rating</span>
                  <span className="font-medium">{contractor.rating}/5</span>
                </div>
                <Progress value={(contractor.rating / 5) * 100} className="h-1.5" />
                <div className="flex items-center justify-between text-xs text-kenya-black/60">
                  <span>Completed</span>
                  <span className="font-medium">{contractor.completedProjects}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-kenya-black/60">
                  <span>Ongoing</span>
                  <span className="font-medium">{contractor.ongoingProjects}</span>
                </div>
                <p className="text-xs text-kenya-black/60 line-clamp-2">{contractor.description}</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={`/contractor/${contractor.id}`}>
                    View Profile
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="timeline" className="space-y-4 mb-6">
          <TabsList className="overflow-x-auto">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="discussions">Discussions ({project.comments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <ProjectTimeline milestones={project.milestones} />
          </TabsContent>

          <TabsContent value="gallery">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Photos ({project.images.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageViewer images={project.images} alt={project.title} />
                </CardContent>
              </Card>
              {project.videos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Videos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project.videos.map((video, i) => (
                      <div key={i} className="mb-4 last:mb-0">
                        <VideoPlayer src={video} title={project.title} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="finance">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm">Budget Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <MoneyFlow project={project} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <BudgetChart project={project} />
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Treasury Disbursements</CardTitle>
                <CardDescription>Transaction history from National Treasury</CardDescription>
              </CardHeader>
              <CardContent>
                {project.disbursements.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No disbursements recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-kenya-border">
                          <th className="text-left py-2 px-3 text-xs font-medium text-kenya-black/60">Date</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-kenya-black/60">Source</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-kenya-black/60">Purpose</th>
                          <th className="text-right py-2 px-3 text-xs font-medium text-kenya-black/60">Amount</th>
                          <th className="text-center py-2 px-3 text-xs font-medium text-kenya-black/60">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.disbursements.map((d) => (
                          <tr key={d.id} className="border-b border-kenya-border/50 hover:bg-kenya-gray/50">
                            <td className="py-2.5 px-3">
                              {new Date(d.date).toLocaleDateString("en-KE")}
                            </td>
                            <td className="py-2.5 px-3">{d.source}</td>
                            <td className="py-2.5 px-3">{d.purpose}</td>
                            <td className="py-2.5 px-3 text-right font-medium">
                              {formatCurrency(d.amount)}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <Badge
                                variant={
                                  d.status === "released"
                                    ? "success"
                                    : d.status === "approved"
                                    ? "warning"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {d.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Project Documents</CardTitle>
                <CardDescription>
                  {project.documents.length} document{project.documents.length !== 1 ? "s" : ""} available
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.documents.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No documents available.</p>
                ) : (
                  <div className="space-y-2">
                    {project.documents.map((doc, i) => (
                      <a
                        key={i}
                        href={doc.url}
                        className="flex items-center justify-between rounded-lg border border-kenya-border p-3 text-sm hover:bg-kenya-gray transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-kenya-gray">
                            <FileText className="h-5 w-5 text-kenya-black/60" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-kenya-black/60">PDF Document</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates">
            {project.officialUpdates.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-sm text-gray-500">No official updates yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {project.officialUpdates.map((update) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{update.title}</CardTitle>
                          <span className="text-xs text-kenya-black/60">
                            {new Date(update.date).toLocaleDateString("en-KE")}
                          </span>
                        </div>
                        <CardDescription>By {update.author}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-kenya-black/80">{update.content}</p>
                        {update.images.length > 0 && (
                          <div className="mt-3 flex gap-2 overflow-x-auto">
                            {update.images.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt={update.title}
                                className="h-32 w-48 rounded-lg object-cover shrink-0"
                              />
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="verification">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VerificationStats project={project} />
              <VerificationForm project={project} />
            </div>
          </TabsContent>

          <TabsContent value="discussions">
            <CommentSection project={project} />
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm">Key Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-kenya-black/60">Project Engineer</p>
                <p className="text-sm font-medium">{project.projectEngineer}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-kenya-black/60">Consultant</p>
                <p className="text-sm font-medium">{project.consultant}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-kenya-black/60">Funding Source</p>
                <p className="text-sm font-medium">{project.fundingSource}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-kenya-black/60">Project Code</p>
                <p className="text-sm font-medium font-mono">{project.code}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Related Projects</CardTitle>
              <CardDescription>
                Similar projects in {project.county} or {project.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {relatedProjects.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No related projects found.</p>
              ) : (
                <div className="space-y-3">
                  {relatedProjects.map((rp) => (
                    <Link
                      key={rp.id}
                      to={`/project/${rp.id}`}
                      className="block rounded-lg border border-kenya-border p-3 hover:bg-kenya-gray transition-colors"
                    >
                      <p className="text-sm font-medium line-clamp-1">{rp.title}</p>
                      <p className="text-xs text-kenya-black/60 mt-0.5">
                        {rp.county} · {rp.progress}% complete
                      </p>
                      <div className="mt-1.5">
                        <Progress value={rp.progress} className="h-1.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails
