import { Button } from "@/components/ui/enhanced-button"
import { ArrowUpRight, MapPin, Sparkles, Star } from "lucide-react"
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[30rem] h-[30rem] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left — editorial copy */}
          <div className="lg:col-span-7 animate-fade-in">
            <div className="rule text-ink/60 mb-8">Issue N°01 · Placements Nigeria</div>

            <h1 className="font-display text-[3.25rem] sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] text-ink text-balance">
              Every great career
              <span className="block italic text-primary">begins somewhere.</span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-ink-soft max-w-xl leading-relaxed">
              A curated network of Nigerian companies opening their doors to students seeking
              IT, SIWES and graduate placements — across all thirty-six states.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link to="/placements">
                <Button size="xl" className="rounded-full bg-ink text-primary-foreground hover:bg-ink/90 gap-2 px-7">
                  Browse placements <ArrowUpRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/how-to-apply">
                <Button variant="ghost" size="xl" className="rounded-full text-ink hover:bg-muted gap-2 px-7">
                  How it works
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-2">
                {["bg-primary","bg-accent","bg-secondary","bg-ink"].map((c,i) => (
                  <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-background`} />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-accent">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  <span className="text-ink font-medium">10,000+</span> students placed this year
                </p>
              </div>
            </div>
          </div>

          {/* Right — editorial visual composition */}
          <div className="lg:col-span-5 relative animate-scale-in" style={{ animationDelay: "0.15s" }}>
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              {/* Main card */}
              <div className="absolute inset-0 rounded-3xl bg-ink text-primary-foreground p-8 flex flex-col justify-between shadow-ink overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/40 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-primary-foreground/60">Featured</span>
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="font-display text-4xl mt-8 leading-tight">
                    Placements, thoughtfully matched.
                  </h3>
                </div>
                <div className="relative space-y-4">
                  <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                    <MapPin className="w-4 h-4" /> 36 states · 774 LGAs
                  </div>
                  <div className="h-px bg-primary-foreground/20" />
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="font-display text-2xl">500+</div>
                      <div className="text-[10px] uppercase tracking-wider text-primary-foreground/60">Firms</div>
                    </div>
                    <div>
                      <div className="font-display text-2xl">36</div>
                      <div className="text-[10px] uppercase tracking-wider text-primary-foreground/60">States</div>
                    </div>
                    <div>
                      <div className="font-display text-2xl">95%</div>
                      <div className="text-[10px] uppercase tracking-wider text-primary-foreground/60">Match</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating chip — top left */}
              <div className="absolute -top-6 -left-6 bg-background border border-border rounded-2xl shadow-medium p-4 w-52 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <span className="font-display text-lg text-ink">A</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Applied to</div>
                    <div className="text-sm font-medium text-ink truncate">Andela Nigeria</div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary rounded-full" />
                </div>
              </div>

              {/* Floating chip — bottom right */}
              <div className="absolute -bottom-6 -right-4 bg-background border border-border rounded-2xl shadow-medium p-4 w-56 animate-fade-in" style={{ animationDelay: "0.55s" }}>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Interview scheduled</div>
                <div className="font-display text-lg text-ink mt-1">MTN · Lagos</div>
                <div className="text-xs text-muted-foreground mt-1">Fri · 10:30 AM WAT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee of company categories */}
        <div className="mt-24 pt-10 border-t border-border">
          <p className="rule mb-6">Trusted across industries</p>
          <div className="relative overflow-hidden">
            <div className="flex gap-12 animate-marquee whitespace-nowrap font-display text-2xl md:text-3xl text-ink/40">
              {[...Array(2)].flatMap((_,r) => ["Fintech","Oil & Gas","Telecoms","Banking","Healthcare","Consulting","Media","Manufacturing","Logistics","EdTech"].map((c,i) => (
                <span key={`${r}-${i}`} className="flex items-center gap-12">
                  {c}<span className="text-accent">✦</span>
                </span>
              )))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
