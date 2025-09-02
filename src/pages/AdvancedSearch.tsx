import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, MapPin, Building, Users, Clock, BookOpen } from "lucide-react";

const AdvancedSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    department: [],
    companySize: [],
    placementType: [],
    duration: [3, 12]
  });
  const [savedSearches, setSavedSearches] = useState([
    "Engineering positions in Lagos",
    "IT internships 6 months",
    "Business positions remote"
  ]);

  const locations = [
    "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Enugu", 
    "Kaduna", "Jos", "Calabar", "Warri", "Remote"
  ];

  const departments = [
    "Engineering", "Information Technology", "Business Administration",
    "Accounting & Finance", "Marketing", "Human Resources", "Operations",
    "Research & Development", "Quality Assurance", "Customer Service"
  ];

  const companySizes = [
    "Startup (1-50 employees)", "Small (51-200 employees)", 
    "Medium (201-1000 employees)", "Large (1000+ employees)"
  ];

  const placementTypes = [
    "Full-time Internship", "Part-time Internship", "Project-based",
    "Remote", "Hybrid", "On-site"
  ];

  const handleFilterToggle = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      location: [],
      department: [],
      companySize: [],
      placementType: [],
      duration: [3, 12]
    });
  };

  const getActiveFiltersCount = () => {
    return selectedFilters.location.length + 
           selectedFilters.department.length + 
           selectedFilters.companySize.length + 
           selectedFilters.placementType.length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Advanced Search & Filters
            </h1>
            <p className="text-muted-foreground">
              Find the perfect placement opportunity with our advanced search tools
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                    </span>
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="secondary">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </CardTitle>
                  {getActiveFiltersCount() > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="text-destructive hover:text-destructive"
                    >
                      Clear All
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Location Filter */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4" />
                      Location
                    </Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {locations.map(location => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox
                            id={`location-${location}`}
                            checked={selectedFilters.location.includes(location)}
                            onCheckedChange={() => handleFilterToggle('location', location)}
                          />
                          <Label 
                            htmlFor={`location-${location}`}
                            className="text-sm cursor-pointer"
                          >
                            {location}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Department Filter */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <BookOpen className="h-4 w-4" />
                      Department
                    </Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {departments.map(dept => (
                        <div key={dept} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dept-${dept}`}
                            checked={selectedFilters.department.includes(dept)}
                            onCheckedChange={() => handleFilterToggle('department', dept)}
                          />
                          <Label 
                            htmlFor={`dept-${dept}`}
                            className="text-sm cursor-pointer"
                          >
                            {dept}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Company Size Filter */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <Building className="h-4 w-4" />
                      Company Size
                    </Label>
                    <div className="space-y-2">
                      {companySizes.map(size => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={`size-${size}`}
                            checked={selectedFilters.companySize.includes(size)}
                            onCheckedChange={() => handleFilterToggle('companySize', size)}
                          />
                          <Label 
                            htmlFor={`size-${size}`}
                            className="text-sm cursor-pointer"
                          >
                            {size}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Placement Type Filter */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4" />
                      Placement Type
                    </Label>
                    <div className="space-y-2">
                      {placementTypes.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={selectedFilters.placementType.includes(type)}
                            onCheckedChange={() => handleFilterToggle('placementType', type)}
                          />
                          <Label 
                            htmlFor={`type-${type}`}
                            className="text-sm cursor-pointer"
                          >
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4" />
                      Duration (months)
                    </Label>
                    <div className="space-y-4">
                      <Slider
                        value={selectedFilters.duration}
                        onValueChange={(value) => setSelectedFilters(prev => ({
                          ...prev,
                          duration: value
                        }))}
                        max={24}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{selectedFilters.duration[0]} months</span>
                        <span>{selectedFilters.duration[1]} months</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search companies, positions, skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Filters */}
              {getActiveFiltersCount() > 0 && (
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
                      {selectedFilters.location.map(location => (
                        <Badge key={location} variant="secondary" className="gap-1">
                          {location}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleFilterToggle('location', location)}
                          />
                        </Badge>
                      ))}
                      {selectedFilters.department.map(dept => (
                        <Badge key={dept} variant="secondary" className="gap-1">
                          {dept}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleFilterToggle('department', dept)}
                          />
                        </Badge>
                      ))}
                      {selectedFilters.companySize.map(size => (
                        <Badge key={size} variant="secondary" className="gap-1">
                          {size}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleFilterToggle('companySize', size)}
                          />
                        </Badge>
                      ))}
                      {selectedFilters.placementType.map(type => (
                        <Badge key={type} variant="secondary" className="gap-1">
                          {type}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleFilterToggle('placementType', type)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Saved Searches */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Saved Searches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {savedSearches.map((search, index) => (
                      <Button key={index} variant="outline" size="sm">
                        {search}
                      </Button>
                    ))}
                    <Button variant="ghost" size="sm" className="text-primary">
                      + Save Current Search
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Search Results */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Search Results</CardTitle>
                    <Select defaultValue="relevance">
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="company">Company Name</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Use the search bar and filters to find placement opportunities</p>
                    <p className="text-sm mt-2">Results will appear here based on your search criteria</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdvancedSearch;