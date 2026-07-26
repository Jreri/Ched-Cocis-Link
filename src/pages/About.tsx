import { useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Heart, Users, Award } from "lucide-react"
import { Link } from "react-router-dom"

const values = [
  {
    icon: Target,
    title: "Excellence",
    description:
      "We strive for excellence in everything we do, from matching students to companies to providing outstanding support.",
  },
  {
    icon: Heart,
    title: "Student-First",
    description:
      "Every decision we make prioritizes the success and career development of Nigerian students.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "We believe in the power of partnerships between students, universities, and industry leaders.",
  },
  {
    icon: Award,
    title: "Quality",
    description:
      "We maintain high standards in our vetting process to ensure meaningful placement opportunities.",
  },
]

const About = () => {
  useEffect(() => {
    document.title = "About — ChedLink"
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        "content",
        "ChedLink (CCL) connects Nigerian students with vetted companies for SIWES, IT and internship placements — developed by Ched Dev in collaboration with COCIS."
      )
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="pt-32 pb-16 text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              ChedLink · CCL · with COCIS
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-ink mb-6 leading-tight">
              A calmer path to your first opportunity.
            </h1>
            <p className="text-lg text-muted-foreground">
              ChedLink connects Nigerian students with vetted companies for SIWES, IT and
              internship placements — developed by Ched Dev in collaboration with COCIS.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 max-w-5xl">
            <Card className="p-8">
              <Target className="w-10 h-10 text-primary mb-4" />
              <h2 className="font-display text-2xl text-ink mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To bridge the gap between Nigerian students and industry by providing a
                platform that facilitates meaningful placement opportunities, fostering
                professional growth for the next generation of leaders.
              </p>
            </Card>

            <Card className="p-8">
              <Heart className="w-10 h-10 text-primary mb-4" />
              <h2 className="font-display text-2xl text-ink mb-3">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become Nigeria's most trusted student placement platform, where every
                student has access to quality internship and career opportunities aligned
                with their studies.
              </p>
            </Card>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="font-display text-3xl text-ink text-center mb-12">Our Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => (
                <Card key={v.title} className="p-6">
                  <v.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-display text-lg text-ink mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="p-10 md:p-14 text-center max-w-3xl mx-auto">
              <h2 className="font-display text-3xl text-ink mb-4">Join us</h2>
              <p className="text-muted-foreground mb-8">
                Whether you're a student looking for opportunities or a company seeking
                interns, we're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <Link to="/register">Create student account</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/contact">Partner with us</Link>
                </Button>
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
