import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"

const columns = [
  {
    title: "Platform",
    links: [
      { to: "/search", label: "Find placements" },
      { to: "/advanced-search", label: "Advanced search" },
      { to: "/browse-locations", label: "Browse by location" },
      { to: "/compare", label: "Compare companies" },
    ],
  },
  {
    title: "Students",
    links: [
      { to: "/register", label: "Create account" },
      { to: "/login", label: "Sign in" },
      { to: "/dashboard", label: "Dashboard" },
      { to: "/how-to-apply", label: "How to apply" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About us" },
      { to: "/success-stories", label: "Success stories" },
      { to: "/contact", label: "Contact" },
      { to: "/help", label: "Help center" },
    ],
  },
]

const Footer = () => {
  return (
    <footer className="relative bg-ink text-primary-foreground pt-24 pb-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/3 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-primary-foreground/10">
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="font-display text-primary-foreground text-xl leading-none">S</span>
              </div>
              <div>
                <div className="font-display text-2xl">StudentPlace</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-primary-foreground/60">Nigeria</div>
              </div>
            </Link>
            <p className="font-display text-3xl md:text-4xl leading-tight mt-8 max-w-md text-balance">
              Where Nigerian students
              <span className="italic text-accent"> meet</span> their first opportunity.
            </p>

            <div className="mt-10 space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-3"><Mail className="w-4 h-4" /> support@studentplace.ng</div>
              <div className="flex items-center gap-3"><Phone className="w-4 h-4" /> +234 800 000 0000</div>
              <div className="flex items-center gap-3"><MapPin className="w-4 h-4" /> Lagos, Nigeria</div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {columns.map(col => (
              <div key={col.title}>
                <h4 className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50 mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l.to}>
                      <Link to={l.to} className="group inline-flex items-center gap-1 text-sm text-primary-foreground/90 hover:text-accent transition-colors">
                        {l.label}
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
          <div>© {new Date().getFullYear()} StudentPlace Nigeria. All rights reserved.</div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-primary-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-primary-foreground">Terms</Link>
            <Link to="/help" className="hover:text-primary-foreground">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
