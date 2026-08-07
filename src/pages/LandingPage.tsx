import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import ProjectCard from "@/components/projects/ProjectCard"
import {
  ShieldCheck,
  ArrowRight,
  Users,
  FileText,
  Clock,
  Mic2,
  Play,
  AlertTriangle,
  MapPinned,
  Search,
  Building2,
  CheckCircle,
  AlertTriangle as AlertTriangleIcon,
  FolderOpen,
  Landmark,
  Wallet,
  HardHat,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn, formatCurrency } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

import heroBg from '@/assets/hero-bg.mp4'

const updates = [
  { title: "Nairobi-Mombasa Expressway reaches 45% completion milestone", date: "2024-05-12", tag: "Infrastructure" },
  { title: "Audit committee flags procurement irregularities in Turkana transmission line", date: "2024-05-10", tag: "Energy" },
  { title: "Citizen verification confirms construction at Nakuru Housing Estate", date: "2024-05-08", tag: "Housing" },
  { title: "World Bank approves additional funding for Mombasa Port upgrade", date: "2024-05-05", tag: "Transport" },
  { title: "Kisumu Hospital ICU wing structural works complete", date: "2024-05-02", tag: "Health" },
]

const verificationData = [
  { county: "Nairobi", verified: 4200, disputed: 180, pending: 90 },
  { county: "Mombasa", verified: 2100, disputed: 95, pending: 45 },
  { county: "Kisumu", verified: 1800, disputed: 110, pending: 60 },
  { county: "Nakuru", verified: 1500, disputed: 70, pending: 30 },
  { county: "Turkana", verified: 980, disputed: 45, pending: 25 },
  { county: "Eldoret", verified: 1100, disputed: 50, pending: 20 },
]

const budgetPieData = [
  { name: "Disbursed", value: 980000000000, color: "#DE2910" },
  { name: "Expended", value: 875000000000, color: "#111c2d" },
  { name: "Remaining", value: 1570000000000, color: "#16a34a" },
]

const participationData = [
  { month: "Jan", submissions: 1200 },
  { month: "Feb", submissions: 1380 },
  { month: "Mar", submissions: 1500 },
  { month: "Apr", submissions: 1720 },
  { month: "May", submissions: 1900 },
  { month: "Jun", submissions: 2100 },
]

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const display = useMemo(() => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
    return value.toLocaleString()
  }, [value])

  return (
    <span className="tabular-nums">
      {display}
      {suffix}
    </span>
  )
}

