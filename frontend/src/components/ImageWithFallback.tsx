import { useState } from 'react';
import { MapPin, Building2 } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  type: 'destination' | 'hotel';
  className?: string;
}

const ImageWithFallback = ({ src, alt, type, className = "" }: ImageWithFallbackProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleLoad = () => {
    setImageLoading(false);
  };

  if (imageError || !src) {
    return (
      <div className={`aspect-video w-full bg-gradient-to-br from-primary/10 to-travel-accent/10 flex items-center justify-center ${className}`}>
        <div className="text-center">
          {type === 'destination' ? (
            <MapPin className="h-12 w-12 text-primary/50 mx-auto mb-2" />
          ) : (
            <Building2 className="h-12 w-12 text-primary/50 mx-auto mb-2" />
          )}
          <p className="text-sm text-muted-foreground">
            {type === 'destination' ? 'Destination' : 'Hotel'} Image
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`aspect-video w-full overflow-hidden relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-travel-accent/10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: imageLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default ImageWithFallback;

