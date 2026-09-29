import { QueryClient } from '@tanstack/react-query'
import type {
  Project,
  County,
  Ministry,
  Contractor,
  DashboardStats,
  User,
  Disbursement,
  Milestone,
  Comment,
} from '../types'

/**
 * UWAZI API adapter.
 *
 * The UI was originally written against a local mock-data contract.  This file
 * keeps that contract stable while translating it to the live UWAZI canonical
 * API (/api/v1/search, /auth/*, /bookmarks, /evidence, /query/*, etc.).
 */

export const queryClient = new QueryClient()

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://uwazi-backend-eight.vercel.app/api/v1').replace(/\/$/, '')
const COUNTY_BUDGET_SOURCE_ID = 'c4b0f6b4-1c7a-4e65-4a9f-e7b05aaf6cbc'
const INTERFACE_HEADER = 'web'
const ACCESS_TOKEN_KEY = 'uwazi_access_token'
const REFRESH_TOKEN_KEY = 'uwazi_refresh_token'
const SESSION_ID_KEY = 'uwazi_session_id'

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresIn: number
  sessionId: string
}

export interface AuthUser {
  id: string
  username?: string | null
  email?: string | null
  name?: string | null
  role?: string | null
  grants?: unknown[]
  [key: string]: unknown
}

export interface QueryAnswer {
  answer?: string
  facts?: unknown[]
  citations?: unknown[]
  uncertainty?: unknown
  [key: string]: unknown
}

export interface CountyBudgetRecord {
  id: string
  externalId: string
  county: string
  fiscalYear: string
  period: string
  classification: string
  isTotal: boolean
  approvedBudgetAssembly: number | null
  approvedBudgetExecutive: number | null
  expenditureAssembly: number | null
  expenditureExecutive: number | null
  absorptionAssembly: number | null
  absorptionExecutive: number | null
}

export interface CountyBudgetRecordPage {
  items: CountyBudgetRecord[]
  total: number
  page: number
  pageSize: number
}

interface ApiEnvelope<T = unknown> {
  success?: boolean
  data?: T
  [key: string]: unknown
}

interface SearchResult {
  id?: string
  entityId?: string
  entityType?: string
  type?: string
  score?: number
  title?: string
  name?: string
  code?: string
  description?: string
  [key: string]: unknown
}

interface SearchData {
  items?: SearchResult[]
  results?: SearchResult[]
  records?: SearchResult[]
  hits?: SearchResult[]
  entities?: SearchResult[]
  pagination?: Record<string, unknown>
  facets?: unknown
  [key: string]: unknown
}

let refreshPromise: Promise<string | null> | null = null

function readToken(key: string) {
  return typeof window === 'undefined' ? null : window.localStorage.getItem(key)
}

function writeTokens(session: AuthSession) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken)
  window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken)
  window.localStorage.setItem(SESSION_ID_KEY, session.sessionId)
}

function clearTokens() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
  window.localStorage.removeItem(SESSION_ID_KEY)
}

function normaliseEnvelope<T>(payload: T | ApiEnvelope<T>): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data as T
  }
  return payload as T
}

async function parseResponse(response: Response) {
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = readToken(REFRESH_TOKEN_KEY)
  if (!refreshToken) return null

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-uwazi-interface': INTERFACE_HEADER,
      },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          clearTokens()
          return null
        }
        const payload = await parseResponse(response) as AuthSession
        writeTokens(payload)
        return payload.accessToken
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('x-uwazi-interface', INTERFACE_HEADER)
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const accessToken = readToken(ACCESS_TOKEN_KEY)
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })

  if (response.status === 401 && retry && !path.startsWith('/auth/')) {
    const newToken = await refreshAccessToken()
    if (newToken) return request<T>(path, options, false)
  }

  const payload = await parseResponse(response)
  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null
      ? String((payload as Record<string, unknown>).message ?? (payload as Record<string, unknown>).error ?? `Request failed with ${response.status}`)
      : `Request failed with ${response.status}`
    throw new Error(message)
  }

  return normaliseEnvelope(payload as T | ApiEnvelope<T>)
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^0-9.-]/g, ''))
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const parsed = toNumber(value, Number.NaN)
  return Number.isFinite(parsed) ? parsed : null
}

