import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { HabitFormData } from "../types/habit";
import { useAuth } from "../context/AuthContext";
import Step1 from "../components/wizard/Step1";
import Step2 from "../components/wizard/Step2";
import Step3 from "../components/wizard/Step3";
import Step4 from "../components/wizard/Step4";
import Step5 from "../components/wizard/Step5";
import Step6 from "../components/wizard/Step6";
import Step7 from "../components/wizard/Step7";

const TOTAL_STEPS = 7;

export default function HabitWizard() {
  const navigate = useNavigate();
  const { token } = useAuth();

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Which step are we on? Start at 1.
  const [currentStep, setCurrentStep] = useState(1);

  // All the form data lives here in the parent
  const [formData, setFormData] = useState<HabitFormData>({
    name: "",
    description: "",
    frequency: "",
    durationWeeks: "",
    triggerCue: "",
    microVersion: "",
    obstaclePlan: "",
    socialMode: "private",
    reward: "",
  });

  // Move forward one step
  function handleNext() {
    setCurrentStep((prev) => prev + 1);
  }

  // Move back one step
  function handleBack() {
    setCurrentStep((prev) => prev - 1);
  }

  function handleChange(field: keyof HabitFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // Called when the user submits on the last step
  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3001/api/habits", {
        method: "POST",
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
        throw new Error("Failed to create habit");
      }

      navigate("/home");
    } catch (err) {
      console.error("Error creating habit:", err);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false); // re-enable if it failed so they can retry
    }
  }

  function isStepValid() {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== "";
      case 2:
        return (
          formData.frequency !== "" &&
          Number(formData.frequency) >= 1 &&
          Number(formData.frequency) <= 7
        );
      default:
        return true;
    }
  }
  // Render the right step based on currentStep
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8">
        {/* Progress indicator */}
        <p className="text-sm text-gray-400 mb-2">
          Step {currentStep} of {TOTAL_STEPS}
        </p>

        {/* The current step's content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Navigation buttons */}
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
              disabled={!isStepValid()}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                isStepValid()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
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
              {isSubmitting ? "Creating..." : "Create Habit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
