import { useState } from "react";
import { Search, Filter, Download, Trash2, Calendar } from "lucide-react";
import Layout from "../components/Layout";
import LogCard from "../components/LogCard";
import { useGlucoseLogs, useDeleteGlucoseLog } from "../hooks/useGlucoseLogs";
import type { GlucoseLog } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import { format, startOfDay, endOfDay, isSameDay } from "date-fns";

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mealTypeFilter, setMealTypeFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const { data: logs, isLoading } = useGlucoseLogs();
  const deleteLog = useDeleteGlucoseLog();

  const filteredLogs =
    logs?.filter((log) => {
      const matchesSearch =
        searchTerm === "" ||
        log.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.level.toString().includes(searchTerm);

      const matchesMealType =
        mealTypeFilter === "" || log.meal_type === mealTypeFilter;

      const matchesDate =
        dateFilter === "" ||
        isSameDay(new Date(log.logged_at), new Date(dateFilter));

      return matchesSearch && matchesMealType && matchesDate;
    }) || [];

  const handleDelete = async (id: string) => {
    await deleteLog.mutateAsync(id);
    setShowDeleteModal(null);
  };

  const exportToCSV = () => {
    if (!logs) return;

    const headers = [
      "Date",
      "Time",
      "Glucose Level (mg/dL)",
      "Meal Type",
      "Notes",
    ];
    const csvContent = [
      headers.join(","),
      ...logs.map((log) =>
        [
          format(new Date(log.logged_at), "MM/dd/yyyy"),
          format(new Date(log.logged_at), "HH:mm"),
          log.level,
          log.meal_type || "General",
          log.note || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `glucose-log-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Glucose History
          </h1>
          <p className="text-gray-600">
            View and manage all your glucose readings
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col gap-4">
            {/* Top Row - Search and Export */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notes or glucose levels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>

            {/* Bottom Row - Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter("")}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Meal Type Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={mealTypeFilter}
                  onChange={(e) => setMealTypeFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Types</option>
                  <option value="before_meal">Before Meal</option>
                  <option value="after_meal">After Meal</option>
                </select>
              </div>

              {/* Quick Date Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setDateFilter(format(new Date(), "yyyy-MM-dd"))
                  }
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() =>
                    setDateFilter(
                      format(
                        new Date(Date.now() - 24 * 60 * 60 * 1000),
                        "yyyy-MM-dd"
                      )
                    )
                  }
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Yesterday
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredLogs.length} of {logs?.length || 0} readings
            {dateFilter && (
              <span className="ml-2 text-blue-600">
                • Filtered by {format(new Date(dateFilter), "MMMM d, yyyy")}
              </span>
            )}
          </p>
        </div>

        {/* Logs List */}
        {filteredLogs.length > 0 ? (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <LogCard
                key={log.id}
                log={log}
                onDelete={(id) => setShowDeleteModal(id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No readings found
            </h3>
            <p className="text-gray-600">
              {searchTerm || mealTypeFilter
                ? "Try adjusting your search or filters"
                : "Start by adding your first glucose reading"}
            </p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Reading
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this glucose reading? This
                action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  disabled={deleteLog.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {deleteLog.isPending ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
