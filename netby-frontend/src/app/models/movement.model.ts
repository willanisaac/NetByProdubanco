export interface Transaction {
  id: string;
  date: string;
  type: string | null;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  detail: string | null;
}

export interface TransactionFormData {
  id?: string;
  date: string;
  type: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  detail: string;
}

// Mantener compatibilidad con el código existente
export interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: 'entry' | 'exit';
  quantity: number;
  reason: string;
  date: Date;
  user: string;
  notes?: string;
}

export interface MovementType {
  id: string;
  name: string;
  description: string;
}
