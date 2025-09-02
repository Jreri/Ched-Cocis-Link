import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, Building, Users, Filter } from "lucide-react";

const BrowseByLocation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState(null);

  const nigerianStates = [
    {
      name: "Lagos",
      companies: 156,
      positions: 423,
      description: "Commercial hub with tech, finance, and creative industries",
      popularSectors: ["Technology", "Finance", "Marketing", "Media"],
      lgas: [
        { name: "Lagos Island", companies: 45, positions: 120 },
        { name: "Ikeja", companies: 38, positions: 95 },
        { name: "Victoria Island", companies: 42, positions: 110 },
        { name: "Lekki", companies: 31, positions: 98 }
      ]
    },
    {
      name: "Abuja",
      companies: 89,
      positions: 245,
      description: "Federal capital with government and corporate offices",
      popularSectors: ["Government", "Banking", "Telecommunications", "Oil & Gas"],
      lgas: [
        { name: "Garki", companies: 28, positions: 75 },
        { name: "Wuse", companies: 25, positions: 68 },
        { name: "Maitama", companies: 22, positions: 55 },
        { name: "Asokoro", companies: 14, positions: 47 }
      ]
    },
    {
      name: "Port Harcourt",
      companies: 67,
      positions: 178,
      description: "Oil and gas capital with engineering opportunities",
      popularSectors: ["Oil & Gas", "Engineering", "Maritime", "Construction"],
      lgas: [
        { name: "Port Harcourt City", companies: 35, positions: 95 },
        { name: "Obio-Akpor", companies: 32, positions: 83 }
      ]
    },
    {
      name: "Kano",
      companies: 54,
      positions: 142,
      description: "Northern commercial center with manufacturing focus",
      popularSectors: ["Manufacturing", "Agriculture", "Textiles", "Trading"],
      lgas: [
        { name: "Kano Municipal", companies: 28, positions: 78 },
        { name: "Fagge", companies: 15, positions: 35 },
        { name: "Dala", companies: 11, positions: 29 }
      ]
    },
    {
      name: "Ibadan",
      companies: 43,
      positions: 115,
      description: "Academic and agricultural hub with research opportunities",
      popularSectors: ["Education", "Agriculture", "Research", "Healthcare"],
      lgas: [
        { name: "Ibadan North", companies: 18, positions: 48 },
        { name: "Ibadan South-West", companies: 14, positions: 35 },
        { name: "Ibadan North-East", companies: 11, positions: 32 }
      ]
    },
    {
      name: "Enugu",
      companies: 38,
      positions: 95,
      description: "Eastern commercial hub with coal mining heritage",
      popularSectors: ["Mining", "Commerce", "Education", "Healthcare"],
      lgas: [
        { name: "Enugu East", companies: 20, positions: 52 },
        { name: "Enugu North", companies: 18, positions: 43 }
      ]
    }
  ];

  const filteredStates = nigerianStates.filter(state =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StateCard = ({ state }) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setSelectedState(state)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {state.name}
          </span>
          <Badge variant="secondary">{state.companies} companies</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">
          {state.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            <span>{state.companies} Companies</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{state.positions} Positions</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2">Popular Sectors:</h4>
          <div className="flex flex-wrap gap-1">
            {state.popularSectors.slice(0, 3).map((sector, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {sector}
              </Badge>
            ))}
            {state.popularSectors.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{state.popularSectors.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const LGACard = ({ lga }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">{lga.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {lga.companies} companies
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{lga.positions} positions</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Browse by Location
            </h1>
            <p className="text-muted-foreground">
              Explore placement opportunities across Nigeria by state and local government area
            </p>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by state name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* States List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  States ({filteredStates.length})
                </h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {filteredStates.map((state, index) => (
                  <StateCard key={index} state={state} />
                ))}
              </div>
              
              {filteredStates.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No states found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* State Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedState ? (
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {selectedState.name} State
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-muted-foreground text-sm mb-4">
                        {selectedState.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {selectedState.companies}
                          </div>
                          <div className="text-xs text-muted-foreground">Companies</div>
                        </div>
                        <div className="text-center p-3 bg-secondary/5 rounded-lg">
                          <div className="text-2xl font-bold text-secondary">
                            {selectedState.positions}
                          </div>
                          <div className="text-xs text-muted-foreground">Positions</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Popular Sectors</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedState.popularSectors.map((sector, index) => (
                          <Badge key={index} variant="outline">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3">
                        Local Government Areas
                      </h4>
                      <div className="space-y-3">
                        {selectedState.lgas.map((lga, index) => (
                          <LGACard key={index} lga={lga} />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full">
                        Browse {selectedState.name} Opportunities
                      </Button>
                      <Button variant="outline" className="w-full">
                        Set Location Alert
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="sticky top-4">
                  <CardContent className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Select a State
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Click on any state to view detailed information about available opportunities
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">36</div>
                <div className="text-sm text-muted-foreground">States Covered</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">774</div>
                <div className="text-sm text-muted-foreground">LGAs Available</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {nigerianStates.reduce((sum, state) => sum + state.companies, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Companies</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {nigerianStates.reduce((sum, state) => sum + state.positions, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Open Positions</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrowseByLocation;