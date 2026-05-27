import type { HabitFormData } from "../../types/habit"

interface Props {
  formData: HabitFormData
  onChange: (field: keyof HabitFormData, value: string) => void
}

export default function Step3({ formData, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          The Trigger
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Habits stick when they're anchored to something you already do.
          What will remind you to start?
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          After I... <span className="text-gray-400 font-normal">(optional)</span>
        </label>

        {/* Sentence completion UI */}
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <span className="text-sm text-gray-400 whitespace-nowrap">After I</span>
          <input
            type="text"
            value={formData.triggerCue}
            onChange={(e) => onChange("triggerCue", e.target.value)}
            placeholder="finish my morning coffee..."
            className="flex-1 text-sm focus:outline-none"
          />
        </div>

        {/* Live preview */}
        {/* {formData.triggerCue && (
          <p className="text-sm text-blue-600 mt-1">
            ✓ After I {formData.triggerCue}
          </p>
        )} */}
      </div>
    </div>
  )
}