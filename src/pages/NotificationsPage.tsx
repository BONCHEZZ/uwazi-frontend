import { Bell, CheckCircle2, MessageCircle, ShieldAlert, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/stores/useAppStore"

const iconFor = (type: string) => type === "comment" ? MessageCircle : type === "verification" ? CheckCircle2 : type === "alert" ? ShieldAlert : Bell

export default function NotificationsPage() {
  const user = useAppStore((state) => state.user)
  const notifications = useAppStore((state) => state.notifications)
  const markRead = useAppStore((state) => state.markNotificationRead)
  const items = notifications.length ? notifications : (user?.notifications ?? [])

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-kenya-black">Notifications</h1><p className="mt-1 text-sm text-kenya-black/60">Updates about projects, discussions and verification activity.</p></div>
        <Button variant="outline" size="sm" onClick={() => items.forEach((n) => markRead(n.id))}><RefreshCw className="mr-2 h-4 w-4" />Mark all read</Button>
      </div>
      <div className="mt-6 space-y-3">
        {items.length ? items.map((notification) => { const Icon = iconFor(notification.type); return (
          <Card key={notification.id} className={notification.read ? "" : "border-kenya-red/30 bg-kenya-red/[0.03]"}>
            <CardContent className="flex gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-kenya-gray text-kenya-red"><Icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><h2 className="font-semibold text-kenya-black">{notification.title}</h2><span className="shrink-0 text-xs text-kenya-black/40">{new Date(notification.date).toLocaleDateString("en-KE")}</span></div><p className="mt-1 text-sm text-kenya-black/60">{notification.message}</p>{!notification.read && <Button variant="link" className="h-auto px-0 pt-2 text-kenya-red" onClick={() => markRead(notification.id)}>Mark as read</Button>}</div>
            </CardContent>
          </Card>
        )}) : <Card><CardContent className="py-14 text-center"><Bell className="mx-auto h-8 w-8 text-kenya-black/20" /><p className="mt-3 font-medium">No notifications yet</p><p className="mt-1 text-sm text-kenya-black/50">Project and account updates will appear here.</p></CardContent></Card>}
      </div>
    </div>
  )
}
