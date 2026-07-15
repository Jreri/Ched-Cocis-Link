import { Button } from "@/components/ui/enhanced-button"
import { Check, ArrowUpRight } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "₦0",
    tag: "To get started",
    features: [
      "Access 1–2 companies per location",
      "Basic search by state and LGA",
      "Direct application submission",
      "Application status tracking",
      "CV and document upload",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Premium",
    price: "₦2,000",
    tag: "Per state · lifetime",
    features: [
      "All companies in your chosen state",
      "Advanced filters and saved searches",
      "Priority application processing",
      "Direct company contact details",
      "Analytics on your applications",
      "Priority email support",
    ],
    cta: "Upgrade",
    highlight: true,
  },
]

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <p className="rule mb-6">Pricing</p>
          <h2 className="font-display text-5xl md:text-6xl text-ink leading-[1] text-balance">
            Pay only for the
            <span className="italic text-primary"> states</span> you need.
          </h2>
          <p className="mt-6 text-lg text-ink-soft max-w-xl">
            Start free. Unlock a whole state's placements for the price of a takeout meal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl p-10 hover-lift ${
                p.highlight
                  ? "bg-ink text-primary-foreground shadow-ink"
                  : "bg-card border border-border text-ink"
              }`}
            >
              {p.highlight && (
                <div className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.2em] text-accent">
                  Most popular
                </div>
              )}
              <div className="flex items-baseline gap-3">
                <h3 className="font-display text-3xl">{p.name}</h3>
                <span className={`text-xs uppercase tracking-wider ${p.highlight ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {p.tag}
                </span>
              </div>
              <div className="font-display text-6xl mt-6">{p.price}</div>

              <ul className="mt-10 space-y-3">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${p.highlight ? "text-accent" : "text-primary"}`} />
                    <span className={p.highlight ? "text-primary-foreground/85" : "text-ink-soft"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={`mt-10 w-full rounded-full gap-2 ${
                  p.highlight
                    ? "bg-background text-ink hover:bg-background/90"
                    : "bg-ink text-primary-foreground hover:bg-ink/90"
                }`}
              >
                {p.cta} <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
