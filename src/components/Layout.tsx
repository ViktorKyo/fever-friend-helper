
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Clock, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background relative">
      <main className="flex-1 container mx-auto px-4 pt-4 pb-24 relative">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 z-40">
        <div className="container mx-auto">
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
