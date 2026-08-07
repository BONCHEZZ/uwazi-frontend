import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  ChevronDown,
  Globe,
  Home,
  Info,
  FolderOpen,
  FolderSearch,
  MessageCircle,
  LogOut,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useI18n, type Locale } from "@/lib/i18n"
import { useAppStore } from "@/stores/useAppStore"
import logo from "@/assets/uwazi-logo.png"

const navLinks = [
  { name: "Home", tKey: "home", href: "/", icon: Home },
  { name: "About", tKey: "about", href: "/about", icon: Info },
  { name: "Browse Projects", tKey: "browseProjects", href: "/projects", icon: FolderOpen },
  { name: "Map", tKey: "map", href: "/map", icon: FolderSearch },
  { name: "Chat", href: "/chat", icon: MessageCircle, tKey: "chat" as const },
]

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "sw", label: "Kiswahili", flag: "🇰🇪" },
]

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const navigate = useNavigate()
  const { user, setSearchQuery, searchQuery, bookmarks } = useAppStore()
  const { t, setLocale, locale } = useI18n()
  const bookmarksCount = bookmarks.length

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/projects?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    useAppStore.getState().setUser(null as any)
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-kenya-border bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <img src={logo} alt="UWAZI logo" className="h-10 w-10 rounded-lg object-cover" />
            <span className="font-bold text-xl text-kenya-black">UWAZI</span>
          </Link>

<nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-kenya-red text-white"
                      : "text-kenya-black/70 hover:text-kenya-red hover:bg-kenya-gray"
                  )
                }
              >
                {t(`nav.${link.tKey}`)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {searchFocused && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "14rem", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSearch}
                  className="overflow-hidden"
                >
<Input
                    type="search"
                    placeholder={t("nav.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 w-full"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSearchFocused(!searchFocused)}
              aria-label={searchFocused ? "Close search" : "Open search"}
            >
              <Search className="h-4 w-4" />
            </Button>

<DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Change language">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onSelect={() => setLocale(lang.code as Locale)}
                    className={locale === lang.code ? "bg-kenya-red/10 text-kenya-red font-medium" : ""}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                    {locale === lang.code && <span className="ml-auto text-xs">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />

            <Button variant="ghost" size="icon" className="h-8 w-8 relative" asChild>
              <Link to="/notifications" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                {bookmarksCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-kenya-red text-xs text-white font-medium">
                    {bookmarksCount > 9 ? "9+" : bookmarksCount}
                  </span>
                )}
              </Link>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                    <div className="flex items-center justify-center h-full w-full rounded-full bg-kenya-red/10 text-kenya-red">
                      <User className="h-4 w-4" />
                    </div>
                    <ChevronDown className="h-3 w-3 ml-1 text-kenya-black/50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-kenya-black">{user.name}</p>
                    <p className="text-xs text-kenya-black/50 capitalize">{user.role}</p>
                  </div>
<DropdownMenuItem asChild>
                    <Link to={`/dashboard/${user.role}`}>{t("nav.dashboard")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">{t("nav.settings")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link to="/login" aria-label="User account">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-kenya-border bg-white/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col space-y-1 p-3" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-kenya-red text-white"
                        : "text-kenya-black/70 hover:bg-kenya-gray hover:text-kenya-black"
                    )
                  }
                >
<link.icon className="h-4 w-4 shrink-0" />
                  {t(`nav.${link.tKey}`)}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar