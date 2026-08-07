import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Notification } from '../types'

interface AppState {
  user: User | null
  setUser: (user: User) => void
  bookmarks: string[]
  toggleBookmark: (projectId: string) => void
  isBookmarked: (projectId: string) => boolean
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: Record<string, string>
  setFilter: (key: string, value: string) => void
  clearFilters: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      bookmarks: [],
      toggleBookmark: (projectId) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(projectId)
            ? state.bookmarks.filter((id) => id !== projectId)
            : [...state.bookmarks, projectId],
        })),
      isBookmarked: (projectId) => get().bookmarks.includes(projectId),
      notifications: [],
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      filters: {},
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      clearFilters: () => set({ filters: {} }),
    }),
    {
      name: 'uwazi-storage',
    }
  )
)
