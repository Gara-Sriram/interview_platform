import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard pages
import InterviewerDashboard from "./pages/InterviewerDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// Session + misc
import SessionPage from "./pages/SessionPage";
import SessionReview from "./pages/SessionReview";
import PracticeSheet from "./pages/PracticeSheet";
import PracticeProblem from "./pages/PracticeProblem";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/"         element={<Navigate to="/login" replace />} />

        {/* Interviewer only */}
        <Route
          path="/dashboard/interviewer"
          element={
            <ProtectedRoute role="interviewer">
              <InterviewerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student only */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Session room — any logged-in user */}
        <Route
          path="/session/:roomId"
          element={
            <ProtectedRoute>
              <SessionPage />
            </ProtectedRoute>
          }
        />

        {/* Practice sheet — student only */}
        <Route
          path="/practice"
          element={
            <ProtectedRoute role="student">
              <PracticeSheet />
            </ProtectedRoute>
          }
        />

        {/* Individual practice problem */}
        <Route
          path="/practice/:id"
          element={
            <ProtectedRoute role="student">
              <PracticeProblem />
            </ProtectedRoute>
          }
        />

        {/* AI Review — any logged-in user */}
        <Route
          path="/review/:roomId"
          element={
            <ProtectedRoute>
              <SessionReview />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
