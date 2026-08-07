import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Funnel, FunnelX } from "lucide-react"
import { projectCategories } from "@/data/mockData"

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "planning", label: "Planning" },
  { value: "procurement", label: "Procurement" },
  { value: "construction", label: "Construction" },
  { value: "completed", label: "Completed" },
  { value: "on-hold", label: "On Hold" },
]

interface MapFiltersProps {
  selectedCategories: string[]
  selectedStatus: string
  onCategoryChange: (categories: string[]) => void
  onStatusChange: (status: string) => void
  onClearAll: () => void
}

const MapFilters = function MapFilters({
  selectedCategories,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
  onClearAll,
}: MapFiltersProps) {
  const toggleCategory = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    onCategoryChange(updated)
  }

  const activeCount = selectedCategories.length + (selectedStatus !== "all" ? 1 : 0)

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Funnel className="h-4 w-4" />
            Map Filters
          </span>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-kenya-black/50 hover:text-kenya-red"
            >
              <FunnelX className="h-4 w-4" />
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs font-medium">Status</Label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-8 text-sm mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-medium">Categories</Label>
          <div className="mt-1 grid grid-cols-2 gap-1.5 text-xs">
            {projectCategories.map((cat) => (
              <div key={cat} className="flex items-center gap-1.5">
                <Checkbox
                  id={`map-cat-${cat}`}
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  className="h-3 w-3"
                />
                <Label htmlFor={`map-cat-${cat}`} className="text-xs">
                  {cat}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {activeCount > 0 && (
          <div className="pt-2">
            <Badge variant="secondary" className="text-xs">
              {activeCount} filter{activeCount > 1 ? "s" : ""} active
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MapFilters
