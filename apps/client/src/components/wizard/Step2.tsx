import type { HabitFormData } from "../../types/habit";

interface Props {
  formData: HabitFormData;
  onChange: (field: keyof HabitFormData, value: string) => void;
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
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={7}
            value={formData.frequency}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") return onChange("frequency", "");
              const clamped = Math.min(7, Math.max(1, Number(val)));
              onChange("frequency", clamped.toString());
            }}
            placeholder="#"
            className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-20 text-center ${
              formData.frequency === "" ? "border-red-400" : "border-gray-300"
            }`}
          />
          <span className="text-sm text-gray-500">days per week</span>
        </div>
        {formData.frequency === "" && (
          <p className="text-xs text-red-400 mt-1">
            Please enter a number between 1 and 7
          </p>
        )}
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
  );
}
