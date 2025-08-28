import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, Building, Search, Filter } from "lucide-react"
import { Link } from "react-router-dom"

interface Company {
  id: string
  name: string
  industry: string
  location: string
  state: string
  size: string
  openPositions: number
  description: string
  logo?: string
  establishedYear: number
}

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Dangote Group",
    industry: "Manufacturing & Conglomerate",
    location: "Lagos",
    state: "Lagos",
    size: "Large (5000+ employees)",
    openPositions: 25,
    description: "Leading African conglomerate with interests in cement, sugar, flour, and more.",
    establishedYear: 1981
  },
  {
    id: "2", 
    name: "Guaranty Trust Bank",
    industry: "Financial Services",
    location: "Lagos",
    state: "Lagos",
    size: "Large (1000+ employees)",
    openPositions: 15,
    description: "One of Nigeria's leading commercial banks with a strong digital presence.",
    establishedYear: 1990
  },
  {
    id: "3",
    name: "Nigerian National Petroleum Corporation",
    industry: "Oil & Gas",
    location: "Abuja",
    state: "FCT",
    size: "Large (10000+ employees)", 
    openPositions: 40,
    description: "Nigeria's national oil company responsible for the exploration and production of petroleum.",
    establishedYear: 1977
  },
  {
    id: "4",
    name: "Andela Nigeria",
    industry: "Technology",
    location: "Lagos",
    state: "Lagos",
    size: "Medium (200-1000 employees)",
    openPositions: 12,
    description: "Global talent network that helps companies build remote engineering teams.",
    establishedYear: 2014
  },
  {
    id: "5",
    name: "Flour Mills of Nigeria",
    industry: "Food & Beverages",
    location: "Lagos",
    state: "Lagos", 
    size: "Large (2000+ employees)",
    openPositions: 8,
    description: "Leading food and agro-allied company in Nigeria with diverse product portfolio.",
    establishedYear: 1960
  },
  {
    id: "6",
    name: "Zenith Bank",
    industry: "Financial Services",
    location: "Lagos",
    state: "Lagos",
    size: "Large (5000+ employees)",
    openPositions: 18,
    description: "Leading Nigerian commercial bank with international presence across Africa and beyond.",
    establishedYear: 1990
  }
]

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(mockCompanies)

  const states = ['Lagos', 'Abuja', 'Kano', 'Rivers', 'Ogun', 'FCT']
  const industries = ['Technology', 'Financial Services', 'Oil & Gas', 'Manufacturing & Conglomerate', 'Food & Beverages']
  const companySizes = ['Small (1-50 employees)', 'Medium (51-200 employees)', 'Large (200+ employees)']

  const handleSearch = () => {
    let filtered = mockCompanies

    if (searchQuery) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedState) {
      filtered = filtered.filter(company => company.state === selectedState)
    }

    if (selectedIndustry) {
      filtered = filtered.filter(company => company.industry === selectedIndustry)
    }

    if (selectedSize) {
      filtered = filtered.filter(company => company.size.includes(selectedSize.split(' ')[0]))
    }

    setFilteredCompanies(filtered)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Search Companies</h1>
          <p className="text-muted-foreground">Find the perfect placement opportunity from {mockCompanies.length}+ companies</p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search companies, industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} className="bg-primary text-primary-foreground hover:bg-primary-hover">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredCompanies.length} companies
          </p>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">Sort by: Relevance</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="p-6 hover-lift card-gradient">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{company.name}</h3>
                    <Badge variant="secondary" className="mb-2">{company.industry}</Badge>
                  </div>
                  <Building className="w-8 h-8 text-primary" />
                </div>

                <p className="text-muted-foreground text-sm line-clamp-3">{company.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {company.location}, {company.state}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    {company.size}
                  </div>
                  <div className="flex items-center text-success">
                    <Clock className="w-4 h-4 mr-2" />
                    {company.openPositions} open positions
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Link to={`/company/${company.id}`}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover">
                      View Company
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No companies found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedState('')
              setSelectedIndustry('')
              setSelectedSize('')
              setFilteredCompanies(mockCompanies)
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default SearchResults