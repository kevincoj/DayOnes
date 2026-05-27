import type { HabitFormData } from "../../types/habit"

interface Props {
  formData: HabitFormData
  onChange: (field: keyof HabitFormData, value: string) => void
}

export default function Step7({ formData, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          The Reward 🎉
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Give yourself something to look forward to. What will you do
          to celebrate when you hit a milestone?
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          When I hit a 30-day streak, I will... <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <span className="text-sm text-gray-400 whitespace-nowrap">I will</span>
          <input
            type="text"
            value={formData.reward}
            onChange={(e) => onChange("reward", e.target.value)}
            placeholder="treat myself to a nice dinner..."
            className="flex-1 text-sm focus:outline-none"
          />
        </div>
        {formData.reward && (
          <p className="text-sm text-blue-600 mt-1">
            ✓ I will {formData.reward}
          </p>
        )}
      </div>
    </div>
  )
}