function toStringValue(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback
  return String(value)
}

function pick<T = unknown>(source: Record<string, unknown>, keys: string[], fallback?: T): T {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) return source[key] as T
  }
  return fallback as T
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function unwrapSearchRecord(item: SearchResult): Record<string, unknown> {
  const candidates = [
    item,
    asRecord(item.data),
    asRecord(item.record),
    asRecord(item.attributes),
    asRecord(item.entity),
    asRecord(item.document),
    asRecord(item.source),
  ]
  return Object.assign({}, ...candidates)
}

function extractSearchItems(data: SearchData | unknown): SearchResult[] {
  const root = asRecord(data)
  const candidates = [root.items, root.results, root.records, root.hits, root.entities]
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as SearchResult[]
  }
  return []
}

function normaliseStatus(value: unknown): Project['status'] {
  const status = toStringValue(value).toLowerCase().replace(/\s+/g, '_')
  if (status.includes('complete') || status === 'completed') return 'completed'
  if (status.includes('construct') || status.includes('progress') || status === 'active') return 'construction'
  if (status.includes('procure') || status.includes('tender')) return 'procurement'
  if (status.includes('hold') || status.includes('stalled') || status.includes('suspend')) return 'on-hold'
  return 'planning'
}

function normaliseRisk(value: unknown): Project['riskLevel'] {
  const risk = toStringValue(value).toLowerCase()
  if (risk.includes('high') || risk.includes('critical')) return 'high'
  if (risk.includes('medium') || risk.includes('moderate')) return 'medium'
  return 'low'
}

