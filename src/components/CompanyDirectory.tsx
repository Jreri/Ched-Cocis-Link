import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Building2, Lock, Unlock, MapPin, Search, Loader2 } from "lucide-react"
import CompanyRequirements from "@/components/CompanyRequirements"
import type { CompanyRequirementRow } from "@/lib/applicationFields"

type Row = {
  id: string
  name: string
  state: string
  city: string
  business_district: string | null
  description: string | null
  internship_position: string | null
  applications_enabled: boolean | null
  is_unlocked: boolean
}

/** Full company directory visible to every signed-in student. Details stay gated by payment. */
export default function CompanyDirectory({
  limit,
  showSearch = true,
  viewAllTo,
  title = "All companies",
  subtitle = "Every placement open to your department. Unlock a city to see contact details and apply.",
}: {
  limit?: number
  showSearch?: boolean
  viewAllTo?: string
  title?: string
  subtitle?: string
}) {
  const [rows, setRows] = useState<Row[]>([])
  const [reqs, setReqs] = useState<Record<string, CompanyRequirementRow[]>>({})
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")

  useEffect(() => {
    ;(async () => {
      const [{ data }, { data: r }] = await Promise.all([
        supabase.rpc("browse_companies"),
        supabase.from("company_requirements").select("company_id, field_key, kind, label, requirement, sort_order"),
      ])
      setRows((data as Row[]) || [])
      const map: Record<string, CompanyRequirementRow[]> = {}
      ;(r || []).forEach((row: any) => {
        map[row.company_id] = [...(map[row.company_id] || []), row as CompanyRequirementRow]
      })
      setReqs(map)
      setLoading(false)
    })()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    const list = s
      ? rows.filter(c => `${c.name} ${c.city} ${c.state}`.toLowerCase().includes(s))
      : rows
    return limit ? list.slice(0, limit) : list
  }, [rows, q, limit])

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <CardTitle className="font-display text-xl text-ink flex items-center gap-2">
              <Building2 className="w-5 h-5" /> {title}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <Badge variant="outline">{rows.length} total</Badge>
        </div>
        {showSearch && (
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search companies or cities…" className="pl-9" />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && (
          <div className="py-10 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
        )}
        {!loading && filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No companies found. Make sure your profile has a department set.
          </p>
        )}
        {filtered.map(c => (
          <div key={c.id} className="p-4 rounded-lg border bg-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-ink">{c.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {c.city}, {c.state}
                  {c.internship_position && <span>· {c.internship_position}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {c.is_unlocked ? (
                  <Badge className="bg-emerald-600 hover:bg-emerald-600"><Unlock className="w-3 h-3 mr-1" />Unlocked</Badge>
                ) : (
                  <Badge variant="outline"><Lock className="w-3 h-3 mr-1" />Locked</Badge>
                )}
                <Button asChild size="sm" variant={c.is_unlocked ? "default" : "secondary"}>
                  <Link
                    to={
                      c.is_unlocked
                        ? `/apply/${c.id}`
                        : `/placements?state=${encodeURIComponent(c.state)}&city=${encodeURIComponent(c.city)}`
                    }
                  >
                    {c.is_unlocked ? "Apply" : "Unlock city"}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Documents required</div>
              <CompanyRequirements compact overrides={reqs[c.id] || []} />
            </div>
          </div>
        ))}
        {viewAllTo && !loading && rows.length > 0 && (
          <Button asChild variant="outline" className="w-full rounded-full">
            <Link to={viewAllTo}>
              View all {rows.length} companies <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
