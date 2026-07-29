import { useEffect, useMemo, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { Loader2, Pencil, Plus, Search, Trash2, Building2, MapPin, Layers, FileText, Upload } from "lucide-react"
import Papa from "papaparse"
import { CANONICAL_FIELDS, type FieldReq } from "@/lib/applicationFields"
import NextStepsJourney, { type JourneyStep } from "@/components/NextStepsJourney"

type Company = {
  id: string
  name: string
  address: string
  state: string
  city: string | null
  lga: string | null
  business_district: string | null
  description: string | null
  contact_email: string | null
  contact_phone: string | null
  internship_email: string | null
  internship_position: string | null
  instructions: string | null
  applications_enabled: boolean | null
  slots: number | null
  is_active: boolean
}

type Department = { id: string; name: string; slug: string }

const emptyForm = {
  id: "" as string | "",
  name: "",
  address: "",
  state: "",
  city: "",
  lga: "",
  business_district: "",
  description: "",
  contact_email: "",
  contact_phone: "",
  internship_email: "",
  internship_position: "",
  instructions: "",
  applications_enabled: true,
  slots: "" as string,
  is_active: true,
  department_ids: [] as string[],
  requirements: {} as Record<string, FieldReq | "default">,
}

export default function Admin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [companyDepts, setCompanyDepts] = useState<Record<string, string[]>>({})
  const [search, setSearch] = useState("")
  const [filterState, setFilterState] = useState("all")
  const [filterDept, setFilterDept] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [bulkImporting, setBulkImporting] = useState(false)

  const loadAll = async () => {
    const [{ data: cs }, { data: ds }, { data: cd }] = await Promise.all([
      supabase.from("companies").select("*").order("name"),
      supabase.from("departments").select("id,name,slug").order("name"),
      supabase.from("company_departments").select("company_id, department_id"),
    ])
    setCompanies((cs as Company[]) || [])
    setDepartments((ds as Department[]) || [])
    const map: Record<string, string[]> = {}
    ;(cd || []).forEach((r: any) => {
      map[r.company_id] = [...(map[r.company_id] || []), r.department_id]
    })
    setCompanyDepts(map)
  }

  useEffect(() => {
    ;(async () => {
      const { data: sess } = await supabase.auth.getSession()
      if (!sess.session) {
        navigate("/login")
        return
      }
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: sess.session.user.id,
        _role: "admin",
      })
      if (!isAdmin) {
        toast({ title: "Access denied", description: "Admin only." })
        navigate("/dashboard")
        return
      }
      setAuthorized(true)
      await loadAll()
      setLoading(false)
    })()
  }, [navigate])

  const states = useMemo(() => Array.from(new Set(companies.map(c => c.state))).sort(), [companies])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return companies.filter(c => {
      if (filterState !== "all" && c.state !== filterState) return false
      if (filterDept !== "all" && !(companyDepts[c.id] || []).includes(filterDept)) return false
      if (q && !(`${c.name} ${c.address} ${c.city ?? ""} ${c.lga ?? ""}`.toLowerCase().includes(q))) return false
      return true
    })
  }, [companies, companyDepts, search, filterState, filterDept])

  const stats = useMemo(() => {
    const byState: Record<string, number> = {}
    const byDept: Record<string, number> = {}
    companies.forEach(c => {
      byState[c.state] = (byState[c.state] || 0) + 1
      ;(companyDepts[c.id] || []).forEach(d => (byDept[d] = (byDept[d] || 0) + 1))
    })
    return {
      total: companies.length,
      active: companies.filter(c => c.is_active).length,
      states: Object.keys(byState).length,
      byState,
      byDept,
    }
  }, [companies, companyDepts])

  const openCreate = () => {
    setForm({ ...emptyForm, department_ids: departments.filter(d => ["computer-science","cyber-security","software-engineering","information-technology"].includes(d.slug)).map(d => d.id) })
    setDialogOpen(true)
  }

  const openEdit = async (c: Company) => {
    const { data: reqRows } = await supabase.from("company_requirements").select("field_key, requirement").eq("company_id", c.id)
    const req: Record<string, FieldReq | "default"> = {}
    ;(reqRows || []).forEach((r: any) => { req[r.field_key] = r.requirement })
    setForm({
      id: c.id,
      name: c.name,
      address: c.address,
      state: c.state,
      city: c.city || "",
      lga: c.lga || "",
      business_district: c.business_district || "",
      description: c.description || "",
      contact_email: c.contact_email || "",
      contact_phone: c.contact_phone || "",
      internship_email: c.internship_email || "",
      internship_position: c.internship_position || "",
      instructions: c.instructions || "",
      applications_enabled: c.applications_enabled !== false,
      slots: c.slots != null ? String(c.slots) : "",
      is_active: c.is_active,
      department_ids: companyDepts[c.id] || [],
      requirements: req,
    })
    setDialogOpen(true)
  }

  const save = async () => {
    if (!form.name.trim() || !form.address.trim() || !form.state.trim()) {
      toast({ title: "Missing fields", description: "Name, address and state are required." })
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
        state: form.state.trim(),
        city: form.city.trim() || null,
        lga: form.lga.trim() || null,
        business_district: form.business_district.trim() || null,
        description: form.description.trim() || null,
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
        internship_email: form.internship_email.trim() || null,
        internship_position: form.internship_position.trim() || null,
        instructions: form.instructions.trim() || null,
        applications_enabled: form.applications_enabled,
        slots: form.slots.trim() ? Number(form.slots) : null,
        is_active: form.is_active,
      }
      let companyId = form.id
      if (form.id) {
        const { error } = await supabase.from("companies").update(payload).eq("id", form.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from("companies").insert(payload).select("id").single()
        if (error) throw error
        companyId = data!.id
      }
      // reset dept links
      await supabase.from("company_departments").delete().eq("company_id", companyId)
      if (form.department_ids.length) {
        await supabase.from("company_departments").insert(form.department_ids.map(did => ({ company_id: companyId, department_id: did })))
      }
      // requirements overrides
      await supabase.from("company_requirements").delete().eq("company_id", companyId)
      const overrides = Object.entries(form.requirements)
        .filter(([, v]) => v && v !== "default")
        .map(([field_key, v], i) => {
          const canon = CANONICAL_FIELDS.find(f => f.key === field_key)
          const requirement = v as FieldReq
          return {
            company_id: companyId,
            field_key,
            kind: canon?.kind ?? "info",
            label: canon?.label ?? field_key,
            requirement,
            sort_order: i,
          }
        })
      if (overrides.length) {
        const { error: rErr } = await supabase.from("company_requirements").insert(overrides)
        if (rErr) throw rErr
      }
      toast({ title: form.id ? "Company updated" : "Company created" })
      setDialogOpen(false)
      await loadAll()
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message ?? String(e) })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (c: Company) => {
    if (!confirm(`Delete "${c.name}"? This cannot be undone.`)) return
    await supabase.from("company_departments").delete().eq("company_id", c.id)
    const { error } = await supabase.from("companies").delete().eq("id", c.id)
    if (error) { toast({ title: "Delete failed", description: error.message }); return }
    toast({ title: "Deleted" })
    await loadAll()
  }

  const toggleDept = (id: string) => {
    setForm(f => ({ ...f, department_ids: f.department_ids.includes(id) ? f.department_ids.filter(x => x !== id) : [...f.department_ids, id] }))
  }

  if (loading || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 pt-28 md:pt-32 pb-24 max-w-7xl">
        {/* Page heading */}
        <header className="mb-12 md:mb-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Admin</div>
              <h1 className="font-display text-4xl md:text-6xl text-ink leading-[1.05] tracking-tight">Companies</h1>
              <p className="text-muted-foreground mt-4 text-base md:text-lg">
                Manage the placement directory. Changes appear instantly for students.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="rounded-full gap-2">
                <Link to="/admin/applications"><FileText className="w-4 h-4" /> Applications</Link>
              </Button>
              <Button onClick={openCreate} className="rounded-full bg-ink text-primary-foreground hover:bg-ink/90 gap-2">
                <Plus className="w-4 h-4" /> Add company
              </Button>
            </div>
          </div>
          <div className="h-px bg-ink/10 mt-10" />
        </header>

        {/* 1. Next action */}
        <section className="mb-16">
          {(() => {
            const hasCompanies = companies.length > 0
            const hasActive = stats.active > 0
            const steps: JourneyStep[] = [
              {
                key: "companies",
                title: "Manage companies",
                description: "Add, edit, and activate placement partners. Configure slots and requirements.",
                href: "/admin",
                cta: "Manage",
                status: hasCompanies ? "done" : "current",
              },
              {
                key: "activate",
                title: "Enable applications",
                description: "Mark companies as active so students can apply from the placements page.",
                href: "/admin",
                cta: "Review",
                status: !hasCompanies ? "todo" : hasActive ? "done" : "current",
              },
              {
                key: "applications",
                title: "Review applications",
                description: "Open student submissions, download documents, and update statuses.",
                href: "/admin/applications",
                cta: "Open inbox",
                status: hasActive ? "current" : "todo",
              },
            ]
            return <NextStepsJourney eyebrow="Admin journey" title="Keep the pipeline moving" steps={steps} />
          })()}
        </section>

        {/* 2. Snapshot stats — editorial numbers */}
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Overview</div>
              <h2 className="font-display text-2xl md:text-3xl text-ink">Directory snapshot</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BigStat icon={<Building2 className="w-3.5 h-3.5" />} label="Total companies" value={stats.total} accent />
            <BigStat icon={<Building2 className="w-3.5 h-3.5" />} label="Active" value={stats.active} />
            <BigStat icon={<MapPin className="w-3.5 h-3.5" />} label="States covered" value={stats.states} />
            <BigStat icon={<Layers className="w-3.5 h-3.5" />} label="Departments" value={departments.length} />
          </div>
        </section>

        {/* 3. Directory */}
        <section>
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Directory</div>
              <h2 className="font-display text-2xl md:text-3xl text-ink">All companies</h2>
            </div>
            <div className="text-sm text-muted-foreground">Showing {filtered.length} of {companies.length}</div>
          </div>

        <Card className="mb-6">
          <CardContent className="pt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, address, city, LGA…" className="pl-9" />
            </div>
            <Select value={filterState} onValueChange={setFilterState}>
              <SelectTrigger className="md:w-56"><SelectValue placeholder="State" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All states</SelectItem>
                {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="md:w-64"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>


        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Location</th>
                  <th className="p-3 font-medium">Departments</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                    <td className="p-3">
                      <div className="font-medium text-ink">{c.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-md">{c.address}</div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div>{c.city || "—"}</div>
                      <div className="text-xs text-muted-foreground">{c.state}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(companyDepts[c.id] || []).slice(0, 3).map(did => {
                          const d = departments.find(x => x.id === did)
                          return d ? <Badge key={did} variant="secondary" className="text-[10px]">{d.name}</Badge> : null
                        })}
                        {(companyDepts[c.id]?.length || 0) > 3 && (
                          <Badge variant="outline" className="text-[10px]">+{(companyDepts[c.id]?.length || 0) - 3}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3"><Badge variant={c.is_active ? "default" : "outline"}>{c.is_active ? "Active" : "Hidden"}</Badge></td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(c)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No companies match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </section>

      </main>
      <Footer />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit company" : "New company"}</DialogTitle>
            <DialogDescription>Fill in the details. Departments control which students can see this placement.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Field label="Name *"><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Address *"><Textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="State *"><Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="Lagos State" /></Field>
              <Field label="City"><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></Field>
              <Field label="LGA"><Input value={form.lga} onChange={e => setForm({ ...form, lga: e.target.value })} /></Field>
              <Field label="Business district"><Input value={form.business_district} onChange={e => setForm({ ...form, business_district: e.target.value })} /></Field>
              <Field label="Contact email"><Input type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} /></Field>
              <Field label="Contact phone"><Input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} /></Field>
            </div>
            <Field label="Description"><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></Field>

            <div className="border-t border-border pt-4">
              <Label className="mb-2 block text-sm font-semibold">Internship application</Label>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Application email *">
                  <Input type="email" value={form.internship_email} placeholder="hr@company.com" onChange={e => setForm({ ...form, internship_email: e.target.value })} />
                </Field>
                <Field label="Position offered">
                  <Input value={form.internship_position} placeholder="e.g. Software Intern" onChange={e => setForm({ ...form, internship_position: e.target.value })} />
                </Field>
              </div>
              <Field label="Instructions for applicants">
                <Textarea value={form.instructions} rows={3} placeholder="Any special notes shown to applicants." onChange={e => setForm({ ...form, instructions: e.target.value })} />
              </Field>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.applications_enabled} onCheckedChange={v => setForm({ ...form, applications_enabled: !!v })} />
                  <span>Accept applications</span>
                </label>
                <div className="flex items-center gap-2 text-sm">
                  <Label className="mb-0">Slots</Label>
                  <Input type="number" min={0} value={form.slots} onChange={e => setForm({ ...form, slots: e.target.value })} className="w-24 h-8" placeholder="—" />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <Label className="mb-2 block text-sm font-semibold">Application requirements</Label>
              <p className="text-xs text-muted-foreground mb-2">Override which fields applicants must submit. "Default" uses the platform standard.</p>
              <div className="border border-border rounded-lg divide-y max-h-72 overflow-y-auto">
                {CANONICAL_FIELDS.map(f => {
                  const val = form.requirements[f.key] ?? "default"
                  return (
                    <div key={f.key} className="flex items-center gap-3 p-2 text-sm">
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{f.label}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{f.kind} · default: {f.default}</div>
                      </div>
                      <Select value={val} onValueChange={(v) => setForm(s => ({ ...s, requirements: { ...s.requirements, [f.key]: v as any } }))}>
                        <SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="required">Required</SelectItem>
                          <SelectItem value="optional">Optional</SelectItem>
                          <SelectItem value="hidden">Hidden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Departments (who can see this)</Label>
              <div className="grid grid-cols-2 gap-2 border border-border rounded-lg p-3 max-h-48 overflow-y-auto">
                {departments.map(d => (
                  <label key={d.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={form.department_ids.includes(d.id)} onCheckedChange={() => toggleDept(d.id)} />
                    <span>{d.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: !!v })} />
              <span>Active (visible to students)</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-ink text-primary-foreground hover:bg-ink/90">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {form.id ? "Save changes" : "Create company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent><div className="text-3xl font-display text-ink">{value}</div></CardContent>
    </Card>
  )
}

function BigStat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent?: boolean }) {
  return (
    <Card className={accent ? "bg-ink text-primary-foreground border-ink" : "border-ink/20"}>
      <CardContent className="p-6">
        <div className={`text-[10px] uppercase tracking-[0.25em] mb-3 flex items-center gap-1.5 ${accent ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
          {icon} {label}
        </div>
        <div className={`text-5xl md:text-6xl font-display leading-none ${accent ? "" : "text-ink"}`}>{value}</div>
      </CardContent>
    </Card>
  )
}


function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>
}
