import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  if (amount >= 1e9) {
    return `KSh ${(amount / 1e9).toFixed(1)}B`
  }
  if (amount >= 1e6) {
    return `KSh ${(amount / 1e6).toFixed(0)}M`
  }
  if (amount >= 1e3) {
    return `KSh ${(amount / 1e3).toFixed(0)}K`
  }
  return `KSh ${amount.toLocaleString()}`
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
