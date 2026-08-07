import type { Notification } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, MessageSquare, Upload, Star, CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Link } from "react-router-dom"

interface RecentActivityProps {
  notifications: Notification[]
  limit?: number
  showLinks?: boolean
}

const typeIcons = {
  update: { icon: Bell, bg: "bg-blue-100 text-blue-600", label: "Update" },
  comment: { icon: MessageSquare, bg: "bg-green-100 text-green-600", label: "Comment" },
  verification: { icon: CheckCircle, bg: "bg-purple-100 text-purple-600", label: "Verification" },
  alert: { icon: AlertTriangle, bg: "bg-red-100 text-red-600", label: "Alert" },
  bookmark: { icon: Star, bg: "bg-amber-100 text-amber-600", label: "Bookmark" },
  upload: { icon: Upload, bg: "bg-teal-100 text-teal-600", label: "Upload" },
} as const

const RecentActivity = function RecentActivity({
  notifications,
  limit = 10,
  showLinks = true,
}: RecentActivityProps) {
  const recent = notifications
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)

  if (recent.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center text-sm text-gray-500">
            <Bell className="mx-auto mb-2 h-8 w-8 opacity-30" />
            <p>No recent activity</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-kenya-border">
          {recent.map((n) => {
            const typeInfo = typeIcons[n.type] || { bg: "bg-gray-100 text-gray-600", label: n.type }

            return (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 p-3 transition-colors hover:bg-kenya-gray/20",
                  !n.read && "bg-kenya-gray/30"
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${n.id}`} />
                  <AvatarFallback className="text-xs">
                    {n.title.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-kenya-black leading-tight">
                      {n.title}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] shrink-0", typeInfo.bg)}
                    >
                      {typeInfo.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-kenya-black/70 leading-tight">{n.message}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-kenya-black/50">
                      {formatDistanceToNow(new Date(n.date), { addSuffix: true })}
                    </p>
                    {showLinks && n.type === "update" && (
                      <Link
                        to={`/project/prj-001`}
                        className="text-xs text-kenya-red hover:underline"
                      >
                        View project →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivity