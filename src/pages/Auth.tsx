import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

type Department = { id: string; name: string }

const Auth = () => {
  const navigate = useNavigate()
  const routeLocation = useLocation()
  const initialTab = routeLocation.pathname === "/register" ? "register" : "login"

  const [tab, setTab] = useState(initialTab)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])

  const [login, setLogin] = useState({ email: "", password: "" })
  const [reg, setReg] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    departmentId: "",
  })

  useEffect(() => {
    document.title = "Sign in — ChedLink"
  }, [])

  const [deptsLoading, setDeptsLoading] = useState(true)

  const redirectByRole = async (userId: string) => {
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" })
    navigate(isAdmin ? "/admin" : "/dashboard", { replace: true })
  }

  // Redirect if already logged in
  useEffect(() => {
    let unsub: (() => void) | undefined
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) redirectByRole(data.session.user.id)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (session) redirectByRole(session.user.id)
    })
    unsub = () => sub.subscription.unsubscribe()
    return () => unsub?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  useEffect(() => {
    ;(async () => {
      setDeptsLoading(true)
      const { data, error } = await supabase
        .from("departments")
        .select("id,name")
        .eq("is_active", true)
        .order("name")
      if (error) toast.error(error.message)
      setDepartments((data as Department[]) || [])
      setDeptsLoading(false)
    })()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: login.email.trim(),
      password: login.password,
    })
    setSubmitting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Welcome back")
    navigate("/placements", { replace: true })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (reg.password !== reg.confirmPassword) return toast.error("Passwords do not match")
    if (reg.password.length < 8) return toast.error("Password must be at least 8 characters")
    if (!reg.departmentId) return toast.error("Please select your department")

    setSubmitting(true)
    const { data, error } = await supabase.auth.signUp({
      email: reg.email.trim(),
      password: reg.password,
      options: {
        emailRedirectTo: `${window.location.origin}/placements`,
        data: {
          full_name: reg.fullName.trim(),
          department_id: reg.departmentId,
        },
      },
    })
    setSubmitting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    if (data.session) {
      toast.success("Account created")
      navigate("/placements", { replace: true })
    } else {
      toast.success("Account created — check your inbox to confirm your email, then sign in.")
      setTab("login")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">ChedLink · CCL</div>
            <h1 className="text-3xl font-display">Welcome to ChedLink</h1>
            <p className="text-muted-foreground mt-2">Find IT/SIWES placements matched to your department.</p>
          </div>

          <Card className="p-6">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login">Sign in</TabsTrigger>
                <TabsTrigger value="register">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6 space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="li-email">Email</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="li-email"
                        type="email"
                        required
                        value={login.email}
                        onChange={(e) => setLogin((s) => ({ ...s, email: e.target.value }))}
                        className="pl-10"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="li-pw">Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="li-pw"
                        type={showPassword ? "text" : "password"}
                        required
                        value={login.password}
                        onChange={(e) => setLogin((s) => ({ ...s, password: e.target.value }))}
                        className="pl-10 pr-10"
                      />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-3 text-muted-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Sign in
                  </Button>
                  <div className="text-center">
                    <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-ink underline">
                      Forgot your password?
                    </Link>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6 space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="rg-name">Full name</Label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="rg-name"
                        required
                        value={reg.fullName}
                        onChange={(e) => setReg((s) => ({ ...s, fullName: e.target.value }))}
                        className="pl-10"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="rg-email">Email</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="rg-email"
                        type="email"
                        required
                        value={reg.email}
                        onChange={(e) => setReg((s) => ({ ...s, email: e.target.value }))}
                        className="pl-10"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select value={reg.departmentId} onValueChange={(v) => setReg((s) => ({ ...s, departmentId: v }))} disabled={deptsLoading || departments.length === 0}>
                      <SelectTrigger>
                        <SelectValue placeholder={deptsLoading ? "Loading departments…" : departments.length === 0 ? "No departments available" : "Select your department"} />
                      </SelectTrigger>
                      <SelectContent className="z-[70] bg-popover max-h-64">
                        {departments.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!deptsLoading && departments.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Departments haven't been set up yet. <Link to="/contact" className="underline">Contact support</Link>.
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="rg-pw">Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="rg-pw"
                        type={showPassword ? "text" : "password"}
                        required
                        value={reg.password}
                        onChange={(e) => setReg((s) => ({ ...s, password: e.target.value }))}
                        className="pl-10"
                        placeholder="At least 8 characters"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="rg-cpw">Confirm password</Label>
                    <Input
                      id="rg-cpw"
                      type={showPassword ? "text" : "password"}
                      required
                      value={reg.confirmPassword}
                      onChange={(e) => setReg((s) => ({ ...s, confirmPassword: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create account
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    By creating an account you agree to the{" "}
                    <Link to="/terms" className="underline">Terms</Link> and{" "}
                    <Link to="/privacy" className="underline">Privacy Policy</Link>.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Auth
