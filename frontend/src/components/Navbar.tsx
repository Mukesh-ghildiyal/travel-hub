import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building2, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const location = useLocation();
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-travel-accent bg-clip-text text-transparent">
              TravelHub
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant={location.pathname === "/destinations" ? "default" : "ghost"}
              asChild
            >
              <Link to="/destinations" className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Destinations</span>
              </Link>
            </Button>
            
            <Button 
              variant={location.pathname === "/hotels" ? "default" : "ghost"}
              asChild
            >
              <Link to="/hotels" className="flex items-center space-x-1">
                <Building2 className="h-4 w-4" />
                <span>Hotels</span>
              </Link>
            </Button>

            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Select value={currentLanguage} onValueChange={(value: 'en' | 'ar') => setLanguage(value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="ar">AR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;