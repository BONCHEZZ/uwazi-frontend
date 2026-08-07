import { NavLink, Link } from "react-router-dom"
import {
  LayoutDashboard,
  FolderOpen,
  Map,
  MessageCircle,
  Image,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/stores/useAppStore"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import logo from "@/assets/uwazi-logo.png"

interface SidebarItem {
  name: string
  href: string
  icon: React.ElementType
}

const navItems: SidebarItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { name: "Map", href: "/dashboard/map", icon: Map },
  { name: "Discussions", href: "/dashboard/discussions", icon: MessageCircle },
  { name: "Gallery", href: "/dashboard/gallery", icon: Image },
  { name: "Finance", href: "/dashboard/finance", icon: DollarSign },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

function Sidebar() {
  const { user } = useAppStore()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "hidden flex-shrink-0 flex-col border-r border-kenya-border bg-white transition-all duration-300 md:flex",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-3 py-3">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="UWAZI logo" className="h-8 w-8 rounded-lg object-cover" />
          {!collapsed && (
            <span className="font-bold text-lg text-kenya-black">UWAZI</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex flex-col gap-1 px-2" aria-label="Sidebar navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-kenya-red text-white"
                  : "text-kenya-black/70 hover:bg-kenya-gray hover:text-kenya-black"
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-kenya-border px-2 py-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2",
            collapsed && "justify-center"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-kenya-red/10 text-kenya-red">
            <User className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-kenya-black">
                {user?.name ?? "User"}
              </p>
              <span className="inline-block rounded-full bg-kenya-gray px-2 py-0.5 text-xs text-kenya-black/60 capitalize">
                {user?.role ?? "citizen"}
              </span>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
              <Link to="/login">
                <LogOut className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar