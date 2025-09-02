import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, Building, MapPin, Calendar, GraduationCap } from "lucide-react";

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "Adaora Okafor",
      avatar: "AO",
      course: "Computer Science",
      university: "University of Lagos",
      company: "TechCorp Nigeria",
      position: "Software Development Intern",
      duration: "6 months",
      location: "Lagos",
      rating: 5,
      story: "My placement at TechCorp was transformative. I worked on real-world projects using React and Node.js, and my mentor guided me through complex challenges. The experience not only enhanced my technical skills but also taught me professional communication and teamwork. I'm now confident about my career path in software development.",
      highlights: [
        "Built 3 full-stack applications",
        "Mentored by senior developers",
        "Received job offer after completion",
        "Improved coding skills by 300%"
      ],
      outcome: "Received full-time job offer and currently working as Junior Developer",
      advice: "Don't be afraid to ask questions and take on challenging projects. The learning curve is steep but incredibly rewarding.",
      placementYear: "2023"
    },
    {
      id: 2,
      name: "Ibrahim Musa",
      avatar: "IM",
      course: "Mechanical Engineering",
      university: "Ahmadu Bello University",
      company: "Manufacturing Giants Ltd",
      position: "Production Engineering Intern",
      duration: "12 months",
      location: "Kaduna",
      rating: 5,
      story: "The placement gave me hands-on experience with industrial machinery and production processes. I learned lean manufacturing principles, quality control systems, and project management. The practical knowledge I gained complemented my theoretical studies perfectly.",
      highlights: [
        "Led a process improvement project",
        "Reduced production waste by 15%",
        "Certified in Lean Six Sigma Yellow Belt",
        "Presented to senior management"
      ],
      outcome: "Promoted to Assistant Production Engineer",
      advice: "Focus on understanding the business side of engineering. Technical skills are important, but knowing how they impact the bottom line is crucial.",
      placementYear: "2023"
    },
    {
      id: 3,
      name: "Chioma Eze",
      avatar: "CE",
      course: "Business Administration",
      university: "Covenant University",
      company: "Nigeria Banking Corp",
      position: "Business Development Intern",
      duration: "8 months",
      location: "Abuja",
      rating: 4,
      story: "Working in the banking sector opened my eyes to financial services and customer relationship management. I participated in client meetings, market research, and product development discussions. The exposure to different departments gave me a holistic view of business operations.",
      highlights: [
        "Assisted in acquiring 50+ new clients",
        "Developed market research presentation",
        "Cross-trained in 4 different departments",
        "Received Excellence Award"
      ],
      outcome: "Offered permanent role in Business Development team",
      advice: "Network with everyone - from fellow interns to senior executives. The relationships you build during your placement are invaluable.",
      placementYear: "2023"
    },
    {
      id: 4,
      name: "Funmi Adebayo",
      avatar: "FA",
      course: "Mass Communication",
      university: "University of Ibadan",
      company: "Creative Media Hub",
      position: "Digital Marketing Intern",
      duration: "6 months",
      location: "Lagos",
      rating: 5,
      story: "This placement transformed my understanding of digital marketing. I worked on social media campaigns, content creation, and analytics. The creative environment encouraged innovation, and I launched a successful campaign that increased client engagement by 40%.",
      highlights: [
        "Managed social media for 10+ clients",
        "Created viral content with 100K+ views",
        "Increased client engagement by 40%",
        "Learned advanced analytics tools"
      ],
      outcome: "Started freelance digital marketing business",
      advice: "Be creative and don't be afraid to propose new ideas. Companies value fresh perspectives from students.",
      placementYear: "2022"
    },
    {
      id: 5,
      name: "Emeka Okonkwo",
      avatar: "EO",
      course: "Electrical Engineering",
      university: "University of Nigeria, Nsukka",
      company: "Power Solutions Ltd",
      position: "Electrical Design Intern",
      duration: "10 months",
      location: "Enugu",
      rating: 4,
      story: "I worked on electrical system designs for commercial buildings and renewable energy projects. The placement exposed me to industry-standard software like AutoCAD and ETAP. I also participated in site visits and learned about project implementation challenges.",
      highlights: [
        "Designed electrical systems for 5 projects",
        "Mastered AutoCAD and ETAP software",
        "Participated in solar installation project",
        "Obtained COREN registration"
      ],
      outcome: "Continuing with company part-time while completing final year",
      advice: "Take advantage of training opportunities and certifications offered during your placement. They add value to your CV.",
      placementYear: "2023"
    },
    {
      id: 6,
      name: "Aisha Yakubu",
      avatar: "AY",
      course: "Accounting",
      university: "Bayero University Kano",
      company: "Audit Excellence Partners",
      position: "Audit Intern",
      duration: "9 months",
      location: "Kano",
      rating: 5,
      story: "My placement in audit gave me exposure to various industries and business models. I learned financial analysis, risk assessment, and regulatory compliance. The experience prepared me well for professional accounting examinations.",
      highlights: [
        "Audited 20+ companies across different sectors",
        "Prepared detailed financial reports",
        "Learned advanced Excel and audit software",
        "Passed ICAN intermediate exams"
      ],
      outcome: "Received scholarship for ICAN professional level and job guarantee",
      advice: "Pay attention to detail and ask lots of questions. Audit work requires precision and continuous learning.",
      placementYear: "2022"
    }
  ];

  const StoryCard = ({ story }) => (
    <Card className="mb-8 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  {story.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">{story.name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    <span>{story.course} - {story.university}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>{story.position} at {story.company}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{story.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{story.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary">{story.placementYear}</Badge>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < story.rating 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="mb-6">
            <Quote className="h-6 w-6 text-muted-foreground mb-2" />
            <p className="text-muted-foreground italic text-lg leading-relaxed">
              "{story.story}"
            </p>
          </div>

          {/* Highlights */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Key Achievements</h4>
              <ul className="space-y-2">
                {story.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Current Outcome</h4>
              <p className="text-sm text-muted-foreground mb-4">{story.outcome}</p>
              
              <h4 className="font-semibold text-foreground mb-2">Advice to Students</h4>
              <p className="text-sm text-muted-foreground italic">"{story.advice}"</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const stats = [
    { label: "Success Rate", value: "94%", description: "Students who completed placements successfully" },
    { label: "Job Offers", value: "78%", description: "Students who received job offers after placement" },
    { label: "Skill Improvement", value: "95%", description: "Students reported significant skill development" },
    { label: "Career Clarity", value: "89%", description: "Students gained clearer career direction" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Success Stories
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Read inspiring stories from students who transformed their careers through quality placement experiences
            </p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter/Sort Options */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="outline" size="sm">All Stories</Button>
            <Button variant="ghost" size="sm">Technology</Button>
            <Button variant="ghost" size="sm">Engineering</Button>
            <Button variant="ghost" size="sm">Business</Button>
            <Button variant="ghost" size="sm">Finance</Button>
            <Button variant="ghost" size="sm">Marketing</Button>
          </div>

          {/* Success Stories */}
          <div className="space-y-8">
            {stories.map(story => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {/* Call to Action */}
          <Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="text-center p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Write Your Success Story?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of Nigerian students who have launched successful careers through quality placement opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Find Your Dream Placement
                </Button>
                <Button variant="outline" size="lg">
                  Share Your Story
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuccessStories;