import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { HelmetProvider } from "react-helmet-async";
import supabase from "./utils/supabase";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import AddLog from "./pages/AddLog";
import History from "./pages/History";
import Charts from "./pages/Charts";
import Profile from "./pages/Profile";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App: Initializing authentication...");

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("App: Error getting session:", error);
      } else {
        console.log(
          "App: Session check result:",
          session?.user?.email || "No user"
        );
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(
        "App: Auth state changed:",
        event,
        session?.user?.email || "No user"
      );
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    // @ts-expect-error: React 19 compatibility issue with react-helmet-async
    <HelmetProvider>
      <AuthProvider value={{ user, setUser }}>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
          />
          <Route
            path="/auth"
            element={user ? <Navigate to="/dashboard" /> : <AuthPage />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/auth" />}
          />
          <Route
            path="/add-log"
            element={user ? <AddLog /> : <Navigate to="/auth" />}
          />
          <Route
            path="/history"
            element={user ? <History /> : <Navigate to="/auth" />}
          />
          <Route
            path="/charts"
            element={user ? <Charts /> : <Navigate to="/auth" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/auth" />}
          />
        </Routes>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
