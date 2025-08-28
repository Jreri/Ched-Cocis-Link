import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Send, CheckCircle } from "lucide-react"

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      icon: <Search className="w-8 h-8" />,
      title: "Search by Location",
      description: "Select your preferred state and LGA to find companies offering placements in your area.",
      color: "bg-primary"
    },
    {
      step: 2,
      icon: <MapPin className="w-8 h-8" />,
      title: "Browse Companies",
      description: "View detailed company profiles, placement requirements, and available positions.",
      color: "bg-secondary"
    },
    {
      step: 3,
      icon: <Send className="w-8 h-8" />,
      title: "Apply Instantly",
      description: "Upload your CV and placement letter, then submit your application directly to the company.",
      color: "bg-accent"
    },
    {
      step: 4,
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Track Progress",
      description: "Monitor your application status and receive updates when companies review your submission.",
      color: "bg-success"
    }
  ]

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Finding your perfect placement is simple with our streamlined 4-step process.
            Get connected with companies in just minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="relative card-gradient border-0 hover-lift animate-fade-in text-center"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                {/* Step Number Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`w-8 h-8 ${step.color} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${step.color}/10 mb-4 mt-4`}>
                  <div className="text-white">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Flow Visualization */}
        <div className="hidden lg:block mt-16">
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-primary transform -translate-y-1/2 opacity-30"></div>
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="bg-background p-2">
                  <div className="w-4 h-4 bg-gradient-primary rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks