import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Check, Star } from "lucide-react"

const Pricing = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Simple, Affordable Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start for free and unlock premium features when you're ready to access 
            all placement opportunities in your preferred state.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="card-gradient border-2 hover-lift animate-fade-in">
            <CardHeader className="text-center pb-8">
              <h3 className="text-2xl font-bold mb-2">Free Access</h3>
              <div className="text-4xl font-bold text-primary mb-2">₦0</div>
              <p className="text-muted-foreground">Perfect to get started</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Access to 1-2 companies per location</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Basic search by state and LGA</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Direct application submission</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Application status tracking</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>CV and document upload</span>
                </li>
              </ul>
              <Button variant="outline" size="lg" className="w-full">
                Start Free
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="card-gradient border-2 border-accent relative hover-lift animate-fade-in">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </div>
            </div>
            <CardHeader className="text-center pb-8 pt-8">
              <h3 className="text-2xl font-bold mb-2">Premium Access</h3>
              <div className="text-4xl font-bold text-accent mb-2">₦2,000</div>
              <p className="text-muted-foreground">Per state, lifetime access</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span className="font-semibold">All companies in selected state</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Advanced filtering options</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Priority application processing</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Company contact information</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Application analytics & insights</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
              <Button variant="accent" size="lg" className="w-full">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <p className="text-muted-foreground mb-4">
            Need access to multiple states? Contact us for bulk pricing.
          </p>
          <Button variant="ghost">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Pricing