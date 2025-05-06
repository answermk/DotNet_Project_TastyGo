export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  options?: {
    name: string;
    choices: {
      id: string;
      name: string;
      price: number;
    }[];
  }[];
}