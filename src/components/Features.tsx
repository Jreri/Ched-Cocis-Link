import { Card, CardContent } from "@/components/ui/card"
import { 
  MapPin, 
  Search, 
  Send, 
  CreditCard, 
  Shield, 
  Clock,
  Building2,
  Users
} from "lucide-react"

const Features = () => {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location-Based Search",
      description: "Find placements by state and LGA. Discover opportunities right in your preferred location across Nigeria.",
      color: "text-primary"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Filtering",
      description: "Filter by department, level, company type, and placement duration to find exactly what you need.",
      color: "text-secondary"
    },
    {
      icon: <Send className="w-8 h-8" />,
      title: "Direct Applications",
      description: "Apply instantly with your CV and placement letter. Applications go directly to company HR.",
      color: "text-accent"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Companies",
      description: "All companies are verified and vetted to ensure legitimate placement opportunities.",
      color: "text-primary"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Status",
      description: "Track your application status in real-time. Know when companies view and respond to your application.",
      color: "text-secondary"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Premium Access",
      description: "Unlock all companies in a state for just ₦2000. Multiple payment options available.",
      color: "text-accent"
    }
  ]

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Why Choose StudentPlace?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've built the most comprehensive platform for student placements in Nigeria,
            with features designed to make your search seamless and successful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-gradient border-0 hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-primary/10 mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <Card className="card-gradient border-0 hover-lift">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Building2 className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-2xl font-semibold">For Companies</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Post your placement opportunities and connect directly with qualified students 
                from universities across Nigeria.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Receive applications directly via email</li>
                <li>• Access to pre-screened student profiles</li>
                <li>• Location-based candidate matching</li>
                <li>• Simple posting and management tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-gradient border-0 hover-lift">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-secondary mr-3" />
                <h3 className="text-2xl font-semibold">For Students</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Search, apply, and secure your ideal placement with our comprehensive 
                platform designed specifically for Nigerian students.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Access to 500+ verified companies</li>
                <li>• State and LGA-based search</li>
                <li>• Application status tracking</li>
                <li>• CV and document management</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Features