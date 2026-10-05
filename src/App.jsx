import { lazy, Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./redirects/ProtectedRoute";
import GuestRoute from "./redirects/GuestRoute";
import PageLoader from "./loader/PageLoader";
import "./App.css";

const DashboardTab = lazy(() => import("./components/DashboardTab"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));

// The pages get their "switch" buttons from the router
function SignupRoute() {
  const navigate = useNavigate();
  return <SignupPage onSwitchToLogin={() => navigate("/login")} />;
}

function LoginRoute() {
  const navigate = useNavigate();
  return <LoginPage onSwitchToSignup={() => navigate("/")} />;
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<GuestRoute><SignupRoute /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupRoute /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><LoginRoute /></GuestRoute>} />
          <Route path="/collector-dashboard" element={<ProtectedRoute><DashboardTab /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;