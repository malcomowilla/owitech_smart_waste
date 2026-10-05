import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../loader/PageLoader";

// Login and signup pages. If you are already signed in, go straight to the dashboard.
export default function GuestRoute({ children }) {
  const { status } = useAuth();

  if (status === "loading") return <PageLoader label="Loading" />;
  if (status === "authenticated") return <Navigate to="/collector-dashboard" replace />;

  return children;
}