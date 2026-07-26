import { MapPin, Search, Send, Shield, Clock, CreditCard, Building2, Users, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"

const features = [
  { icon: MapPin, title: "Place-based search", body: "Every state, every LGA. Placements surface where you actually live and study." },
  { icon: Search, title: "Smart filters", body: "Department, level, company type and duration — narrow to what fits your term." },
  { icon: Send, title: "Direct applications", body: "Applications land straight in company inboxes. No middlemen, no lost letters." },
  { icon: Shield, title: "Verified companies", body: "Every firm on the platform is vetted so your effort goes toward real opportunities." },
  { icon: Clock, title: "Live status", body: "Know the moment a company opens your file. No refreshing, no guessing." },
  { icon: CreditCard, title: "Affordable access", body: "Unlock an entire state's placements for ₦2,000. Pay how you like." },
]

const Features = () => {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-muted/40">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <p className="rule mb-6">Why StudentPlace</p>
          <h2 className="font-display text-5xl md:text-6xl text-ink leading-[1] text-balance">
            Built for the student
            <span className="italic text-primary"> hustle</span>.
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {features.map((f, i) => {
            const spans = ["md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-6"]
            return (
              <div
                key={f.title}
                className={`${spans[i]} bg-card border border-border rounded-3xl p-8 hover-lift animate-fade-in`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">0{i+1}</span>
                </div>
                <h3 className="font-display text-2xl text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">{f.body}</p>
              </div>
            )
          })}
        </div>

        {/* Two audience cards */}
        <div className="grid md:grid-cols-2 gap-5 mt-12">
          <Link to="/register" className="group relative rounded-3xl p-10 bg-ink text-primary-foreground overflow-hidden hover-lift">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/40 rounded-full blur-3xl" />
            <div className="relative">
              <Users className="w-8 h-8 mb-8 text-accent" />
              <h3 className="font-display text-3xl md:text-4xl mb-4">For students</h3>
              <p className="text-primary-foreground/70 mb-8 max-w-md">
                Browse verified companies, track applications and manage documents from one calm dashboard.
              </p>
              <div className="inline-flex items-center gap-2 text-sm border-b border-primary-foreground/30 pb-1 group-hover:border-accent group-hover:text-accent transition-colors">
                Create account <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
          <Link to="/contact" className="group relative rounded-3xl p-10 bg-background border border-border overflow-hidden hover-lift">
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative">
              <Building2 className="w-8 h-8 mb-8 text-primary" />
              <h3 className="font-display text-3xl md:text-4xl text-ink mb-4">For companies</h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                Post opportunities and reach qualified students across every Nigerian state — with tools built for HR teams.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-ink border-b border-ink/30 pb-1 group-hover:border-primary group-hover:text-primary transition-colors">
                Post placements <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Features
