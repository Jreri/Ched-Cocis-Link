import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Route name mapping
  const routeNames = {
    'search': 'Search Results',
    'advanced-search': 'Advanced Search',
    'compare': 'Company Comparison',
    'company': 'Company Profile',
    'about': 'About Us',
    'contact': 'Contact',
    'help': 'Help & Support',
    'terms': 'Terms of Service',
    'privacy': 'Privacy Policy',
    'how-to-apply': 'How to Apply',
    'login': 'Login',
    'register': 'Register',
    'dashboard': 'Dashboard',
    'applications': 'Application Status',
    'success-stories': 'Success Stories',
    'profile': 'Profile',
    'settings': 'Settings'
  };

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {pathnames.map((pathname, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = routeNames[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);

            return (
              <BreadcrumbItem key={pathname}>
                <BreadcrumbSeparator />
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={routeTo}>{displayName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;