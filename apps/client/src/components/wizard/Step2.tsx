import type { HabitFormData } from "../../types/habit"

interface Props {
  formData: HabitFormData
  onChange: (field: keyof HabitFormData, value: string) => void
}

export default function Step2({ formData, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Frequency & Duration
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          How often will you do this habit, and for how long?
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Frequency <span className="text-red-400">*</span>
        </label>
        <select
          value={formData.frequency}
          onChange={(e) => onChange("frequency", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Duration <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={52}
            value={formData.durationWeeks}
            onChange={(e) => onChange("durationWeeks", e.target.value)}
            placeholder="e.g. 12"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
          />
          <span className="text-sm text-gray-500">weeks</span>
        </div>
      </div>
    </div>
  )
}