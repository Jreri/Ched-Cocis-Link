import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, ChevronDown, ChevronRight, FileText, ExternalLink, ArrowRight } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

type App = {
  id: string
  company_id: string
  sent_to_email: string | null
  created_at: string
  documents: Record<string, string>
  snapshot: { company_name?: string; info?: Record<string, string> } | null
}

export default function MyApplications() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<App[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [q, setQ] = useState("")
  const [urls, setUrls] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => { document.title = "My applications — ChedLink" }, [])

  useEffect(() => {
    ;(async () => {
      const { data: sess } = await supabase.auth.getSession()
      if (!sess.session) { navigate("/login", { replace: true }); return }
      const { data, error } = await supabase.from("applications")
        .select("id, company_id, sent_to_email, created_at, documents, snapshot")
        .eq("user_id", sess.session.user.id)
        .order("created_at", { ascending: false })
      if (error) toast.error(error.message)
      setRows((data as App[]) || [])
      setLoading(false)
    })()
  }, [navigate])

  const toggle = async (a: App) => {
    if (expanded === a.id) { setExpanded(null); return }
    setExpanded(a.id)
    if (!urls[a.id]) {
      const entries: Record<string, string> = {}
      for (const [k, path] of Object.entries(a.documents || {})) {
        if (!path) continue
        const { data } = await supabase.storage.from("applicant-documents").createSignedUrl(path, 60 * 60)
        if (data?.signedUrl) entries[k] = data.signedUrl
      }
      setUrls(s => ({ ...s, [a.id]: entries }))
    }
  }

  const filtered = rows.filter(r =>
    !q || (r.snapshot?.company_name || "").toLowerCase().includes(q.toLowerCase())
  )

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-24 md:pt-32 max-w-4xl">
        <header className="mb-10">
          <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">History</div>
          <h1 className="text-4xl md:text-5xl font-display text-ink leading-tight">My applications</h1>
          <p className="text-muted-foreground mt-3">{rows.length} submission{rows.length === 1 ? "" : "s"} on record.</p>
          <div className="h-px bg-ink/10 mt-8" />
        </header>

        {rows.length > 0 && (
          <Input placeholder="Search by company…" value={q} onChange={e => setQ(e.target.value)} className="max-w-sm mb-6" />
        )}

        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Submitted applications</CardTitle></CardHeader>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="p-10 text-center">
                <FileText className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="text-sm text-muted-foreground mb-4">
                  {rows.length === 0 ? "You haven't applied to any company yet." : "No applications match your search."}
                </p>
                {rows.length === 0 && (
                  <Button asChild size="sm" className="rounded-full bg-ink text-primary-foreground hover:bg-ink/90">
                    <Link to="/placements">Browse placements <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filtered.map(a => {
                  const info = a.snapshot?.info || {}
                  const isOpen = expanded === a.id
                  return (
                    <div key={a.id}>
                      <button onClick={() => toggle(a)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors">
                        {isOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-ink truncate">{a.snapshot?.company_name || "Company"}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            Sent to {a.sent_to_email || "—"} · {new Date(a.created_at).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant="secondary" className="shrink-0">Submitted</Badge>
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-muted/30 border-t space-y-4">
                          <div>
                            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Information submitted</div>
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
                            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Documents submitted</div>
                            {Object.keys(a.documents || {}).length === 0 ? (
                              <div className="text-sm text-muted-foreground">None attached.</div>
                            ) : (
                              <ul className="text-sm space-y-1">
                                {Object.keys(a.documents || {}).map(k => {
                                  const url = urls[a.id]?.[k]
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