function normaliseDate(value: unknown): string {
  if (!value) return new Date().toISOString()
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

function normaliseArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function mapMilestones(value: unknown): Milestone[] {
  return normaliseArray(value).map((item, index) => {
    const source = asRecord(item)
    return {
      id: toStringValue(pick(source, ['id', 'eventId']), `milestone-${index}`),
      title: toStringValue(pick(source, ['title', 'name', 'label']), 'Milestone'),
      date: normaliseDate(pick(source, ['date', 'eventDate', 'occurredAt'])),
      completed: Boolean(pick(source, ['completed', 'isCompleted'], false)),
      description: toStringValue(pick(source, ['description', 'details']), ''),
    }
  })
}

function mapDisbursements(value: unknown): Disbursement[] {
  return normaliseArray(value).map((item, index) => {
    const source = asRecord(item)
    const rawStatus = toStringValue(pick(source, ['status', 'statusCode']), 'released').toLowerCase()
    const status: Disbursement['status'] = rawStatus.includes('pending') ? 'pending' : rawStatus.includes('approv') ? 'approved' : 'released'
    return {
      id: toStringValue(pick(source, ['id', 'paymentId']), `disbursement-${index}`),
      date: normaliseDate(pick(source, ['date', 'paymentDate', 'transactionDate', 'occurredAt'])),
      amount: toNumber(pick(source, ['amount', 'value', 'paymentAmount'])),
      source: toStringValue(pick(source, ['source', 'payer', 'fundingSource']), 'Treasury'),
      purpose: toStringValue(pick(source, ['purpose', 'description', 'memo']), 'Project funding'),
      status,
    }
  })
}

function mapComments(value: unknown): Comment[] {
  return normaliseArray(value).map((item, index) => {
    const source = asRecord(item)
    return {
      id: toStringValue(pick(source, ['id', 'commentId']), `comment-${index}`),
      userId: toStringValue(pick(source, ['userId', 'authorId']), ''),
      userName: toStringValue(pick(source, ['userName', 'authorName', 'author']), 'UWAZI user'),
      userAvatar: toStringValue(pick(source, ['userAvatar', 'avatar']), ''),
      content: toStringValue(pick(source, ['content', 'text', 'body']), ''),
      date: normaliseDate(pick(source, ['date', 'createdAt', 'updatedAt'])),
      likes: toNumber(pick(source, ['likes', 'likeCount'])),
      replies: mapComments(pick(source, ['replies', 'children'], [])),
      isOfficial: Boolean(pick(source, ['isOfficial', 'official'], false)),
      pinned: Boolean(pick(source, ['pinned', 'isPinned'], false)),
    }
  })
}

function mapProject(item: SearchResult): Project {
  const source = unwrapSearchRecord(item)
  const id = toStringValue(pick(source, ['id', 'entityId', 'recordId']), toStringValue(item.entityId ?? item.id))
  const title = toStringValue(pick(source, ['title', 'name', 'projectName', 'programmeName']), 'Untitled project')
  const latitude = toNumber(pick(source, ['latitude', 'lat', 'gpsLat', 'locationLatitude']))
  const longitude = toNumber(pick(source, ['longitude', 'lng', 'lon', 'gpsLng', 'locationLongitude']))
  const budget = toNumber(pick(source, ['budget', 'approvedBudget', 'amount', 'contractValue']))
  const disbursed = toNumber(pick(source, ['treasuryDisbursement', 'totalDisbursed', 'disbursed', 'paidAmount']))
  const expenditure = toNumber(pick(source, ['expenditure', 'totalExpenditure', 'spent', 'actualSpend']))
  const allocation = toNumber(pick(source, ['treasuryAllocation', 'allocation', 'allocatedAmount']), budget)

  const rawImages = normaliseArray(pick(source, ['images', 'imageUrls', 'photos', 'media']))
  const images = rawImages.map((image) => typeof image === 'string' ? image : toStringValue(pick(asRecord(image), ['url', 'accessUrl', 'downloadUrl']), '')).filter(Boolean)

  return {
    id,
    title,
    description: toStringValue(pick(source, ['description', 'summary', 'details']), ''),
    code: toStringValue(pick(source, ['code', 'projectCode', 'referenceCode']), id),
    category: toStringValue(pick(source, ['category', 'programmeTypeCode', 'programmeType', 'sector']), 'Government project'),
    status: normaliseStatus(pick(source, ['status', 'statusCode', 'projectStatus'])),
    county: toStringValue(pick(source, ['county', 'countyName']), ''),
    constituency: toStringValue(pick(source, ['constituency', 'constituencyName']), ''),
    ward: toStringValue(pick(source, ['ward', 'wardName']), ''),
    gps: { lat: latitude, lng: longitude },
    budget,
    treasuryAllocation: allocation,
    treasuryDisbursement: disbursed,
    expenditure,
    remainingBalance: Math.max(0, allocation - expenditure),
    fundingSource: toStringValue(pick(source, ['fundingSource', 'funder', 'source']), 'Public funds'),
    implementingMinistry: toStringValue(pick(source, ['implementingMinistry', 'ministry', 'ministryName']), ''),
    contractorId: toStringValue(pick(source, ['contractorId', 'contractId', 'implementerId']), ''),
    consultant: toStringValue(pick(source, ['consultant', 'consultantName']), ''),
    projectEngineer: toStringValue(pick(source, ['projectEngineer', 'engineer', 'engineerName']), ''),
    startDate: normaliseDate(pick(source, ['startDate', 'projectStartDate', 'commencementDate'])),
    expectedCompletion: normaliseDate(pick(source, ['expectedCompletion', 'completionDate', 'plannedCompletionDate'])),
    actualCompletion: source.actualCompletion ? normaliseDate(source.actualCompletion) : undefined,
    progress: Math.min(100, Math.max(0, toNumber(pick(source, ['progress', 'completionPercentage', 'percentComplete'])))),
    verificationScore: toNumber(pick(source, ['verificationScore', 'verification', 'confidenceScore'])),
    riskLevel: normaliseRisk(pick(source, ['riskLevel', 'risk', 'severity'])),
    images,
    videos: normaliseArray(pick(source, ['videos', 'videoUrls'])).map(String),
    documents: normaliseArray(pick(source, ['documents', 'attachments'])).map((doc, index) => {
      const d = asRecord(doc)
      return { name: toStringValue(pick(d, ['name', 'title']), `Document ${index + 1}`), url: toStringValue(pick(d, ['url', 'accessUrl', 'downloadUrl']), '') }
    }),
    milestones: mapMilestones(pick(source, ['milestones', 'timeline', 'events'], [])),
    disbursements: mapDisbursements(pick(source, ['disbursements', 'payments', 'transactions'], [])),
    comments: mapComments(pick(source, ['comments'], [])),
    communityUploads: [],
    officialUpdates: [],
  }
}

function mapUser(payload: Record<string, unknown>): User {
  const raw = asRecord(payload.user ?? payload)
  const grants = normaliseArray(payload.grants ?? raw.grants)
  const grantText = JSON.stringify(grants).toLowerCase()
  const explicitRole = toStringValue(pick(raw, ['role', 'roleCode', 'userRole']), '').toLowerCase()
  const role: User['role'] = explicitRole.includes('oversight') || grantText.includes('oversight')
    ? 'oversight'
    : explicitRole.includes('government') || grantText.includes('government') || grantText.includes('project:write')
      ? 'government'
      : 'citizen'

  return {
    id: toStringValue(pick(raw, ['id', 'userId']), ''),
    name: toStringValue(pick(raw, ['name', 'fullName', 'displayName', 'username']), 'UWAZI User'),
    email: toStringValue(pick(raw, ['email', 'emailAddress']), ''),
    role,
    avatar: toStringValue(pick(raw, ['avatar', 'avatarUrl', 'profileImage']), ''),
    notifications: [],
    bookmarks: [],
    comments: [],
    uploads: [],
  }
}

function searchParams(filters: Record<string, unknown> = {}) {
  const params = new URLSearchParams()
  const map: Record<string, string> = {
    search: 'q',
    status: 'status',
    category: 'category',
    county: 'county',
    constituency: 'constituency',
    ward: 'ward',
    minBudget: 'min_amount',
    maxBudget: 'max_amount',
    year: 'from',
  }

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue
    const target = map[key] ?? key
    if (key === 'year') {
      const year = String(value).split(',')[0]
      if (/^\d{4}$/.test(year)) params.set('from', `${year}-01-01T00:00:00.000Z`)
      continue
    }
    params.set(target, Array.isArray(value) ? value.join(',') : String(value))
  }

  params.set('page', '1')
  params.set('pageSize', '200')
  params.set('entity_type', 'governance_record,programme')
  return params
}

