import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import RequireRole from "./components/RequireRole";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import HowToApply from "./pages/HowToApply";
import Placements from "./pages/Placements";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Apply from "./pages/Apply";
import MyApplications from "./pages/MyApplications";
import AdminApplications from "./pages/AdminApplications";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const student = (el: JSX.Element) => <RequireRole role="student">{el}</RequireRole>;
const admin = (el: JSX.Element) => <RequireRole role="admin">{el}</RequireRole>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/how-to-apply" element={<HowToApply />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Student-only */}
          <Route path="/placements" element={student(<Placements />)} />
          <Route path="/dashboard" element={student(<Dashboard />)} />
          <Route path="/profile" element={student(<Profile />)} />
          <Route path="/apply/:companyId" element={student(<Apply />)} />
          <Route path="/applications" element={student(<MyApplications />)} />

          {/* Admin-only */}
          <Route path="/admin" element={admin(<Admin />)} />
          <Route path="/admin/applications" element={admin(<AdminApplications />)} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
