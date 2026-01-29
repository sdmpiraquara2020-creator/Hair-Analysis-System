import { useMemo } from "react";

interface UserPayload {
  id: string;
  role: "OWNER" | "ADMIN" | "PROFESSIONAL";
  organizationId?: string;
  professionalId?: string;
}

export function useAuth() {
  const token = localStorage.getItem("access_token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const user = payload as UserPayload | null;

  return useMemo(
    () => ({
      isAuthenticated: !!user,
      role: user?.role,
      user,
    }),
    [user]
  );
}
