import { useParams, Link } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  Mail, 
  Phone,
  Clock,
  CheckCircle,
  Star,
  ArrowLeft
} from "lucide-react"

interface CompanyDetails {
  id: string
  name: string
  industry: string
  location: string
  state: string
  size: string
  establishedYear: number
  description: string
  website?: string
  email?: string
  phone?: string
  logo?: string
  openPositions: Array<{
    id: string
    title: string
    department: string
    duration: string
    requirements: string[]
    benefits: string[]
  }>
  about: {
    mission: string
    vision: string
    values: string[]
  }
  workCulture: string[]
  requirements: {
    general: string[]
    preferred: string[]
  }
}

const mockCompanyData: Record<string, CompanyDetails> = {
  "1": {
    id: "1",
    name: "Dangote Group",
    industry: "Manufacturing & Conglomerate",
    location: "Lagos",
    state: "Lagos",
    size: "Large (5000+ employees)",
    establishedYear: 1981,
    description: "Africa's leading conglomerate with interests in cement, sugar, flour, salt, and oil & gas. We are committed to providing quality products and services while creating value for all stakeholders.",
    website: "www.dangote.com",
    email: "careers@dangote.com",
    phone: "+234-1-448-0815",
    openPositions: [
      {
        id: "d1",
        title: "Industrial Training (IT) - Engineering",
        department: "Engineering",
        duration: "6 months",
        requirements: ["Engineering student (200-400 level)", "Minimum CGPA of 3.0", "Strong analytical skills"],
        benefits: ["Monthly stipend", "Transportation allowance", "Professional mentorship", "Certificate of completion"]
      },
      {
        id: "d2", 
        title: "SIWES Program - Mechanical Engineering",
        department: "Production",
        duration: "6 months",
        requirements: ["Mechanical Engineering student", "300-400 level", "Basic AutoCAD knowledge"],
        benefits: ["Hands-on experience", "Industry exposure", "Networking opportunities", "Possible job offer"]
      }
    ],
    about: {
      mission: "To be a world-class organization that creates value for all stakeholders",
      vision: "To be the most admired brand in Africa by 2025",
      values: ["Excellence", "Innovation", "Integrity", "Teamwork", "Sustainability"]
    },
    workCulture: ["Innovation-driven", "Collaborative environment", "Professional development", "Work-life balance"],
    requirements: {
      general: ["Must be a registered Nigerian university student", "Valid student ID", "Letter from institution"],
      preferred: ["Previous internship experience", "Relevant certifications", "Leadership experience"]
    }
  }
}

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>()
  const company = mockCompanyData[id || "1"]

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Company Not Found</h1>
          <Link to="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/search" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Link>

        {/* Company Header */}
        <Card className="p-8 mb-8 card-gradient">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center">
                <Building className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{company.name}</h1>
                  <Badge variant="secondary" className="mb-4">{company.industry}</Badge>
                  <p className="text-muted-foreground mb-4">{company.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {company.location}, {company.state}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {company.size}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Established {company.establishedYear}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="flex items-center justify-end text-success">
                    <Clock className="w-4 h-4 mr-2" />
                    {company.openPositions.length} open positions
                  </div>
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Company Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">About Company</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Mission</h4>
                    <p className="text-muted-foreground">{company.about.mission}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Vision</h4>
                    <p className="text-muted-foreground">{company.about.vision}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Core Values</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.about.values.map((value, index) => (
                        <Badge key={index} variant="outline">{value}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Work Culture</h3>
                <div className="space-y-3">
                  {company.workCulture.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-success mr-3" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="positions" className="space-y-6">
            <div className="grid gap-6">
              {company.openPositions.map((position) => (
                <Card key={position.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>{position.department}</span>
                        <span>•</span>
                        <span>{position.duration}</span>
                      </div>
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
                      Apply for Position
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {position.requirements.map((req, index) => (
                          <li key={index} className="flex items-start text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Benefits</h4>
                      <ul className="space-y-2">
                        {position.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start text-muted-foreground">
                            <Star className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">General Requirements</h3>
                <ul className="space-y-3">
                  {company.requirements.general.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Preferred Qualifications</h3>
                <ul className="space-y-3">
                  {company.requirements.preferred.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {company.website && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-primary mr-3" />
                      <a href={`https://${company.website}`} className="text-primary hover:underline">
                        {company.website}
                      </a>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-primary mr-3" />
                      <a href={`mailto:${company.email}`} className="text-primary hover:underline">
                        {company.email}
                      </a>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-primary mr-3" />
                      <a href={`tel:${company.phone}`} className="text-primary hover:underline">
                        {company.phone}
                      </a>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover">
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save Company
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

export default CompanyProfile