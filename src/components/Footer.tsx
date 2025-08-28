import { GraduationCap, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">StudentPlace</span>
            </div>
            <p className="text-background/80 mb-6 max-w-md">
              Nigeria's leading platform connecting students with top companies for 
              IT, SIWES, and job placements across all 36 states.
            </p>
            <div className="space-y-2 text-sm text-background/80">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                support@studentplace.ng
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +234 800 000 0000
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Lagos, Nigeria
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#how-it-works" className="hover:text-background transition-colors">How it Works</a></li>
              <li><a href="#features" className="hover:text-background transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-background transition-colors">Pricing</a></li>
              <li><a href="#about" className="hover:text-background transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="/register" className="hover:text-background transition-colors">Sign Up</a></li>
              <li><a href="/login" className="hover:text-background transition-colors">Sign In</a></li>
              <li><a href="/dashboard" className="hover:text-background transition-colors">Dashboard</a></li>
              <li><a href="/placements" className="hover:text-background transition-colors">Find Placements</a></li>
              <li><a href="/help" className="hover:text-background transition-colors">Help Center</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-background/60 mb-4 md:mb-0">
              © 2024 StudentPlace Nigeria. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-background/80">
              <a href="/privacy" className="hover:text-background transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-background transition-colors">Terms of Service</a>
              <a href="/cookies" className="hover:text-background transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer