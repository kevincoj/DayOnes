import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Habit {
  id: number;
  name: string;
  description: string | null;
  frequency: string;
  triggerCue: string | null;
  socialMode: string;
  isActive: boolean;
}

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHabits() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/habits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  if (loading) {
    return <p className="p-8 text-gray-500">Loading your habits...</p>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Today's Habits</h1>

      {habits.length === 0 ? (
        <p className="text-gray-500">No habits yet. Time to create one!</p>
      ) : (
        <ul className="space-y-4">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <h2 className="text-xl font-semibold">{habit.name}</h2>
              {habit.description && (
                <p className="text-gray-600 mt-1">{habit.description}</p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                Frequency: {habit.frequency}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}