async function searchProjects(filters: Record<string, unknown> = {}): Promise<Project[]> {
  const params = searchParams(filters)
  const data = await request<SearchData>(`/search?${params.toString()}`)
  let projects = extractSearchItems(data).map(mapProject).filter((project) => Boolean(project.id))
  const minCompletion = filters.minCompletion === undefined ? undefined : toNumber(filters.minCompletion)
  const maxCompletion = filters.maxCompletion === undefined ? undefined : toNumber(filters.maxCompletion)
  const contractor = filters.contractor ? String(filters.contractor).split(',').filter(Boolean) : []
  if (minCompletion !== undefined) projects = projects.filter((project) => project.progress >= minCompletion)
  if (maxCompletion !== undefined) projects = projects.filter((project) => project.progress <= maxCompletion)
  if (contractor.length) projects = projects.filter((project) => contractor.includes(project.contractorId))
  return projects
}

async function findEntityById(id: string): Promise<SearchResult | undefined> {
  const params = searchParams({ search: id })
  const data = await request<SearchData>(`/search?${params.toString()}`)
  return extractSearchItems(data).find((item) => {
    const source = unwrapSearchRecord(item)
    return toStringValue(pick(source, ['id', 'entityId', 'recordId'])) === id || item.entityId === id || item.id === id
  }) ?? extractSearchItems(data)[0]
}

