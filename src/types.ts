export interface Product {
  id: string;
  name: string;
  code: string;
  category: "interior" | "exterior" | "specialty" | "primer";
  description: string;
  price: number;
  unit: string;
  stars: number;
  reviews: number;
  features: string[];
  badge?: string;
  image?: string;
}

export interface ColorItem {
  hex: string;
  name: string;
  code: string;
  category: "classic" | "modern" | "pastel" | "earthy";
  description: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "won" | "lost";
  source?: string;
  createdAt: string;
}
