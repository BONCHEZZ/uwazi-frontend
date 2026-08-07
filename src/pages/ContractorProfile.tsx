import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  MapPin,
  ClipboardCheck,
  TrendingUp,
  ExternalLink,
  Mail,
  Phone,
  Briefcase,
  Landmark,
  AlertTriangle,
  Gavel,
  CheckCircle,
  ShieldAlert,
  FileSearch,
  Users,
  Clock,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn, formatCurrency } from "@/lib/utils"

function ContractorProfile() {
  const { id } = useParams<{ id: string }>()

  const { data: contractor, isLoading: contractorLoading } = useQuery({
    queryKey: ["contractor", id],
    queryFn: () => (id ? api.getContractor(id) : Promise.resolve(undefined)),
    staleTime: 60000,
  })

  const { data: allProjects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.getProjects(),
  })

  const contractorProjects = allProjects.filter((p) => p.contractorId === id)

  if (contractorLoading || !contractor) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  const riskColor = {
    low: "text-green-600 bg-green-50",
    medium: "text-amber-600 bg-amber-50",
    high: "text-red-600 bg-red-50",
  }

  const metrics = [
    { label: "Completed Projects", value: contractor.completedProjects, icon: ClipboardCheck },
    { label: "Active Projects", value: contractor.ongoingProjects, icon: TrendingUp },
    { label: "Delayed Projects", value: contractor.delayedProjects, icon: Clock },
    { label: "Years in Business", value: contractor.yearsInBusiness, icon: Briefcase },
    { label: "Budget Managed", value: formatCurrency(contractor.budgetManaged), icon: Landmark },
    { label: "Performance Rating", value: `${contractor.rating}/5`, icon: Star },
    { label: "Citizen Rating", value: `${contractor.citizenRating}/5`, icon: Users },
    { label: "Inspection Reports", value: contractor.inspectionReports, icon: FileSearch },
  ]

  return (
    <div className="min-h-screen bg-kenya-gray py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-kenya-black">Contractor Profile</h1>
          <Button variant="outline" size="sm" asChild>
            <a href={`/contractor/${contractor.id}/contracts`}>
              <ExternalLink className="h-4 w-4 mr-1" />
              View Contracts
            </a>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?u=${contractor.id}`}
                    alt={contractor.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {contractor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-xl font-bold">{contractor.name}</h2>
                    <Badge variant="secondary" className="text-xs">
                      {contractor.category}
                    </Badge>
                    {contractor.blacklisted && (
                      <Badge variant="danger" className="text-xs">
                        <ShieldAlert className="h-3 w-3 mr-1" />
                        Blacklisted
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-kenya-black/60 mb-2">
                    {contractor.description}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(contractor.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                    <span className="text-xs text-kenya-black/60">
                      ({contractor.rating}/5)
                    </span>
                    <span className="text-xs text-kenya-black/40 ml-2">
                      Registration: {contractor.registrationNumber}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-kenya-black/60">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{contractor.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>{contractor.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{contractor.phone}</span>
                    </div>
                    <Badge className={riskColor[contractor.riskLevel]}>
                      {contractor.riskLevel} risk
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          {metrics.map((m) => (
            <Card key={m.label}>
              <CardContent className="pt-4 text-center">
                <m.icon className="mx-auto mb-1 h-5 w-5 text-kenya-red" />
                <p className="text-2xl font-bold text-kenya-black">{m.value}</p>
                <p className="text-xs text-kenya-black/60">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-kenya-green" />
                Performance Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-kenya-black/60">Completion Rate</span>
                  <span className="font-semibold">{contractor.completionRate}%</span>
                </div>
                <Progress value={contractor.completionRate} className="h-2" indicatorClassName="bg-kenya-green" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-kenya-black/60">Performance Rating</span>
                  <span className="font-semibold">{contractor.rating}/5</span>
                </div>
                <Progress value={(contractor.rating / 5) * 100} className="h-2" indicatorClassName="bg-kenya-red" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-kenya-black/60">Citizen Rating</span>
                  <span className="font-semibold">{contractor.citizenRating}/5</span>
                </div>
                <Progress value={(contractor.citizenRating / 5) * 100} className="h-2" indicatorClassName="bg-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Compliance & Risk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-kenya-black/60">Blacklist History</span>
                <Badge variant={contractor.blacklistHistory ? "danger" : "success"}>
                  {contractor.blacklistHistory ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-kenya-black/60">Court Cases</span>
                <Badge variant={contractor.courtCases > 0 ? "warning" : "success"}>
                  {contractor.courtCases}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-kenya-black/60">Delayed Projects</span>
                <Badge variant={contractor.delayedProjects > 3 ? "danger" : "warning"}>
                  {contractor.delayedProjects}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-kenya-black/60">Inspection Reports</span>
                <span className="font-semibold">{contractor.inspectionReports}</span>
              </div>
              <div className="border-t border-kenya-border pt-3 flex items-center gap-2 text-xs text-kenya-black/60">
                <Gavel className="h-4 w-4" />
                Court cases are shown only where publicly available.
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Projects by {contractor.name}</CardTitle>
            <CardDescription className="text-xs text-kenya-black/60">
              {contractorProjects.length} projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contractorProjects.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-8">
                No projects found for this contractor.
              </p>
            ) : (
              <div className="space-y-3">
                {contractorProjects.map((proj) => (
                  <motion.div
                    key={proj.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between rounded-lg border border-kenya-border p-3"
                  >
                    <div className="space-y-1">
                      <a
                        href={`/project/${proj.id}`}
                        className="font-medium text-sm hover:text-kenya-red"
                      >
                        {proj.title}
                      </a>
                      <p className="text-xs text-kenya-black/60">
                        {proj.county} · {proj.category}
                      </p>
                      <div className="mt-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{proj.progress}%</span>
                        </div>
                        <div className="h-1.5 w-24 rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-kenya-red"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        proj.status === "completed"
                          ? "success"
                          : proj.status === "construction"
                          ? "default"
                          : "warning"
                      }
                    >
                      {proj.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ContractorProfile
