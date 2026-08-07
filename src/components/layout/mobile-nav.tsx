import { NavLink } from "react-router-dom"
import {
  Home,
  Compass,
  Map,
  Bell,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useI18n } from "@/lib/i18n"

const tabs = [
  { name: "Home", tKey: "home", href: "/", icon: Home },
  { name: "Explore", tKey: "explore", href: "/projects", icon: Compass },
  { name: "Map", tKey: "map", href: "/map", icon: Map },
  { name: "Notifications", tKey: "notifications", href: "/notifications", icon: Bell },
  { name: "Profile", tKey: "profile", href: "/profile", icon: User },
]

function MobileNav() {
  const { t } = useI18n()
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-kenya-border bg-white/95 backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.href}
          to={tab.href}
          className={({ isActive }) =>
            cn(
              "relative flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "text-kenya-red"
                : "text-kenya-black/50 hover:text-kenya-black"
            )
          }
        >
          {({ isActive }) => (
            <>
              <tab.icon className="h-5 w-5" />
              <span>{t(`nav.${tab.tKey}`)}</span>
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute -top-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-kenya-red"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNav