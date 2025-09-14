import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Hotel, Destination } from "@/types";
import { hotelApi } from "@/services/api";
import { createBilingualContent } from "@/utils/localization";

interface HotelFormProps {
  hotel?: Hotel | null;
  destinations: Destination[];
  onSuccess: () => void;
  onCancel: () => void;
}

const HotelForm = ({ hotel, destinations, onSuccess, onCancel }: HotelFormProps) => {
  const { currentLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    name: hotel?.name || "",
    destinationId: hotel?.destinationId || "",
    description: hotel?.description || "",
    address: hotel?.address || "",
    stars: hotel?.stars || 1,
    rating: hotel?.rating || 0,
    priceFrom: hotel?.priceFrom || 0,
    pricePerNight: hotel?.pricePerNight || 0,
    amenities: hotel?.amenities || [],
    imageUrl: hotel?.imageUrl || "",
    // Multilingual content
    enName: hotel?.language?.en?.name || hotel?.name || "",
    enDescription: hotel?.language?.en?.description || hotel?.description || "",
    arName: hotel?.language?.ar?.name || hotel?.name || "",
    arDescription: hotel?.language?.ar?.description || hotel?.description || "",
  });
  const [newAmenity, setNewAmenity] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.destinationId || !formData.description.trim() || !formData.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.priceFrom <= 0) {
      toast({
        title: "Validation Error",
        description: "Price from must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (formData.rating < 0 || formData.rating > 5) {
      toast({
        title: "Validation Error",
        description: "Rating must be between 0 and 5",
        variant: "destructive"
      });
      return;
    }

    if (formData.stars < 1 || formData.stars > 5) {
      toast({
        title: "Validation Error",
        description: "Stars must be between 1 and 5",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare data with multilingual support - ensure both languages have content
      const hotelData = {
        name: formData.name,
        destinationId: formData.destinationId,
        description: formData.description,
        address: formData.address,
        stars: formData.stars,
        rating: formData.rating,
        priceFrom: formData.priceFrom,
        pricePerNight: formData.pricePerNight || formData.priceFrom, // Use priceFrom as fallback
        amenities: formData.amenities,
        imageUrl: formData.imageUrl,
        language: createBilingualContent(
          formData.enName || formData.name,
          formData.enDescription || formData.description,
          formData.arName || formData.name,
          formData.arDescription || formData.description
        )
      };

      if (hotel?._id) {
        await hotelApi.update(hotel._id, hotelData);
        toast({
          title: "Success",
          description: "Hotel updated successfully"
        });
      } else {
        await hotelApi.create(hotelData);
        toast({
          title: "Success", 
          description: "Hotel created successfully"
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving hotel:', error);
      toast({
        title: "Error",
        description: `Failed to ${hotel?._id ? 'update' : 'create'} hotel`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  return (
    <Card className="mb-8 border-0 shadow-lg">
      <CardHeader>
        <CardTitle>{hotel?._id ? 'Edit' : 'Add'} Hotel</CardTitle>
        <CardDescription>
          {hotel?._id ? 'Update hotel information' : 'Create a new hotel'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hotel Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Grand Hotel Paris"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Select 
                value={formData.destinationId} 
                onValueChange={(value) => handleChange('destinationId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest._id} value={dest._id!}>
                      {dest.name}, {dest.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the hotel amenities and features..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="123 Main Street, City, Country"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stars">Stars (1-5) *</Label>
              <Input
                id="stars"
                type="number"
                min="1"
                max="5"
                value={formData.stars}
                onChange={(e) => handleChange('stars', parseInt(e.target.value) || 1)}
                placeholder="5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceFrom">Price From ($) *</Label>
              <Input
                id="priceFrom"
                type="number"
                min="0"
                step="0.01"
                value={formData.priceFrom}
                onChange={(e) => handleChange('priceFrom', parseFloat(e.target.value) || 0)}
                placeholder="200.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5) *</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
                placeholder="4.5"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerNight">Price per Night ($) (Optional)</Label>
            <Input
              id="pricePerNight"
              type="number"
              min="0"
              step="0.01"
              value={formData.pricePerNight}
              onChange={(e) => handleChange('pricePerNight', parseFloat(e.target.value) || 0)}
              placeholder="250.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://example.com/hotel-image.jpg"
            />
          </div>

          {/* Multilingual Content */}
          <div className="space-y-4">
            <Label>Multilingual Content</Label>
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
              </TabsList>
              
              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="enName">English Name *</Label>
                  <Input
                    id="enName"
                    value={formData.enName}
                    onChange={(e) => handleChange('enName', e.target.value)}
                    placeholder="e.g., Grand Hotel Paris"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enDescription">English Description *</Label>
                  <Textarea
                    id="enDescription"
                    value={formData.enDescription}
                    onChange={(e) => handleChange('enDescription', e.target.value)}
                    placeholder="Describe the hotel amenities and features in English..."
                    rows={4}
                    required
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="ar" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="arName">Arabic Name *</Label>
                  <Input
                    id="arName"
                    value={formData.arName}
                    onChange={(e) => handleChange('arName', e.target.value)}
                    placeholder="مثل: فندق جراند باريس"
                    required
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arDescription">Arabic Description *</Label>
                  <Textarea
                    id="arDescription"
                    value={formData.arDescription}
                    onChange={(e) => handleChange('arDescription', e.target.value)}
                    placeholder="صف مرافق وخصائص الفندق باللغة العربية..."
                    rows={4}
                    required
                    dir="rtl"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="flex space-x-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add amenity (e.g., WiFi, Pool, Spa)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" variant="outline" onClick={addAmenity}>
                Add
              </Button>
            </div>
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.amenities.map((amenity, idx) => (
                  <Badge key={idx} variant="secondary" className="flex items-center space-x-1">
                    <span>{amenity}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeAmenity(amenity)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-primary to-travel-accent hover:opacity-90"
            >
              {loading ? 'Saving...' : (hotel?._id ? 'Update' : 'Create')} Hotel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default HotelForm;