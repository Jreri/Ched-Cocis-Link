import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { 
  User, 
  Mail, 
  Lock, 
  Phone,
  MapPin,
  GraduationCap,
  Building,
  Eye,
  EyeOff
} from "lucide-react"

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  university: string
  course: string
  level: string
  state: string
  agreeToTerms: boolean
}

const universities = [
  "University of Lagos",
  "University of Ibadan", 
  "Ahmadu Bello University",
  "University of Nigeria, Nsukka",
  "Obafemi Awolowo University",
  "University of Benin",
  "Federal University of Technology, Akure",
  "Covenant University",
  "Other"
]

const courses = [
  "Computer Science",
  "Engineering",
  "Business Administration",
  "Accounting",
  "Economics", 
  "Mass Communication",
  "Medicine",
  "Law",
  "Other"
]

const levels = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level", "Graduate"]
const states = ["Lagos", "Abuja", "Kano", "Rivers", "Ogun", "Kaduna", "Other"]

const Auth = () => {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
    rememberMe: false
  })

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    university: "",
    course: "",
    level: "",
    state: "",
    agreeToTerms: false
  })

  useEffect(() => {
    // Update meta tags
    document.title = "Login & Register - StudentPlace Nigeria | Student Portal"
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Login or register for StudentPlace Nigeria to access exclusive student placement opportunities, manage applications, and connect with top companies.')
    }
  }, [])

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setRegisterForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleRegisterSelectChange = (value: string, field: string) => {
    setRegisterForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Login Successful!",
        description: "Welcome back to StudentPlace Nigeria.",
      })

      // In a real app, redirect to dashboard
      console.log("Redirecting to dashboard...")
      
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Password Mismatch", 
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      })
      return
    }

    if (registerForm.password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to StudentPlace Nigeria! Please check your email to verify your account.",
      })

      // Switch to login tab
      setActiveTab("login")
      
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoginValid = loginForm.email && loginForm.password
  const isRegisterValid = registerForm.firstName && registerForm.lastName && registerForm.email && 
    registerForm.password && registerForm.confirmPassword && registerForm.university && 
    registerForm.course && registerForm.level && registerForm.state && registerForm.agreeToTerms

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to StudentPlace</h1>
              <p className="text-muted-foreground">Join thousands of students finding their dream placements</p>
            </div>

            <Card className="p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-6 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          value={loginForm.email}
                          onChange={handleLoginChange}
                          placeholder="Enter your email"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={handleLoginChange}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember-me"
                          name="rememberMe"
                          checked={loginForm.rememberMe}
                          onCheckedChange={(checked) => 
                            setLoginForm(prev => ({ ...prev, rememberMe: !!checked }))
                          }
                        />
                        <Label htmlFor="remember-me" className="text-sm">Remember me</Label>
                      </div>
                      <Link to="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                      disabled={!isLoginValid || isSubmitting}
                    >
                      {isSubmitting ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-6 mt-6">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={registerForm.firstName}
                          onChange={handleRegisterChange}
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={registerForm.lastName}
                          onChange={handleRegisterChange}
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="register-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          value={registerForm.email}
                          onChange={handleRegisterChange}
                          placeholder="Enter your email"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="register-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input
                          id="register-phone"
                          name="phone"
                          type="tel"
                          value={registerForm.phone}
                          onChange={handleRegisterChange}
                          placeholder="Enter your phone number"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="university">University</Label>
                        <Select 
                          value={registerForm.university} 
                          onValueChange={(value) => handleRegisterSelectChange(value, 'university')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select university" />
                          </SelectTrigger>
                          <SelectContent>
                            {universities.map((uni) => (
                              <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="course">Course of Study</Label>
                        <Select 
                          value={registerForm.course} 
                          onValueChange={(value) => handleRegisterSelectChange(value, 'course')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course} value={course}>{course}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="level">Current Level</Label>
                        <Select 
                          value={registerForm.level} 
                          onValueChange={(value) => handleRegisterSelectChange(value, 'level')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {levels.map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Select 
                          value={registerForm.state} 
                          onValueChange={(value) => handleRegisterSelectChange(value, 'state')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input
                          id="register-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={registerForm.password}
                          onChange={handleRegisterChange}
                          placeholder="Create a password"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={registerForm.confirmPassword}
                          onChange={handleRegisterChange}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agree-terms"
                        name="agreeToTerms"
                        checked={registerForm.agreeToTerms}
                        onCheckedChange={(checked) => 
                          setRegisterForm(prev => ({ ...prev, agreeToTerms: !!checked }))
                        }
                      />
                      <Label htmlFor="agree-terms" className="text-sm">
                        I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                      disabled={!isRegisterValid || isSubmitting}
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>

            <p className="text-center text-muted-foreground text-sm mt-6">
              By continuing, you agree to our terms and that you have read our privacy policy.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Auth