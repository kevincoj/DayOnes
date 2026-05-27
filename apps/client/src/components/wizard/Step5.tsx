import type { HabitFormData } from "../../types/habit"

interface Props {
  formData: HabitFormData
  onChange: (field: keyof HabitFormData, value: string) => void
}

export default function Step5({ formData, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          The Obstacle Plan
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Think ahead. What's the most likely thing that will get in your way,
          and what will you do about it?
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          If [obstacle], then [alternative]... <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <span className="text-sm text-gray-400 whitespace-nowrap">If I can't, I will</span>
          <input
            type="text"
            value={formData.obstaclePlan}
            onChange={(e) => onChange("obstaclePlan", e.target.value)}
            placeholder="do it right after dinner instead..."
            className="flex-1 text-sm focus:outline-none"
          />
        </div>
        {formData.obstaclePlan && (
          <p className="text-sm text-blue-600 mt-1">
            ✓ If I can't, I will {formData.obstaclePlan}
          </p>
        )}
      </div>
    </div>
  )
}