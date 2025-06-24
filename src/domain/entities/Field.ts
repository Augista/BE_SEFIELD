export interface Field {
  id: string;
  name: string;
  type: string;
  price: number;
  image?: string;
  description?: string;
  operational_start: string;
  operational_end: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}