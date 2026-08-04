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
import CompanyDirectory from "@/components/CompanyDirectory"



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
      <main className="flex-1 container mx-auto px-4 pt-28 pb-24 md:pt-32 max-w-6xl">
        {/* Page heading */}
        <header className="mb-12 md:mb-16">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-2xl">
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Dashboard</div>
              <h1 className="text-4xl md:text-6xl font-display text-ink leading-[1.05] tracking-tight">
                {profile?.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}.` : "Welcome."}
              </h1>
              <p className="text-muted-foreground mt-4 text-base md:text-lg">
                Your placement activity at a glance.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button asChild size="sm" className="rounded-full bg-ink text-primary-foreground hover:bg-ink/90">
                <Link to="/placements">Find placements <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link to="/profile">Edit profile</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
            </div>
          </div>
          <div className="h-px bg-ink/10 mt-10" />
        </header>

        {/* Key stats — editorial numbers */}
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Overview</div>
              <h2 className="font-display text-2xl md:text-3xl text-ink">Your snapshot</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Hero stat 1 */}
            <Card className="lg:col-span-1 bg-ink text-primary-foreground border-ink">
              <CardContent className="p-6">
                <div className="text-[10px] uppercase tracking-[0.25em] text-primary-foreground/60 mb-3">Cities unlocked</div>
                <div className="text-6xl font-display leading-none">{unlocked.length}</div>
                <div className="text-xs text-primary-foreground/60 mt-3">
                  {unlocked.length === 0 ? "None yet" : `${unlocked.reduce((n, u) => n + u.company_count, 0)} companies revealed`}
                </div>
              </CardContent>
            </Card>

            {/* Hero stat 2 */}
            <Card className="lg:col-span-1 border-ink/20">
              <CardContent className="p-6">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">Applications</div>
                <div className="text-6xl font-display leading-none text-ink">{applications.length}</div>
                <div className="text-xs text-muted-foreground mt-3">
                  {applications.length === 0 ? "None sent yet" : `Last: ${new Date(applications[0].created_at).toLocaleDateString()}`}
                </div>
              </CardContent>
            </Card>

            {/* Meta 1 */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3 flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Account
                </div>
                <div className="font-medium text-ink truncate">{profile?.full_name || "—"}</div>
                <div className="text-xs text-muted-foreground truncate mt-1">{email}</div>
                <div className="text-xs text-muted-foreground truncate mt-3">
                  {departmentName ? (
                    <span>{departmentName}{profile?.level ? ` · ${profile.level}` : ""}</span>
                  ) : (
                    <Link to="/profile" className="text-primary underline">Set department</Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Meta 2 */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">Institution</div>
                <div className="font-medium text-ink truncate">
                  {profile?.institution || (
                    <Link to="/profile" className="text-primary underline">Add institution</Link>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate mt-1">
                  {profile?.phone || "No phone on file"}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 3. Activity — two clear blocks */}
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Activity</div>
              <h2 className="font-display text-2xl md:text-3xl text-ink">Your placements & applications</h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Unlocked cities */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-display text-xl text-ink">Unlocked cities</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Cities you've paid to reveal.</p>
                </div>
                <Button asChild size="sm" variant="ghost" className="rounded-full">
                  <Link to="/placements">Find more <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </CardHeader>
              <CardContent>
                {unlocked.length === 0 ? (
                  <div className="py-10 text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-40" />
                    <p className="text-muted-foreground text-sm mb-4">You haven't unlocked any cities yet.</p>
                    <Button asChild size="sm" className="rounded-full bg-ink text-primary-foreground hover:bg-ink/90">
                      <Link to="/placements">Browse placements</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {unlocked.map((u) => (
                      <Link
                        key={`${u.state}|${u.city}`}
                        to={`/placements?state=${encodeURIComponent(u.state)}&city=${encodeURIComponent(u.city)}`}
                        className="group p-4 border rounded-lg flex items-center justify-between hover:border-ink hover:bg-muted/50 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold flex items-center gap-2 truncate text-ink">
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
                <CardTitle className="font-display text-xl text-ink flex items-center gap-2">
                  <FileText className="w-5 h-5" />Recent applications
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Your latest internship submissions.</p>
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
                          <div className="font-medium truncate text-ink">
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
          </div>
        </section>

        {/* 4. Featured companies */}
        <section className="mt-16">
          <div className="mb-6">
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Directory</div>
            <h2 className="font-display text-2xl md:text-3xl text-ink">Featured companies</h2>
          </div>
          <CompanyDirectory
            limit={6}
            showSearch={false}
            viewAllTo="/placements"
            title="Featured companies"
            subtitle="A snapshot of placements open to your department."
          />
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard
