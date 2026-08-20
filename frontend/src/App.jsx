import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard placeholders (built in Part 7)
import Dashboard from "./pages/Dashboard";
import SessionPage from "./pages/SessionPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Interviewer dashboard — only interviewers can access */}
        <Route
          path="/dashboard/interviewer"
          element={
            <ProtectedRoute role="interviewer">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Student dashboard — only students can access */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute role="student">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Session room — any logged-in user can join */}
        <Route
          path="/session/:roomId"
          element={
            <ProtectedRoute>
              <SessionPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
