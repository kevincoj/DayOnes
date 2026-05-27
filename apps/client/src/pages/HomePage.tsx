import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { Habit } from "../types/habit"
import HabitCard from "../components/HabitCard"
import DeleteModal from "../components/DeleteModal"

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchHabits() {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }
      try {
        const response = await fetch("http://localhost:3001/api/habits", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          navigate("/login")
          return
        }
        const data = await response.json()
        setHabits(data)
      } catch (error) {
        console.error("Failed to fetch habits:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHabits()
  }, [])

  // Called when user confirms delete in the modal
  async function handleConfirmDelete() {
    if (!habitToDelete) return

    const token = localStorage.getItem("token")
    try {
      const response = await fetch(
        `http://localhost:3001/api/habits/${habitToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!response.ok) throw new Error("Failed to delete")

      // Remove it from the list without refetching
      setHabits((prev) => prev.filter((h) => h.id !== habitToDelete.id))
      setHabitToDelete(null)
    } catch (err) {
      console.error("Delete failed:", err)
      alert("Something went wrong. Please try again.")
    }
  }

  if (loading) {
    return <p className="p-8 text-gray-500">Loading your habits...</p>
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Today's Habits</h1>

      {habits.length === 0 ? (
        <p className="text-gray-500">No habits yet. Time to create one!</p>
      ) : (
        <ul className="space-y-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onDelete={(id) => {
                const habit = habits.find((h) => h.id === id)
                if (habit) setHabitToDelete(habit)
              }}
            />
          ))}
        </ul>
      )}

      {/* Modal renders on top of everything when habitToDelete is set */}
      {habitToDelete && (
        <DeleteModal
          habitName={habitToDelete.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setHabitToDelete(null)}
        />
      )}
    </div>
  )
}