import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building, MapPin, Users, Star, Clock, DollarSign, 
  Award, Wifi, Car, Coffee, Heart, X, Plus 
} from "lucide-react";

const CompanyComparison = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([
    {
      id: 1,
      name: "TechCorp Nigeria",
      logo: "TC",
      rating: 4.5,
      location: "Lagos",
      size: "Large (1000+ employees)",
      industry: "Technology",
      benefits: ["Health Insurance", "Remote Work", "Learning Budget", "Free Meals"],
      duration: "6 months",
      stipend: "₦50,000/month",
      requirements: ["3.0 GPA", "Computer Science", "Programming Skills"],
      description: "Leading technology company focused on digital transformation and innovation.",
      highlights: [
        "Work on cutting-edge projects",
        "Mentorship from senior engineers",
        "Opportunity for full-time conversion",
        "Access to latest technologies"
      ]
    },
    {
      id: 2,
      name: "Nigeria Banking Corp",
      logo: "NBC",
      rating: 4.2,
      location: "Abuja",
      size: "Large (1000+ employees)",
      industry: "Financial Services",
      benefits: ["Health Insurance", "Transportation", "Career Development", "Networking"],
      duration: "12 months",
      stipend: "₦45,000/month",
      requirements: ["3.2 GPA", "Finance/Economics", "Analytical Skills"],
      description: "Premier financial institution offering comprehensive banking solutions across Nigeria.",
      highlights: [
        "Exposure to financial markets",
        "Professional certifications",
        "Leadership development program",
        "Cross-departmental rotations"
      ]
    }
  ]);

  const availableCompanies = [
    {
      id: 3,
      name: "Manufacturing Giants Ltd",
      logo: "MG",
      rating: 4.0,
      location: "Port Harcourt",
      size: "Large (1000+ employees)",
      industry: "Manufacturing"
    },
    {
      id: 4,
      name: "StartupHub Africa",
      logo: "SA",
      rating: 4.3,
      location: "Lagos",
      size: "Medium (201-1000 employees)",
      industry: "Technology"
    },
    {
      id: 5,
      name: "Energy Solutions Nigeria",
      logo: "ESN",
      rating: 3.9,
      location: "Warri",
      size: "Large (1000+ employees)",
      industry: "Oil & Gas"
    }
  ];

  const removeCompany = (companyId) => {
    setSelectedCompanies(prev => prev.filter(company => company.id !== companyId));
  };

  const addCompany = (company) => {
    if (selectedCompanies.length < 3) {
      setSelectedCompanies(prev => [...prev, company]);
    }
  };

  const ComparisonRow = ({ label, values, type = "text" }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b border-border">
      <div className="font-medium text-foreground md:border-r md:border-border md:pr-4">
        {label}
      </div>
      {values.map((value, index) => (
        <div key={index} className="text-muted-foreground">
          {type === "rating" ? (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{value}</span>
            </div>
          ) : type === "badges" ? (
            <div className="flex flex-wrap gap-1">
              {value.map((item, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          ) : type === "highlights" ? (
            <ul className="text-sm space-y-1">
              {value.map((item, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span>{value}</span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Company Comparison
            </h1>
            <p className="text-muted-foreground">
              Compare placement opportunities side by side to make informed decisions
            </p>
          </div>

          {/* Add Company Section */}
          {selectedCompanies.length < 3 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Company to Compare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {availableCompanies.map(company => (
                    <div 
                      key={company.id}
                      className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => addCompany(company)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                          {company.logo}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{company.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{company.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin className="h-3 w-3" />
                          {company.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {company.industry}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Table */}
          {selectedCompanies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Company Comparison Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Company Headers */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 border-b border-border">
                  <div className="md:border-r md:border-border md:pr-4">
                    <span className="font-medium">Companies</span>
                  </div>
                  {selectedCompanies.map(company => (
                    <div key={company.id} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                            {company.logo}
                          </div>
                          <span className="font-semibold text-foreground">{company.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCompany(company.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{company.rating} rating</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comparison Rows */}
                <ComparisonRow 
                  label="Overall Rating" 
                  values={selectedCompanies.map(c => c.rating)}
                  type="rating"
                />
                
                <ComparisonRow 
                  label="Location" 
                  values={selectedCompanies.map(c => c.location)}
                />
                
                <ComparisonRow 
                  label="Company Size" 
                  values={selectedCompanies.map(c => c.size)}
                />
                
                <ComparisonRow 
                  label="Industry" 
                  values={selectedCompanies.map(c => c.industry)}
                />
                
                <ComparisonRow 
                  label="Placement Duration" 
                  values={selectedCompanies.map(c => c.duration)}
                />
                
                <ComparisonRow 
                  label="Monthly Stipend" 
                  values={selectedCompanies.map(c => c.stipend)}
                />
                
                <ComparisonRow 
                  label="Benefits" 
                  values={selectedCompanies.map(c => c.benefits)}
                  type="badges"
                />
                
                <ComparisonRow 
                  label="Requirements" 
                  values={selectedCompanies.map(c => c.requirements)}
                  type="badges"
                />
                
                <ComparisonRow 
                  label="Key Highlights" 
                  values={selectedCompanies.map(c => c.highlights)}
                  type="highlights"
                />
                
                <ComparisonRow 
                  label="Description" 
                  values={selectedCompanies.map(c => c.description)}
                />
              </CardContent>
            </Card>
          )}

          {selectedCompanies.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Companies Selected
                </h3>
                <p className="text-muted-foreground mb-4">
                  Select companies from the list above to start comparing placement opportunities
                </p>
                <Button>
                  Browse All Companies
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {selectedCompanies.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Apply to Selected Companies
              </Button>
              <Button variant="outline" size="lg">
                Save Comparison
              </Button>
              <Button variant="outline" size="lg">
                Export as PDF
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyComparison;