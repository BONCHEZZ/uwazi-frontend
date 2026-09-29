import { Link } from "react-router-dom"
import { CheckCircle2, ShieldCheck, UserCheck, LockKeyhole } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const roles = [
  { title: "Citizens", text: "Browse projects, inspect public information, contribute evidence and report observations.", icon: UserCheck },
  { title: "Government Officers", text: "Authorized officers can manage assigned project information and provide official updates.", icon: ShieldCheck },
  { title: "Oversight Institutions", text: "Authorized oversight users can review evidence, reports and accountability information.", icon: CheckCircle2 },
]

export default function AuthorizedUsersPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-kenya-red/10 text-kenya-red"><LockKeyhole className="h-6 w-6" /></div>
        <h1 className="mt-4 text-3xl font-bold text-kenya-black">Authorized users</h1>
        <p className="mt-3 text-kenya-black/60">UWAZI separates public access from privileged project-management and oversight capabilities.</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {roles.map(({ title, text, icon: Icon }) => (
          <Card key={title}>
            <CardHeader><Icon className="h-6 w-6 text-kenya-red" /><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
            <CardContent><p className="text-sm leading-6 text-kenya-black/60">{text}</p></CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-kenya-border bg-kenya-gray p-6">
        <h2 className="font-semibold text-kenya-black">Account verification</h2>
        <p className="mt-2 text-sm leading-6 text-kenya-black/60">Privileged roles should be verified by the UWAZI administration or the relevant institution. The frontend should never be treated as the authority for granting permissions.</p>
        <Button className="mt-4" asChild><Link to="/login">Sign in</Link></Button>
      </div>
    </div>
  )
}
