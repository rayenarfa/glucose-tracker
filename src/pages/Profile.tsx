import { useState } from "react";
import {
  User,
  Settings,
  Download,
  Trash2,
  Heart,
  Shield,
  Smartphone,
  Info,
} from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { useGlucoseLogs } from "../hooks/useGlucoseLogs";

export default function Profile() {
  const { user } = useAuth();
  const { data: logs } = useGlucoseLogs();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const exportAllData = () => {
    if (!logs) return;

    const data = {
      user: {
        email: user?.email,
        joined: user?.created_at,
      },
      glucose_logs: logs,
      export_date: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `glucose-tracker-data-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    // This would typically call an API to delete the user account
    // For now, we'll just show a confirmation
    setShowDeleteConfirm(false);
    alert("Account deletion would be implemented here");
  };

  return (
    <Layout>
      <div className="py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile & Settings
          </h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    User Information
                  </h2>
                  <p className="text-gray-600">Your account details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900">
                    {user?.email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">
                    {user?.created_at
                      ? format(new Date(user.created_at), "MMM d, yyyy")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Total Readings</span>
                  <span className="font-medium text-gray-900">
                    {logs?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* App Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  App Settings
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Glucose Range
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Minimum
                      </label>
                      <input
                        type="number"
                        defaultValue="80"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Maximum
                      </label>
                      <input
                        type="number"
                        defaultValue="140"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Units
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none">
                    <option value="mg/dL">mg/dL (US Standard)</option>
                    <option value="mmol/L">mmol/L (International)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Notifications
                    </label>
                    <p className="text-xs text-gray-500">
                      Get reminders for glucose readings
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Download className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Data Management
                </h2>
              </div>

              <div className="space-y-4">
                <button
                  onClick={exportAllData}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={16} />
                  Export All Data (JSON)
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Readings</span>
                  <span className="font-semibold">{logs?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Active</span>
                  <span className="font-semibold">
                    {logs
                      ? new Set(
                          logs.map((log) =>
                            format(new Date(log.logged_at), "yyyy-MM-dd")
                          )
                        ).size
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average/Day</span>
                  <span className="font-semibold">
                    {logs
                      ? Math.round(
                          logs.length /
                            Math.max(
                              1,
                              new Set(
                                logs.map((log) =>
                                  format(new Date(log.logged_at), "yyyy-MM-dd")
                                )
                              ).size
                            )
                        )
                      : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* About App */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  About Glucose Tracker
                </h3>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile Optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span>Version 1.0.0</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Built with ❤️ for people managing diabetes. This app helps you
                  track your glucose levels and understand your patterns.
                </p>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Need Help?
              </h3>
              <p className="text-blue-700 text-sm mb-4">
                Have questions or need support? We're here to help.
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Account
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This will
                permanently remove all your data and cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
