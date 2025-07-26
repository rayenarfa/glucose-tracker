import { format } from "date-fns";
import { Trash2, Edit } from "lucide-react";
import type { GlucoseLog } from "../types";
import { cn } from "../lib/utils";

interface LogCardProps {
  log: GlucoseLog;
  onDelete?: (id: string) => void;
  onEdit?: (log: GlucoseLog) => void;
  showActions?: boolean;
}

export default function LogCard({
  log,
  onDelete,
  onEdit,
  showActions = true,
}: LogCardProps) {
  const getGlucoseColor = (level: number) => {
    if (level < 90) return "text-red-600 bg-red-50";
    if (level >= 90 && level <= 140) return "text-green-600 bg-green-50";
    if (level > 140 && level <= 180) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getMealTypeLabel = (mealType?: string) => {
    switch (mealType) {
      case "before_meal":
        return "Before Meal";
      case "after_meal":
        return "After Meal";
      default:
        return "General";
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                getGlucoseColor(log.level)
              )}
            >
              {log.level} mg/dL
            </span>
            <span className="text-sm text-gray-500">
              {getMealTypeLabel(log.meal_type)}
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-1">
            {format(new Date(log.logged_at), "MMM d, yyyy 'at' h:mm a")}
          </div>

          {log.note && <p className="text-sm text-gray-700 mt-2">{log.note}</p>}
        </div>

        {showActions && (onDelete || onEdit) && (
          <div className="flex items-center gap-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(log)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(log.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
