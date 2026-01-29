export type UserRole = "OWNER" | "ADMIN" | "PROFESSIONAL";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  professionalId?: string;
}
