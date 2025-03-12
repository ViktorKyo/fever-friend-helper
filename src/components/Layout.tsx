
import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Clock, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const mountRef = useRef<boolean>(false);
  
  useEffect(() => {
    console.log("Layout mounted with location:", location.pathname);
    mountRef.current = true;
    
    return () => {
      console.log("Layout unmounting from path:", location.pathname);
      mountRef.current = false;
    };
  }, [location.pathname]);
  
  // Ensure children are present
  const hasChildren = Boolean(children);
  console.log("Layout rendering, has children:", hasChildren);
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 container max-w-screen-md mx-auto px-4 pb-24 pt-8 md:pt-12">
        {children ? (
          <div className="w-full" data-testid="layout-children">
            {children}
          </div>
        ) : (
          <div className="p-6 border border-yellow-300 bg-yellow-50 rounded-lg text-center my-8">
            <h2 className="font-medium text-yellow-800">Content Not Available</h2>
            <p className="text-sm text-yellow-700 mt-1">Please refresh the page to try again.</p>
          </div>
        )}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 px-4 z-50">
        <div className="container max-w-screen-md mx-auto">
          <ul className="flex justify-around items-center">
            <li>
              <NavLink to="/" active={location.pathname === '/'}>
                <Home className="w-5 h-5 mb-1" />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/history" active={location.pathname === '/history'}>
                <Clock className="w-5 h-5 mb-1" />
                <span>History</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/advice" active={location.pathname === '/advice'}>
                <BookOpen className="w-5 h-5 mb-1" />
                <span>Guidance</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center text-xs p-2 rounded-lg transition-all duration-300",
        active
          ? "text-primary font-medium"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
};

export default Layout;
