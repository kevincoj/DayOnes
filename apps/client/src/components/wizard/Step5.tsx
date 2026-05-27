import type { HabitFormData } from "../../types/habit"

interface Props {
  formData: HabitFormData
  onChange: (field: keyof HabitFormData, value: string) => void
}

export default function Step4({ formData, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          The Micro-Version
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Life gets busy. What's the smallest version of this habit
          you could do on a hard day?
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          If I'm busy, I'll at least... <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <span className="text-sm text-gray-400 whitespace-nowrap">If I'm busy, I'll at least</span>
          <input
            type="text"
            value={formData.microVersion}
            onChange={(e) => onChange("microVersion", e.target.value)}
            placeholder="do 5 minutes..."
            className="flex-1 text-sm focus:outline-none"
          />
        </div>
        {formData.microVersion && (
          <p className="text-sm text-blue-600 mt-1">
            ✓ If I'm busy, I'll at least {formData.microVersion}
          </p>
        )}
      </div>
    </div>
  )
}