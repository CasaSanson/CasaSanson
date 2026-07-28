// lib/types.ts
export interface ProductVariant {
    id: string;
    size: string;
    color: string;
    price: number;
    stock: number;
    personalizedText: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    description: string;
    base_price: number;
    image: string;
    active: boolean;
    product_variants: ProductVariant[];
    maquila: boolean;
    personalizacion: boolean;
  }
  