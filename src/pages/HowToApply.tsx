import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, UserPlus, Search, FileText, Send, Bell, ThumbsUp } from "lucide-react";

const HowToApply = () => {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: "Create Your Account",
      description: "Sign up with your email and complete your student profile with accurate information.",
      details: [
        "Provide your full name, email, and phone number",
        "Select your institution and course of study",
        "Choose your current academic level",
        "Set your location preferences"
      ],
      tip: "Use your institutional email for faster verification"
    },
    {
      number: 2,
      icon: FileText,
      title: "Build Your Profile",
      description: "Upload your documents and create a compelling profile that showcases your skills.",
      details: [
        "Upload your current CV/Resume",
        "Add your academic transcripts",
        "Upload a professional passport photograph",
        "Write a brief bio highlighting your interests",
        "Add your skills and certifications"
      ],
      tip: "Keep your CV updated and tailored to your field of study"
    },
    {
      number: 3,
      icon: Search,
      title: "Browse Opportunities",
      description: "Explore available placement positions that match your interests and qualifications.",
      details: [
        "Use filters to find relevant positions",
        "Search by location, company, or department",
        "Read company profiles and requirements carefully",
        "Save interesting positions for later",
        "Compare different opportunities"
      ],
      tip: "Apply to 3-5 positions to increase your chances of success"
    },
    {
      number: 4,
      icon: Send,
      title: "Submit Applications",
      description: "Apply to positions that interest you with all required documents.",
      details: [
        "Review application requirements carefully",
        "Attach your placement letter from your institution",
        "Write a personalized cover letter for each application",
        "Double-check all information before submitting",
        "Submit your application before the deadline"
      ],
      tip: "Customize your application for each company to show genuine interest"
    },
    {
      number: 5,
      icon: Bell,
      title: "Track Your Applications",
      description: "Monitor your application status and respond to company communications promptly.",
      details: [
        "Check your dashboard regularly for updates",
        "Respond to interview invitations quickly",
        "Prepare for interviews and assessments",
        "Follow up professionally if needed",
        "Keep your availability updated"
      ],
      tip: "Set up email notifications to stay informed about application updates"
    },
    {
      number: 6,
      icon: ThumbsUp,
      title: "Accept Your Placement",
      description: "Once accepted, complete the onboarding process and prepare for your placement.",
      details: [
        "Review and accept the placement offer",
        "Complete any required documentation",
        "Confirm your start date and reporting details",
        "Prepare for orientation and training",
        "Maintain professionalism throughout"
      ],
      tip: "Read your placement agreement carefully before accepting"
    }
  ];

  const tips = [
    "Start your search early - popular positions fill up quickly",
    "Keep your profile complete and up-to-date",
    "Apply to multiple positions but tailor each application",
    "Be professional in all communications",
    "Prepare for interviews and assessments in advance",
    "Follow up on applications appropriately",
    "Be flexible with location and timing when possible"
  ];

  const requirements = [
    "Valid student ID from a recognized institution",
    "Placement letter from your institution",
    "Updated CV/Resume",
    "Academic transcripts",
    "Passport photographs",
    "Valid means of identification"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              How to Apply for Student Placements
            </h1>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              Follow this step-by-step guide to successfully apply for student placement opportunities through StudentPlace Nigeria
            </p>
            <Button size="lg" className="mr-4">
              Get Started Now
            </Button>
            <Button variant="outline" size="lg">
              Watch Tutorial Video
            </Button>
          </div>

          {/* Requirements Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Before You Start: Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{requirement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Guide */}
          <div className="space-y-8 mb-12">
            <h2 className="text-3xl font-bold text-center text-foreground">Step-by-Step Application Process</h2>
            
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid lg:grid-cols-3 gap-0">
                      {/* Step Header */}
                      <div className="bg-primary/5 p-6 flex items-center gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                          {step.number}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-1">{step.title}</h3>
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      
                      {/* Step Content */}
                      <div className="lg:col-span-2 p-6">
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">What to do:</h4>
                            <ul className="space-y-1">
                              {step.details.map((detail, detailIndex) => (
                                <li key={detailIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Pro Tip:</h4>
                            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                              <p className="text-sm text-blue-700 dark:text-blue-300">{step.tip}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Success Tips */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Success Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-1">
                        {index + 1}
                      </Badge>
                      <p className="text-muted-foreground text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account Now
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Available Positions
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Download CV Template
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Get Application Tips
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="text-center p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Start Your Placement Journey?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of Nigerian students who have successfully secured placement opportunities through our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Create Your Account
                </Button>
                <Button variant="outline" size="lg">
                  Need Help? Contact Support
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

export default HowToApply;