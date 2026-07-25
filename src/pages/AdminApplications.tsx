import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Loader2, ChevronDown, ChevronRight, ArrowLeft, ExternalLink } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

type App = {
  id: string
  user_id: string
  company_id: string
  status: string
  sent_to_email: string | null
  created_at: string
  documents: Record<string, string>
  snapshot: { company_name?: string; info?: Record<string, string> } | null
}

const STATUSES = ["sent", "reviewed", "accepted", "rejected"]

export default function AdminApplications() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<App[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [q, setQ] = useState("")
  const [signedUrls, setSignedUrls] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => { document.title = "Applications — Admin" }, [])

  useEffect(() => {
    ;(async () => {
      const { data: sess } = await supabase.auth.getSession()
      if (!sess.session) { navigate("/login"); return }
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: sess.session.user.id, _role: "admin" })
      if (!isAdmin) { navigate("/"); return }
      const { data, error } = await supabase.from("applications")
        .select("id, user_id, company_id, status, sent_to_email, created_at, documents, snapshot")
        .order("created_at", { ascending: false })
      if (error) toast.error(error.message)
      setRows((data as App[]) || [])
      setLoading(false)
    })()
  }, [navigate])

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id)
    if (error) return toast.error(error.message)
    setRows(rs => rs.map(r => r.id === id ? { ...r, status } : r))
    toast.success("Updated")
  }

  const toggle = async (a: App) => {
    if (expanded === a.id) { setExpanded(null); return }
    setExpanded(a.id)
    if (!signedUrls[a.id]) {
      const entries: Record<string, string> = {}
      for (const [k, path] of Object.entries(a.documents || {})) {
        if (!path) continue
        const { data } = await supabase.storage.from("applicant-documents").createSignedUrl(path, 60 * 60 * 24 * 7)
        if (data?.signedUrl) entries[k] = data.signedUrl
      }
      setSignedUrls(s => ({ ...s, [a.id]: entries }))
    }
  }

  const filtered = rows.filter(r => {
    if (!q) return true
    const s = q.toLowerCase()
    const info = r.snapshot?.info || {}
    return (
      (r.snapshot?.company_name || "").toLowerCase().includes(s) ||
      (r.sent_to_email || "").toLowerCase().includes(s) ||
      (info.full_name || "").toLowerCase().includes(s) ||
      (info.email || "").toLowerCase().includes(s)
    )
  })

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24 md:py-28 max-w-6xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-2"><Link to="/admin"><ArrowLeft className="w-4 h-4 mr-1" />Back to admin</Link></Button>
            <h1 className="text-3xl md:text-4xl font-display">Applications</h1>
            <p className="text-muted-foreground text-sm">{rows.length} total submissions.</p>
          </div>
          <Input placeholder="Search company, applicant…" value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Submissions</CardTitle></CardHeader>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No applications match.</div>
            ) : (
              <div className="divide-y">
                {filtered.map(a => {
                  const info = a.snapshot?.info || {}
                  const isOpen = expanded === a.id
                  return (
                    <div key={a.id}>
                      <button onClick={() => toggle(a)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors">
                        {isOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                        <div className="flex-1 min-w-0 grid md:grid-cols-4 gap-2 items-center">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{info.full_name || "—"}</div>
                            <div className="text-xs text-muted-foreground truncate">{info.email || ""}</div>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm truncate">{a.snapshot?.company_name || "—"}</div>
                            <div className="text-xs text-muted-foreground truncate">{a.sent_to_email || ""}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</div>
                          <div onClick={e => e.stopPropagation()}>
                            <Select value={a.status} onValueChange={v => updateStatus(a.id, v)}>
                              <SelectTrigger className="h-8 w-32 capitalize"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-muted/30 border-t space-y-4">
                          <div>
                            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Applicant info</div>
                            <div className="grid md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                              {Object.entries(info).map(([k, v]) => (
                                <div key={k} className="flex gap-2">
                                  <span className="text-muted-foreground capitalize min-w-[140px]">{k.replace(/_/g, " ")}:</span>
                                  <span className="flex-1 break-words">{v || "—"}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Documents</div>
                            {Object.keys(a.documents || {}).length === 0 ? (
                              <div className="text-sm text-muted-foreground">None attached.</div>
                            ) : (
                              <ul className="text-sm space-y-1">
                                {Object.entries(a.documents || {}).map(([k, _]) => {
                                  const url = signedUrls[a.id]?.[k]
                                  return (
                                    <li key={k}>
                                      {url ? (
                                        <a href={url} target="_blank" rel="noreferrer" className="text-primary underline inline-flex items-center gap-1">
                                          {k.replace(/^doc_/, "").replace(/_/g, " ")} <ExternalLink className="w-3 h-3" />
                                        </a>
                                      ) : (
                                        <span className="text-muted-foreground">{k}…</span>
                                      )}
                                    </li>
                                  )
                                })}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
