import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => { document.title = "Reset password — ChedLink" }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setSubmitting(false)
    if (error) return toast.error(error.message)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Reset your password</CardTitle>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center py-6 space-y-3">
                <Mail className="w-8 h-8 mx-auto text-primary" />
                <p className="text-sm">Check your inbox for a reset link.</p>
                <Link to="/login" className="text-sm underline">Back to sign in</Link>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send reset link
                </Button>
                <div className="text-center">
                  <Link to="/login" className="text-xs text-muted-foreground hover:text-ink underline">Back to sign in</Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
