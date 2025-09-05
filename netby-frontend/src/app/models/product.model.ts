export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  price: number;
  stock: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
}
