import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Building, 
  Clock, 
  FileText,
  Bell,
  Star,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Eye
} from "lucide-react"

interface Application {
  id: string
  companyName: string
  position: string
  appliedDate: string
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected'
  location: string
}

interface SavedCompany {
  id: string
  name: string
  industry: string
  location: string
  openPositions: number
  saved_date: string
}

const mockApplications: Application[] = [
  {
    id: "1",
    companyName: "Dangote Group",
    position: "Industrial Training - Engineering",
    appliedDate: "2024-01-15",
    status: "interview",
    location: "Lagos"
  },
  {
    id: "2", 
    companyName: "Guaranty Trust Bank",
    position: "SIWES Program - IT",
    appliedDate: "2024-01-10",
    status: "reviewing",
    location: "Lagos"
  },
  {
    id: "3",
    companyName: "Andela Nigeria",
    position: "Software Development Internship",
    appliedDate: "2024-01-05",
    status: "pending",
    location: "Lagos"
  }
]

const mockSavedCompanies: SavedCompany[] = [
  {
    id: "4",
    name: "Flour Mills of Nigeria",
    industry: "Food & Beverages", 
    location: "Lagos",
    openPositions: 8,
    saved_date: "2024-01-12"
  },
  {
    id: "5",
    name: "Zenith Bank",
    industry: "Financial Services",
    location: "Lagos", 
    openPositions: 18,
    saved_date: "2024-01-08"
  }
]

const Dashboard = () => {
  const [profileCompletion, setProfileCompletion] = useState(75)
  const [notifications] = useState(3)

  useEffect(() => {
    document.title = "Dashboard - StudentPlace Nigeria | Manage Applications"
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Manage your student placement applications, track application status, and discover new opportunities on your StudentPlace dashboard.')
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-success text-success-foreground'
      case 'interview': return 'bg-accent text-accent-foreground'
      case 'reviewing': return 'bg-secondary text-secondary-foreground'
      case 'rejected': return 'bg-destructive text-destructive-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return CheckCircle
      case 'interview': return Calendar
      case 'reviewing': return Clock
      case 'rejected': return AlertCircle
      default: return Clock
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h1>
            <p className="text-muted-foreground">Manage your applications and discover new opportunities</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {notifications > 0 && (
                <Badge variant="destructive" className="text-xs">{notifications}</Badge>
              )}
            </div>
            <Link to="/search">
              <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
                <Plus className="w-4 h-4 mr-2" />
                Find Placements
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Applications</p>
                <p className="text-2xl font-bold text-foreground">{mockApplications.length}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Saved Companies</p>
                <p className="text-2xl font-bold text-foreground">{mockSavedCompanies.length}</p>
              </div>
              <Star className="w-8 h-8 text-accent" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Interview Scheduled</p>
                <p className="text-2xl font-bold text-foreground">1</p>
              </div>
              <Calendar className="w-8 h-8 text-secondary" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Profile Completion</p>
                <p className="text-2xl font-bold text-foreground">{profileCompletion}%</p>
              </div>
              <User className="w-8 h-8 text-success" />
            </div>
            <Progress value={profileCompletion} className="mt-2" />
          </Card>
        </div>

        {/* Profile Completion Alert */}
        {profileCompletion < 100 && (
          <Card className="p-4 mb-8 border-accent">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-accent mr-3" />
                <div>
                  <p className="font-medium text-foreground">Complete your profile</p>
                  <p className="text-muted-foreground text-sm">A complete profile increases your chances of getting selected</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Complete Profile
              </Button>
            </div>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="saved">Saved Companies</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">My Applications</h2>
              <Link to="/search">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  New Application
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {mockApplications.map((application) => {
                const StatusIcon = getStatusIcon(application.status)
                return (
                  <Card key={application.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Building className="w-5 h-5 text-muted-foreground" />
                          <h3 className="text-lg font-semibold text-foreground">{application.companyName}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">{application.position}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {application.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(application.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {mockApplications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-4">Start applying to companies to see your applications here</p>
                <Link to="/search">
                  <Button>Find Companies</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Saved Companies</h2>
              <Link to="/search">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Companies
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockSavedCompanies.map((company) => (
                <Card key={company.id} className="p-6 hover-lift">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{company.name}</h3>
                        <Badge variant="secondary">{company.industry}</Badge>
                      </div>
                      <Star className="w-6 h-6 text-accent fill-current" />
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {company.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {company.openPositions} open positions
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex gap-2">
                      <Link to={`/company/${company.id}`} className="flex-1">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover">
                          View Company
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {mockSavedCompanies.length === 0 && (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No saved companies</h3>
                <p className="text-muted-foreground mb-4">Save companies you're interested in to view them here</p>
                <Link to="/search">
                  <Button>Browse Companies</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Profile Information</h2>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">John Adebayo Ogundimu</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">john.ogundimu@example.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">+234-806-000-0000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">Lagos, Nigeria</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Academic Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">University</p>
                    <p className="font-medium text-foreground">University of Lagos</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Course of Study</p>
                    <p className="font-medium text-foreground">Computer Science</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Level</p>
                    <p className="font-medium text-foreground">300 Level</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CGPA</p>
                    <p className="font-medium text-foreground">4.2/5.0</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">CV/Resume</p>
                      <p className="text-sm text-muted-foreground">john_resume.pdf</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Student ID</p>
                      <p className="text-sm text-muted-foreground">Not uploaded</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
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

export default Dashboard