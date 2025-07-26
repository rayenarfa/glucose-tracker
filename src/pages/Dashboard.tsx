import { Link } from "react-router-dom";
import {
  TrendingUp,
  Clock,
  Activity,
  Target,
  Plus,
  History,
  BarChart3,
} from "lucide-react";
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import LogCard from "../components/LogCard";
import { useGlucoseStats, useGlucoseLogs } from "../hooks/useGlucoseLogs";
import { format } from "date-fns";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGlucoseStats();
  const { data: logs, isLoading: logsLoading } = useGlucoseLogs();

  if (statsLoading || logsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const recentLogs = logs?.slice(0, 5) || [];

  const getNextSuggestedTime = () => {
    if (!logs || logs.length === 0) return "Start tracking to get suggestions";

    const lastLog = logs[0];
    const lastLogTime = new Date(lastLog.logged_at);
    const now = new Date();
    const hoursSinceLastLog =
      (now.getTime() - lastLogTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastLog < 2) {
      return "Check again in 2 hours";
    } else if (hoursSinceLastLog < 4) {
      return "Time for next reading";
    } else {
      return "Overdue for reading";
    }
  };

  return (
    <Layout>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Track your glucose levels and monitor your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Latest Reading"
            value={stats?.latest ? `${stats.latest.level} mg/dL` : "No data"}
            subtitle={
              stats?.latest
                ? format(new Date(stats.latest.logged_at), "MMM d, h:mm a")
                : ""
            }
            icon={<Activity className="w-6 h-6 text-blue-600" />}
          />
          <StatsCard
            title="7-Day Average"
            value={
              stats?.average_7_days
                ? `${stats.average_7_days} mg/dL`
                : "No data"
            }
            subtitle="Last 7 days"
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          />
          <StatsCard
            title="Total Readings"
            value={stats?.total_logs || 0}
            subtitle="All time"
            icon={<Clock className="w-6 h-6 text-purple-600" />}
          />
          <StatsCard
            title="Time in Range"
            value={
              stats?.time_in_range_percentage
                ? `${stats.time_in_range_percentage}%`
                : "No data"
            }
            subtitle="80-140 mg/dL"
            icon={<Target className="w-6 h-6 text-orange-600" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/add-log"
            className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors text-center group"
          >
            <Plus className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">Log New Reading</h3>
            <p className="text-blue-100 text-sm">
              Add your latest glucose measurement
            </p>
          </Link>

          <Link
            to="/history"
            className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors text-center group"
          >
            <History className="w-8 h-8 mx-auto mb-3 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              View History
            </h3>
            <p className="text-gray-600 text-sm">See all your past readings</p>
          </Link>

          <Link
            to="/charts"
            className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors text-center group"
          >
            <BarChart3 className="w-8 h-8 mx-auto mb-3 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              View Charts
            </h3>
            <p className="text-gray-600 text-sm">Analyze trends and patterns</p>
          </Link>
        </div>

        {/* Recent Readings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Readings
            </h2>
            <Link
              to="/history"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>

          {recentLogs.length > 0 ? (
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <LogCard key={log.id} log={log} showActions={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No readings yet</p>
              <Link
                to="/add-log"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Reading
              </Link>
            </div>
          )}
        </div>

        {/* Next Suggested Reading */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">
                Next Suggested Reading
              </h3>
              <p className="text-blue-700">{getNextSuggestedTime()}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
