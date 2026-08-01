import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheck2, CheckCircle2 } from "lucide-react"
import { mergeRequirements, type CompanyRequirementRow } from "@/lib/applicationFields"

type Props = {
  companyName?: string
  overrides: CompanyRequirementRow[]
  compact?: boolean
}

/** Shows the documents a company requires, resolved from its configured requirements. */
export default function CompanyRequirements({ companyName, overrides, compact }: Props) {
  const merged = mergeRequirements(overrides)
  const docs = merged.filter(f => f.kind === "document")
  const required = docs.filter(f => f.requirement === "required")
  const optional = docs.filter(f => f.requirement === "optional")

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {required.length === 0 && <span className="text-xs text-muted-foreground">No documents required</span>}
        {required.map(f => (
          <Badge key={f.key} variant="secondary" className="text-[10px] font-normal">{f.label}</Badge>
        ))}
      </div>
    )
  }

  return (
    <Card className="mb-6 border-primary/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-primary" />
          Requirements{companyName ? ` — ${companyName}` : ""}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Prepare these documents before you start the application.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Required</div>
          {required.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents required by this company.</p>
          ) : (
            <ul className="space-y-1.5">
              {required.map(f => (
                <li key={f.key} className="flex items-start gap-2 text-sm text-ink">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  {f.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        {optional.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Optional</div>
            <div className="flex flex-wrap gap-1.5">
              {optional.map(f => (
                <Badge key={f.key} variant="outline" className="text-[11px] font-normal">{f.label}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
