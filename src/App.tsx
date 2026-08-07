import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/api'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import MobileNav from '@/components/layout/mobile-nav'
import ErrorBoundary from '@/components/ui/error-boundary'
import { Skeleton } from '@/components/ui/skeleton'
import { I18nProvider } from '@/lib/i18n'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ChatPage = lazy(() => import('@/pages/ChatPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const ProjectExplorer = lazy(() => import('@/pages/ProjectExplorer'))
const ProjectDetails = lazy(() => import('@/pages/ProjectDetails'))
const ContractorProfile = lazy(() => import('@/pages/ContractorProfile'))
const FinancialTransparency = lazy(() => import('@/pages/FinancialTransparency'))
const OfficialGallery = lazy(() => import('@/pages/OfficialGallery'))
const CommunityGallery = lazy(() => import('@/pages/CommunityGallery'))
const Discussions = lazy(() => import('@/pages/Discussions'))
const InteractiveMap = lazy(() => import('@/pages/InteractiveMap'))
const Verification = lazy(() => import('@/pages/Verification'))
const CitizenDashboard = lazy(() => import('@/pages/CitizenDashboard'))
const GovernmentDashboard = lazy(() => import('@/pages/GovernmentDashboard'))
const OversightDashboard = lazy(() => import('@/pages/OversightDashboard'))
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'))

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-kenya-gray">
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full mb-6" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-kenya-red focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-medium"
            >
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1" role="main">
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/projects" element={<ProjectExplorer />} />
                    <Route path="/project/:id" element={<ProjectDetails />} />
                    <Route path="/contractor/:id" element={<ContractorProfile />} />
                    <Route path="/finance" element={<FinancialTransparency />} />
                    <Route path="/gallery" element={<OfficialGallery />} />
                    <Route path="/gallery/community" element={<CommunityGallery />} />
                    <Route path="/discussions" element={<Discussions />} />
                    <Route path="/map" element={<InteractiveMap />} />
                    <Route path="/verification" element={<Verification />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/dashboard/citizen" element={<CitizenDashboard />} />
                    <Route path="/dashboard/government" element={<GovernmentDashboard />} />
                    <Route path="/dashboard/oversight" element={<OversightDashboard />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
            <Footer />
            <MobileNav />
          </div>
        </BrowserRouter>
      </I18nProvider>
    </QueryClientProvider>
  )
}

export default App
