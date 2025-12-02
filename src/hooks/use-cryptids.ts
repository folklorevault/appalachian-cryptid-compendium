import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCryptids,
  getCryptid,
  createCryptid,
  updateCryptid,
  deleteCryptid,
  CryptidInput,
  Cryptid,
} from "@/lib/api";

// Query keys
export const cryptidKeys = {
  all: ["cryptids"] as const,
  lists: () => [...cryptidKeys.all, "list"] as const,
  list: (filters: { region?: string; danger_level?: string; search?: string }) =>
    [...cryptidKeys.lists(), filters] as const,
  details: () => [...cryptidKeys.all, "detail"] as const,
  detail: (id: string) => [...cryptidKeys.details(), id] as const,
};

// Get all cryptids with optional filters
export function useCryptids(filters?: {
  region?: string;
  danger_level?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: cryptidKeys.list(filters || {}),
    queryFn: () => getCryptids(filters),
  });
}

// Get a single cryptid by ID
export function useCryptid(id: string) {
  return useQuery({
    queryKey: cryptidKeys.detail(id),
    queryFn: () => getCryptid(id),
    enabled: !!id,
  });
}

// Create a new cryptid
export function useCreateCryptid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cryptid: CryptidInput) => createCryptid(cryptid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cryptidKeys.lists() });
    },
  });
}

// Update an existing cryptid
export function useUpdateCryptid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CryptidInput>;
    }) => updateCryptid(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cryptidKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: cryptidKeys.lists() });
    },
  });
}

// Delete a cryptid
export function useDeleteCryptid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCryptid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cryptidKeys.lists() });
    },
  });
}

