import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Destination } from "@/types";
import { destinationApi } from "@/services/api";
import { getLocalizedDestination } from "@/utils/localization";
import DestinationForm from "@/components/DestinationForm";
import ImageWithFallback from "@/components/ImageWithFallback";

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await destinationApi.getAll();
      if (response.data.success) {
        setDestinations(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
      // Mock data for development
      setDestinations([
        {
          _id: "1",
          name: "Paris",
          country: "France",
          description: "The City of Light, famous for the Eiffel Tower and romantic atmosphere."
        },
        {
          _id: "2", 
          name: "Tokyo",
          country: "Japan",
          description: "A vibrant metropolis blending traditional culture with modern innovation."
        }
      ]);
      toast({
        title: "Using Mock Data",
        description: "Connect your Express.js backend to see real data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    
    try {
      await destinationApi.delete(id);
      setDestinations(destinations.filter(dest => dest._id !== id));
      toast({
        title: "Success",
        description: "Destination deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete destination",
        variant: "destructive"
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingDestination(null);
    fetchDestinations();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Destinations</h1>
          <p className="text-muted-foreground mt-2">Manage your travel destinations</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-primary to-travel-accent hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Destination
        </Button>
      </div>

      {showForm && (
        <DestinationForm
          destination={editingDestination}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingDestination(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => {
          const localized = getLocalizedDestination(destination, currentLanguage);
          return (
            <Card key={destination._id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
              <ImageWithFallback
                src={destination.imageUrl}
                alt={localized.name}
                type="destination"
              />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{localized.name}</CardTitle>
                  </div>
                  <Badge variant="secondary">{destination.country}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-sm text-muted-foreground">
                  {localized.description}
                </CardDescription>
                
                {destination.coordinates && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {destination.coordinates.lat.toFixed(4)}, {destination.coordinates.lon.toFixed(4)}
                      </span>
                    </div>
                  </div>
                )}
                
                {destination.photos && destination.photos.length > 0 && (
                  <div className="mb-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {destination.photos.slice(0, 3).map((photo, idx) => (
                        <div key={idx} className="flex-shrink-0 w-20 h-16 rounded overflow-hidden">
                          <img 
                            src={photo.url} 
                            alt={photo.caption || `Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {destination.photos.length > 3 && (
                        <div className="flex-shrink-0 w-20 h-16 rounded bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                          +{destination.photos.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingDestination(destination);
                    setShowForm(true);
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(destination._id!)}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
          );
        })}
        
        {destinations.length === 0 && (
          <div className="col-span-full text-center py-12">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No destinations yet. Add your first destination!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;