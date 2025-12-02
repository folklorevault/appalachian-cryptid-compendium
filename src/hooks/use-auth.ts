import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  login as apiLogin,
  logout as apiLogout,
  verifyAuth,
  isLoggedIn as checkLoggedIn,
} from "@/lib/api";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (checkLoggedIn()) {
        const valid = await verifyAuth();
        setIsAuthenticated(valid);
        if (!valid) {
          apiLogout();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: (apiKey: string) => apiLogin(apiKey),
    onSuccess: () => {
      setIsAuthenticated(true);
    },
  });

  const logout = useCallback(() => {
    apiLogout();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}

