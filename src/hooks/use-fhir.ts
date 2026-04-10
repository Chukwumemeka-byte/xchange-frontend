import { useQuery } from "@tanstack/react-query";
import { fetchFHIR, fetchFHIRResource } from "@/lib/api";
import { ResourceType, BaseResource } from "@/lib/fhir";

/**
 * Hook to search for FHIR resources (returns a Bundle)
 */
export function useFHIRSearch<T = BaseResource>(
  resourceType: ResourceType,
  params?: Record<string, string>
) {
  return useQuery({
    queryKey: ["fhir-search", resourceType, params],
    queryFn: () => fetchFHIR<T>(resourceType, params),
    enabled: !!resourceType,
  });
}

/**
 * Hook to fetch a single FHIR resource by ID
 */
export function useFHIRResource<T = BaseResource>(
  resourceType: ResourceType,
  id: string
) {
  return useQuery({
    queryKey: ["fhir-resource", resourceType, id],
    queryFn: () => fetchFHIRResource<T>(resourceType, id),
    enabled: !!resourceType && !!id,
  });
}

/**
 * Shorthand hook to get patients (most common operation)
 */
export function usePatients(params?: Record<string, string>) {
  return useFHIRSearch("Patient", params);
}

/**
 * Shorthate hook to get a patient by ID
 */
export function usePatient(id: string) {
  return useFHIRResource("Patient", id);
}
