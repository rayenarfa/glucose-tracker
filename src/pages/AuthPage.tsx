import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../utils/supabase";
import { Heart } from "lucide-react";
import { useEffect } from "react";

export default function AuthPage() {
  useEffect(() => {
    // Debug logging
    console.log("AuthPage mounted");
    console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("Window location origin:", window.location.origin);
    console.log("Current pathname:", window.location.pathname);

    // Check if user is already authenticated
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error("Error getting session:", error);
        } else if (session) {
          console.log("User already authenticated:", session.user.email);
          console.log("Session expires at:", session.expires_at);
        } else {
          console.log("No active session found");
        }
      })
      .catch((error) => {
        console.error("Unexpected error getting session:", error);
      });
  }, []);

  const handleAuthStateChange = (event: string, session: any) => {
    console.log("Auth state changed:", event, session?.user?.email);

    // Additional debugging for specific events
    if (event === "SIGNED_IN") {
      console.log("User signed in successfully:", session?.user?.email);
    } else if (event === "SIGNED_OUT") {
      console.log("User signed out");
    } else if (event === "TOKEN_REFRESHED") {
      console.log("Token refreshed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              Glucose Tracker
            </h1>
          </div>
          <p className="text-gray-600">Sign in to manage your glucose levels</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#2563eb",
                    brandAccent: "#1d4ed8",
                  },
                },
              },
            }}
            providers={["google"]}
            redirectTo={window.location.origin + "/dashboard"}
            showLinks={true}
            view="sign_in"
            onAuthStateChange={handleAuthStateChange}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
