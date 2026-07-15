import { Button } from "@/components/ui/enhanced-button"
import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"

const CTA = () => {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="relative rounded-[2rem] bg-ink text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-primary/40 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl" />
          </div>

          <div className="relative grid lg:grid-cols-12 gap-10 p-10 md:p-16 lg:p-20 items-center">
            <div className="lg:col-span-8">
              <p className="rule text-primary-foreground/60 mb-6">Ready when you are</p>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-balance">
                Find the placement that
                <span className="italic text-accent"> shapes</span> everything after.
              </h2>
              <p className="mt-8 text-lg text-primary-foreground/70 max-w-xl">
                Join thousands of Nigerian students who have already secured meaningful IT, SIWES and graduate placements through StudentPlace.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/register">
                  <Button size="xl" className="rounded-full bg-background text-ink hover:bg-background/90 gap-2 px-7">
                    Start as a student <ArrowUpRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="xl" variant="ghost" className="rounded-full text-primary-foreground hover:bg-primary-foreground/10 border border-primary-foreground/20 gap-2 px-7">
                    Post opportunities
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              {[
                { n: "500+", l: "Verified companies" },
                { n: "10K+", l: "Students placed" },
                { n: "36", l: "States covered" },
                { n: "95%", l: "Success rate" },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.03] p-6 backdrop-blur">
                  <div className="font-display text-4xl md:text-5xl text-primary-foreground">{s.n}</div>
                  <div className="text-xs uppercase tracking-[0.15em] text-primary-foreground/60 mt-2">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
