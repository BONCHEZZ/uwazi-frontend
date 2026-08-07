import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import { useAppStore } from "@/stores/useAppStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  DollarSign,
  Construction,
  Camera,
  UserMinus,
  ClipboardCheck,
} from "lucide-react"
import { cn, formatTimeAgo } from "@/lib/utils"
import { motion } from "framer-motion"
import type { Notification } from "@/types"

const typeStyles: Record<string, { icon: typeof Bell; color: string }> = {
  update: { icon: Construction, color: "text-blue-600 bg-blue-50" },
  comment: { icon: MessageSquare, color: "text-green-600 bg-green-50" },
  verification: { icon: ShieldCheck, color: "text-purple-600 bg-purple-50" },
  alert: { icon: AlertTriangle, color: "text-red-600 bg-red-50" },
  funds: { icon: DollarSign, color: "text-amber-600 bg-amber-50" },
  photo: { icon: Camera, color: "text-cyan-600 bg-cyan-50" },
  contractor: { icon: UserMinus, color: "text-orange-600 bg-orange-50" },
  inspection: { icon: ClipboardCheck, color: "text-emerald-600 bg-emerald-50" },
}

function NotificationItem({ notification }: { notification: Notification }) {
  const { markNotificationRead } = useAppStore()
  const style = typeStyles[notification.type] ?? typeStyles.update
  const Icon = style.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 transition-colors",
        notification.read ? "border-kenya-border bg-white" : "border-kenya-red/30 bg-red-50/40"
      )}
    >
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", style.color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-kenya-black">{notification.title}</p>
          <span className="text-xs text-kenya-black/50 shrink-0">
            {formatTimeAgo(new Date(notification.date))}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-kenya-black/70 leading-relaxed">{notification.message}</p>
      </div>
      {!notification.read && (
        <button
          type="button"
          onClick={() => markNotificationRead(notification.id)}
          className="shrink-0 rounded-full p-1 hover:bg-kenya-gray transition-colors"
          aria-label="Mark as read"
        >
          <CheckCheck className="h-4 w-4 text-kenya-green" />
        </button>
      )}
    </motion.div>
  )
}

function NotificationsPage() {
  const { user, markNotificationRead } = useAppStore()
  const { data: fetchedUser } = useQuery({
    queryKey: ["user"],
    queryFn: api.getUser,
  })

  const notifications: Notification[] = useMemo(() => {
    return (user?.notifications ?? fetchedUser?.notifications ?? []).map((n) => ({
      ...n,
      read: user ? user.notifications.find((u) => u.id === n.id)?.read ?? n.read : n.read,
    }))
  }, [user, fetchedUser])

  const unread = notifications.filter((n) => !n.read)
  const read = notifications.filter((n) => n.read)

  const markAllRead = () => {
    notifications.forEach((n) => markNotificationRead(n.id))
  }

  return (
    <div className="min-h-screen bg-kenya-gray py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-kenya-red/10">
              <Bell className="h-6 w-6 text-kenya-red" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-kenya-black">Notifications</h1>
              <p className="text-sm text-kenya-black/60">
                {unread.length} unread notification{unread.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {unread.length > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unread.length})</TabsTrigger>
            <TabsTrigger value="read">Read ({read.length})</TabsTrigger>
          </TabsList>

{[
            { value: "all", items: notifications },
            { value: "unread", items: unread },
            { value: "read", items: read },
          ].map(({ value, items }) => (
            <TabsContent key={value} value={value} className="space-y-3">
              {items.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Bell className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-sm text-kenya-black/60">No notifications here.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {items.map((n) => (
                    <NotificationItem key={n.id} notification={n} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export default NotificationsPage
