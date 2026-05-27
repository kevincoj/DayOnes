import type { HabitFormData } from "../../types/habit"

interface Props {
  formData: HabitFormData
  onChange: (field: keyof HabitFormData, value: string) => void
}

const SOCIAL_OPTIONS = [
  {
    value: "private",
    label: "Private",
    description: "Only you can see this habit",
    emoji: "🔒"
  },
  {
    value: "shared",
    label: "Shared",
    description: "Your accountability partners can see your progress",
    emoji: "🤝"
  },
  {
    value: "competitive",
    label: "Competitive",
    description: "Compete with partners — may the best habit win",
    emoji: "🏆"
  },
]

export default function Step6({ formData, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Social Mode
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          How public do you want this habit to be?
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {SOCIAL_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange("socialMode", option.value)}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-colors ${
              formData.socialMode === option.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-2xl">{option.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">{option.label}</p>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}