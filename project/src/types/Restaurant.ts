export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  cuisineType: string;
  priceLevel: string;
  distance: number;
  deliveryTime: number;
  freeDelivery: boolean;
  address?: string;
  description?: string;
}