export const api = {
  get baseUrl() {
    return API_BASE_URL
  },

  async login(usernameOrEmail: string, password: string, mfaCode?: string): Promise<User> {
    const payload = await request<AuthSession & { user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password, ...(mfaCode ? { mfaCode } : {}) }),
    })
    writeTokens(payload)
    const me = await request<Record<string, unknown>>('/auth/me')
    return mapUser(me)
  },

  async logout(): Promise<void> {
    const refreshToken = readToken(REFRESH_TOKEN_KEY)
    try {
      if (refreshToken) {
        await request<void>('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }, false)
      }
    } finally {
      clearTokens()
      queryClient.clear()
    }
  },

  async getUser(): Promise<User> {
    const me = await request<Record<string, unknown>>('/auth/me')
    return mapUser(me)
  },

  async getProjects(filters?: Record<string, unknown>): Promise<Project[]> {
    return searchProjects(filters)
  },

  async getProject(id: string): Promise<Project | undefined> {
    const entity = await findEntityById(id)
    return entity ? mapProject(entity) : undefined
  },

  async getCounties(): Promise<County[]> {
    const projects = await searchProjects()
    const names = Array.from(new Set(projects.map((p) => p.county).filter(Boolean))).sort()
    return names.map((name, index) => ({ id: `county-${index}`, name, code: '', constituency: [] }))
  },

  async getMinistries(): Promise<Ministry[]> {
    const projects = await searchProjects()
    const names = Array.from(new Set(projects.map((p) => p.implementingMinistry).filter(Boolean))).sort()
    return names.map((name, index) => ({ id: `ministry-${index}`, name, code: '', description: '' }))
  },

  async getContractors(): Promise<Contractor[]> {
    const projects = await searchProjects()
    const grouped = new Map<string, Project[]>()
    for (const project of projects) {
      if (!project.contractorId) continue
      const current = grouped.get(project.contractorId) ?? []
      current.push(project)
      grouped.set(project.contractorId, current)
    }
    return Array.from(grouped.entries()).map(([id, items]) => ({
      id,
      name: items[0].contractorId || 'Contractor',
      registrationNumber: '',
      category: items[0].category,
      rating: 0,
      completedProjects: items.filter((p) => p.status === 'completed').length,
      ongoingProjects: items.filter((p) => p.status === 'construction').length,
      riskLevel: items.some((p) => p.riskLevel === 'high') ? 'high' : items.some((p) => p.riskLevel === 'medium') ? 'medium' : 'low',
      location: items[0].county,
      description: `Contractor associated with ${items.length} UWAZI project${items.length === 1 ? '' : 's'}.`,
    }))
  },

  async getContractor(id: string): Promise<Contractor | undefined> {
    const projects = await searchProjects()
    const associated = projects.filter((p) => p.contractorId === id)
    if (!associated.length) return undefined
    return {
      id,
      name: id,
      registrationNumber: '',
      category: associated[0].category,
      rating: 0,
      completedProjects: associated.filter((p) => p.status === 'completed').length,
      ongoingProjects: associated.filter((p) => p.status === 'construction').length,
      riskLevel: associated.some((p) => p.riskLevel === 'high') ? 'high' : associated.some((p) => p.riskLevel === 'medium') ? 'medium' : 'low',
      location: associated[0].county,
      description: `Contractor associated with ${associated.length} UWAZI project${associated.length === 1 ? '' : 's'}.`,
    }
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const projects = await searchProjects()
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === 'construction').length,
      completedProjects: projects.filter((p) => p.status === 'completed').length,
      totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
      totalDisbursed: projects.reduce((sum, p) => sum + p.treasuryDisbursement, 0),
      totalExpenditure: projects.reduce((sum, p) => sum + p.expenditure, 0),
      citizenVerifications: projects.reduce((sum, p) => sum + (p.verificationScore > 0 ? 1 : 0), 0),
      commentsCount: projects.reduce((sum, p) => sum + p.comments.length, 0),
    }
  },

  async getFeaturedProjects(): Promise<Project[]> {
    return searchProjects({ status: 'construction' })
  },

  async getBudgetSummaries() {
    const projects = await searchProjects()
    const grouped = new Map<string, { category: string; allocated: number; disbursed: number; expenditure: number; remaining: number }>()
    for (const project of projects) {
      const key = project.category || 'Unspecified'
      const current = grouped.get(key) ?? { category: key, allocated: 0, disbursed: 0, expenditure: 0, remaining: 0 }
      current.allocated += project.treasuryAllocation || project.budget
      current.disbursed += project.treasuryDisbursement
      current.expenditure += project.expenditure
      current.remaining = Math.max(0, current.allocated - current.expenditure)
      grouped.set(key, current)
    }
    return Array.from(grouped.values())
  },

  async getCountyBudgetRecords(page = 1, pageSize = 20): Promise<CountyBudgetRecordPage> {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    const response = await request<{
      items?: unknown[]
      total?: number
      page?: number
      pageSize?: number
    }>(`/public/sources/${COUNTY_BUDGET_SOURCE_ID}/records?${params.toString()}`)

    return {
      items: normaliseArray(response.items).map((item, index) => {
        const record = asRecord(item)
        const sourcePayload = asRecord(record.sourcePayload)
        return {
          id: toStringValue(record.id, `budget-record-${index}`),
          externalId: toStringValue(record.externalId),
          county: toStringValue(sourcePayload.county, 'Unknown county'),
          fiscalYear: toStringValue(sourcePayload.fiscalYear),
          period: toStringValue(sourcePayload.period),
          classification: toStringValue(sourcePayload.classification, 'Unclassified'),
          isTotal: sourcePayload.isTotal === true,
          approvedBudgetAssembly: toNullableNumber(sourcePayload.approvedBudgetAssembly),
          approvedBudgetExecutive: toNullableNumber(sourcePayload.approvedBudgetExecutive),
          expenditureAssembly: toNullableNumber(sourcePayload.expenditureAssembly),
          expenditureExecutive: toNullableNumber(sourcePayload.expenditureExecutive),
          absorptionAssembly: toNullableNumber(sourcePayload.absorptionAssembly),
          absorptionExecutive: toNullableNumber(sourcePayload.absorptionExecutive),
        }
      }),
      total: toNumber(response.total),
      page: toNumber(response.page, page),
      pageSize: toNumber(response.pageSize, pageSize),
    }
  },

  async getRiskIndicators(): Promise<Array<{ id: string; project: string; level: 'low' | 'medium' | 'high'; score: number; category: string; description: string }>> {
    const projects = await searchProjects()
    return projects.filter((p) => p.riskLevel !== 'low').map((p) => ({
      id: p.id,
      project: p.title,
      level: p.riskLevel,
      score: Math.round(p.verificationScore || (p.riskLevel === 'high' ? 80 : 55)),
      category: p.category,
      description: p.description,
    }))
  },

  async getAuditChecklist(): Promise<Array<{ id: string; item: string; status: string; assignedTo: string; dueDate: string }>> {
    return []
  },

  async getVerificationQueue(): Promise<Array<Record<string, any>>> {
    const evidence = await request<{ items?: unknown[] }>('/evidence?page=1&pageSize=100')
    return normaliseArray(evidence.items).map((item, index) => {
      const source = asRecord(item)
      return {
        id: toStringValue(source.id, `evidence-${index}`),
        project: toStringValue(source.title, 'Evidence submission'),
        type: toStringValue(source.evidenceType, 'evidence'),
        submittedBy: 'Authenticated contributor',
        date: toStringValue(source.createdAt, new Date().toISOString()),
        status: 'pending',
        priority: 'medium',
      }
    })
  },

  async getContractMonitoring(): Promise<Array<{ id: string; contractor: string; project: string; contractValue: number; progress: number; milestones: number; completedMilestones: number; onSchedule: boolean; riskLevel: string }>> {
    const projects = await searchProjects()
    return projects.filter((p) => p.contractorId).map((p) => ({
      id: p.id,
      contractor: p.contractorId,
      project: p.title,
      contractValue: p.budget,
      progress: p.progress,
      milestones: p.milestones.length,
      completedMilestones: p.milestones.filter((m) => m.completed).length,
      onSchedule: p.status !== 'on-hold',
      riskLevel: p.riskLevel,
    }))
  },

  async getFraudIndicators(): Promise<Array<Record<string, any>>> {
    const signals = await request<unknown>('/intelligence/signals?page=1&pageSize=100')
    return normaliseArray(signals).map((item, index) => {
      const source = asRecord(item)
      return {
        id: toStringValue(source.id, `signal-${index}`),
        type: toStringValue(pick(source, ['signalTypeCode', 'type', 'category']), 'Intelligence signal'),
        project: toStringValue(pick(source, ['entityName', 'project', 'title']), 'UWAZI entity'),
        severity: toStringValue(pick(source, ['severity', 'severityCode']), 'medium').toLowerCase(),
        description: toStringValue(pick(source, ['description', 'explanation']), ''),
        date: toStringValue(pick(source, ['createdAt', 'detectedAt']), new Date().toISOString()),
        status: toStringValue(pick(source, ['statusCode', 'status']), 'review'),
      }
    })
  },

  async getInspectionSchedules(): Promise<Array<{ id: string; project: string; inspector: string; date: string; type: string; status: string }>> {
    return []
  },

  async getReports(): Promise<Array<{ id: string; title: string; type: string; generatedBy: string; date: string; status: string; format: string }>> {
    return []
  },

  async getAchievements(): Promise<Array<{ id: string; title: string; description: string; icon: string; color: string; unlocked: boolean; date: string | null }>> {
    return []
  },

  async getCommunityContributions(): Promise<Array<{ id: string; type: string; title: string; author: string; date: string; status: string; projectId: string }>> {
    const evidence = await request<{ items?: unknown[] }>('/evidence?page=1&pageSize=100')
    return normaliseArray(evidence.items).map((item, index) => {
      const source = asRecord(item)
      return {
        id: toStringValue(source.id, `evidence-${index}`),
        type: 'photo',
        title: toStringValue(source.title, 'Community evidence'),
        author: 'Authenticated contributor',
        date: toStringValue(source.createdAt, new Date().toISOString()),
        status: 'pending',
        projectId: toStringValue(pick(source, ['entityId', 'projectId']), ''),
      }
    })
  },

  async getProjectsNearMe(latitude?: number, longitude?: number, radiusKm = 25) {
    const projects = await searchProjects({})
    if (latitude === undefined || longitude === undefined) return projects
    return projects.filter((project) => {
      const latDistance = (project.gps.lat - latitude) * 111
      const lngDistance = (project.gps.lng - longitude) * 111 * Math.cos(latitude * Math.PI / 180)
      return Math.sqrt(latDistance ** 2 + lngDistance ** 2) <= radiusKm
    })
  },

  async getBookmarks() {
    const data = await request<unknown>('/bookmarks')
    const root = asRecord(data)
    return normaliseArray(root.items ?? root.bookmarks ?? data)
  },

  async addBookmark(entityType: string, entityId: string, note?: string) {
    return request<unknown>('/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ entityType, entityId, ...(note ? { note } : {}) }),
    })
  },

  async removeBookmark(id: string) {
    return request<void>(`/bookmarks/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },

  async getEntityTimeline(entityType: string, entityId: string) {
    return request<unknown>(`/entities/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}/timeline?limit=500`)
  },

  async getEntityRelationships(entityType: string, entityId: string) {
    return request<unknown>(`/entities/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}/relationships?depth=2&limit=200`)
  },

  async registerEvidence(file: File | Blob) {
    return request<unknown>('/evidence', {
      method: 'POST',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    })
  },

  async linkEvidence(evidenceId: string, entityType: string, entityId: string, linkTypeCode = 'SUPPORTS', explanation?: string) {
    return request<unknown>(`/evidence/${encodeURIComponent(evidenceId)}/links`, {
      method: 'POST',
      body: JSON.stringify({ entityType, entityId, linkTypeCode, ...(explanation ? { explanation } : {}) }),
    })
  },

  async createObservation(input: {
    observationTypeCode: string
    title: string
    description?: string
    observedDate?: string
    statusValueId: string
    sourceRecordId?: string
    supportingEvidenceIds?: string[]
    metadata?: Record<string, unknown>
  }) {
    return request<unknown>('/observations', { method: 'POST', body: JSON.stringify(input) })
  },

  async answerQuery(question: string, entityType?: string, entityId?: string): Promise<QueryAnswer> {
    return request<QueryAnswer>('/query/answer', {
      method: 'POST',
      body: JSON.stringify({ question, ...(entityType ? { entityType } : {}), ...(entityId ? { entityId } : {}) }),
    })
  },
}
