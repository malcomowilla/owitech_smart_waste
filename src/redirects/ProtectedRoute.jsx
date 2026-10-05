import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../loader/PageLoader";

// Only signed in collector admins get through. Everyone else goes to /login.
export default function ProtectedRoute({ children }) {
  const { status } = useAuth();

  // Wait for the cookie check, so a refresh never bounces a logged in user to /login
  if (status === "loading") return <PageLoader label="Checking your session" />;
  if (status !== "authenticated") return <Navigate to="/login" replace />;

  return children;
}


