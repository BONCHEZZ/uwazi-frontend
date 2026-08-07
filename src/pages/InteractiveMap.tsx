import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Search, MapPin, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'

const kenyaBounds = [
  [-4.5, 33.5],
  [5.5, 42.5],
] as const

// Color coding:
// Green = Completed, Blue = Ongoing (construction), Yellow = Delayed, Gray = Planned, Red = High Risk
const statusColors: Record<string, string> = {
  completed: "#16A34A",
  construction: "#3B82F6",
  "on-hold": "#F59E0B",
  planning: "#6B7280",
  procurement: "#6B7280",
}

const riskColors: Record<string, string> = {
  low: "#16A34A",
  medium: "#F59E0B",
  high: "#EF4444",
}

function MapController({ filters }: { filters: Record<string, string> }) {
  const map = useMap()
  if (filters.county) {
    map.setView([-0.0236, 37.9062], 6)
  }
  return null
}

export default function InteractiveMap() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCounty, setFilterCounty] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.getProjects(),
  })

  const filteredProjects = useMemo(() => {
    if (!projects) return []
    return projects.filter(project => {
      const matchesSearch = !searchQuery ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.county.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCounty = filterCounty === 'all' || project.county === filterCounty
      const matchesCategory = filterCategory === 'all' || project.category === filterCategory
      return matchesSearch && matchesCounty && matchesCategory
    })
  }, [projects, searchQuery, filterCounty, filterCategory])

  const counties = [...new Set(projects?.map(p => p.county) || [])]
  const categories = [...new Set(projects?.map(p => p.category) || [])]

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'medium': return <AlertTriangle className="w-4 h-4 text-amber-600" />
      default: return <CheckCircle className="w-4 h-4 text-green-600" />
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-kenya-red" />
            <h1 className="text-xl font-bold text-kenya-black">Interactive Kenya Map</h1>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search projects or counties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterCounty} onValueChange={setFilterCounty}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="County" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              {counties.map(county => (
                <SelectItem key={county} value={county}>{county}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="text-sm">
            {filteredProjects.length} projects
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1">
          <MapContainer
            center={[-0.0236, 37.9062] as any}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            bounds={kenyaBounds as any}
            minZoom={6}
            maxZoom={18}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <MapController filters={{ county: filterCounty }} />
{filteredProjects.map(project => {
              const baseColor = statusColors[project.status] || '#666'
              const markerColor = project.riskLevel === 'high' ? riskColors.high : baseColor
              return (
              <Marker
                key={project.id}
                position={[project.gps.lat, project.gps.lng]}
                icon={L.divIcon({
                  className: 'custom-marker',
                  html: `<div style="
                    width: 24px;
                    height: 24px;
                    background-color: ${markerColor};
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    cursor: pointer;
                  "></div>`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12],
                }) as any}
                eventHandlers={{
                  click: () => setSelectedProject(project),
                } as any}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-1">{project.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">{project.county}, {project.constituency}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs capitalize">{project.status}</Badge>
                      <span className="text-xs font-medium">{project.progress}% complete</span>
                    </div>
                  </div>
</Popup>
              </Marker>
              )
            })}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto hidden lg:block">
          <div className="p-4">
            <h3 className="font-semibold text-kenya-black mb-4">
              {filteredProjects.length} Projects
            </h3>
            <div className="space-y-3">
              {filteredProjects.map(project => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedProject(project)}
                  className={cn(
                    'p-3 rounded-lg border cursor-pointer transition-all',
                    selectedProject?.id === project.id
                      ? 'border-kenya-red bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-kenya-black line-clamp-1">{project.title}</h4>
                    {getRiskIcon(project.riskLevel)}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{project.county}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs capitalize">{project.status}</Badge>
                    <span className="text-xs font-medium">{project.progress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-kenya-red transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

{/* Legend */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
          <span className="font-medium text-gray-600">Legend:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#16A34A]" />
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
            <span className="text-gray-600">Ongoing</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span className="text-gray-600">Delayed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#6B7280]" />
            <span className="text-gray-600">Planned</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <span className="text-gray-600">High Risk</span>
          </div>
        </div>
      </div>
    </div>
  )
}
