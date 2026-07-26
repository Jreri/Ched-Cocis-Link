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
            <div className="rule text-ink/60 mb-8">ChedLink · CCL · In collaboration with COCIS</div>

            <h1 className="font-display text-[3.25rem] sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] text-ink text-balance">
              Every great career
              <span className="block italic text-primary">begins somewhere.</span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-ink-soft max-w-xl leading-relaxed">
              ChedLink connects Nigerian students with vetted companies for SIWES, IT and
              internship placements — developed by Ched Dev in collaboration with COCIS.
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

            <div className="mt-12 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Nationwide coverage across Nigerian states
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
                  <p className="text-sm text-primary-foreground/70 leading-relaxed">
                    A calmer path from application to placement — matched to your
                    department, unlocked city by city.
                  </p>
                </div>
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
