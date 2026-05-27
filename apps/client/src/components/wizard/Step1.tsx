import type { HabitFormData } from "../../types/habit";

interface Props {
  formData: HabitFormData;
  onChange: (field: keyof HabitFormData, value: string) => void;
}

export default function Step1({ formData, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Name your habit
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Give it a short, action-oriented name. e.g. "Morning run", "Read 10
          pages"
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Habit name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="e.g. Morning run"
          className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            formData.name === "" ? "border-red-400" : "border-gray-300"
          }`}
        />
        {formData.name === "" && (
          <p className="text-xs text-red-400 mt-1">Please enter a habit name</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Description{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="What does this habit involve? Why does it matter to you?"
          rows={3}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
}
