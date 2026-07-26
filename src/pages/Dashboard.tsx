import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, User, Unlock, ArrowRight, FileText } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

type Profile = {
  full_name: string | null
  department_id: string | null
  level: string | null
  institution: string | null
  phone: string | null
}
type Unlocked = { state: string; city: string; paid_at: string; company_count: number }
type Application = {
  id: string
  company_id: string
  status: string
  sent_to_email: string | null
  created_at: string
  snapshot: { company_name?: string; info?: Record<string, string> } | null
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string>("")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [departmentName, setDepartmentName] = useState<string>("")
  const [unlocked, setUnlocked] = useState<Unlocked[]>([])

  useEffect(() => {
    document.title = "Dashboard — ChedLink"
  }, [])

  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    ;(async () => {
      const { data: sess } = await supabase.auth.getSession()
      if (!sess.session) {
        navigate("/login", { replace: true })
        return
      }
      const user = sess.session.user
      setEmail(user.email || "")
      const meta = (user.user_metadata || {}) as Record<string, string | null>

      const uid = user.id
      const [{ data: prof }, { data: locs }, { data: apps }] = await Promise.all([
        supabase.from("profiles").select("full_name, department_id, level, institution, phone").eq("id", uid).maybeSingle(),
        supabase.rpc("get_my_unlocked_locations"),
        supabase.from("applications").select("id, company_id, status, sent_to_email, created_at, snapshot").eq("user_id", uid).order("created_at", { ascending: false }).limit(10),
      ])

      // Merge DB profile with auth metadata so nothing appears "unset" if the value exists
      const merged: Profile = {
        full_name: prof?.full_name ?? meta.full_name ?? null,
        department_id: prof?.department_id ?? (meta.department_id as string) ?? null,
        level: prof?.level ?? meta.level ?? null,
        institution: prof?.institution ?? meta.institution ?? null,
        phone: prof?.phone ?? meta.phone ?? null,
      }
      setProfile(merged)
      setUnlocked((locs as Unlocked[]) || [])
      setApplications((apps as Application[]) || [])

      if (merged.department_id) {
        const { data: dept } = await supabase
          .from("departments")
          .select("name")
          .eq("id", merged.department_id)
          .maybeSingle()
        setDepartmentName(dept?.name || "")
      }
      setLoading(false)
    })()
  }, [navigate])

  const signOut = async () => {
    await supabase.auth.signOut()
    toast.success("Signed out")
    navigate("/", { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24 md:py-28 max-w-6xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-ink leading-tight">
              {profile?.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}` : "Welcome"}
            </h1>
            <p className="text-muted-foreground mt-2">
              Your placement activity at a glance.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link to="/placements">Find placements <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/profile">Edit profile</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
          </div>
        </div>

        {/* Snapshot cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
                <User className="w-3.5 h-3.5" />Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium truncate">{profile?.full_name || "—"}</div>
              <div className="text-xs text-muted-foreground truncate">{email}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium truncate">
                {departmentName || (
                  <Link to="/profile" className="text-primary underline">Set now</Link>
                )}
              </div>
              {profile?.level && <div className="text-xs text-muted-foreground">{profile.level}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Institution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium truncate">
                {profile?.institution || (
                  <Link to="/profile" className="text-primary underline">Add</Link>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-ink text-primary-foreground border-ink">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-[0.15em] text-primary-foreground/60">
                Cities unlocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display">{unlocked.length}</div>
              <div className="text-xs text-primary-foreground/60 mt-1">
                {applications.length} application{applications.length === 1 ? "" : "s"} sent
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unlocked cities */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="font-display text-xl">Your unlocked cities</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Access companies inside cities you've paid to unlock.
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link to="/placements">Find more <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {unlocked.length === 0 ? (
              <div className="py-12 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="text-muted-foreground mb-4">You haven't unlocked any cities yet.</p>
                <Button asChild>
                  <Link to="/placements">Browse placements</Link>
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {unlocked.map((u) => (
                  <Link
                    key={`${u.state}|${u.city}`}
                    to="/placements"
                    className="group p-4 border rounded-lg flex items-center justify-between hover:border-primary hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold flex items-center gap-2 truncate">
                        <MapPin className="w-4 h-4 shrink-0 text-primary" />
                        {u.city}
                        <span className="text-muted-foreground font-normal">· {u.state}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {u.company_count} companies · since {new Date(u.paid_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 hover:bg-emerald-600 shrink-0">
                      <Unlock className="w-3 h-3 mr-1" />Paid
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <FileText className="w-5 h-5" />Your applications
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Most recent internship applications you've submitted.
            </p>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="py-10 text-center">
                <FileText className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="text-muted-foreground text-sm">
                  No applications yet. Unlock a city and apply to a company.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {applications.map((a) => (
                  <div key={a.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {a.snapshot?.company_name || "Company"}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        Sent to {a.sent_to_email || "—"} · {new Date(a.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge
                      variant={
                        a.status === "accepted"
                          ? "default"
                          : a.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                      className="capitalize shrink-0"
                    >
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard
