import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Habit } from "../types/habit";
import HabitCard from "../components/HabitCard";
import DeleteModal from "../components/DeleteModal";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleSignOut() {
    logout();
    navigate("/login");
  }

  function handleCheckIn(id: number) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              loggedToday: true,
              logsThisWeek: h.logsThisWeek + 1,
              currentStreak: h.currentStreak + 1,
            }
          : h,
      ),
    );
  }

  useEffect(() => {
    async function fetchHabits() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch("http://localhost:3001/api/habits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          navigate("/login");
          return;
        }
        const data = await response.json();
        setHabits(data);
      } catch (error) {
        console.error("Failed to fetch habits:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHabits();
  }, []);

  // Called when user confirms delete in the modal
  async function handleConfirmDelete() {
    if (!habitToDelete) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3001/api/habits/${habitToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to delete");

      // Remove it from the list without refetching
      setHabits((prev) => prev.filter((h) => h.id !== habitToDelete.id));
      setHabitToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong. Please try again.");
    }
  }

  if (loading) {
    return <p className="p-8 text-gray-500">Loading your habits...</p>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Today's Habits</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/habits/new")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Habit
          </button>
          <button
            onClick={handleSignOut}
            className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {habits.length === 0 ? (
        <p className="text-gray-500">No habits yet. Time to create one!</p>
      ) : (
        <ul className="space-y-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onDelete={(id) => {
                const habit = habits.find((h) => h.id === id);
                if (habit) setHabitToDelete(habit);
              }}
              onCheckIn={handleCheckIn}
            />
          ))}
        </ul>
      )}

      {habitToDelete && (
        <DeleteModal
          habitName={habitToDelete.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setHabitToDelete(null)}
        />
      )}
    </div>
  );
}
