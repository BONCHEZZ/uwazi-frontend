import { useState, useEffect, memo } from "react"
import type { County, Ministry, Contractor } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useAppStore } from "@/stores/useAppStore"
import { projectCategories } from "@/data/mockData"
import { cn, formatCurrency } from "@/lib/utils"

const statusOptions = [
  { value: "planning", label: "Planning" },
  { value: "procurement", label: "Procurement" },
  { value: "construction", label: "Construction" },
  { value: "completed", label: "Completed" },
  { value: "on-hold", label: "On Hold" },
]

interface ProjectFiltersProps {
  counties: County[]
  ministries: Ministry[]
  contractors: Contractor[]
  selectedFilters: Record<string, string[]>
  budgetRange: [number, number]
  completionRange: [number, number]
  onFilterChange: (filters: Record<string, string[]>) => void
  onClearAll: () => void
  uniqueConstituencies: string[]
  uniqueWards: string[]
  uniqueYears: number[]
  onBudgetRangeChange: (range: [number, number]) => void
  onCompletionRangeChange: (range: [number, number]) => void
}

const ProjectFilters = memo(function ProjectFilters({
  counties,
  ministries,
  contractors,
  selectedFilters,
  budgetRange,
  completionRange,
  onFilterChange,
  onClearAll,
  uniqueConstituencies,
  uniqueWards,
  uniqueYears,
  onBudgetRangeChange,
  onCompletionRangeChange,
}: ProjectFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 300)
  const { setFilter } = useAppStore()

  useEffect(() => {
    if (debouncedSearch) {
      setFilter("search", debouncedSearch)
    }
  }, [debouncedSearch, setFilter])

  const toggleFilter = (category: string, value: string) => {
    const current = selectedFilters[category] || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFilterChange({ ...selectedFilters, [category]: updated })
  }

  const clearCategory = (category: string) => {
    const { [category]: _, ...rest } = selectedFilters
    onFilterChange(rest)
  }

  const activeFilterCount =
    Object.values(selectedFilters).reduce((sum, vals) => sum + vals.length, 0) +
    (budgetRange[0] > 0 || budgetRange[1] < 15000000000 ? 1 : 0) +
    (completionRange[0] > 0 || completionRange[1] < 100 ? 1 : 0)

  const FilterSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [open, setOpen] = useState(defaultOpen)
    return (
      <div className="border-b border-kenya-border last:border-b-0">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between py-2 text-sm font-medium text-kenya-black"
        >
          {title}
          {open ? <ChevronUp className="h-4 w-4 text-kenya-black/50" /> : <ChevronDown className="h-4 w-4 text-kenya-black/50" />}
        </button>
        <div className={cn("overflow-hidden transition-all duration-200", open ? "max-h-96 pb-3" : "max-h-0")}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount} active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <FilterSection title="Search">
          <div className="space-y-1.5">
            <Input
              type="search"
              placeholder="Project name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </FilterSection>

        <FilterSection title="Category">
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {projectCategories.map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${cat}`}
                  checked={selectedFilters.category?.includes(cat) ?? false}
                  onCheckedChange={() => toggleFilter("category", cat)}
                />
                <Label htmlFor={`cat-${cat}`} className="text-xs">
                  {cat}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="County">
          <Select
            onValueChange={(val) => {
              if (val) {
                toggleFilter("county", val)
              }
            }}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select county" />
            </SelectTrigger>
            <SelectContent>
              {counties.map((county) => (
                <SelectItem key={county.id} value={county.name}>
                  {county.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFilters.county?.map((c) => (
            <div key={c} className="flex items-center justify-between rounded bg-kenya-gray px-2 py-1 text-xs mt-1">
              <span>{c}</span>
              <button
                type="button"
                onClick={() => clearCategory("county")}
                className="hover:text-kenya-red"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </FilterSection>

        <FilterSection title="Constituency" defaultOpen={selectedFilters.county?.length > 0}>
          <Select
            onValueChange={(val) => {
              if (val) toggleFilter("constituency", val)
            }}
            disabled={uniqueConstituencies.length === 0}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder={uniqueConstituencies.length === 0 ? "Select county first" : "Select constituency"} />
            </SelectTrigger>
            <SelectContent>
              {uniqueConstituencies.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFilters.constituency?.map((c) => (
            <div key={c} className="flex items-center justify-between rounded bg-kenya-gray px-2 py-1 text-xs mt-1">
              <span>{c}</span>
              <button
                type="button"
                onClick={() => clearCategory("constituency")}
                className="hover:text-kenya-red"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </FilterSection>

        <FilterSection title="Ward" defaultOpen={selectedFilters.constituency?.length > 0}>
          <Select
            onValueChange={(val) => {
              if (val) toggleFilter("ward", val)
            }}
            disabled={uniqueWards.length === 0}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder={uniqueWards.length === 0 ? "Select constituency first" : "Select ward"} />
            </SelectTrigger>
            <SelectContent>
              {uniqueWards.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFilters.ward?.map((w) => (
            <div key={w} className="flex items-center justify-between rounded bg-kenya-gray px-2 py-1 text-xs mt-1">
              <span>{w}</span>
              <button
                type="button"
                onClick={() => clearCategory("ward")}
                className="hover:text-kenya-red"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </FilterSection>

        <FilterSection title="Status">
          <div className="space-y-1.5">
            {statusOptions.map((status) => (
              <div key={status.value} className="flex items-center gap-2">
                <Checkbox
                  id={`status-${status.value}`}
                  checked={selectedFilters.status?.includes(status.value) ?? false}
                  onCheckedChange={() => toggleFilter("status", status.value)}
                />
                <Label htmlFor={`status-${status.value}`} className="text-xs">
                  {status.label}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Implementing Ministry">
          <Select
            onValueChange={(val) => {
              if (val) toggleFilter("ministry", val)
            }}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select ministry" />
            </SelectTrigger>
            <SelectContent>
              {ministries.map((m) => (
                <SelectItem key={m.id} value={m.name}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFilters.ministry?.map((m) => (
            <div key={m} className="flex items-center justify-between rounded bg-kenya-gray px-2 py-1 text-xs mt-1">
              <span className="truncate">{m}</span>
              <button
                type="button"
                onClick={() => clearCategory("ministry")}
                className="hover:text-kenya-red shrink-0 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </FilterSection>

        <FilterSection title="Contractor">
          <Select
            onValueChange={(val) => {
              if (val) toggleFilter("contractor", val)
            }}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select contractor" />
            </SelectTrigger>
            <SelectContent>
              {contractors.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFilters.contractor?.map((c) => (
            <div key={c} className="flex items-center justify-between rounded bg-kenya-gray px-2 py-1 text-xs mt-1">
              <span className="truncate">{c}</span>
              <button
                type="button"
                onClick={() => clearCategory("contractor")}
                className="hover:text-kenya-red shrink-0 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </FilterSection>

        <FilterSection title="Budget Range">
          <div className="space-y-3 pt-1">
            <Slider
              value={[budgetRange[1]]}
              min={0}
              max={15000000000}
              step={50000000}
              onValueChange={(vals) => onBudgetRangeChange([budgetRange[0], vals[0]])}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-kenya-black/60">
              <span>{formatCurrency(budgetRange[0])}</span>
              <span>{formatCurrency(budgetRange[1])}</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Completion %">
          <div className="space-y-3 pt-1">
            <Slider
              value={[completionRange[0], completionRange[1]]}
              min={0}
              max={100}
              step={5}
              onValueChange={(vals) => onCompletionRangeChange([vals[0], vals[1]])}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-kenya-black/60">
              <span>{completionRange[0]}%</span>
              <span>{completionRange[1]}%</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Year">
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {uniqueYears.map((year) => (
              <div key={year} className="flex items-center gap-2">
                <Checkbox
                  id={`year-${year}`}
                  checked={selectedFilters.year?.includes(String(year)) ?? false}
                  onCheckedChange={() => toggleFilter("year", String(year))}
                />
                <Label htmlFor={`year-${year}`} className="text-xs">
                  {year}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        <div className="pt-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onClearAll}
            disabled={activeFilterCount === 0}
          >
            Clear All Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

ProjectFilters.displayName = "ProjectFilters"

export default ProjectFilters
