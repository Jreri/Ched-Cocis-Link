import { Button } from "@/components/ui/enhanced-button"
import { Search, MapPin, Building2 } from "lucide-react"
import heroBackground from "@/assets/hero-background.jpg"

const Hero = () => {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-hero/80" />
      
      {/* Additional Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Find Your Perfect Placement in Nigeria
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with top companies offering IT, SIWES, and job placements across all 36 states. 
            Easy search by location, instant applications, and direct company contact.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up">
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              <Search className="w-5 h-5 mr-2" />
              Find Placements Now
            </Button>
            <Button variant="outline" size="xl" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
              <Building2 className="w-5 h-5 mr-2" />
              I'm a Company
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Companies</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-3xl font-bold text-white mb-2">36</div>
              <div className="text-white/80">States Covered</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/80">Students Placed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero