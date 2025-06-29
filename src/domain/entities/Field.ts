export interface Field {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string | null; 
  description: string | null; 
  operational_start: string;
  operational_end: string;
  is_active: boolean;
  created_at: string; 
  updated_at: string;
}
