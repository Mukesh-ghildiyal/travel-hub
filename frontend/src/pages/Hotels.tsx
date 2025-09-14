import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Building2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Hotel, Destination } from "@/types";
import { hotelApi, destinationApi } from "@/services/api";
import { getLocalizedHotel, getLocalizedDestination } from "@/utils/localization";
import HotelForm from "@/components/HotelForm";
import ImageWithFallback from "@/components/ImageWithFallback";

const Hotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    fetchDestinations();
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedDestination && selectedDestination !== "all") {
      fetchHotelsByDestination(selectedDestination);
    } else {
      fetchHotels();
    }
  }, [selectedDestination]);

  const fetchDestinations = async () => {
    try {
      const response = await destinationApi.getAll();
      if (response.data.success) {
        setDestinations(response.data.data || []);
      }
    } catch (error) {
      // Mock data for development
      setDestinations([
        { _id: "1", name: "Paris", country: "France", description: "City of Light" },
        { _id: "2", name: "Tokyo", country: "Japan", description: "Modern metropolis" }
      ]);
    }
  };

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await hotelApi.getAll();
      if (response.data.success) {
        setHotels(response.data.data || []);
      }
    } catch (error) {
      // Mock data for development
      setHotels([
        {
          _id: "1",
          name: "Hotel Ritz Paris",
          destinationId: "1",
          description: "Luxury hotel in the heart of Paris",
          pricePerNight: 500,
          rating: 4.8,
          amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
          destination: { _id: "1", name: "Paris", country: "France", description: "City of Light" }
        },
        {
          _id: "2", 
          name: "Tokyo Grand Hotel",
          destinationId: "2",
          description: "Modern hotel with city views",
          pricePerNight: 300,
          rating: 4.5,
          amenities: ["WiFi", "Gym", "Restaurant", "Business Center"],
          destination: { _id: "2", name: "Tokyo", country: "Japan", description: "Modern metropolis" }
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

  const fetchHotelsByDestination = async (destinationId: string) => {
    try {
      setLoading(true);
      const response = await hotelApi.getByDestination(destinationId);
      if (response.data.success) {
        setHotels(response.data.data || []);
      }
    } catch (error) {
      // Filter mock data by destination
      const mockHotels = [
        {
          _id: "1",
          name: "Hotel Ritz Paris",
          destinationId: "1",
          description: "Luxury hotel in the heart of Paris",
          pricePerNight: 500,
          rating: 4.8,
          amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
          destination: { _id: "1", name: "Paris", country: "France", description: "City of Light" }
        },
        {
          _id: "2", 
          name: "Tokyo Grand Hotel",
          destinationId: "2",
          description: "Modern hotel with city views",
          pricePerNight: 300,
          rating: 4.5,
          amenities: ["WiFi", "Gym", "Restaurant", "Business Center"],
          destination: { _id: "2", name: "Tokyo", country: "Japan", description: "Modern metropolis" }
        }
      ];
      setHotels(mockHotels.filter(hotel => hotel.destinationId === destinationId));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hotel?")) return;
    
    try {
      await hotelApi.delete(id);
      setHotels(hotels.filter(hotel => hotel._id !== id));
      toast({
        title: "Success",
        description: "Hotel deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hotel",
        variant: "destructive"
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingHotel(null);
    if (selectedDestination && selectedDestination !== "all") {
      fetchHotelsByDestination(selectedDestination);
    } else {
      fetchHotels();
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
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
          <h1 className="text-3xl font-bold text-foreground">Hotels</h1>
          <p className="text-muted-foreground mt-2">Manage hotels and accommodations</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-primary to-travel-accent hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Hotel
        </Button>
      </div>

      {/* Filter by destination */}
      <div className="mb-6">
        <Select value={selectedDestination} onValueChange={setSelectedDestination}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Destinations</SelectItem>
            {destinations.map((dest) => (
              <SelectItem key={dest._id} value={dest._id!}>
                {dest.name}, {dest.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showForm && (
        <HotelForm
          hotel={editingHotel}
          destinations={destinations}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingHotel(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => {
          const localizedHotel = getLocalizedHotel(hotel, currentLanguage);
          const localizedDestination = hotel.destination ? getLocalizedDestination(hotel.destination, currentLanguage) : null;
          
          return (
            <Card key={hotel._id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
              <ImageWithFallback
                src={hotel.imageUrl}
                alt={localizedHotel.name}
                type="hotel"
              />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{localizedHotel.name}</CardTitle>
                  </div>
                  <Badge variant="secondary">
                    ${hotel.priceFrom || hotel.pricePerNight}/night
                  </Badge>
                </div>
                
                {localizedDestination && (
                  <div className="text-sm text-muted-foreground">
                    📍 {localizedDestination.name}, {hotel.destination?.country}
                  </div>
                )}

                <div className="flex items-center space-x-1">
                  {renderStars(hotel.rating)}
                  <span className="text-sm text-muted-foreground ml-2">
                    {hotel.rating}/5
                  </span>
                </div>
                
                {hotel.address && (
                  <div className="text-sm text-muted-foreground mt-2">
                    📍 {hotel.address}
                  </div>
                )}
                
                {hotel.stars && (
                  <div className="flex items-center space-x-1 mt-2">
                    <span className="text-sm text-muted-foreground">Stars:</span>
                    {Array.from({ length: hotel.stars }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {localizedHotel.description}
                </CardDescription>
                
                {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Room Types</h4>
                    <div className="space-y-2">
                      {hotel.roomTypes.slice(0, 2).map((room, idx) => (
                        <div key={idx} className="p-2 bg-muted/50 rounded text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{room.name}</span>
                            <span className="text-primary">${room.price}/night</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {room.facilities.slice(0, 3).join(', ')}
                            {room.facilities.length > 3 && ` +${room.facilities.length - 3} more`}
                          </div>
                        </div>
                      ))}
                      {hotel.roomTypes.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{hotel.roomTypes.length - 2} more room types
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Nearby Attractions</h4>
                    <div className="space-y-1">
                      {hotel.nearbyAttractions.slice(0, 3).map((attraction, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span>{attraction.name}</span>
                          <span className="text-muted-foreground">{attraction.distance}</span>
                        </div>
                      ))}
                      {hotel.nearbyAttractions.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{hotel.nearbyAttractions.length - 3} more attractions
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {hotel.photos && hotel.photos.length > 0 && (
                  <div className="mb-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {hotel.photos.slice(0, 3).map((photo, idx) => (
                        <div key={idx} className="flex-shrink-0 w-20 h-16 rounded overflow-hidden">
                          <img 
                            src={photo.url} 
                            alt={photo.caption || `Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {hotel.photos.length > 3 && (
                        <div className="flex-shrink-0 w-20 h-16 rounded bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                          +{hotel.photos.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{hotel.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingHotel(hotel);
                    setShowForm(true);
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(hotel._id!)}
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
        
        {hotels.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {selectedDestination !== "all" 
                ? "No hotels found for selected destination" 
                : "No hotels yet. Add your first hotel!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;