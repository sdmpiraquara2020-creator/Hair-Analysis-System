import { Navigate, Outlet } from "react-router-dom";

interface Props {
  roles: string[];
}

export default function RoleRoute({ roles }: Props) {
  const userRole = "ADMIN"; // exemplo

  if (!roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
