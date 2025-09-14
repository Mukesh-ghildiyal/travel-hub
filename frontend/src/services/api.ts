import axios from 'axios';
import { Destination, Hotel, ApiResponse } from '@/types';

// Configure your Express.js backend URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout


});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Destination API calls
export const destinationApi = {
  // Get all destinations
  getAll: () => api.get<ApiResponse<Destination[]>>('/destinations'),
  
  // Get destination by ID
  getById: (id: string) => api.get<ApiResponse<Destination>>(`/destinations/${id}`),
  
  // Create new destination
  create: (destination: Omit<Destination, '_id'>) => 
    api.post<ApiResponse<Destination>>('/destinations', destination),
  
  // Update destination
  update: (id: string, destination: Partial<Destination>) => 
    api.put<ApiResponse<Destination>>(`/destinations/${id}`, destination),
  
  // Delete destination
  delete: (id: string) => api.delete<ApiResponse<void>>(`/destinations/${id}`),
  
  // Get hotels for a destination
  getHotels: (id: string) => api.get<ApiResponse<Hotel[]>>(`/destinations/${id}/hotels`),
};

// Hotel API calls
export const hotelApi = {
  // Get all hotels
  getAll: () => api.get<ApiResponse<Hotel[]>>('/hotels'),
  
  // Get hotels by destination ID
  getByDestination: (destinationId: string) => 
    api.get<ApiResponse<Hotel[]>>(`/hotels/destination/${destinationId}`),
  
  // Get hotel by ID
  getById: (id: string) => api.get<ApiResponse<Hotel>>(`/hotels/${id}`),
  
  // Create new hotel
  create: (hotel: Omit<Hotel, '_id'>) => 
    api.post<ApiResponse<Hotel>>('/hotels', hotel),
  
  // Update hotel
  update: (id: string, hotel: Partial<Hotel>) => 
    api.put<ApiResponse<Hotel>>(`/hotels/${id}`, hotel),
  
  // Delete hotel
  delete: (id: string) => api.delete<ApiResponse<void>>(`/hotels/${id}`),
  
  // Filter hotels
  filter: (params: {
    destinationId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    maxRating?: number;
    amenities?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => api.get<ApiResponse<Hotel[]>>('/hotels/search/filter', { params }),
};

// Health check
export const healthCheck = () => api.get<ApiResponse<any>>('/health');

export default api;