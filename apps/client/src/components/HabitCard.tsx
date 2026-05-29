import type { Habit } from "../types/habit";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  habit: Habit;
  onDelete: (id: number) => void;
  onCheckIn: (id: number) => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export default function HabitCard({ habit, onDelete, onCheckIn, isMenuOpen, onToggleMenu }: Props) {
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  async function handleCheckIn() {
    setChecking(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3001/api/habits/${habit.id}/log`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      onCheckIn(habit.id);
    }
    setChecking(false);
  }

  return (
    <li
        onClick={() => navigate(`/habits/${habit.id}`)}
        className={`border rounded-lg p-4 shadow-sm relative cursor-pointer transition-all duration-150 hover:shadow-md hover:scale-[1.01] hover:bg-gray-50 ${isMenuOpen ? "z-50" : ""}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{habit.name}</h2>
          {habit.description && (
            <p className="text-gray-600 mt-1">{habit.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm text-gray-400">
  {habit.logsThisWeek} / {habit.frequency} days this week
</p>
<div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
  <div
    className="h-full rounded-full transition-all duration-300"
    style={{
      width: `${Math.min((habit.logsThisWeek / parseInt(habit.frequency)) * 100, 100)}%`,
      backgroundColor: habit.logsThisWeek >= parseInt(habit.frequency) ? '#22c55e' : '#6366f1',
    }}
  />
</div>
            {habit.currentStreak > 0 && (
              <p className="text-sm text-orange-400">
                🔥 {habit.currentStreak} day streak
              </p>
            )}
          </div>
        </div>

        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Check-in button */}
          <button
            onClick={handleCheckIn}
            disabled={habit.loggedToday || checking}
            className={`text-sm px-3 py-1 rounded-lg transition-colors ${
              habit.loggedToday
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {habit.loggedToday ? "Done ✓" : checking ? "..." : "Check in"}
          </button>

          {/* 3-dot menu */}
          <div className="relative">
            <button
              onClick={onToggleMenu}
              className={`text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 ${isMenuOpen ? "bg-gray-100 text-gray-600" : ""}`}
            >
              ⋯
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    onToggleMenu();
                    navigate(`/habits/${habit.id}/edit`);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    onToggleMenu();
                    onDelete(habit.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}