import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchVendors,
  fetchVendor,
  createVendor,
  updateVendor,
  fetchVendorStats,
  fetchVendorActivities,
  generateVendorToken,
} from "@/lib/api";

export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  });
}

export function useVendor(id: string) {
  return useQuery({
    queryKey: ["vendor", id],
    queryFn: () => fetchVendor(id),
    enabled: !!id,
  });
}

export function useVendorStats(id: string) {
  return useQuery({
    queryKey: ["vendor-stats", id],
    queryFn: () => fetchVendorStats(id),
    enabled: !!id,
  });
}

export function useVendorActivities(id: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["vendor-activities", id, page, limit],
    queryFn: () => fetchVendorActivities(id, page, limit),
    enabled: !!id,
  });
}

export function useCreateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createVendor,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendors"] }),
  });
}

export function useUpdateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateVendor>[1] }) =>
      updateVendor(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
      qc.invalidateQueries({ queryKey: ["vendor", id] });
    },
  });
}

export function useGenerateToken() {
  return useMutation({
    mutationFn: (id: string) => generateVendorToken(id),
  });
}
