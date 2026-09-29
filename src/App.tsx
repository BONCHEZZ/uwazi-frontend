import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/api'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import MobileNav from '@/components/layout/mobile-nav'
import LandingPage from '@/pages/LandingPage'
import AboutPage from '@/pages/AboutPage'
import ChatPage from '@/pages/ChatPage'
import LoginPage from '@/pages/LoginPage'
import ProjectExplorer from '@/pages/ProjectExplorer'
import ProjectDetails from '@/pages/ProjectDetails'
import ContractorProfile from '@/pages/ContractorProfile'
import FinancialTransparency from '@/pages/FinancialTransparency'
import OfficialGallery from '@/pages/OfficialGallery'
import CommunityGallery from '@/pages/CommunityGallery'
import Discussions from '@/pages/Discussions'
import InteractiveMap from '@/pages/InteractiveMap'
import Verification from '@/pages/Verification'
import CitizenDashboard from '@/pages/CitizenDashboard'
import GovernmentDashboard from '@/pages/GovernmentDashboard'
import OversightDashboard from '@/pages/OversightDashboard'
import FocusAreasPage from '@/pages/FocusAreasPage'
import AuthorizedUsersPage from '@/pages/AuthorizedUsersPage'
import NotificationsPage from '@/pages/NotificationsPage'
import SettingsPage from '@/pages/SettingsPage'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/focus-areas" element={<FocusAreasPage />} />
              <Route path="/authorized-users" element={<AuthorizedUsersPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<LoginPage />} />
              <Route path="/projects" element={<ProjectExplorer />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
              <Route path="/contractor/:id" element={<ContractorProfile />} />
              <Route path="/finance" element={<FinancialTransparency />} />
              <Route path="/gallery" element={<OfficialGallery />} />
              <Route path="/gallery/community" element={<CommunityGallery />} />
              <Route path="/discussions" element={<Discussions />} />
              <Route path="/map" element={<InteractiveMap />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/dashboard/citizen" element={<CitizenDashboard />} />
              <Route path="/dashboard/government" element={<GovernmentDashboard />} />
              <Route path="/dashboard/oversight" element={<OversightDashboard />} />
              <Route path="/dashboard" element={<Navigate to="/dashboard/citizen" replace />} />
              <Route path="/dashboard/projects" element={<Navigate to="/projects" replace />} />
              <Route path="/dashboard/map" element={<Navigate to="/map" replace />} />
              <Route path="/dashboard/discussions" element={<Navigate to="/discussions" replace />} />
              <Route path="/dashboard/gallery" element={<Navigate to="/gallery" replace />} />
              <Route path="/dashboard/finance" element={<Navigate to="/finance" replace />} />
              <Route path="/dashboard/notifications" element={<Navigate to="/notifications" replace />} />
              <Route path="/dashboard/settings" element={<Navigate to="/settings" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <MobileNav />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
