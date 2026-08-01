import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, CheckCircle2, ArrowLeft, Mail, MapPin, Building2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { mergeRequirements, CANONICAL_FIELDS, type CompanyRequirementRow } from "@/lib/applicationFields"
import CompanyRequirements from "@/components/CompanyRequirements"


const DURATION_PRESETS = ["2 Months", "3 Months", "4 Months", "5 Months", "6 Months"]
const TYPE_PRESETS = ["SIWES", "NYSC", "Placement", "Other"]

const Apply = () => {
  const { companyId } = useParams<{ companyId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [company, setCompany] = useState<any>(null)
  const [fields, setFields] = useState<ReturnType<typeof mergeRequirements>>([])
  const [rawRequirements, setRawRequirements] = useState<CompanyRequirementRow[]>([])
  const [profile, setProfile] = useState<any>(null)

  const [uid, setUid] = useState<string>("")
  const [info, setInfo] = useState<Record<string, string>>({})
  const [docs, setDocs] = useState<Record<string, string>>({}) // fieldKey -> storage path
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.title = "Apply — ChedLink"
  }, [])

  useEffect(() => {
    if (!companyId) return
    ;(async () => {
      const { data: sess } = await supabase.auth.getSession()
      if (!sess.session) { navigate("/login"); return }
      setUid(sess.session.user.id)

      const [{ data: coData, error: coErr }, { data: reqData }, { data: prof }] = await Promise.all([
        supabase.rpc("get_unlocked_company", { _company_id: companyId }),
        supabase.rpc("get_company_requirements", { _company_id: companyId }),
        supabase.from("profiles").select("*, departments(name)").eq("id", sess.session.user.id).maybeSingle(),
      ])

      if (coErr || !coData || (coData as any[]).length === 0) {
        toast.error("This company isn't accessible. Unlock its city first.")
        navigate("/placements")
        return
      }
      const co = (coData as any[])[0]
      setCompany(co)
      const merged = mergeRequirements((reqData as any[]) || [])
      setFields(merged)

      const p = prof as any
      setProfile(p)

      // Prefill info
      const dept = p?.departments?.name || ""
      const seed: Record<string, string> = {}
      merged.filter(f => f.kind === "info").forEach(f => {
        if (f.profileKey === "department_name") seed[f.key] = dept
        else if (f.profileKey && p?.[f.profileKey]) seed[f.key] = String(p[f.profileKey])
      })
      if (!seed.email) seed.email = sess.session.user.email || ""
      setInfo(seed)

      // Prefill docs from profile.documents
      if (p?.documents) setDocs({ ...(p.documents as Record<string, string>) })

      setLoading(false)
    })()
  }, [companyId, navigate])

  const missing = useMemo(() => {
    const m: string[] = []
    fields.forEach(f => {
      if (f.requirement !== "required") return
      if (f.kind === "document") {
        if (!docs[f.key]) m.push(f.label)
      } else {
        if (!(info[f.key] || "").trim()) m.push(f.label)
      }
    })
    return m
  }, [fields, info, docs])

  const uploadDoc = async (fieldKey: string, file: File) => {
    if (!uid) return
    setUploadingKey(fieldKey)
    try {
      const ext = file.name.split(".").pop() || "bin"
      const path = `${uid}/${fieldKey}-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from("applicant-documents").upload(path, file, { upsert: true })
      if (error) throw error
      setDocs(d => ({ ...d, [fieldKey]: path }))
      // Persist to profile for reuse
      const nextDocs = { ...(profile?.documents || {}), [fieldKey]: path }
      await supabase.from("profiles").update({ documents: nextDocs }).eq("id", uid)
      setProfile((p: any) => ({ ...(p || {}), documents: nextDocs }))
      toast.success("Uploaded")
    } catch (e: any) {
      toast.error(e.message || "Upload failed")
    } finally {
      setUploadingKey(null)
    }
  }

  const submit = async () => {
    if (missing.length) {
      toast.error(`Missing: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? "…" : ""}`)
      return
    }
    setSubmitting(true)
    try {
      // Only send filled info & docs matching visible fields
      const infoOut: Record<string, string> = {}
      const docOut: Record<string, string> = {}
      fields.forEach(f => {
        if (f.kind === "document") { if (docs[f.key]) docOut[f.label] = docs[f.key] }
        else if (info[f.key]) infoOut[f.label] = info[f.key]
      })
      const { data, error } = await supabase.functions.invoke("submit-application", {
        body: { company_id: companyId, info: infoOut, document_paths: docOut },
      })
      if (error) throw error
      if ((data as any)?.error) throw new Error((data as any).error)
      setDone(true)
      toast.success("Application sent")
    } catch (e: any) {
      toast.error(e.message || "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-6 pt-32 pb-16 max-w-2xl text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="font-display text-4xl text-ink">Application sent</h1>
          <p className="text-muted-foreground mt-3 mb-8">
            We've emailed your application to <strong>{company.name}</strong> at {company.internship_email}.
            You'll see it in your dashboard.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline"><Link to="/placements">Back to placements</Link></Button>
            <Button asChild><Link to="/dashboard">View dashboard</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 pt-28 pb-16 max-w-3xl">
        <Link to="/placements" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to placements
        </Link>

        <div className="flex items-start gap-4 mb-8">
          {company.logo_url ? (
            <img src={company.logo_url} className="w-16 h-16 rounded-xl object-cover border" alt="" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center"><Building2 className="w-7 h-7 text-muted-foreground" /></div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Apply for internship</div>
            <h1 className="font-display text-3xl md:text-4xl text-ink leading-tight">{company.name}</h1>
            {company.internship_position && <div className="text-muted-foreground mt-1">{company.internship_position}</div>}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {company.city || company.state}</span>
              {company.internship_email && <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> {company.internship_email}</span>}
            </div>
          </div>
        </div>

        {company.applications_enabled === false && (
          <Card className="mb-6 border-destructive"><CardContent className="pt-6 text-sm text-destructive">Applications are currently closed for this company.</CardContent></Card>
        )}

        <CompanyRequirements companyName={company.name} overrides={rawRequirements} />

        {company.instructions && (
          <Card className="mb-6 bg-muted/30">
            <CardHeader><CardTitle className="text-base">Instructions from {company.name}</CardTitle></CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm text-ink-soft">{company.instructions}</CardContent>
          </Card>
        )}


        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Your information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {fields.filter(f => f.kind !== "document").map(f => {
              const val = info[f.key] || ""
              const setVal = (v: string) => setInfo(s => ({ ...s, [f.key]: v }))
              const isDuration = f.key === "internship_duration"
              const isType = f.key === "internship_type"
              const durationIsCustom = isDuration && val !== "" && !DURATION_PRESETS.includes(val)
              return (
                <div key={f.key} className="space-y-1.5">
                  <Label>
                    {f.label} {f.requirement === "required" && <span className="text-destructive">*</span>}
                    {f.requirement === "optional" && <span className="text-muted-foreground text-xs ml-1">(optional)</span>}
                  </Label>
                  {isType ? (
                    <Select value={TYPE_PRESETS.includes(val) ? val : ""} onValueChange={setVal}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent className="z-[70] bg-popover">
                        {TYPE_PRESETS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : isDuration ? (
                    <div className="space-y-2">
                      <Select
                        value={durationIsCustom ? "__custom__" : (val || "")}
                        onValueChange={(v) => setVal(v === "__custom__" ? " " : v)}
                      >
                        <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                        <SelectContent className="z-[70] bg-popover">
                          {DURATION_PRESETS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          <SelectItem value="__custom__">Custom…</SelectItem>
                        </SelectContent>
                      </Select>
                      {durationIsCustom && (
                        <Input placeholder="e.g. 8 weeks" value={val.trim()} onChange={e => setVal(e.target.value)} />
                      )}
                    </div>
                  ) : f.input === "textarea" ? (
                    <Textarea rows={2} value={val} onChange={e => setVal(e.target.value)} />
                  ) : (
                    <Input type={f.input || "text"} value={val} onChange={e => setVal(e.target.value)} />
                  )}
                </div>
              )
            })}
            {fields.filter(f => f.kind !== "document").length === 0 && (
              <p className="text-sm text-muted-foreground">No information fields required.</p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Documents</CardTitle>
            <p className="text-xs text-muted-foreground">Uploaded documents are saved to your profile and reused for future applications.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.filter(f => f.kind === "document").map(f => {
              const uploaded = !!docs[f.key]
              return (
                <div key={f.key} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {f.label} {f.requirement === "required" && <span className="text-destructive">*</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {uploaded ? <span className="text-primary inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Uploaded</span> : "PDF, JPG, or PNG"}
                    </div>
                  </div>
                  <label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={e => { const f2 = e.target.files?.[0]; if (f2) uploadDoc(f.key, f2) }}
                    />
                    <Button asChild size="sm" variant={uploaded ? "outline" : "default"} disabled={uploadingKey === f.key}>
                      <span className="cursor-pointer inline-flex items-center gap-1">
                        {uploadingKey === f.key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                        {uploaded ? "Replace" : "Upload"}
                      </span>
                    </Button>
                  </label>
                </div>
              )
            })}
            {fields.filter(f => f.kind === "document").length === 0 && (
              <p className="text-sm text-muted-foreground">No documents required.</p>
            )}
          </CardContent>
        </Card>

        {missing.length > 0 && (
          <div className="mb-4 text-sm text-muted-foreground">
            Still needed: {missing.map(m => <Badge key={m} variant="outline" className="mr-1 mb-1">{m}</Badge>)}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild><Link to="/placements">Cancel</Link></Button>
          <Button onClick={submit} disabled={submitting || company.applications_enabled === false} className="bg-ink text-primary-foreground hover:bg-ink/90">
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit application
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Apply
