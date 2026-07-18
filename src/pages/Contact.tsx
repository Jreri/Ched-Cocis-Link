import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Building,
  Users
} from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: ["hello@studentplace.ng", "support@studentplace.ng"],
    description: "Get in touch via email for general inquiries or support"
  },
  {
    icon: Phone, 
    title: "Call Us",
    details: ["+234-906-000-0000", "+234-809-000-0000"],
    description: "Speak directly with our support team during business hours"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Lagos Office:", "123 Admiralty Way, Lekki", "Lagos State, Nigeria"],
    description: "Come visit our office for in-person consultations"
  },
  {
    icon: Clock,
    title: "Business Hours", 
    details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM", "Sun: Closed"],
    description: "Our operating hours for support and consultations"
  }
]

const Contact = () => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Add structured data for Contact page
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact StudentPlace Nigeria",
      "description": "Get in touch with StudentPlace Nigeria for support, partnerships, or general inquiries about student placements",
      "url": "https://studentplace.ng/contact"
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json' 
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    // Update meta tags
    document.title = "Contact Us - StudentPlace Nigeria | Support & Partnerships"
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact StudentPlace Nigeria for student placement support, company partnerships, or general inquiries. Get in touch via email, phone, or visit our Lagos office.')
    }

    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for reaching out. We'll get back to you within 24 hours.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: ""
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.email && formData.subject && formData.message && formData.category

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="hero-gradient pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Contact Us
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto animate-slide-up">
              Have questions about placements, partnerships, or need support? We're here to help!
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <Card key={index} className="p-6 text-center hover-lift">
                  <info.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-3">{info.title}</h3>
                  <div className="space-y-1 mb-3">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-muted-foreground text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-xs">{info.description}</p>
                </Card>
              ))}
            </div>

            {/* Contact Form & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="p-8">
                  <div className="flex items-center mb-6">
                    <Send className="w-6 h-6 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-foreground">Send us a Message</h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleSelectChange(value, 'category')}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student Support</SelectItem>
                            <SelectItem value="company">Company Partnership</SelectItem>
                            <SelectItem value="university">University Partnership</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="general">General Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What is this regarding?"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                      disabled={!isFormValid || isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Additional Info */}
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="w-6 h-6 text-secondary mr-3" />
                    <h3 className="text-lg font-semibold text-foreground">For Students</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    Need help with your application, profile setup, or finding placements? Our student support team is ready to assist.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Student Help Center
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Building className="w-6 h-6 text-accent mr-3" />
                    <h3 className="text-lg font-semibold text-foreground">For Companies</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    Interested in partnering with us to find talented students? Let's discuss how we can work together.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Partnership Info
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Users className="w-6 h-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold text-foreground">Response Time</h3>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• General inquiries: Within 24 hours</p>
                    <p>• Student support: Within 12 hours</p>
                    <p>• Partnership requests: Within 48 hours</p>
                    <p>• Technical issues: Within 6 hours</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Contact