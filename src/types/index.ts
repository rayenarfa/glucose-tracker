export interface GlucoseLog {
  id: string;
  user_id: string;
  level: number;
  note?: string;
  logged_at: string;
  created_at: string;
  meal_type?: "before_meal" | "after_meal";
  meal_time?: string;
}

export interface Medication {
  id: string;
  user_id: string;
  medication_name: string;
  dosage: string;
  type?: string;
  time_taken: string;
  note?: string;
  created_at: string;
}

export interface UserSettings {
  target_min: number;
  target_max: number;
  units: "mg/dL" | "mmol/L";
  notifications_enabled: boolean;
}

export interface GlucoseStats {
  latest: GlucoseLog | null;
  average_7_days: number;
  total_logs: number;
  time_in_range_percentage: number;
  min: number;
  max: number;
}

export type MealType = "before_meal" | "after_meal";

export interface ChartDataPoint {
  date: string;
  level: number;
  meal_type?: MealType;
}
