import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import type {HabitFormData} from "../types/habit";
import {useAuth} from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Step1 from "../components/wizard/Step1";
import Step2 from "../components/wizard/Step2";
import Step3 from "../components/wizard/Step3";
import Step4 from "../components/wizard/Step4";
import Step5 from "../components/wizard/Step5";
import Step6 from "../components/wizard/Step6";
import Step7 from "../components/wizard/Step7";

const TOTAL_STEPS = 7;

export default function EditHabitPage() {
  const navigate = useNavigate();
  const {token} = useAuth();
  const {id} = useParams(); // ← NEW: read :id from URL

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ← NEW: loading state
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<HabitFormData>({
    name: "",
    description: "",
    frequency: "daily",
    durationWeeks: "",
    triggerCue: "",
    microVersion: "",
    obstaclePlan: "",
    socialMode: "private",
    reward: "",
    pactPartnerUsername: "",
  });

  // ← NEW: fetch the habit and pre-fill the form
  useEffect(() => {
    async function fetchHabit() {
      try {
        const response = await fetch(`http://localhost:3001/api/habits/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch habit");
        }

        const habit = await response.json();

        // Pre-fill formData with what came back from the server
        setFormData({
          name: habit.name ?? "",
          description: habit.description ?? "",
          frequency: habit.frequency ?? "daily",
          durationWeeks: habit.durationWeeks ? String(habit.durationWeeks) : "",
          triggerCue: habit.triggerCue ?? "",
          microVersion: habit.microVersion ?? "",
          obstaclePlan: habit.obstaclePlan ?? "",
          socialMode: habit.socialMode ?? "private",
          reward: habit.reward ?? "",
          pactPartnerUsername: "",
        });
      } catch (err) {
        console.error("Error fetching habit:", err);
        alert("Could not load habit. Returning to home.");
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHabit();
  }, [id]);

  function handleNext() {
    setCurrentStep((prev) => prev + 1);
  }

  function handleBack() {
    setCurrentStep((prev) => prev - 1);
  }

  function handleChange(field: keyof HabitFormData, value: string) {
    setFormData((prev) => ({...prev, [field]: value}));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3001/api/habits/${id}`, {
        method: "PUT", // ← PUT instead of POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          frequency: formData.frequency,
          durationWeeks: formData.durationWeeks
            ? parseInt(formData.durationWeeks)
            : null,
          triggerCue: formData.triggerCue,
          microVersion: formData.microVersion,
          obstaclePlan: formData.obstaclePlan,
          socialMode: formData.socialMode,
          reward: formData.reward,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update habit");
      }

      navigate("/home");
    } catch (err) {
      console.error("Error updating habit:", err);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  function renderStep() {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} onChange={handleChange} />;
      case 2:
        return <Step2 formData={formData} onChange={handleChange} />;
      case 3:
        return <Step3 formData={formData} onChange={handleChange} />;
      case 4:
        return <Step4 formData={formData} onChange={handleChange} />;
      case 5:
        return <Step5 formData={formData} onChange={handleChange} />;
      case 6:
        return <Step6 formData={formData} onChange={handleChange} />;
      case 7:
        return <Step7 formData={formData} onChange={handleChange} />;
      default:
        return null;
    }
  }

  // ← NEW: show a loading state while we fetch
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading habit...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8">
          <p className="text-sm text-gray-400 mb-2">
            Step {currentStep} of {TOTAL_STEPS}
          </p>

          <div className="mb-8">{renderStep()}</div>

          <div className="flex justify-between">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  isSubmitting
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
