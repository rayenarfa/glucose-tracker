import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, ArrowLeft, ArrowRight, Check } from "lucide-react";
import Layout from "../components/Layout";
import { useAddGlucoseLog } from "../hooks/useGlucoseLogs";

import LoadingSpinner from "../components/LoadingSpinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const glucoseSchema = z.object({
  level: z.number().min(10).max(600),
  meal_type: z.enum(["before_meal", "after_meal"]),
  meal_time: z.string().optional(),
  note: z.string().optional(),
});

type GlucoseFormData = z.infer<typeof glucoseSchema>;

const quickTags = [
  "Exercise",
  "Stress",
  "Medication",
  "Sleep",
  "Illness",
  "Travel",
];

export default function AddLog() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState("");
  const [testTime, setTestTime] = useState<Date>(() => new Date());

  const addGlucoseLog = useAddGlucoseLog();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GlucoseFormData>({
    resolver: zodResolver(glucoseSchema),
    defaultValues: {
      meal_type: "before_meal",
    },
  });

  const watchedLevel = watch("level");
  const watchedMealType = watch("meal_type");

  const getGlucoseColor = (level: number) => {
    if (level < 90) return "text-red-600 bg-red-50 border-red-200";
    if (level >= 90 && level <= 140)
      return "text-green-600 bg-green-50 border-green-200";
    if (level > 140 && level <= 180)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getGlucoseStatus = (level: number) => {
    if (level < 90) return "Low";
    if (level >= 90 && level <= 140) return "Normal";
    if (level > 140 && level <= 180) return "Elevated";
    return "High";
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: GlucoseFormData) => {
    const note = [customNote, ...selectedTags].filter(Boolean).join(" | ");

    await addGlucoseLog.mutateAsync({
      level: data.level,
      meal_type: data.meal_type,
      meal_time: data.meal_time,
      note: note || undefined,
      logged_at: testTime.toISOString(), // Use Date object
    });

    navigate("/dashboard");
  };

  const renderStep1 = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        When did you take this reading?
      </h2>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setValue("meal_type", "before_meal")}
          className={`w-full p-6 rounded-xl border-2 transition-colors ${
            watchedMealType === "before_meal"
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <Clock className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Before Meal</h3>
          <p className="text-sm text-gray-600">Fasting or pre-meal reading</p>
        </button>

        <button
          type="button"
          onClick={() => setValue("meal_type", "after_meal")}
          className={`w-full p-6 rounded-xl border-2 transition-colors ${
            watchedMealType === "after_meal"
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <Clock className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">After Meal</h3>
          <p className="text-sm text-gray-600">
            Post-meal reading (1-2 hours after)
          </p>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        When did you take this reading?
      </h2>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Time
          </label>
          <div className="flex justify-center">
            {/* @ts-expect-error: react-datepicker JSX type issue */}
            <DatePicker
              selected={testTime}
              onChange={(date) => {
                if (date && !Array.isArray(date)) setTestTime(date);
              }}
              showTimeSelect
              timeIntervals={5}
              dateFormat="Pp"
              className="w-full text-lg font-medium text-center p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              popperPlacement="bottom"
              maxDate={new Date()}
              isClearable={false}
              autoComplete="off"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Set the exact time when you took your blood test
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> If you took your test at 11:00 AM but are
            logging it at 11:30 AM, set the time to 11:00 AM for accurate
            tracking.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        What's your glucose level?
      </h2>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <input
            type="number"
            {...register("level", { valueAsNumber: true })}
            placeholder="Enter glucose level"
            className="w-full text-4xl font-bold text-center p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            min="10"
            max="600"
          />
          <p className="text-sm text-gray-500 mt-2">mg/dL (10-600 range)</p>
        </div>

        {watchedLevel && (
          <div
            className={`p-4 rounded-xl border-2 ${getGlucoseColor(
              watchedLevel
            )}`}
          >
            <p className="text-lg font-semibold">
              {getGlucoseStatus(watchedLevel)}
            </p>
            <p className="text-sm">
              {watchedLevel < 90 && "Consider eating something"}
              {watchedLevel >= 90 && watchedLevel <= 140 && "Great! Keep it up"}
              {watchedLevel > 140 && "Consider exercise or medication"}
            </p>
          </div>
        )}

        {errors.level && (
          <p className="text-red-600 text-sm mt-2">{errors.level.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Add any notes (optional)
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Tags
        </label>
        <div className="grid grid-cols-2 gap-2">
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagToggle(tag)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedTags.includes(tag)
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          placeholder="Add any additional context..."
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep5 = () => {
    const note = [customNote, ...selectedTags].filter(Boolean).join(" | ");

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Review Your Entry
        </h2>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Glucose Level:</span>
            <span className="font-semibold">{watchedLevel} mg/dL</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Meal Type:</span>
            <span className="font-semibold">
              {watchedMealType === "before_meal" ? "Before Meal" : "After Meal"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Test Time:</span>
            <span className="font-semibold">{testTime.toLocaleString()}</span>
          </div>

          {note && (
            <div className="flex justify-between">
              <span className="text-gray-600">Notes:</span>
              <span className="font-semibold text-right max-w-xs">{note}</span>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Ready to save this reading to your log?
          </p>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  return (
    <Layout>
      <div className="py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add Glucose Reading
          </h1>
          <p className="text-gray-600">Step {currentStep} of 5</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step < currentStep ? <Check size={16} /> : step}
              </div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
        >
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !watchedMealType) ||
                  (currentStep === 3 &&
                    (!watchedLevel || watchedLevel < 10 || watchedLevel > 600))
                }
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={addGlucoseLog.isPending}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {addGlucoseLog.isPending ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Save Reading
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}
