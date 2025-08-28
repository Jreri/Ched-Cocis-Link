import { Button } from "@/components/ui/enhanced-button"
import { ArrowRight, Users, Building2 } from "lucide-react"

const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Find Your Perfect Placement?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of students who have successfully secured their IT, SIWES, 
            and job placements through our platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button 
              variant="secondary" 
              size="xl" 
              className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
            >
              <Users className="w-5 h-5 mr-2" />
              Start as Student
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
            >
              <Building2 className="w-5 h-5 mr-2" />
              Post Opportunities
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="text-2xl font-bold mb-1">500+</div>
              <div className="text-white/80 text-sm">Verified Companies</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-2xl font-bold mb-1">10K+</div>
              <div className="text-white/80 text-sm">Students Placed</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="text-2xl font-bold mb-1">36</div>
              <div className="text-white/80 text-sm">States Covered</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-2xl font-bold mb-1">95%</div>
              <div className="text-white/80 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA