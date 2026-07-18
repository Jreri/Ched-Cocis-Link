import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SearchResults from "./pages/SearchResults";
import CompanyProfile from "./pages/CompanyProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import HowToApply from "./pages/HowToApply";
import AdvancedSearch from "./pages/AdvancedSearch";
import CompanyComparison from "./pages/CompanyComparison";
import ApplicationStatus from "./pages/ApplicationStatus";
import SuccessStories from "./pages/SuccessStories";
import BrowseByLocation from "./pages/BrowseByLocation";
import Placements from "./pages/Placements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/company/:id" element={<CompanyProfile />} />
          <Route path="/compare" element={<CompanyComparison />} />
          <Route path="/browse-location" element={<BrowseByLocation />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/applications" element={<ApplicationStatus />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/how-to-apply" element={<HowToApply />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
