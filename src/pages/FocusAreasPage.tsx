import { Link } from "react-router-dom"
import { ArrowRight, Building2, GraduationCap, HeartPulse, Leaf, Droplets, Tractor, Route, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const focusAreas = [
  { title: "Health", description: "Track hospitals, clinics, equipment and other public health projects.", icon: HeartPulse, category: "Health" },
  { title: "Education", description: "Explore schools, classrooms, laboratories and education infrastructure.", icon: GraduationCap, category: "Education" },
  { title: "Roads & Transport", description: "Follow road construction, rehabilitation and transport infrastructure.", icon: Route, category: "Roads" },
  { title: "Water & Sanitation", description: "Monitor water supply, sanitation and community water projects.", icon: Droplets, category: "Water" },
  { title: "Agriculture", description: "Discover public agricultural infrastructure and development projects.", icon: Tractor, category: "Agriculture" },
  { title: "Environment", description: "Find projects focused on conservation, climate and environmental protection.", icon: Leaf, category: "Environment" },
  { title: "Public Buildings", description: "Track construction and rehabilitation of public facilities.", icon: Building2, category: "Infrastructure" },
  { title: "Public Safety", description: "Explore projects supporting public safety and community resilience.", icon: ShieldCheck, category: "Security" },
]

export default function FocusAreasPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-kenya-red">UWAZI Focus Areas</p>
        <h1 className="mt-2 text-3xl font-bold text-kenya-black sm:text-4xl">Explore public projects by sector</h1>
        <p className="mt-3 text-kenya-black/60">Start with an area that matters to your community, then inspect individual projects, funding and citizen evidence.</p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {focusAreas.map(({ title, description, icon: Icon, category }) => (
          <Card key={title} className="group transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-kenya-red/10 text-kenya-red"><Icon className="h-5 w-5" /></div>
              <h2 className="mt-4 font-semibold text-kenya-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-kenya-black/60">{description}</p>
              <Link to={`/projects?category=${encodeURIComponent(category)}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-kenya-red hover:underline">
                View projects <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
