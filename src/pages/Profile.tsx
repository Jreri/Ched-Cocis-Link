import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

type Department = { id: string; name: string }

const LEVELS = ["ND1", "ND2", "HND1", "HND2", "100L", "200L", "300L", "400L", "500L"]

const Profile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState("")
  const [departments, setDepartments] = useState<Department[]>([])
  const [form, setForm] = useState({
    full_name: "",
    department_id: "",
    level: "",
    institution: "",
    phone: "",
  })

  useEffect(() => {
    document.title = "Profile — StudentPlace Nigeria"
  }, [])

  useEffect(() => {
    ;(async () => {
      const { data: sess } = await supabase.auth.getSession()
      if (!sess.session) {
        navigate("/login", { replace: true })
        return
      }
      const uid = sess.session.user.id
      setEmail(sess.session.user.email || "")

      const [{ data: prof }, { data: depts }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
        supabase.from("departments").select("id,name").eq("is_active", true).order("name"),
      ])
      setDepartments((depts as Department[]) || [])
      if (prof) {
        setForm({
          full_name: prof.full_name ?? "",
          department_id: prof.department_id ?? "",
          level: prof.level ?? "",
          institution: prof.institution ?? "",
          phone: prof.phone ?? "",
        })
      } else {
        // Fallback: create a profile row from auth metadata if trigger somehow missed
        const meta = sess.session.user.user_metadata || {}
        const seed = {
          id: uid,
          full_name: meta.full_name ?? "",
          department_id: meta.department_id ?? null,
          level: meta.level ?? null,
          institution: meta.institution ?? null,
        }
        await supabase.from("profiles").insert(seed)
        setForm({
          full_name: seed.full_name || "",
          department_id: seed.department_id || "",
          level: seed.level || "",
          institution: seed.institution || "",
          phone: "",
        })
      }
      setLoading(false)
    })()
  }, [navigate])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: sess } = await supabase.auth.getSession()
    if (!sess.session) return
    setSaving(true)
    const payload = {
      full_name: form.full_name.trim() || null,
      department_id: form.department_id || null,
      level: form.level || null,
      institution: form.institution.trim() || null,
      phone: form.phone.trim() || null,
    }
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", sess.session.user.id)
    // Keep auth metadata in sync so it's the same everywhere
    await supabase.auth.updateUser({ data: payload })
    setSaving(false)
    if (error) return toast.error(error.message)
    toast.success("Profile updated")
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
      <main className="flex-1 container mx-auto px-4 py-24 md:py-28 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display">Your profile</h1>
          <p className="text-muted-foreground mt-1">Keep this up to date — it drives placement matching.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input
                    id="full_name"
                    value={form.full_name}
                    onChange={(e) => setForm((s) => ({ ...s, full_name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={form.department_id}
                    onValueChange={(v) => setForm((s) => ({ ...s, department_id: v }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={form.level} onValueChange={(v) => setForm((s) => ({ ...s, level: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    placeholder="e.g. University of Lagos"
                    value={form.institution}
                    onChange={(e) => setForm((s) => ({ ...s, institution: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="e.g. 0803 000 0000"
                    value={form.phone}
                    onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default Profile
