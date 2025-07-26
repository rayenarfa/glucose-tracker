import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import supabase from "../utils/supabase";
import type { GlucoseLog, GlucoseStats } from "../types";

// Fetch all glucose logs for a user
export function useGlucoseLogs() {
  return useQuery({
    queryKey: ["glucose-logs"],
    queryFn: async (): Promise<GlucoseLog[]> => {
      const { data, error } = await supabase
        .from("glucose_logs")
        .select("*")
        .order("logged_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

// Fetch glucose logs with filters
export function useGlucoseLogsWithFilters(
  startDate?: string,
  endDate?: string,
  mealType?: string
) {
  return useQuery({
    queryKey: ["glucose-logs", startDate, endDate, mealType],
    queryFn: async (): Promise<GlucoseLog[]> => {
      let query = supabase.from("glucose_logs").select("*");

      if (startDate) {
        query = query.gte("logged_at", startDate);
      }
      if (endDate) {
        query = query.lte("logged_at", endDate);
      }
      if (mealType) {
        query = query.eq("meal_type", mealType);
      }

      const { data, error } = await query.order("logged_at", {
        ascending: false,
      });

      if (error) throw error;
      return data || [];
    },
  });
}

// Add new glucose log
export function useAddGlucoseLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      log: Omit<GlucoseLog, "id" | "user_id" | "created_at">
    ) => {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("glucose_logs")
        .insert([
          {
            ...log,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["glucose-logs"] });
      queryClient.invalidateQueries({ queryKey: ["glucose-stats"] });
      toast.success("Glucose reading logged successfully!");
    },
    onError: (error) => {
      toast.error("Failed to log glucose reading");
      console.error("Error adding glucose log:", error);
    },
  });
}

// Delete glucose log
export function useDeleteGlucoseLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("glucose_logs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["glucose-logs"] });
      queryClient.invalidateQueries({ queryKey: ["glucose-stats"] });
      toast.success("Reading deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete reading");
      console.error("Error deleting glucose log:", error);
    },
  });
}

// Get glucose statistics
export function useGlucoseStats() {
  return useQuery({
    queryKey: ["glucose-stats"],
    queryFn: async (): Promise<GlucoseStats> => {
      const { data: logs, error } = await supabase
        .from("glucose_logs")
        .select("*")
        .order("logged_at", { ascending: false });

      if (error) throw error;

      const glucoseLogs = logs || [];
      const latest = glucoseLogs[0] || null;

      // Calculate 7-day average
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentLogs = glucoseLogs.filter(
        (log) => new Date(log.logged_at) >= sevenDaysAgo
      );

      const average7Days =
        recentLogs.length > 0
          ? recentLogs.reduce((sum, log) => sum + log.level, 0) /
            recentLogs.length
          : 0;

      // Calculate time in range (80-140 mg/dL)
      const inRangeLogs = glucoseLogs.filter(
        (log) => log.level >= 80 && log.level <= 140
      );
      const timeInRangePercentage =
        glucoseLogs.length > 0
          ? (inRangeLogs.length / glucoseLogs.length) * 100
          : 0;

      const levels = glucoseLogs.map((log) => log.level);
      const min = levels.length > 0 ? Math.min(...levels) : 0;
      const max = levels.length > 0 ? Math.max(...levels) : 0;

      return {
        latest,
        average_7_days: Math.round(average7Days),
        total_logs: glucoseLogs.length,
        time_in_range_percentage: Math.round(timeInRangePercentage),
        min,
        max,
      };
    },
  });
}
