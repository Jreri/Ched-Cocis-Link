import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, Save, Upload, CheckCircle2, Trash2, Lock } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { CANONICAL_FIELDS } from "@/lib/applicationFields"

type Department = { id: string; name: string }

const LEVELS = ["ND1", "ND2", "HND1", "HND2", "100L", "200L", "300L", "400L", "500L"]

const Profile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [uid, setUid] = useState("")
  const [email, setEmail] = useState("")
  const [departments, setDepartments] = useState<Department[]>([])
  const [documents, setDocuments] = useState<Record<string, string>>({})
  const [locked, setLocked] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [form, setForm] = useState({
    full_name: "", department_id: "", level: "", institution: "", phone: "",
    address: "", date_of_birth: "", matric_number: "", university: "",
    internship_duration: "", preferred_start_date: "", expected_end_date: "",
  })

  useEffect(() => { document.title = "Profile — ChedLink" }, [])

  useEffect(() => {
    ;(async () => {
      const { data: sess } = await supabase.auth.getSession()
      if (!sess.session) { navigate("/login", { replace: true }); return }
      const u = sess.session.user
      setUid(u.id); setEmail(u.email || "")

      const [{ data: prof }, { data: depts }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.id).maybeSingle(),
        supabase.from("departments").select("id,name").eq("is_active", true).order("name"),
      ])
      setDepartments((depts as Department[]) || [])
      const p = prof as any
      if (p) {
        setForm({
          full_name: p.full_name ?? "", department_id: p.department_id ?? "",
          level: p.level ?? "", institution: p.institution ?? "", phone: p.phone ?? "",
          address: p.address ?? "", date_of_birth: p.date_of_birth ?? "",
          matric_number: p.matric_number ?? "", university: p.university ?? p.institution ?? "",
          internship_duration: p.internship_duration ?? "",
          preferred_start_date: p.preferred_start_date ?? "",
          expected_end_date: p.expected_end_date ?? "",
        })
        setDocuments((p.documents as Record<string, string>) || {})
        setLocked(!!p.profile_locked)
      }
      setLoading(false)
    })()
  }, [navigate])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uid || saving) return
    if (locked) { doSave() } else { setConfirmOpen(true) }
  }

  const doSave = async () => {
    setConfirmOpen(false)
    if (!uid || saving) return
    setSaving(true)
    const payload: any = { ...form }
    Object.keys(payload).forEach(k => { if (payload[k] === "") payload[k] = null })
    if (!locked) payload.profile_locked = true
    const { data: saved, error } = await supabase
      .from("profiles").update(payload).eq("id", uid).select().maybeSingle()
    await supabase.auth.updateUser({ data: { full_name: form.full_name, department_id: form.department_id, level: form.level, institution: form.institution } })
    setSaving(false)
    if (error) return toast.error(error.message)
    // Reflect exactly what the backend stored, immediately.
    if (saved) {
      setForm((f: any) => {
        const next: any = { ...f }
        Object.keys(f).forEach(k => { next[k] = (saved as any)[k] ?? "" })
        return next
      })
      setDocuments(((saved as any).documents as Record<string, string>) || {})
      setLocked(!!(saved as any).profile_locked)
    }
    toast.success(locked ? "Profile updated" : "Profile saved — personal and academic details are now locked")
  }



  const upload = async (key: string, file: File) => {
    setUploadingKey(key)
    try {
      const ext = file.name.split(".").pop() || "bin"
      const path = `${uid}/${key}-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from("applicant-documents").upload(path, file, { upsert: true })
      if (error) throw error
      const next = { ...documents, [key]: path }
      setDocuments(next)
      await supabase.from("profiles").update({ documents: next }).eq("id", uid)
      toast.success("Uploaded")
    } catch (e: any) {
      toast.error(e.message || "Upload failed")
    } finally { setUploadingKey(null) }
  }

  const removeDoc = async (key: string) => {
    const path = documents[key]
    if (!path) return
    if (!confirm("Remove this document?")) return
    setUploadingKey(key)
    try {
      await supabase.storage.from("applicant-documents").remove([path])
      const next = { ...documents }
      delete next[key]
      setDocuments(next)
      await supabase.from("profiles").update({ documents: next }).eq("id", uid)
      toast.success("Removed")
    } catch (e: any) {
      toast.error(e.message || "Remove failed")
    } finally { setUploadingKey(null) }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>

  const docFields = CANONICAL_FIELDS.filter(f => f.kind === "document")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24 md:py-28 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display">Your profile</h1>
          <p className="text-muted-foreground mt-1">Fill this once — every application auto-fills from here.</p>
        </div>

        <form onSubmit={save} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Personal information</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email</Label><Input value={email} disabled /></div>
              <F label="Full name" v={form.full_name} on={v => setForm(s => ({ ...s, full_name: v }))} />
              <F label="Phone" v={form.phone} on={v => setForm(s => ({ ...s, phone: v }))} />
              <F label="Date of birth" type="date" v={form.date_of_birth} on={v => setForm(s => ({ ...s, date_of_birth: v }))} />
              <div className="sm:col-span-2"><F label="Residential address" v={form.address} on={v => setForm(s => ({ ...s, address: v }))} textarea /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Academic information</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <F label="University" v={form.university || form.institution} on={v => setForm(s => ({ ...s, university: v, institution: v }))} />
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={form.department_id} onValueChange={v => setForm(s => ({ ...s, department_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Select value={form.level} onValueChange={v => setForm(s => ({ ...s, level: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <F label="Matriculation number" v={form.matric_number} on={v => setForm(s => ({ ...s, matric_number: v }))} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Internship preferences</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              <F label="Expected duration" placeholder="e.g. 6 months" v={form.internship_duration} on={v => setForm(s => ({ ...s, internship_duration: v }))} />
              <F label="Preferred start date" type="date" v={form.preferred_start_date} on={v => setForm(s => ({ ...s, preferred_start_date: v }))} />
              <F label="Expected end date" type="date" v={form.expected_end_date} on={v => setForm(s => ({ ...s, expected_end_date: v }))} />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="gap-2 bg-ink text-primary-foreground hover:bg-ink/90">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save changes
            </Button>
          </div>
        </form>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <p className="text-xs text-muted-foreground">Upload once, reuse across every application.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {docFields.map(f => {
              const uploaded = !!documents[f.key]
              return (
                <div key={f.key} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{f.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {uploaded ? <span className="text-primary inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Uploaded</span> : "PDF, JPG, or PNG"}
                    </div>
                  </div>
                  <label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                      onChange={e => { const file = e.target.files?.[0]; if (file) upload(f.key, file) }} />
                    <Button asChild size="sm" variant={uploaded ? "outline" : "default"} disabled={uploadingKey === f.key}>
                      <span className="cursor-pointer inline-flex items-center gap-1">
                        {uploadingKey === f.key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                        {uploaded ? "Replace" : "Upload"}
                      </span>
                    </Button>
                  </label>
                  {uploaded && (
                    <Button size="sm" variant="ghost" onClick={() => removeDoc(f.key)} disabled={uploadingKey === f.key} aria-label="Remove document">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

function F({ label, v, on, type = "text", textarea = false, placeholder }: { label: string; v: string; on: (v: string) => void; type?: string; textarea?: boolean; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {textarea
        ? <Textarea rows={2} value={v} placeholder={placeholder} onChange={e => on(e.target.value)} />
        : <Input type={type} value={v} placeholder={placeholder} onChange={e => on(e.target.value)} />}
    </div>
  )
}

export default Profile
