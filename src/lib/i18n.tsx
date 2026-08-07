import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Locale = "en" | "sw"

const dictionaries = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      browseProjects: "Browse Projects",
      map: "Map",
      notifications: "Notifications",
      profile: "Profile",
explore: "Explore",
      search: "Search projects...",
      signIn: "Sign In",
      logout: "Log Out",
      dashboard: "Dashboard",
      settings: "Settings",
      chat: "Chat",
    },
    hero: {
      badge: "Transparency and Accountability Platform",
      title: "Track Every Shilling. Demand Every Answer.",
      subtitle:
        "Empowering Kenyan citizens with real-time access to public project data. Track budgets, monitor progress, and verify infrastructure development across all 47 counties.",
      searchPlaceholder: "Search by project, county, contractor, ministry...",
      searchCta: "Search Projects",
      mapCta: "View Interactive Map",
      countyCta: "Explore County Projects",
      watchOverview: "Watch overview",
      trustedBy: "Trusted by 15,000+ citizens",
    },
    stats: {
      totalProjects: "Total Projects",
      totalBudget: "Total Budget",
      fundsDisbursed: "Funds Disbursed",
      countiesCovered: "Counties Covered",
      activeContractors: "Active Contractors",
      completedProjects: "Completed Projects",
      citizenReports: "Citizen Reports",
      verifiedReports: "Verified Reports",
      delayedProjects: "Delayed Projects",
    },
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      retry: "Retry",
      viewAll: "View all",
      featuredProjects: "Featured Projects",
      latestUpdates: "Latest Project Updates",
      howItWorks: "How It Works",
      disclaimer: "Disclaimer",
      readyCTA: "Ready to Hold Leaders Accountable?",
    },
  },
  sw: {
    nav: {
      home: "Nyumbani",
      about: "Kuhusu",
      browseProjects: "Vinara Miradi",
      map: "Ramani",
      notifications: "Arifa",
profile: "Wasifu",
      explore: "Gundua",
      search: "Tafuta miradi...",
      signIn: "Ingia",
      logout: "Toka",
      dashboard: "Dashibodi",
      settings: "Mipangilio",
      chat: "Mazungumzo",
    },
    hero: {
      badge: "Jukwaa la Uwazi na Uwajibikaji",
      title: "Fuatilia Kila Shilingi. Uliza Kila Jibu.",
      subtitle:
        "Tunawawezesha Wakenya kufikia data ya miradi ya umma kwa wakati halisi. Fuatilia bajeti, fuatilia maendeleo, na thibitisha maendeleo ya miundombinu katika kaunti zote 47.",
      searchPlaceholder: "Tafuta kwa mradi, kaunti, mkandarasi, wizara...",
      searchCta: "Tafuta Miradi",
      mapCta: "Tazama Ramani",
      countyCta: "Gundua Miradi ya Kaunti",
      watchOverview: "Tazama muhtasari",
      trustedBy: "Inaaminika na raia 15,000+",
    },
    stats: {
      totalProjects: "Jumla ya Miradi",
      totalBudget: "Jumla ya Bajeti",
      fundsDisbursed: "Fedha Zilizotolewa",
      countiesCovered: "Kaunti Zilizofikiwa",
      activeContractors: "Wakandarasi Hai",
      completedProjects: "Miradi Iliyokamilika",
      citizenReports: "Ripoti za Raia",
      verifiedReports: "Ripoti Zilizothibitishwa",
      delayedProjects: "Miradi Iliyochelewa",
    },
    common: {
      loading: "Inapakia...",
      error: "Hitilafu imetokea",
      retry: "Jaribu tena",
      viewAll: "Tazama zote",
      featuredProjects: "Miradi Maarufu",
      latestUpdates: "Sasisho za Hivi Karibuni",
      howItWorks: "Jinsi Inavyofanya Kazi",
      disclaimer: "Kanusho",
      readyCTA: "Tayari Kuwawajibisha Viongozi?",
    },
  },
}

export type TranslationKey = keyof typeof dictionaries.en

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("uwazi-locale") as Locale) || "en"
    }
    return "en"
  })

  const setLocaleAndPersist = useCallback((next: Locale) => {
    setLocale(next)
    localStorage.setItem("uwazi-locale", next)
  }, [])

const t = useCallback(
    (key: string) => {
      const dict = dictionaries[locale] as Record<string, unknown>
      const value = key.split(".").reduce<unknown>((acc, part) => {
        if (acc && typeof acc === "object") {
          return (acc as Record<string, unknown>)[part]
        }
        return undefined
      }, dict)
      return typeof value === "string" ? value : key
    },
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale: setLocaleAndPersist, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
