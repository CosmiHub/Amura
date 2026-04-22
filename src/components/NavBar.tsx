
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, UserCog } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { toast } from "@/components/ui/use-toast";

type NavItem = {
  name: string;
  path: string;
  adminOnly?: boolean;
  showAlways?: boolean;
};

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin: checkIsAdmin } = useAuth();
  const isAdminUser = user && checkIsAdmin();

  const navItems: NavItem[] = [
    { name: "Home", path: "/" },
    { name: "Events & Workshops", path: "/events" },
    { name: "Register", path: "/register" },
    { name: "Certificate Download", path: "/certificates" },
    { name: "Achievements", path: "/achievements" },
    { name: "About Us", path: "/about" },
    // Show Login link only when not logged in
    { name: "Login", path: "/auth", adminOnly: false },
    // Show Dashboard link only for admins
    { name: "Dashboard", path: "/dashboard", adminOnly: true }
  ];

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-white dark:bg-gray-900 shadow-md glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-amura-purple">AMURA</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              // Skip Login if user is logged in
              if (item.name === "Login" && user) return null;
              
              // Skip if it's an admin-only item and user is not admin
              if (item.adminOnly && !isAdminUser) return null;

              // Always show items marked with showAlways
              if (item.showAlways || !item.adminOnly || (item.adminOnly && isAdminUser)) {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? "text-amura-purple border-b-2 border-amura-purple"
                        : "text-gray-700 dark:text-gray-300 hover:text-amura-purple dark:hover:text-amura-purple"
                    }`}
                  >
                    {item.name === "Admin" ? (
                      <div className="flex items-center">
                        <UserCog className="h-4 w-4 mr-1" />
                        {item.name}
                      </div>
                    ) : (
                      item.name
                    )}
                  </Link>
                );
              }
              
              return null;
            })}
            
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-300 hover:text-amura-purple dark:hover:text-amura-purple"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
            
            <div className="pl-4">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={toggleNav}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-amura-purple hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              // Skip Login if user is logged in
              if (item.name === "Login" && user) return null;
              
              // Skip if it's an admin-only item and user is not admin
              if (item.adminOnly && !isAdminUser) return null;

              // Always show items marked with showAlways
              if (item.showAlways || !item.adminOnly || (item.adminOnly && isAdminUser)) {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.path
                        ? "text-amura-purple bg-amura-purple-light"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name === "Admin" ? (
                      <div className="flex items-center">
                        <UserCog className="h-4 w-4 mr-1" />
                        {item.name}
                      </div>
                    ) : (
                      item.name
                    )}
                  </Link>
                );
              }
              
              return null;
            })}
            
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
