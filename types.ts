
export interface Product {
  id: string;
  bidhaa: string;
  bei: string;
  maelezo: string;
  stock: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Inventory {
  products: Product[];
  lastUpdated: string;
}
