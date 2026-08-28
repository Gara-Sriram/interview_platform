import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps any route that requires login.
// If not logged in → redirect to /login
// If role doesn't match → redirect to their correct dashboard
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // Still checking the cookie — show nothing (avoids flash of login page)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Wrong role — redirect to their own dashboard
  if (role && user.role !== role) {
    const dest =
      user.role === "admin"       ? "/dashboard/admin" :
      user.role === "interviewer" ? "/dashboard/interviewer" :
                                    "/dashboard/student";
    return <Navigate to={dest} replace />;
  }

  return children;
}
