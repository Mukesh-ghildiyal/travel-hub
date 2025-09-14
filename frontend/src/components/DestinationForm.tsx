import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Destination } from "@/types";
import { destinationApi } from "@/services/api";
import { createBilingualContent } from "@/utils/localization";

interface DestinationFormProps {
  destination?: Destination | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const DestinationForm = ({ destination, onSuccess, onCancel }: DestinationFormProps) => {
  const { currentLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    name: destination?.name || "",
    country: destination?.country || "",
    description: destination?.description || "",
    imageUrl: destination?.imageUrl || "",
    // Multilingual content
    enName: destination?.language?.en?.name || destination?.name || "",
    enDescription: destination?.language?.en?.description || destination?.description || "",
    arName: destination?.language?.ar?.name || destination?.name || "",
    arDescription: destination?.language?.ar?.description || destination?.description || "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.country.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare data with multilingual support - ensure both languages have content
      const destinationData = {
        name: formData.name,
        country: formData.country,
        description: formData.description,
        imageUrl: formData.imageUrl,
        language: createBilingualContent(
          formData.enName || formData.name,
          formData.enDescription || formData.description,
          formData.arName || formData.name,
          formData.arDescription || formData.description
        )
      };

      if (destination?._id) {
        await destinationApi.update(destination._id, destinationData);
        toast({
          title: "Success",
          description: "Destination updated successfully"
        });
      } else {
        await destinationApi.create(destinationData);
        toast({
          title: "Success", 
          description: "Destination created successfully"
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving destination:', error);
      toast({
        title: "Error",
        description: `Failed to ${destination?._id ? 'update' : 'create'} destination`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="mb-8 border-0 shadow-lg">
      <CardHeader>
        <CardTitle>{destination?._id ? 'Edit' : 'Add'} Destination</CardTitle>
        <CardDescription>
          {destination?._id ? 'Update destination information' : 'Create a new travel destination'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Destination Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Paris"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="e.g., France"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what makes this destination special..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
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
                    placeholder="e.g., Paris"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enDescription">English Description *</Label>
                  <Textarea
                    id="enDescription"
                    value={formData.enDescription}
                    onChange={(e) => handleChange('enDescription', e.target.value)}
                    placeholder="Describe what makes this destination special in English..."
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
                    placeholder="مثل: باريس"
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
                    placeholder="صف ما يجعل هذا الوجهة مميزة باللغة العربية..."
                    rows={4}
                    required
                    dir="rtl"
                  />
                </div>
              </TabsContent>
            </Tabs>
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
              {loading ? 'Saving...' : (destination?._id ? 'Update' : 'Create')} Destination
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DestinationForm;