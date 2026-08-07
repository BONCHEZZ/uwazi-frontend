export interface County {
  id: string
  name: string
  code: string
  constituency: Constituency[]
}

export interface Constituency {
  id: string
  name: string
  countyId: string
  ward: Ward[]
}

export interface Ward {
  id: string
  name: string
  constituencyId: string
}

export interface Ministry {
  id: string
  name: string
  code: string
  description: string
}

export interface Contractor {
  id: string
  name: string
  registrationNumber: string
  category: string
  rating: number
  completedProjects: number
  ongoingProjects: number
  delayedProjects: number
  blacklisted: boolean
  riskLevel: 'low' | 'medium' | 'high'
  location: string
  description: string
  email: string
  phone: string
  yearsInBusiness: number
  budgetManaged: number
  citizenRating: number
  completionRate: number
  courtCases: number
  blacklistHistory: boolean
  inspectionReports: number
}

export interface Project {
  id: string
  title: string
  description: string
  code: string
  category: string
  status: 'planning' | 'procurement' | 'construction' | 'completed' | 'on-hold'
  county: string
  constituency: string
  ward: string
  gps: { lat: number; lng: number }
  budget: number
  treasuryAllocation: number
  treasuryDisbursement: number
  expenditure: number
  remainingBalance: number
  fundingSource: string
  implementingMinistry: string
  contractorId: string
  consultant: string
  projectEngineer: string
  startDate: string
  expectedCompletion: string
  actualCompletion?: string
  progress: number
  verificationScore: number
  riskLevel: 'low' | 'medium' | 'high'
  images: string[]
  videos: string[]
  documents: { name: string; url: string }[]
  milestones: Milestone[]
  disbursements: Disbursement[]
  comments: Comment[]
  communityUploads: CommunityUpload[]
  officialUpdates: OfficialUpdate[]
}

export interface Milestone {
  id: string
  title: string
  date: string
  completed: boolean
  description: string
}

export interface Disbursement {
  id: string
  date: string
  amount: number
  source: string
  purpose: string
  status: 'pending' | 'approved' | 'released'
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  date: string
  likes: number
  replies: Comment[]
  isOfficial: boolean
  pinned: boolean
}

export interface CommunityUpload {
  id: string
  userId: string
  userName: string
  type: 'photo' | 'video'
  url: string
  caption: string
  dateTaken: string
  dateUploaded: string
  location: string
  supportsOfficial: boolean
  verificationStatus: 'pending' | 'verified' | 'rejected'
}

export interface OfficialUpdate {
  id: string
  date: string
  title: string
  content: string
  author: string
  images: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: 'citizen' | 'government' | 'oversight'
  avatar: string
  notifications: Notification[]
  bookmarks: string[]
  comments: string[]
  uploads: string[]
}

export interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  type: 'update' | 'comment' | 'verification' | 'alert'
}

export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalBudget: number
  totalDisbursed: number
  totalExpenditure: number
  citizenVerifications: number
  commentsCount: number
  countiesCovered: number
  activeContractors: number
  citizenReports: number
  verifiedReports: number
  delayedProjects: number
}

export interface VerificationOption {
  id: string
  label: string
  icon: string
  color: string
}
