import { useState } from "react"
import type { Habit } from "../types/habit"
import { useNavigate } from "react-router-dom"

interface Props {
  habit: Habit
  onDelete: (id: number) => void
}

export default function HabitCard({ habit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <li className="border rounded-lg p-4 shadow-sm relative">
      {/* Habit info */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{habit.name}</h2>
          {habit.description && (
            <p className="text-gray-600 mt-1">{habit.description}</p>
          )}
          <p className="text-sm text-gray-400 mt-2">
            Frequency: {habit.frequency}
          </p>
        </div>

        {/* 3-dot menu button */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
          >
            ⋯
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                    setMenuOpen(false)
                    navigate(`/habits/${habit.id}/edit`)   // ← this is the new line
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onDelete(habit.id)
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}