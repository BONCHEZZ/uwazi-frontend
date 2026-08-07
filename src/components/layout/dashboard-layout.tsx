import type { ReactNode } from "react"
import Sidebar from "@/components/layout/sidebar"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn("flex min-h-screen bg-kenya-gray", className)}>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout