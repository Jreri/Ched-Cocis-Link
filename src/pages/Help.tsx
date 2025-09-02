import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, Phone, Mail } from "lucide-react";

const Help = () => {
  const faqs = [
    {
      question: "How do I apply for a placement position?",
      answer: "To apply for a placement position, first create an account and complete your profile. Browse available companies, select positions that match your interests, and submit your application with required documents including CV and placement letter from your institution."
    },
    {
      question: "What documents do I need for placement applications?",
      answer: "You'll need: 1) Updated CV/Resume, 2) Placement letter from your institution, 3) Academic transcripts, 4) Valid means of identification, 5) Passport photographs. Some companies may require additional documents."
    },
    {
      question: "How long does the application process take?",
      answer: "The application review process typically takes 1-2 weeks. However, this varies by company and position. You'll receive updates on your application status through your dashboard and email notifications."
    },
    {
      question: "Can I apply to multiple companies at once?",
      answer: "Yes! You can apply to multiple companies simultaneously. We recommend applying to 3-5 positions to increase your chances of success. Each application is tracked separately in your dashboard."
    },
    {
      question: "What if I don't hear back from a company?",
      answer: "If you haven't heard back within 2 weeks, you can follow up through the platform. Some companies take longer to respond due to high application volumes. Continue applying to other positions while waiting."
    },
    {
      question: "Are there placement opportunities for all courses?",
      answer: "We work with companies across various industries to provide opportunities for students from all academic backgrounds. Popular fields include Engineering, Business, IT, Healthcare, and more."
    },
    {
      question: "Is there a fee to use StudentPlace Nigeria?",
      answer: "StudentPlace Nigeria is completely free for students. There are no hidden charges or fees. We're committed to helping Nigerian students access quality placement opportunities at no cost."
    },
    {
      question: "How do I update my profile information?",
      answer: "Log into your account and go to the Profile section in your dashboard. You can update personal information, academic details, upload new documents, and modify your preferences at any time."
    },
    {
      question: "What makes a strong placement application?",
      answer: "A strong application includes: 1) Complete and accurate profile, 2) Well-written CV highlighting relevant skills, 3) Clear placement objectives, 4) All required documents, 5) Tailored application for each position."
    },
    {
      question: "Can I get help with my CV and application?",
      answer: "Yes! Check our Resources section for CV templates, application tips, and interview preparation guides. We also have success stories from other students to inspire your applications."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Help & Support
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Get answers to common questions and find the help you need
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for help topics..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Quick Help Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Chat Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Get instant help from our support team
                </p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Send us your questions via email
                </p>
                <Button variant="outline" className="w-full">Send Email</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Phone Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Call us during business hours
                </p>
                <Button variant="outline" className="w-full">Call Now</Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <p className="text-muted-foreground mb-2">
                    Email: support@studentplacenigeria.com
                  </p>
                  <p className="text-muted-foreground mb-2">
                    Phone: +234 800 STUDENT
                  </p>
                  <p className="text-muted-foreground">
                    Hours: Monday - Friday, 8AM - 6PM WAT
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quick Links</h3>
                  <div className="space-y-2">
                    <Button variant="link" className="p-0 h-auto text-primary">
                      How to Apply Guide
                    </Button>
                    <br />
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Application Status Help
                    </Button>
                    <br />
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Profile Setup Guide
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;