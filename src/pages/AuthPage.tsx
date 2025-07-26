import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../utils/supabase";
import { Heart } from "lucide-react";

export default function AuthPage() {
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
