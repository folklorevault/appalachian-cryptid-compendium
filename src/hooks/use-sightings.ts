import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  submitSighting,
  getSightings,
  updateSightingStatus,
  deleteSighting,
  uploadImage,
  uploadImageFile,
  SightingInput,
} from "@/lib/api";

// Query keys
export const sightingKeys = {
  all: ["sightings"] as const,
  lists: () => [...sightingKeys.all, "list"] as const,
  list: (filters: { status?: string; limit?: number; offset?: number }) =>
    [...sightingKeys.lists(), filters] as const,
};

// Get sighting reports (admin only)
export function useSightings(filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: sightingKeys.list(filters || {}),
    queryFn: () => getSightings(filters),
  });
}

// Submit a new sighting report
export function useSubmitSighting() {
  return useMutation({
    mutationFn: (sighting: SightingInput) => submitSighting(sighting),
  });
}

// Update sighting status (admin only)
export function useUpdateSightingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      reviewerNotes,
    }: {
      id: string;
      status: "pending" | "approved" | "rejected";
      reviewerNotes?: string;
    }) => updateSightingStatus(id, status, reviewerNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sightingKeys.lists() });
    },
  });
}

// Delete a sighting report (admin only)
export function useDeleteSighting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSighting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sightingKeys.lists() });
    },
  });
}

// Upload an image (base64)
export function useUploadImage() {
  return useMutation({
    mutationFn: (base64Image: string) => uploadImage(base64Image),
  });
}

// Upload an image file
export function useUploadImageFile() {
  return useMutation({
    mutationFn: (file: File) => uploadImageFile(file),
  });
}