import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Circle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export type JourneyStep = {
  key: string
  title: string
  description: string
  href: string
  cta: string
  status: "done" | "current" | "todo"
}

type Props = {
  eyebrow?: string
  title?: string
  steps: JourneyStep[]
}

const NextStepsJourney = ({ eyebrow = "Your journey", title = "What to do next", steps }: Props) => {
  const currentIdx = steps.findIndex(s => s.status === "current")
  const next = currentIdx >= 0 ? steps[currentIdx] : steps.find(s => s.status === "todo")

  return (
    <Card className="mb-6 overflow-hidden border-ink/10">
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-[1fr_auto] gap-0">
          <div className="p-6">
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-1">{eyebrow}</div>
            <h2 className="font-display text-2xl text-ink mb-5">{title}</h2>

            <ol className="space-y-3">
              {steps.map((s, i) => {
                const isDone = s.status === "done"
                const isCurrent = s.status === "current"
                return (
                  <li
                    key={s.key}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                      isCurrent && "border-ink bg-muted/60",
                      !isCurrent && "border-border",
                      s.status === "todo" && !isCurrent && "opacity-70",
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold",
                        isDone && "bg-emerald-600 text-white",
                        isCurrent && "bg-ink text-primary-foreground",
                        s.status === "todo" && "bg-muted text-muted-foreground",
                      )}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : s.status === "todo" ? <Lock className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-medium text-ink">{s.title}</div>
                        {isCurrent && <span className="text-[10px] uppercase tracking-[0.2em] text-ink bg-accent/30 px-2 py-0.5 rounded-full">Now</span>}
                        {isDone && <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-700">Done</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{s.description}</p>
                    </div>
                    {(isCurrent || isDone) && (
                      <Button asChild size="sm" variant={isCurrent ? "default" : "ghost"} className={cn("shrink-0 rounded-full", isCurrent && "bg-ink text-primary-foreground hover:bg-ink/90")}>
                        <Link to={s.href}>{isDone ? "View" : s.cta} <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
                      </Button>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>

          {next && (
            <div className="bg-ink text-primary-foreground p-6 lg:w-72 flex flex-col justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-primary-foreground/60 mb-2">Next step</div>
                <div className="font-display text-xl leading-tight">{next.title}</div>
                <p className="text-sm text-primary-foreground/70 mt-2">{next.description}</p>
              </div>
              <Button asChild className="mt-6 rounded-full bg-primary-foreground text-ink hover:bg-primary-foreground/90 gap-1.5">
                <Link to={next.href}>{next.cta} <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default NextStepsJourney
