export interface Booking {
  id: string;
  user_id: string;
  field_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  booking_date: Date;
  start_time: string;
  end_time: string;
  total_price: number;
  status: string;
  payment_deadline: Date;
  cancellation_reason?: string;
  cancelled_at?: Date;
  rescheduled_at?: Date;
  old_date?: Date;
  old_start_time?: string;
  old_end_time?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  duration_minutes: number;
}