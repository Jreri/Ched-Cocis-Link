import { Search, Building2, Send, CheckCircle2 } from "lucide-react"

const steps = [
  { n: "01", icon: Search, title: "Search by place", body: "Filter by state, LGA and field of study to surface placements near you." },
  { n: "02", icon: Building2, title: "Meet the company", body: "Read verified profiles, understand roles and see what each firm expects." },
  { n: "03", icon: Send, title: "Apply directly", body: "Send your CV and placement letter straight to the hiring team — no middlemen." },
  { n: "04", icon: CheckCircle2, title: "Track everything", body: "Watch application status update in real time from a single dashboard." },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <p className="rule mb-6">The process</p>
            <h2 className="font-display text-5xl md:text-6xl text-ink leading-[1] text-balance">
              Four steps from
              <span className="italic text-primary"> curiosity</span> to <span className="italic">contract.</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 flex items-end">
            <p className="text-lg text-ink-soft leading-relaxed">
              We designed the journey to feel less like a job board and more like an introduction.
              Each step is calm, direct, and made for students juggling classes and deadlines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="group relative bg-card border border-border rounded-3xl p-8 hover-lift animate-fade-in overflow-hidden"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="absolute top-6 right-6 font-display text-6xl text-muted leading-none group-hover:text-primary/20 transition-colors">
                {s.n}
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-ink text-primary-foreground flex items-center justify-center mb-8">
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-2xl text-ink mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
