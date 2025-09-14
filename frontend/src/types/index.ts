// TypeScript interfaces matching MongoDB schemas

export interface LanguageContent {
  name: string;
  description: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface RoomType {
  name: string;
  price: number;
  facilities: string[];
}

export interface NearbyAttraction {
  name: string;
  distance: string;
}

export interface Photo {
  url: string;
  caption?: string;
}

export interface Destination {
  _id?: string;
  name: string;
  country: string;
  description: string;
  imageUrl?: string;
  coordinates?: Coordinates;
  photos?: Photo[];
  language?: {
    en?: LanguageContent;
    ar?: LanguageContent;
  };
  hotelsCount?: number; // Virtual field from backend
  createdAt?: string;
  updatedAt?: string;
  // Dynamic fields support
  [key: string]: any;
}

export interface Hotel {
  _id?: string;
  name: string;
  destinationId: string;
  destination?: Destination; // Populated destination
  description: string;
  address: string;
  stars: number;
  rating: number;
  priceFrom: number;
  pricePerNight?: number; // Keep for backward compatibility
  roomTypes: RoomType[];
  nearbyAttractions: NearbyAttraction[];
  amenities: string[];
  imageUrl?: string;
  photos?: Photo[];
  language?: {
    en?: LanguageContent;
    ar?: LanguageContent;
  };
  createdAt?: string;
  updatedAt?: string;
  // Dynamic fields support
  [key: string]: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}