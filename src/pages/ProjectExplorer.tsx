import { useState, useMemo, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Grid3X3,
  List,
  Map as MapIcon,
  Calendar,
  X,
  SortAsc,
  SortDesc,
  SlidersHorizontal,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { formatCurrency } from "@/lib/utils"
import ProjectCard from "@/components/projects/ProjectCard"
import ProjectFilters from "@/components/projects/ProjectFilters"
import MapView from "@/components/maps/MapView"

type ViewMode = "cards" | "list" | "map" | "timeline"

const ITEMS_PER_PAGE = 12

const sortOptions = [
  { value: "progress", label: "Progress" },
  { value: "budget", label: "Budget" },
  { value: "date", label: "Start Date" },
  { value: "verification", label: "Verification" },
] as const

function ProjectExplorer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "")
  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get("view") as ViewMode) ?? "cards"
  )
  const [sortBy, setSortBy] = useState<string>("progress")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("order") as "asc" | "desc") ?? "desc"
  )
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    county: [],
    constituency: [],
    ward: [],
    status: [],
    ministry: [],
    contractor: [],
    category: [],
    year: [],
  })
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 15000000000])
  const [completionRange, setCompletionRange] = useState<[number, number]>([0, 100])
  const [currentPage, setCurrentPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", selectedFilters, searchTerm, sortBy, sortOrder, budgetRange, completionRange],
    queryFn: async () => {
      const flatFilters: Record<string, unknown> = {
        search: searchTerm,
      }

      Object.entries(selectedFilters).forEach(([key, values]) => {
        if ((values as string[]).length > 0) {
          flatFilters[key] = (values as string[]).join(",")
        }
      })

      if (budgetRange[0] > 0 || budgetRange[1] < 15000000000) {
        flatFilters.minBudget = budgetRange[0]
        flatFilters.maxBudget = budgetRange[1]
      }

      if (completionRange[0] > 0 || completionRange[1] < 100) {
        flatFilters.minCompletion = completionRange[0]
        flatFilters.maxCompletion = completionRange[1]
      }

      let result = await api.getProjects(flatFilters)

      result = result.filter((p) => {
        if (p.budget < budgetRange[0] || p.budget > budgetRange[1]) return false
        if (p.progress < completionRange[0] || p.progress > completionRange[1]) return false
        return true
      })

      result = result.sort((a, b) => {
        let aVal: number
        let bVal: number
        switch (sortBy) {
          case "progress":
            aVal = a.progress
            bVal = b.progress
            break
          case "budget":
            aVal = a.budget
            bVal = b.budget
            break
          case "verification":
            aVal = a.verificationScore
            bVal = b.verificationScore
            break
          case "date":
          default:
            aVal = new Date(a.startDate).getTime()
            bVal = new Date(b.startDate).getTime()
            break
        }
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal
      })

      return result
    },
    placeholderData: (previous) => previous,
  })

  const { data: counties = [] } = useQuery({
    queryKey: ["counties"],
    queryFn: () => api.getCounties(),
  })

  const { data: ministries = [] } = useQuery({
    queryKey: ["ministries"],
    queryFn: () => api.getMinistries(),
  })

  const { data: contractors = [] } = useQuery({
    queryKey: ["contractors"],
    queryFn: () => api.getContractors(),
  })

  const { data: allProjects = [] } = useQuery({
    queryKey: ["all-projects-for-map"],
    queryFn: () => api.getProjects(),
  })

  const uniqueYears = useMemo(() => {
    const years = new Set(projects.map((p) => new Date(p.startDate).getFullYear()))
    return Array.from(years).sort((a, b) => b - a)
  }, [projects])

  const uniqueConstituencies = useMemo(() => {
    const selectedCounties = selectedFilters.county
    if (selectedCounties.length === 0) return []
    const countyMap = new Map(counties.map((c) => [c.name, c]))
    const constituencies = new Set<string>()
    selectedCounties.forEach((countyName) => {
      const county = countyMap.get(countyName)
      if (county) {
        county.constituency.forEach((c) => constituencies.add(c.name))
      }
    })
    return Array.from(constituencies).sort()
  }, [counties, selectedFilters.county])

  const uniqueWards = useMemo(() => {
    const selectedConstituencies = selectedFilters.constituency
    if (selectedConstituencies.length === 0) return []
    const all = counties.flatMap((c) => c.constituency)
    const constituencyMap = new Map(all.map((c) => [c.name, c]))
    const wards = new Set<string>()
    selectedConstituencies.forEach((constituencyName) => {
      const constituency = constituencyMap.get(constituencyName)
      if (constituency) {
        constituency.ward.forEach((w) => wards.add(w.name))
      }
    })
    return Array.from(wards).sort()
  }, [counties, selectedFilters.constituency])

  const handleFilterChange = useCallback(
    (filters: Record<string, string[]>) => {
      setSelectedFilters(filters)
      setCurrentPage(1)
      const params = new URLSearchParams(searchParams)
      Object.entries(filters).forEach(([key, vals]) => {
        if ((vals as string[]).length > 0) {
          params.set(key, (vals as string[]).join(","))
        } else {
          params.delete(key)
        }
      })
      setSearchParams(params, { replace: true })
    },
    [searchParams, setSearchParams]
  )

  const clearAll = useCallback(() => {
    setSelectedFilters({
      county: [],
      constituency: [],
      ward: [],
      status: [],
      ministry: [],
      contractor: [],
      category: [],
      year: [],
    })
    setBudgetRange([0, 15000000000])
    setCompletionRange([0, 100])
    setCurrentPage(1)
    setSearchParams({})
  }, [setSearchParams])

  const handleSort = useCallback((field: string) => {
    const newSort = field as typeof sortBy
    if (sortBy === newSort) {
      setSortOrder((order) => (order === "asc" ? "desc" : "asc"))
    } else {
      setSortOrder("desc")
    }
    setSortBy(newSort)
  }, [sortBy])

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE)
  const paginatedProjects = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const activeFilterCount =
    Object.values(selectedFilters).reduce((sum, v) => sum + (v as string[]).length, 0) +
    (budgetRange[0] > 0 || budgetRange[1] < 15000000000 ? 1 : 0) +
    (completionRange[0] > 0 || completionRange[1] < 100 ? 1 : 0)

  return (
    <div className="min-h-screen bg-kenya-gray">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kenya-black">Project Explorer</h1>
            <p className="mt-1 text-sm text-kenya-black/60">
              {isLoading ? (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading projects...
                </span>
              ) : (
                `${projects.length} project${projects.length !== 1 ? "s" : ""} found`
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <div className="hidden md:flex items-center gap-1 rounded-md bg-white border border-kenya-border p-1">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "ghost"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleSort(option.value)}
                >
                  {sortBy === option.value && sortOrder === "desc" ? (
                    <SortDesc className="h-3 w-3 mr-1" />
                  ) : (
                    <SortAsc className="h-3 w-3 mr-1" />
                  )}
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -320, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/50 md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <motion.div
                  initial={{ x: -320 }}
                  animate={{ x: 0 }}
                  exit={{ x: -320 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-white shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b border-kenya-border">
                    <span className="font-semibold text-kenya-black">Filters</span>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ProjectFilters
                    counties={counties}
                    ministries={ministries}
                    contractors={contractors}
                    selectedFilters={selectedFilters}
                    budgetRange={budgetRange}
                    completionRange={completionRange}
                    onFilterChange={handleFilterChange}
                    onClearAll={clearAll}
                    uniqueConstituencies={uniqueConstituencies}
                    uniqueWards={uniqueWards}
                    uniqueYears={uniqueYears}
                    onBudgetRangeChange={setBudgetRange}
                    onCompletionRangeChange={setCompletionRange}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <ProjectFilters
                counties={counties}
                ministries={ministries}
                contractors={contractors}
                selectedFilters={selectedFilters}
                budgetRange={budgetRange}
                completionRange={completionRange}
                onFilterChange={handleFilterChange}
                onClearAll={clearAll}
                uniqueConstituencies={uniqueConstituencies}
                uniqueWards={uniqueWards}
                uniqueYears={uniqueYears}
                onBudgetRangeChange={setBudgetRange}
                onCompletionRangeChange={setCompletionRange}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search by project name, code, or keyword..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-9 pl-9 text-sm"
                />
              </div>
              <div className="hidden sm:flex items-center gap-1 rounded-md bg-white border border-kenya-border p-1">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("cards")}
                  aria-label="Card view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("map")}
                  aria-label="Map view"
                >
                  <MapIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "timeline" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("timeline")}
                  aria-label="Timeline view"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex flex-wrap gap-1.5"
              >
                {Object.entries(selectedFilters).map(([key, vals]) =>
                  vals.map((v) => (
                    <Badge
                      key={`${key}-${v}`}
                      variant="secondary"
                      className="text-xs flex items-center gap-1"
                    >
                      {v}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...selectedFilters }
                          updated[key] = updated[key].filter((x) => x !== v)
                          if (updated[key].length === 0) delete updated[key]
                          handleFilterChange(updated)
                        }}
                        className="hover:text-kenya-red"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
                {(budgetRange[0] > 0 || budgetRange[1] < 15000000000) && (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    Budget: {formatCurrency(budgetRange[0])} - {formatCurrency(budgetRange[1])}
                    <button
                      type="button"
                      onClick={() => setBudgetRange([0, 15000000000])}
                      className="hover:text-kenya-red"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(completionRange[0] > 0 || completionRange[1] < 100) && (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    Progress: {completionRange[0]}% - {completionRange[1]}%
                    <button
                      type="button"
                      onClick={() => setCompletionRange([0, 100])}
                      className="hover:text-kenya-red"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6"
                  onClick={clearAll}
                >
                  Clear all
                </Button>
              </motion.div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 text-center"
              >
                <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-sm text-gray-500 mb-2">No projects match your filters.</p>
                <Button variant="link" onClick={clearAll}>Clear all filters</Button>
              </motion.div>
            ) : viewMode === "cards" ? (
              <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
                }}
              >
                {paginatedProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>
            ) : viewMode === "list" ? (
              <motion.div
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
                }}
              >
                {paginatedProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl border border-kenya-border bg-white p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={project.images[0] ?? "/placeholder.png"}
                          alt={project.title}
                          className="h-12 w-12 rounded-lg object-cover shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm truncate">{project.title}</h3>
                            <Badge
                              variant={
                                project.status === "completed"
                                  ? "success"
                                  : project.status === "construction"
                                  ? "default"
                                  : project.status === "planning"
                                  ? "warning"
                                  : "secondary"
                              }
                              className="text-xs shrink-0"
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-kenya-black/60 mt-0.5">
                            {project.county} · {project.category} · {project.code}
                          </p>
                          <div className="flex items-center gap-4 mt-1.5">
                            <span className="text-xs text-kenya-black/60">
                              Budget: {formatCurrency(project.budget)}
                            </span>
                            <span className="text-xs text-kenya-black/60">
                              Progress: {project.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden sm:block w-24">
                          <Progress value={project.progress} className="h-1.5" />
                        </div>
                        <Button size="sm" asChild variant="outline">
                          <a href={`/project/${project.id}`}>View</a>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : viewMode === "map" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-kenya-border bg-white overflow-hidden"
              >
                <MapView
                  projects={allProjects}
                  selectedProject={null}
                  onProjectSelect={() => {}}
                  height="h-[600px]"
                />
              </motion.div>
            ) : (
              <motion.div
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
                }}
              >
                {paginatedProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-kenya-border bg-white p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-kenya-black">{project.title}</h3>
                      <Badge variant="outline" className="text-xs capitalize">
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-kenya-black/60 mb-1">
                      {new Date(project.startDate).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {" → "}
                      {new Date(project.expectedCompletion).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-kenya-black/70 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-kenya-black/60">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <span className="text-sm font-semibold text-kenya-black shrink-0">
                        {formatCurrency(project.budget)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {project.county}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {project.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {project.implementingMinistry}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-kenya-black/60">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, projects.length)} of {projects.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        if (page === 1 || page === totalPages) return true
                        if (Math.abs(page - currentPage) <= 1) return true
                        return false
                      })
                      .map((page, idx, arr) => {
                        const showEllipsisBefore = idx > 0 && arr[idx - 1] !== page - 1
                        return (
                          <>
                            {showEllipsisBefore && (
                              <span key={`ellipsis-${page}`} className="px-2 text-xs text-gray-400">
                                ...
                              </span>
                            )}
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "ghost"}
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          </>
                        )
                      })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectExplorer
