export interface Movement {
  id: number;
  productId: number;
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