function LandingPage() {
  const { t } = useI18n()
  const [heroQuery, setHeroQuery] = useState("")
  const navigate = useNavigate()

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: () => api.getFeaturedProjects(),
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.getDashboardStats(),
  })

  const completedProjects = useQuery({
    queryKey: ["completed-projects"],
    queryFn: async () => {
      const data = await api.getProjects({ status: "completed" })
      return data.slice(0, 6)
    },
  })

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (heroQuery.trim()) {
      navigate(`/projects?q=${encodeURIComponent(heroQuery.trim())}`)
    }
  }

  const statItems = [
    { label: t("stats.totalProjects"), value: stats?.totalProjects ?? 0, icon: FolderOpen, color: "text-kenya-red" },
    { label: t("stats.totalBudget"), value: stats?.totalBudget ?? 0, icon: Landmark, color: "text-blue-600" },
    { label: t("stats.fundsDisbursed"), value: stats?.totalDisbursed ?? 0, icon: Wallet, color: "text-amber-600" },
    { label: t("stats.countiesCovered"), value: stats?.countiesCovered ?? 47, icon: MapPinned, color: "text-kenya-green" },
    { label: t("stats.activeContractors"), value: stats?.activeContractors ?? 0, icon: HardHat, color: "text-orange-600" },
    { label: t("stats.completedProjects"), value: stats?.completedProjects ?? 0, icon: CheckCircle, color: "text-emerald-600" },
    { label: t("stats.citizenReports"), value: stats?.citizenReports ?? 0, icon: Users, color: "text-purple-600" },
    { label: t("stats.verifiedReports"), value: stats?.verifiedReports ?? 0, icon: ShieldCheck, color: "text-cyan-600" },
    { label: t("stats.delayedProjects"), value: stats?.delayedProjects ?? 0, icon: AlertTriangleIcon, color: "text-red-600" },
  ]

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-kenya-black via-kenya-red/15 to-kenya-green/15">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            src={heroBg}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-r from-kenya-black/95 via-kenya-red/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-kenya-black/85 via-kenya-green/20 to-kenya-black/20" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl"
          >
            <Badge className="mb-4 bg-kenya-red/20 text-kenya-red border-kenya-red/30">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
              {t("hero.badge")}
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-200 leading-relaxed max-w-2xl">
              {t("hero.subtitle")}
            </p>

            <form onSubmit={handleHeroSearch} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder={t("hero.searchPlaceholder")}
                  className="h-12 rounded-xl border-0 bg-white/95 pl-11 pr-4 text-sm shadow-lg backdrop-blur-sm placeholder:text-gray-500"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 bg-kenya-red hover:bg-kenya-red-dark text-white">
                <Search className="h-4 w-4 mr-2" />
                {t("hero.searchCta")}
              </Button>
            </form>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                <Link to="/map">
                  <MapPinned className="h-4 w-4 mr-2" />
                  {t("hero.mapCta")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                <Link to="/projects">
                  <Building2 className="h-4 w-4 mr-2" />
                  {t("hero.countyCta")}
                </Link>
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1.5">
                <Play className="h-4 w-4 text-kenya-red" />
                {t("hero.watchOverview")}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-500" />
              <span>{t("hero.trustedBy")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-y border-kenya-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl font-bold text-kenya-black">Key Metrics</h2>
            <p className="mt-1 text-sm text-kenya-black/60">Real-time national project statistics</p>
          </motion.div>

{statsLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {[...Array(9)].map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
            >
              {statItems.map((metric) => (
                <motion.div
                  key={metric.label}
                  variants={item}
                  className="rounded-xl border border-kenya-border bg-kenya-gray p-5 text-center transition-shadow hover:shadow-md"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                    <metric.icon className={cn("h-5 w-5", metric.color)} />
                  </div>
                  <p className="text-2xl font-bold text-kenya-black">
                    <AnimatedCounter value={metric.value} />
                  </p>
                  <p className="mt-1 text-xs text-kenya-black/60">{metric.label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-kenya-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-end justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-kenya-black">Featured Projects</h2>
              <p className="mt-1 text-sm text-kenya-black/60">
                Highlighted infrastructure projects under active construction
              </p>
            </div>
            <Button variant="link" asChild className="text-kenya-red">
              <Link to="/projects">
                View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </motion.div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {projects.map((project) => (
                <motion.div key={project.id} variants={item}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-y border-kenya-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-kenya-black">Latest Project Updates</h2>
            <p className="mt-1 text-sm text-kenya-black/60">
              Recent reports, audit findings, and community verifications
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {updates.map((update, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="rounded-xl border border-kenya-border bg-kenya-gray p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">{update.tag}</Badge>
                  <span className="text-xs text-kenya-black/50">
                    {new Date(update.date).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-sm font-medium text-kenya-black leading-snug">{update.title}</p>
                <div className="mt-3 flex items-center gap-1 text-kenya-red text-xs font-medium">
                  <FileText className="h-3.5 w-3.5" />
                  Read full report
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-kenya-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-kenya-black">Citizen Verification Statistics</h2>
            <p className="mt-1 text-sm text-kenya-black/60">
              Breakdown of on-ground verifications by county
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-kenya-border bg-white p-4 shadow-sm"
          >
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={verificationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="county" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Bar dataKey="verified" name="Verified" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="disputed" name="Disputed" fill="#DE2910" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-y border-kenya-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-kenya-black">Budget Transparency Statistics</h2>
            <p className="mt-1 text-sm text-kenya-black/60">
              National treasury disbursement overview
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-kenya-border bg-white p-4 shadow-sm"
            >
              <ResponsiveContainer width="100%" height={320}>
                <RePieChart>
                  <Pie
                    data={budgetPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) =>
                      `${name}: ${formatCurrency(value)}`
                    }
                  >
                    {budgetPieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl border border-kenya-border bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-kenya-black mb-4">Budget Summary</h3>
              <div className="space-y-4">
                {budgetPieData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm font-medium text-kenya-black">{entry.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-kenya-black">
                      {formatCurrency(entry.value)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-kenya-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-kenya-black">Total Allocated</span>
                  <span className="text-sm font-bold text-kenya-red">
                    {formatCurrency(2450000000000)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-kenya-black/60">
                  Data sourced from the National Treasury and implementing ministries.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-kenya-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-kenya-black">Public Participation Statistics</h2>
            <p className="mt-1 text-sm text-kenya-black/60">
              Monthly citizen submissions and engagement trends
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-kenya-border bg-white p-4 shadow-sm"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={participationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="submissions" name="Submissions" fill="#DE2910" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-y border-kenya-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-end justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-kenya-black">Recently Completed Projects</h2>
              <p className="mt-1 text-sm text-kenya-black/60">
                Projects successfully delivered to communities
              </p>
            </div>
          </motion.div>

          {completedProjects.isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {completedProjects.data?.map((project) => (
                <motion.div key={project.id} variants={item}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-kenya-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-bold text-kenya-black">How It Works</h2>
            <p className="mt-1 text-sm text-kenya-black/60">
              Three pillars that make UWAZI the leading transparency platform in Kenya
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {[
              {
                icon: ShieldCheck,
                title: "Transparency",
                description:
                  "All project data — budgets, timelines, contractors, and milestones — is published openly so every Kenyan can inspect public spending.",
                color: "text-kenya-red",
                bg: "bg-red-50",
              },
              {
                icon: Clock,
                title: "Timeline Tracking",
                description:
                  "Real-time progress updates from the National Treasury and implementing ministries keep you informed at every project milestone.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Mic2,
                title: "Community Voice",
                description:
                  "Citizens can upload photos, submit verifications, and engage in discussions — turning passive observation into active accountability.",
                color: "text-kenya-green",
                bg: "bg-green-50",
              },
            ].map((feature, _i) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="rounded-2xl border border-kenya-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className={cn("mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl", feature.bg)}>
                  <feature.icon className={cn("h-6 w-6", feature.color)} />
                </div>
                <h3 className="text-lg font-semibold text-kenya-black">{feature.title}</h3>
                <p className="mt-2 text-sm text-kenya-black/70 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-kenya-red">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-10 bg-kenya-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <AlertTriangle className="mx-auto h-8 w-8 text-kenya-red mb-4" />
            <h2 className="text-xl font-bold text-white">Disclaimer</h2>
            <p className="mt-3 text-sm text-gray-300 leading-relaxed">
              The data presented on UWAZI is sourced from publicly available government records, the National Treasury,
              and implementing ministries. While every effort is made to ensure accuracy, UWAZI does not warrant
              the completeness or reliability of the information. Users are encouraged to verify data through
              official channels. UWAZI is an independent transparency platform and is not affiliated with any
              political party or government entity beyond the public data it aggregates.
            </p>
            <p className="mt-3 text-xs text-gray-500">
              Last updated: {new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-kenya-red">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to Hold Leaders Accountable?
            </h2>
            <p className="mt-3 text-base text-white/90 max-w-xl mx-auto">
              Join thousands of Kenyans who use UWAZI to monitor public projects, verify on-the-ground progress, and demand accountability.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white text-kenya-red hover:bg-gray-100" asChild>
                <Link to="/projects">
                  Start Exploring
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/about">
                  About UWAZI
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
