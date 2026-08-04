import { Button } from "@/components/ui/enhanced-button"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

const publicNav = [
  { to: "/placements", label: "Placements" },
  { to: "/how-to-apply", label: "How it works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
]

const Header = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  // Body scroll lock when drawer open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  const checkAdmin = async (uid: string) => {
    const { data } = await supabase.rpc("has_role", { _user_id: uid, _role: "admin" })
    setIsAdmin(!!data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session)
      if (data.session) checkAdmin(data.session.user.id)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setAuthed(!!s)
      if (s) checkAdmin(s.user.id); else setIsAdmin(false)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Ctrl+Shift+A opens /admin (page is role-gated)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault()
        navigate("/admin")
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [navigate])

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate("/", { replace: true })
  }

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border" : "bg-transparent"}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 bg-ink rounded-lg flex items-center justify-center transition-transform group-hover:rotate-3">
                <span className="font-display text-primary-foreground text-lg leading-none">C</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl text-ink">ChedLink</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-0.5">CCL · with COCIS</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {publicNav.map(item => {
              const active = location.pathname === item.to
              return (
                <Link key={item.to} to={item.to} className={`px-4 py-2 text-sm rounded-full transition-colors ${active ? "text-ink bg-muted" : "text-muted-foreground hover:text-ink"}`}>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {authed ? (
              <>
                <Link to={isAdmin ? "/admin" : "/dashboard"}><Button variant="ghost" size="sm" className="rounded-full">Dashboard</Button></Link>
                {isAdmin ? (
                  <Link to="/admin/applications"><Button variant="ghost" size="sm" className="rounded-full">Applications</Button></Link>
                ) : (
                  <>
                    <Link to="/placements"><Button variant="ghost" size="sm" className="rounded-full">Placements</Button></Link>
                    <Link to="/applications"><Button variant="ghost" size="sm" className="rounded-full">My applications</Button></Link>
                    <Link to="/profile"><Button variant="ghost" size="sm" className="rounded-full">Profile</Button></Link>
                  </>
                )}
                <Button size="sm" onClick={signOut} className="rounded-full bg-ink text-primary-foreground hover:bg-ink/90">Sign out</Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm" className="rounded-full">Sign in</Button></Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full bg-ink text-primary-foreground hover:bg-ink/90 gap-1.5">
                    Get started <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button className="lg:hidden p-2 text-ink z-[60] relative" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer + backdrop */}
      {open && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-ink/60 backdrop-blur-sm z-40 animate-fade-in"
            style={{ height: "100dvh" }}
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            className="lg:hidden fixed top-0 right-0 w-[86%] max-w-sm bg-background shadow-2xl z-50 flex flex-col border-l border-border animate-fade-in"
            style={{ height: "100dvh" }}
          >
            <div className="h-20 flex items-center px-6 border-b border-border shrink-0">
              <span className="font-display text-lg text-ink">ChedLink</span>
              <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">CCL</span>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
              {publicNav.map(item => (
                <Link key={item.to} to={item.to} className="px-4 py-3 text-base text-ink hover:bg-muted rounded-lg">
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-border">
                {authed ? (
                  <>
                    <Link to={isAdmin ? "/admin" : "/dashboard"}><Button variant="ghost" className="w-full justify-start rounded-lg">Dashboard</Button></Link>
                    {isAdmin ? (
                      <Link to="/admin/applications"><Button variant="ghost" className="w-full justify-start rounded-lg">Applications</Button></Link>
                    ) : (
                      <>
                        <Link to="/placements"><Button variant="ghost" className="w-full justify-start rounded-lg">Placements</Button></Link>
                        <Link to="/applications"><Button variant="ghost" className="w-full justify-start rounded-lg">My applications</Button></Link>
                        <Link to="/profile"><Button variant="ghost" className="w-full justify-start rounded-lg">Profile</Button></Link>
                      </>
                    )}
                    <Button onClick={signOut} className="w-full rounded-lg bg-ink text-primary-foreground hover:bg-ink/90">Sign out</Button>
                  </>
                ) : (
                  <>
                    <Link to="/login"><Button variant="ghost" className="w-full justify-start rounded-lg">Sign in</Button></Link>
                    <Link to="/register"><Button className="w-full rounded-lg bg-ink text-primary-foreground hover:bg-ink/90">Get started</Button></Link>
                  </>
                )}
              </div>
            </nav>
            <div className="p-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground border-t border-border shrink-0">
              Ched Dev × COCIS
            </div>
          </aside>
        </>
      )}
    </header>
  )
}

export default Header
