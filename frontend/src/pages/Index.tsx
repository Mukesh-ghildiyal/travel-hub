import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Plane } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-primary to-travel-accent rounded-full shadow-lg">
              <Plane className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-travel-accent bg-clip-text text-transparent">
              TravelHub
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your complete travel management platform. Manage destinations,
            hotels, and create amazing travel experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-travel-accent hover:opacity-90 text-lg px-8 py-4 h-auto"
            >
              <Link to="/destinations" className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Explore Destinations</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 h-auto border-2 hover:bg-secondary/50"
            >
              <Link to="/hotels" className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Browse Hotels</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-8 rounded-xl bg-card shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              Destination Management
            </h3>
            <p className="text-muted-foreground mb-6">
              Add, edit, and manage travel destinations with detailed
              descriptions and multilingual support.
            </p>
            <Button asChild variant="outline">
              <Link to="/destinations">Manage Destinations</Link>
            </Button>
          </div>

          <div className="text-center p-8 rounded-xl bg-card shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <div className="p-3 bg-travel-accent/10 rounded-full w-fit mx-auto mb-4">
              <Building2 className="h-8 w-8 text-travel-accent" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Hotel Directory</h3>
            <p className="text-muted-foreground mb-6">
              Comprehensive hotel management with ratings, amenities, and
              destination linking.
            </p>
            <Button asChild variant="outline">
              <Link to="/hotels">Manage Hotels</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sample Data Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Sample Data Preview</h2>
          <p className="text-muted-foreground">
            Explore our pre-loaded destinations and hotels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Sample Destinations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Destinations</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-card border">
                <div className="aspect-video w-full mb-3 rounded overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop"
                    alt="Paris"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold">Paris, France</h4>
                <p className="text-sm text-muted-foreground">
                  The City of Light
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <div className="aspect-video w-full mb-3 rounded overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop"
                    alt="Tokyo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold">Tokyo, Japan</h4>
                <p className="text-sm text-muted-foreground">
                  Vibrant metropolis
                </p>
              </div>
            </div>
          </div>

          {/* Sample Hotels */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Hotels</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-card border">
                <div className="aspect-video w-full mb-3 rounded overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
                    alt="Hotel Ritz Paris"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold">Hotel Ritz Paris</h4>
                <p className="text-sm text-muted-foreground">
                  $800/night • ⭐ 4.8
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <div className="aspect-video w-full mb-3 rounded overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop"
                    alt="The Plaza New York"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold">The Plaza New York</h4>
                <p className="text-sm text-muted-foreground">
                  $1200/night • ⭐ 4.9
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Features</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-travel-accent/10 border border-primary/20">
                <h4 className="font-semibold text-primary">
                  Multilingual Support
                </h4>
                <p className="text-sm text-muted-foreground">
                  English & Arabic content
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-travel-accent/10 border border-primary/20">
                <h4 className="font-semibold text-primary">Dynamic Schemas</h4>
                <p className="text-sm text-muted-foreground">
                  Flexible data storage
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-travel-accent/10 border border-primary/20">
                <h4 className="font-semibold text-primary">
                  Advanced Filtering
                </h4>
                <p className="text-sm text-muted-foreground">
                  Filter by destination, price, rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
