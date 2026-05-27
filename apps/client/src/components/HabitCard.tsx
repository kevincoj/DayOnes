import { useState } from "react";
import type { Habit } from "../types/habit";
import { useNavigate } from "react-router-dom";

interface Props {
  habit: Habit;
  onDelete: (id: number) => void;
  onCheckIn: (id: number) => void;
}

export default function HabitCard({ habit, onDelete, onCheckIn }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  async function handleCheckIn() {
    setChecking(true);
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:3001/api/habits/${habit.id}/log`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (res.ok) {
      onCheckIn(habit.id);
    }
    setChecking(false);
  }

  return (
    <li className="border rounded-lg p-4 shadow-sm relative">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{habit.name}</h2>
          {habit.description && (
            <p className="text-gray-600 mt-1">{habit.description}</p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm text-gray-400">
              {habit.logsThisWeek} / {habit.frequency} days this week
            </p>
            {habit.currentStreak > 0 && (
              <p className="text-sm text-orange-400">
                🔥 {habit.currentStreak} day streak
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
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
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
            >
              ⋯
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(`/habits/${habit.id}/edit`);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
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
