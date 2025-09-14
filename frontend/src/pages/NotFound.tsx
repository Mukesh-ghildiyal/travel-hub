import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, MapPin } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="p-4 bg-gradient-to-r from-primary to-travel-accent rounded-full w-fit mx-auto mb-6 shadow-lg">
          <MapPin className="h-16 w-16 text-white" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-travel-accent bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-8">
          Oops! The destination you're looking for doesn't exist. Let's get you back on track.
        </p>
        
        <Button 
          asChild
          className="bg-gradient-to-r from-primary to-travel-accent hover:opacity-90"
        >
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
