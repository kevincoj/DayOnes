import type { ProfileStats } from "../types/habit";

interface Props {
  stats: ProfileStats;
}

export default function StatBar({ stats }: Props) {
  const tiles = [
    {
      label: "Current Streak",
      value: stats.activeHabits > 0 ? `${stats.currentStreak}` : "—",
      suffix: stats.currentStreak > 0 ? " 🔥" : "",
    },
    {
      label: "Active Habits",
      value: stats.activeHabits > 0 ? `${stats.activeHabits}` : "—",
      suffix: "",
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-6 py-1 grid grid-cols-2 divide-x divide-gray-200">
        {tiles.map((tile) => (
          <div key={tile.label} className="flex flex-col items-center py-3 px-2">
            <span className="text-xl font-bold text-gray-900">
              {tile.value}
              {tile.suffix}
            </span>
            <span className="text-xs text-gray-500 mt-0.5 text-center">
              {tile.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
