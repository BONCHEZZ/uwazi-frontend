import { useEffect, useRef, memo } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet"
import L from "leaflet"
import type { Project } from "@/types"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

const kenyaCenter: [number, number] = [-1.2921, 36.8219]

function createCustomIcon(status: Project["status"]): any {
  const colorMap = {
    planning: "#F59E0B",
    procurement: "#F59E0B",
    construction: "#DC2626",
    completed: "#16A34A",
    "on-hold": "#6B7280",
  }
  const color = colorMap[status]
  return L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        background-color: ${color};
        border: 2px solid white;
        box-shadow: 0 0 0 2px ${color};
      "></div>
    `,
    className: "custom-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  })
}

function MapClickHandler() {
  return null
}

interface MapViewProps {
  projects: Project[]
  selectedProject: Project | null
  onProjectSelect: (project: Project | null) => void
  height?: string
}

const MapView = memo(function MapView({
  projects,
  selectedProject,
  onProjectSelect,
  height = "h-[500px]",
}: MapViewProps) {
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (selectedProject && mapRef.current) {
      mapRef.current.setView(
        [selectedProject.gps.lat, selectedProject.gps.lng],
        12
      )
    }
  }, [selectedProject])

  return (
    <div className={height}>
      <MapContainer
        center={kenyaCenter}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />

        {projects.map((project) => (
          <Marker
            key={project.id}
            position={[project.gps.lat, project.gps.lng]}
            icon={createCustomIcon(project.status)}
            eventHandlers={{
              click: () => {
                onProjectSelect(project)
              },
            }}
          >
            <Popup
              autoClose={false}
              closeButton={false}
              direction="top"
              className="uwazi-popup"
            >
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">{project.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {project.status}
                  </Badge>
                  <span className="text-xs font-medium">
                    {formatCurrency(project.budget)}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
})

MapView.displayName = "MapView"

export default MapView
