import { useState } from "react"
import { Bell, Globe2, Lock, Save, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/stores/useAppStore"

export default function SettingsPage() {
  const user = useAppStore((state) => state.user)
  const setUser = useAppStore((state) => state.setUser)
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const saveProfile = () => {
    if (user) setUser({ ...user, name: name.trim() || user.name, email: email.trim() || user.email })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-kenya-black">Settings</h1>
      <p className="mt-1 text-sm text-kenya-black/60">Manage your UWAZI profile and preferences.</p>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-kenya-red" />Profile</CardTitle></CardHeader><CardContent className="space-y-4">
          <div><Label htmlFor="name">Name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" /></div>
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" /></div>
          <div><Label>Role</Label><Input value={user?.role ?? "citizen"} readOnly className="mt-1 capitalize" /></div>
          <Button onClick={saveProfile}><Save className="mr-2 h-4 w-4" />{saved ? "Saved" : "Save changes"}</Button>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Preferences</CardTitle></CardHeader><CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-4"><div className="flex gap-3"><Bell className="mt-0.5 h-5 w-5 text-kenya-red" /><div><p className="font-medium">Notifications</p><p className="text-sm text-kenya-black/50">Receive updates about projects and activity.</p></div></div><Switch checked={notifications} onCheckedChange={setNotifications} /></div>
          <div className="flex gap-3"><Globe2 className="h-5 w-5 text-kenya-red" /><div><p className="font-medium">Language</p><p className="text-sm text-kenya-black/50">English is currently selected. Kiswahili support can be enabled when translations are connected.</p></div></div>
          <div className="flex gap-3"><Lock className="h-5 w-5 text-kenya-red" /><div><p className="font-medium">Security</p><p className="text-sm text-kenya-black/50">Password and session controls should be connected to the backend authentication service.</p></div></div>
        </CardContent></Card>
      </div>
    </div>
  )
}
