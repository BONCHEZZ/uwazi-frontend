import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("uwazi-theme") || "light"
    }
    return "light"
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("uwazi-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}