import { useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Target, 
  Heart, 
  Award,
  CheckCircle,
  Linkedin,
  Mail
} from "lucide-react"
import { Link } from "react-router-dom"

const teamMembers = [
  {
    name: "Adebayo Ogundimu",
    role: "Founder & CEO",
    image: "/api/placeholder/150/150",
    linkedin: "#",
    description: "Former HR Director with 15+ years in student placement and career development."
  },
  {
    name: "Fatima Aliyu", 
    role: "Head of Partnerships",
    image: "/api/placeholder/150/150",
    linkedin: "#",
    description: "Building strategic relationships with top Nigerian companies and institutions."
  },
  {
    name: "Chinedu Okeke",
    role: "Technical Lead",
    image: "/api/placeholder/150/150", 
    linkedin: "#",
    description: "Full-stack developer passionate about creating seamless user experiences."
  }
]

const milestones = [
  { year: "2020", event: "Platform conception and initial research" },
  { year: "2021", event: "Partnership with first 10 companies" },
  { year: "2022", event: "1,000+ successful student placements" },
  { year: "2023", event: "Expansion to 15+ states across Nigeria" },
  { year: "2024", event: "5,000+ students served, 200+ partner companies" }
]

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for excellence in everything we do, from matching students to companies to providing outstanding support."
  },
  {
    icon: Heart, 
    title: "Student-First",
    description: "Every decision we make prioritizes the success and career development of Nigerian students."
  },
  {
    icon: Users,
    title: "Collaboration", 
    description: "We believe in the power of partnerships between students, universities, and industry leaders."
  },
  {
    icon: Award,
    title: "Quality",
    description: "We maintain high standards in our vetting process to ensure meaningful placement opportunities."
  }
]

const About = () => {
  useEffect(() => {
    // Add structured data for About page
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "StudentPlace Nigeria",
      "description": "Nigeria's leading platform connecting students with quality placement opportunities",
      "url": "https://studentplace.ng/about",
      "foundingDate": "2020",
      "founder": {
        "@type": "Person", 
        "name": "Adebayo Ogundimu"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lagos",
        "addressCountry": "Nigeria"
      }
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    // Update meta tags
    document.title = "About Us - StudentPlace Nigeria | Leading Student Placement Platform"
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about StudentPlace Nigeria - the leading platform connecting Nigerian students with top companies for IT, SIWES, and internship opportunities since 2020.')
    }

    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="hero-gradient pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              About StudentPlace Nigeria
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 animate-slide-up">
              Connecting Nigerian students with top companies since 2020. We're building the bridge 
              between academic excellence and professional success.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
              <Badge variant="secondary" className="text-lg py-2 px-4">5,000+ Students Placed</Badge>
              <Badge variant="secondary" className="text-lg py-2 px-4">200+ Partner Companies</Badge>
              <Badge variant="secondary" className="text-lg py-2 px-4">15+ States Coverage</Badge>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <Card className="p-8 card-gradient">
                <div className="text-center mb-6">
                  <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To bridge the gap between Nigerian students and industry by providing a comprehensive 
                  platform that facilitates meaningful placement opportunities, fostering professional 
                  growth and career development for the next generation of leaders.
                </p>
              </Card>

              <Card className="p-8 card-gradient">
                <div className="text-center mb-6">
                  <Heart className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To become Nigeria's premier student placement platform, where every student has 
                  access to quality internship and career opportunities that align with their 
                  academic pursuits and professional aspirations.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Story</h2>
              
              <div className="space-y-8">
                <Card className="p-8">
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    StudentPlace Nigeria was born from a simple observation: too many talented Nigerian 
                    students were struggling to find quality placement opportunities, while companies 
                    were looking for bright minds to join their teams.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    Founded in 2020 by a team of HR professionals and tech enthusiasts, we set out to 
                    create a platform that would streamline the placement process for both students and 
                    employers, ensuring better matches and more successful outcomes.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Today, we're proud to have facilitated thousands of successful placements across 
                    Nigeria, helping students gain valuable work experience while supporting companies 
                    in finding and developing young talent.
                  </p>
                </Card>

                {/* Timeline */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-foreground text-center mb-8">Our Journey</h3>
                  {milestones.map((milestone, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                          {milestone.year}
                        </div>
                        <div className="ml-6">
                          <p className="text-muted-foreground text-lg">{milestone.event}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="p-6 text-center hover-lift">
                  <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Meet Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="p-6 text-center hover-lift">
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4">{member.role}</Badge>
                  <p className="text-muted-foreground text-sm mb-4">{member.description}</p>
                  <div className="flex justify-center space-x-3">
                    <Button variant="outline" size="sm">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="p-12 text-center card-gradient max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-6">Join Our Mission</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Whether you're a student looking for opportunities or a company seeking talented interns, 
                we're here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                    Get Started as Student
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Partner with Us
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About