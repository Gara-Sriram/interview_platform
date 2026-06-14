import { useUser } from "./context/AuthContext";
import { Navigate, Route, Routes, useLocation } from "react-router";
import HomePage from "./pages/HomePage";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import LoginPage from "./pages/LoginPage";

// Redirect to login while preserving the full intended URL (including ?token=)
function RequireAuth({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return children;
}

function App() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!isSignedIn ? <LoginPage /> : <Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/problems" element={<RequireAuth><ProblemsPage /></RequireAuth>} />
        <Route path="/problem/:id" element={<RequireAuth><ProblemPage /></RequireAuth>} />
        <Route path="/session/:id" element={<RequireAuth><SessionPage /></RequireAuth>} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
