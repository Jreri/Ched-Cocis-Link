import { useEffect, useState, type ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

type Role = "admin" | "student"

/**
 * Route guard. Students can never render admin routes, admins can never render
 * student routes — both are bounced to their own home.
 */
export default function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const location = useLocation()
  const [state, setState] = useState<"loading" | "ok" | "anon" | "wrong">("loading")

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!active) return
      if (!user) { setState("anon"); return }
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" })
      if (!active) return
      const actual: Role = isAdmin ? "admin" : "student"
      setState(actual === role ? "ok" : "wrong")
    })()
    return () => { active = false }
  }, [role, location.pathname])

  if (state === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>
  }
  if (state === "anon") return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (state === "wrong") return <Navigate to={role === "admin" ? "/dashboard" : "/admin"} replace />
  return <>{children}</>
}
