import { useState, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Area,
  AreaChart,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  ZoomIn,
} from "lucide-react";
import Layout from "../components/Layout";
import { useGlucoseLogs } from "../hooks/useGlucoseLogs";
import LoadingSpinner from "../components/LoadingSpinner";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

type TimeRange = "today" | "7d" | "30d" | "90d" | "all";
type ChartType = "line" | "area";

interface ChartDataPoint {
  date: string;
  level: number;
  meal_type?: string;
  fullDate: Date;
  time: string;
  dateFull: string;
}

export default function Charts() {
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [isMobile, setIsMobile] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const { data: logs, isLoading } = useGlucoseLogs();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const getFilteredLogs = () => {
    if (!logs) return [];

    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (timeRange) {
      case "today":
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        return logs.filter((log) => {
          const logDate = new Date(log.logged_at);
          return logDate >= startDate && logDate <= endDate;
        });
      case "7d":
        startDate = subDays(now, 7);
        break;
      case "30d":
        startDate = subDays(now, 30);
        break;
      case "90d":
        startDate = subDays(now, 90);
        break;
      default:
        return logs;
    }

    return logs.filter((log) => new Date(log.logged_at) >= startDate);
  };

  const filteredLogs = getFilteredLogs();

  // Prepare data for chart
  const chartData: ChartDataPoint[] = filteredLogs
    .map((log) => ({
      date:
        timeRange === "today"
          ? format(new Date(log.logged_at), "h:mm a")
          : format(new Date(log.logged_at), "MMM d"),
      level: log.level,
      meal_type: log.meal_type,
      fullDate: new Date(log.logged_at),
      time: format(new Date(log.logged_at), "HH:mm"),
      dateFull: format(new Date(log.logged_at), "MMM d, yyyy"),
    }))
    .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

  // Calculate statistics
  const stats = {
    average:
      filteredLogs.length > 0
        ? Math.round(
            filteredLogs.reduce((sum, log) => sum + log.level, 0) /
              filteredLogs.length
          )
        : 0,
    lowest:
      filteredLogs.length > 0
        ? Math.min(...filteredLogs.map((log) => log.level))
        : 0,
    highest:
      filteredLogs.length > 0
        ? Math.max(...filteredLogs.map((log) => log.level))
        : 0,
    inRange:
      filteredLogs.length > 0
        ? Math.round(
            (filteredLogs.filter((log) => log.level >= 90 && log.level <= 140)
              .length /
              filteredLogs.length) *
              100
          )
        : 0,
    trend:
      filteredLogs.length > 1
        ? filteredLogs[filteredLogs.length - 1].level > filteredLogs[0].level
          ? "up"
          : "down"
        : "neutral",
  };

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; payload: ChartDataPoint }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Time</span>
              <span className="text-sm font-semibold">{data.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Date</span>
              <span className="text-sm font-semibold">{data.dateFull}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Glucose</span>
              <span className="text-lg font-bold text-blue-600">
                {data.level} mg/dL
              </span>
            </div>
            {data.meal_type && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Meal</span>
                <span className="text-sm font-semibold">
                  {data.meal_type === "before_meal"
                    ? "Before Meal"
                    : "After Meal"}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-100">
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  data.level < 90
                    ? "bg-red-100 text-red-700"
                    : data.level >= 90 && data.level <= 140
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {data.level < 90
                  ? "Low"
                  : data.level >= 90 && data.level <= 140
                  ? "Normal"
                  : "High"}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartType === "area") {
      return (
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              interval="preserveStartEnd"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, "dataMax + 50"]}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceArea y1={90} y2={140} fill="#dcfce7" fillOpacity={0.2} />
            <ReferenceLine
              y={90}
              stroke="#22c55e"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <ReferenceLine
              y={140}
              stroke="#22c55e"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="level"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#glucoseGradient)"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: isMobile ? 3 : 4 }}
              activeDot={{
                r: isMobile ? 5 : 6,
                stroke: "#3b82f6",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            interval="preserveStartEnd"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, "dataMax + 50"]}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceArea y1={90} y2={140} fill="#dcfce7" fillOpacity={0.2} />
          <ReferenceLine
            y={90}
            stroke="#22c55e"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          <ReferenceLine
            y={140}
            stroke="#22c55e"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          <Line
            type="monotone"
            dataKey="level"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: isMobile ? 3 : 4 }}
            activeDot={{
              r: isMobile ? 5 : 6,
              stroke: "#3b82f6",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Layout>
      <div className="py-4 lg:py-8">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Charts</h1>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Glucose Charts
          </h1>
          <p className="text-gray-600">
            Visualize your glucose patterns and trends
          </p>
        </div>

        {/* Mobile Quick Stats */}
        <div className="lg:hidden mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                Today's Average
              </span>
              <div className="flex items-center gap-1">
                {stats.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : stats.trend === "down" ? (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                ) : (
                  <Minus className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.average} mg/dL
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {filteredLogs.length} readings
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-4 lg:mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="today">Today</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>

            {/* Chart Type Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Chart:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartType("line")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartType === "line"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType("area")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartType === "area"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Area
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Statistics Panel */}
        <div className="hidden lg:grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Average</h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.average} mg/dL
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {filteredLogs.length} readings
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Lowest</h3>
            <p className="text-3xl font-bold text-red-600">
              {stats.lowest} mg/dL
            </p>
            <p className="text-xs text-gray-500 mt-1">Minimum reading</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Highest</h3>
            <p className="text-3xl font-bold text-orange-600">
              {stats.highest} mg/dL
            </p>
            <p className="text-xs text-gray-500 mt-1">Maximum reading</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">In Range</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.inRange}%
            </p>
            <p className="text-xs text-gray-500 mt-1">90-140 mg/dL</p>
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
              {timeRange === "today"
                ? "Today's Glucose Readings"
                : "Glucose Levels Over Time"}
            </h2>
            <p className="text-sm lg:text-base text-gray-600">
              {timeRange === "today"
                ? "Tap on data points to see detailed information"
                : "Track your glucose levels over time with target range indicators"}
            </p>
          </div>

          {filteredLogs.length > 0 ? (
            <div ref={chartRef} className="relative">
              {renderChart()}

              {/* Mobile Instructions */}
              <div className="lg:hidden mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <ZoomIn className="w-4 h-4" />
                  <span>Tap any point on the chart to see details</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No data to display
              </h3>
              <p className="text-gray-600">
                Add some glucose readings to see your charts and trends.
              </p>
            </div>
          )}
        </div>

        {/* Target Range Info */}
        <div className="mt-4 lg:mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Target Range Guide
              </h3>
              <p className="text-sm text-blue-700">
                The green shaded area (90-140 mg/dL) represents your optimal
                glucose range. Readings within this range are considered healthy
                for most people with diabetes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
