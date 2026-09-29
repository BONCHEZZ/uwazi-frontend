import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import Sidebar from "@/components/layout/sidebar"
import StatsCard from "@/components/dashboard/StatsCard"
import RecentActivity from "@/components/dashboard/RecentActivity"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  FolderOpen,
  MessageSquare,
  Upload,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  Activity,
  Flag,
} from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import type { Notification, User } from "@/types"

function CitizenDashboard() {
  const emptyUser: User = { id: "", name: "UWAZI User", email: "", role: "citizen", avatar: "", notifications: [], bookmarks: [], comments: [], uploads: [] }
  const { data: user = emptyUser } = useQuery({
    queryKey: ["user"],
    queryFn: api.getUser,
  })

  const { data: stats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: api.getDashboardStats,
  })

  const { data: bookmarkedProjects = [] } = useQuery({
    queryKey: ["bookmarkedProjects"],
    queryFn: async () => {
      const allProjects = await api.getProjects()
      return allProjects.filter((p) => user.bookmarks.includes(p.id))
    },
  })

  const { data: nearMeProjects = [] } = useQuery({
    queryKey: ["projectsNearMe"],
    queryFn: () => api.getProjectsNearMe(),
  })

  const { data: contributions = [] } = useQuery({
    queryKey: ["communityContributions"],
    queryFn: api.getCommunityContributions,
  })

  const { data: achievements = [] } = useQuery({
    queryKey: ["achievements"],
    queryFn: api.getAchievements,
  })

  const notifications: Notification[] = user.notifications || []

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex min-h-screen bg-kenya-gray">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-gradient-to-r from-kenya-black to-kenya-red p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
                <p className="text-white/80 mt-1">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""} and {user.bookmarks.length} saved projects.
                </p>
              </div>
              <Avatar className="h-12 w-12 border-2 border-white/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-kenya-red text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Saved Projects"
              value={user.bookmarks.length}
              change="+2 this week"
              icon={FolderOpen}
              trend="up"
              colorVariant="blue"
            />
            <StatsCard
              title="Recent Activity"
              value={notifications.length}
              change={`${unreadCount} unread`}
              icon={Activity}
              trend={unreadCount > 0 ? "down" : "neutral"}
              colorVariant="amber"
            />
            <StatsCard
              title="My Comments"
              value={stats?.commentsCount ?? 0}
              change="+5 today"
              icon={MessageSquare}
              trend="up"
              colorVariant="green"
            />
            <StatsCard
              title="My Uploads"
              value={user.uploads.length}
              change="3 pending review"
              icon={Upload}
              trend="neutral"
              colorVariant="purple"
            />
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-kenya-gray">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="saved">Saved Projects</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Saved Projects */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-kenya-black flex items-center gap-2">
                    <Star className="h-5 w-5 text-kenya-red" />
                    Saved Projects
                  </h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/citizen?saved=true">View all</Link>
                  </Button>
                </div>
                {bookmarkedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {bookmarkedProjects.map((project) => (
                      <Card key={project.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-kenya-black truncate">
                                {project.title}
                              </h3>
                              <p className="text-xs text-kenya-black/60">
                                {project.county} · {project.category}
                              </p>
                            </div>
                            <Badge
                              variant={
                                project.status === "completed"
                                  ? "success"
                                  : project.status === "construction"
                                  ? "default"
                                  : "warning"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-kenya-black/60">Progress</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs text-kenya-black/50">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(project.expectedCompletion).toLocaleDateString("en-KE", { month: "short", year: "numeric" })}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {project.county}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-sm text-kenya-black/50">
                      No saved projects yet. Browse projects and bookmark them.
                    </CardContent>
                  </Card>
                )}
              </section>

              {/* Recent Activity */}
              <section>
                <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-kenya-red" />
                  Recent Activity
                </h2>
                <RecentActivity notifications={notifications} limit={5} showLinks />
              </section>

              {/* Projects Near Me */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-kenya-black flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-kenya-red" />
                    Projects Near Me
                  </h2>
                </div>
                <Card>
                  <CardContent className="p-0">
                    <div className="relative h-48 bg-kenya-gray rounded-xl overflow-hidden mb-4">
                      <div className="absolute inset-0 flex items-center justify-center bg-kenya-gray/50">
                        <div className="text-center">
                          <MapPin className="mx-auto h-8 w-8 text-kenya-red/40" />
                          <p className="text-sm text-kenya-black/50 mt-1">Map placeholder — Nairobi region</p>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-kenya-black/80 to-transparent">
                        <p className="text-white text-sm font-medium">{nearMeProjects.length} projects nearby</p>
                      </div>
                    </div>
                    <div className="space-y-2 p-4">
                      {nearMeProjects.map((proj) => (
                        <div key={proj.id} className="flex items-center justify-between py-2 border-b border-kenya-border last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-kenya-red" />
                            <div>
                              <p className="text-sm font-medium text-kenya-black">{proj.title}</p>
                              <p className="text-xs text-kenya-black/50">{proj.county} · {proj.category}</p>
                            </div>
                          </div>
                          <Progress value={proj.progress} className="w-20 h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Community Contributions */}
              <section>
                <h2 className="text-lg font-semibold text-kenya-black mb-4 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-kenya-red" />
                  Community Contributions
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {contributions.map((contrib) => (
                    <Card key={contrib.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center",
                            contrib.type === "photo" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                          )}>
                            {contrib.type === "photo" ? (
                              <Flag className="h-5 w-5" />
                            ) : (
                              <MessageSquare className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-kenya-black truncate">{contrib.title}</p>
                            <p className="text-xs text-kenya-black/50">{contrib.author} · {formatDistanceToNow(new Date(contrib.date), { addSuffix: true })}</p>
                          </div>
                          <Badge
                            variant={contrib.status === "verified" ? "success" : contrib.status === "approved" ? "default" : "secondary"}
                            className="text-[10px]"
                          >
                            {contrib.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bookmarkedProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold text-kenya-black mb-2">{project.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-kenya-black/60">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-kenya-black/50">
                          <span>{project.county}</span>
                          <span>{formatCurrency(project.budget)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <RecentActivity notifications={notifications} limit={20} showLinks />
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((ach) => (
                  <Card key={ach.id} className={cn(!ach.unlocked && "opacity-50")}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", ach.color)}>
                          {ach.unlocked ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-kenya-black">{ach.title}</h3>
                          <p className="text-xs text-kenya-black/60">{ach.description}</p>
                          {ach.unlocked && (
                            <p className="text-xs text-kenya-green mt-1">Unlocked {ach.date}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default CitizenDashboard