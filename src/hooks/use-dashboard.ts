import { useQuery } from "@tanstack/react-query";
import { fetchStats, fetchTrends, fetchActivities, fetchOnboarding } from "@/lib/api";

export function useStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
  });
}

export function useTrends(start?: string, end?: string) {
  return useQuery({
    queryKey: ["dashboard-trends", start, end],
    queryFn: () => fetchTrends(start, end),
  });
}

export function useActivities(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["dashboard-activities", page, limit],
    queryFn: () => fetchActivities(page, limit),
  });
}

export function useOnboarding() {
  return useQuery({
    queryKey: ["dashboard-onboarding"],
    queryFn: fetchOnboarding,
  });
}
