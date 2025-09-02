import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, Clock, AlertCircle, FileText, Calendar, 
  MessageSquare, Phone, Mail, Eye, Download 
} from "lucide-react";

const ApplicationStatus = () => {
  const [applications] = useState([
    {
      id: 1,
      company: "TechCorp Nigeria",
      position: "Software Development Intern",
      appliedDate: "2024-01-15",
      status: "in-review",
      progress: 60,
      nextStep: "Technical Interview",
      nextStepDate: "2024-02-01",
      interviewer: "John Smith",
      interviewerRole: "Senior Developer",
      documents: ["CV", "Cover Letter", "Transcripts"],
      timeline: [
        { step: "Application Submitted", date: "2024-01-15", status: "completed" },
        { step: "Application Reviewed", date: "2024-01-18", status: "completed" },
        { step: "Initial Screening", date: "2024-01-22", status: "completed" },
        { step: "Technical Interview", date: "2024-02-01", status: "upcoming" },
        { step: "Final Interview", date: "", status: "pending" },
        { step: "Decision", date: "", status: "pending" }
      ]
    },
    {
      id: 2,
      company: "Nigeria Banking Corp",
      position: "Finance Intern",
      appliedDate: "2024-01-10",
      status: "accepted",
      progress: 100,
      startDate: "2024-03-01",
      stipend: "₦45,000/month",
      documents: ["CV", "Cover Letter", "Transcripts", "Placement Letter"],
      timeline: [
        { step: "Application Submitted", date: "2024-01-10", status: "completed" },
        { step: "Application Reviewed", date: "2024-01-12", status: "completed" },
        { step: "Phone Interview", date: "2024-01-20", status: "completed" },
        { step: "Assessment Test", date: "2024-01-25", status: "completed" },
        { step: "Final Interview", date: "2024-01-28", status: "completed" },
        { step: "Offer Extended", date: "2024-01-30", status: "completed" }
      ]
    },
    {
      id: 3,
      company: "StartupHub Africa",
      position: "Marketing Intern",
      appliedDate: "2024-01-20",
      status: "rejected",
      progress: 40,
      rejectionReason: "Position filled with another candidate",
      feedback: "Strong application, encourage to apply for future openings",
      documents: ["CV", "Cover Letter", "Portfolio"],
      timeline: [
        { step: "Application Submitted", date: "2024-01-20", status: "completed" },
        { step: "Application Reviewed", date: "2024-01-25", status: "completed" },
        { step: "Initial Screening", date: "2024-01-28", status: "rejected" }
      ]
    }
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "in-review":
        return <Badge variant="default">In Review</Badge>;
      case "interview":
        return <Badge variant="default">Interview Scheduled</Badge>;
      case "accepted":
        return <Badge className="bg-green-500 hover:bg-green-600">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "upcoming":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const ApplicationCard = ({ application }) => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{application.company}</CardTitle>
            <p className="text-muted-foreground">{application.position}</p>
            <p className="text-sm text-muted-foreground">Applied: {new Date(application.appliedDate).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            {getStatusBadge(application.status)}
            <div className="mt-2">
              <Progress value={application.progress} className="w-32" />
              <p className="text-xs text-muted-foreground mt-1">{application.progress}% Complete</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {application.status === "in-review" && (
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Next Step</h4>
                <p className="text-blue-800 dark:text-blue-200 mb-2">{application.nextStep}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Scheduled for: {new Date(application.nextStepDate).toLocaleDateString()}
                </p>
                {application.interviewer && (
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Interviewer: {application.interviewer} ({application.interviewerRole})
                  </p>
                )}
              </div>
            )}
            
            {application.status === "accepted" && (
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Congratulations! 🎉</h4>
                <p className="text-green-800 dark:text-green-200 mb-2">Your application has been accepted</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Start Date: {new Date(application.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Stipend: {application.stipend}
                </p>
              </div>
            )}
            
            {application.status === "rejected" && (
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Application Update</h4>
                <p className="text-red-800 dark:text-red-200 mb-2">{application.rejectionReason}</p>
                {application.feedback && (
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Feedback: {application.feedback}
                  </p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            <div className="space-y-4">
              {application.timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  {getStatusIcon(item.status)}
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.step}</h4>
                    {item.date && (
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {application.documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border border-border rounded">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{doc}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {application.status === "in-review" && (
                <>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Company
                  </Button>
                </>
              )}
              
              {application.status === "accepted" && (
                <>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    View Offer Letter
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Contract
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact HR
                  </Button>
                </>
              )}
              
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Company Profile
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  const activeApplications = applications.filter(app => 
    app.status === "pending" || app.status === "in-review" || app.status === "interview"
  );
  
  const completedApplications = applications.filter(app => 
    app.status === "accepted" || app.status === "rejected"
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Application Status Tracker
            </h1>
            <p className="text-muted-foreground">
              Track the progress of your placement applications and stay updated on next steps
            </p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-foreground mb-2">{applications.length}</div>
                <div className="text-sm text-muted-foreground">Total Applications</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">{activeApplications.length}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {applications.filter(app => app.status === "accepted").length}
                </div>
                <div className="text-sm text-muted-foreground">Accepted</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">
                  {applications.filter(app => app.status === "rejected").length}
                </div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Applications ({activeApplications.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedApplications.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-6">
              {activeApplications.length > 0 ? (
                activeApplications.map(app => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Active Applications
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any applications in progress
                    </p>
                    <Button>
                      Browse New Opportunities
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-6">
              {completedApplications.length > 0 ? (
                completedApplications.map(app => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Completed Applications
                    </h3>
                    <p className="text-muted-foreground">
                      Completed applications will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplicationStatus;