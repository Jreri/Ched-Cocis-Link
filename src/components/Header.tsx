import { Button } from "@/components/ui/enhanced-button"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

const nav = [
  { to: "/search", label: "Companies" },
  { to: "/browse-locations", label: "Locations" },
  { to: "/success-stories", label: "Stories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
]

const Header = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border" : "bg-transparent"}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 bg-ink rounded-lg flex items-center justify-center transition-transform group-hover:rotate-3">
                <span className="font-display text-primary-foreground text-lg leading-none">S</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl text-ink">StudentPlace</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-0.5">Nigeria</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map(item => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${active ? "text-ink bg-muted" : "text-muted-foreground hover:text-ink"}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-full">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-full bg-ink text-primary-foreground hover:bg-ink/90 gap-1.5">
                Get started <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-ink"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-6 animate-fade-in">
            <nav className="flex flex-col gap-1 pt-4 border-t border-border">
              {nav.map(item => (
                <Link key={item.to} to={item.to} className="px-4 py-3 text-base text-ink hover:bg-muted rounded-lg">
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
                <Link to="/login"><Button variant="ghost" className="w-full justify-start rounded-lg">Sign in</Button></Link>
                <Link to="/register"><Button className="w-full rounded-lg bg-ink text-primary-foreground hover:bg-ink/90">Get started</Button></Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
