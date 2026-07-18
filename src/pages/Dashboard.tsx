import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, User, Unlock, ArrowRight } from "lucide-react"
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

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string>("")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [departmentName, setDepartmentName] = useState<string>("")
  const [unlocked, setUnlocked] = useState<Unlocked[]>([])

  useEffect(() => {
    document.title = "Dashboard — StudentPlace Nigeria"
  }, [])

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
      const [{ data: prof }, { data: locs }] = await Promise.all([
        supabase.from("profiles").select("full_name, department_id, level, institution, phone").eq("id", uid).maybeSingle(),
        supabase.rpc("get_my_unlocked_locations"),
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-serif font-bold">
              Hi{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="text-muted-foreground mt-1">Your placement dashboard.</p>
          </div>
          <Button variant="outline" onClick={signOut}>Sign out</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><User className="w-4 h-4" />Account</CardTitle></CardHeader>
            <CardContent>
              <div className="font-medium">{profile?.full_name || "—"}</div>
              <div className="text-sm text-muted-foreground truncate">{email}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Department</CardTitle></CardHeader>
            <CardContent>
              <div className="font-medium">{departmentName || "Not set"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Locations unlocked</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-serif">{unlocked.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your unlocked locations</CardTitle>
            <Button asChild size="sm">
              <Link to="/placements">Find more <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {unlocked.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">
                <p className="mb-4">You haven't unlocked any locations yet.</p>
                <Button asChild>
                  <Link to="/placements">Browse placements</Link>
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {unlocked.map((u) => (
                  <div key={`${u.state}|${u.city}`} className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {u.city}, {u.state}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {u.company_count} companies · unlocked {new Date(u.paid_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 hover:bg-emerald-600"><Unlock className="w-3 h-3 mr-1" />Paid</Badge>
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
