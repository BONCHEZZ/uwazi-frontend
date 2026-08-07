import { QueryClient } from '@tanstack/react-query'
import type { Project, County, Ministry, Contractor, DashboardStats } from '../types'
import { projects as mockProjects, counties as mockCounties, ministries as mockMinistries, contractors as mockContractors, dashboardStats as mockStats, currentUser, budgetSummaries, riskIndicators, auditChecklist, verificationQueue, contractMonitoring, fraudIndicators, inspectionSchedules, reports, achievements, communityContributions, projectsNearMe } from '../data/mockData'

export const queryClient = new QueryClient()

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  async getProjects(filters?: Record<string, unknown>): Promise<Project[]> {
    await delay(300)
    let result = [...mockProjects]
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && typeof value === 'string' && value !== '') {
          if (key === 'county') result = result.filter((p) => p.county.toLowerCase() === (value as string).toLowerCase())
          if (key === 'category') result = result.filter((p) => p.category.toLowerCase() === (value as string).toLowerCase())
          if (key === 'status') result = result.filter((p) => p.status === (value as string))
          if (key === 'ministry') result = result.filter((p) => p.implementingMinistry.toLowerCase().includes((value as string).toLowerCase()))
          if (key === 'search') {
            const q = (value as string).toLowerCase()
            result = result.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
          }
        }
      })
    }
    return result
  },

  async getProject(id: string): Promise<Project | undefined> {
    await delay(200)
    return mockProjects.find((p) => p.id === id)
  },

  async getCounties(): Promise<County[]> {
    await delay(150)
    return mockCounties
  },

  async getMinistries(): Promise<Ministry[]> {
    await delay(150)
    return mockMinistries
  },

  async getContractors(): Promise<Contractor[]> {
    await delay(150)
    return mockContractors
  },

  async getContractor(id: string): Promise<Contractor | undefined> {
    await delay(150)
    return mockContractors.find((c) => c.id === id)
  },

  async getDashboardStats(): Promise<DashboardStats> {
    await delay(250)
    return mockStats
  },

  async getUser(): Promise<typeof currentUser> {
    await delay(100)
    return currentUser
  },

  async getFeaturedProjects(): Promise<Project[]> {
    await delay(200)
    return mockProjects.filter((p) => p.status === 'construction').slice(0, 4)
  },

  async getBudgetSummaries() {
    await delay(200)
    return budgetSummaries
  },

  async getRiskIndicators() {
    await delay(200)
    return riskIndicators
  },

  async getAuditChecklist() {
    await delay(150)
    return auditChecklist
  },

  async getVerificationQueue() {
    await delay(200)
    return verificationQueue
  },

  async getContractMonitoring() {
    await delay(200)
    return contractMonitoring
  },

  async getFraudIndicators() {
    await delay(200)
    return fraudIndicators
  },

  async getInspectionSchedules() {
    await delay(150)
    return inspectionSchedules
  },

  async getReports() {
    await delay(200)
    return reports
  },

  async getAchievements() {
    await delay(150)
    return achievements
  },

  async getCommunityContributions() {
    await delay(150)
    return communityContributions
  },

  async getProjectsNearMe() {
    await delay(200)
    return projectsNearMe
  },
}
