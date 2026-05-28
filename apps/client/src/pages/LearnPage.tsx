import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// ─── Data ────────────────────────────────────────────────────────────────────

const habitLoopSteps = [
  {
    number: "01",
    title: "Cue",
    description:
      "A trigger that kicks off the behavior — a time of day, a place, an emotion, or another habit you already do.",
    example: "You pour your morning coffee.",
    color: "bg-blue-50 border-blue-200",
    numberColor: "text-blue-500",
  },
  {
    number: "02",
    title: "Routine",
    description:
      "The behavior itself. The action you want to build into your life.",
    example: "You sit down and read for 10 minutes.",
    color: "bg-purple-50 border-purple-200",
    numberColor: "text-purple-500",
  },
  {
    number: "03",
    title: "Reward",
    description:
      "The benefit your brain registers. Over time, your brain starts craving the cue because it anticipates the reward.",
    example: "You feel calm and focused for the day.",
    color: "bg-indigo-50 border-indigo-200",
    numberColor: "text-indigo-500",
  },
];

const myths = [
  {
    myth: "You need motivation to build habits.",
    reality:
      "Motivation is unreliable — it comes and goes. What actually works is designing a system that makes the habit easy to do even when you don't feel like it.",
  },
  {
    myth: "It takes 21 days to form a habit.",
    reality:
      "Research suggests habit formation takes anywhere from 18 to 254 days depending on the person and the behavior. There's no magic number — consistency matters more than the timeline.",
  },
  {
    myth: "Missing a day means you've failed.",
    reality:
      "Missing once has almost no impact on long-term habit formation. What matters is getting back on track quickly. Missing twice is where habits start to unravel.",
  },
  {
    myth: "Willpower is the key ingredient.",
    reality:
      "Willpower is a limited resource. The most consistent people aren't more disciplined — they've designed their environment to make habits easier and temptations harder.",
  },
];

const tips = [
  {
    icon: "🎯",
    title: "Start absurdly small",
    description:
      "Two minutes counts. The goal at first is just to show up. Reduce the activation energy until starting feels effortless.",
  },
  {
    icon: "📍",
    title: "Stack onto existing routines",
    description:
      "Pair your new habit with something you already do every day. 'After I pour my coffee, I will...' This is called habit stacking.",
  },
  {
    icon: "👁️",
    title: "Make the cue visible",
    description:
      "Put your running shoes by the door. Leave the book on the pillow. Environment design beats willpower every time.",
  },
  {
    icon: "📋",
    title: "Plan for obstacles",
    description:
      "Write down: 'If X happens, I will do Y instead.' Research shows if-then plans dramatically improve follow-through.",
  },
  {
    icon: "🎉",
    title: "Celebrate small wins",
    description:
      "Your brain learns through emotion. A small moment of pride or satisfaction after completing a habit accelerates the wiring process.",
  },
  {
    icon: "🔄",
    title: "Never miss twice",
    description:
      "Missing once is an accident. Missing twice is starting a new habit — of not doing the thing. Get back on track the very next day.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const [openMyth, setOpenMyth] = useState<number | null>(null);
  const navigate = useNavigate();

  // When a myth is clicked, open it — or close it if it's already open
  function handleMythClick(index: number) {
    setOpenMyth((prev) => (prev === index ? null : index));
  }

  return (
    <div>
      <Navbar />

      <div className="p-8 max-w-2xl mx-auto">

        {/* ── Hero ── */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-blue-500 font-medium mb-2">
            Habit Academy
          </p>
          <h1 className="text-3xl font-bold mb-3">
            The science of habits — simplified.
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-5 max-w-lg">
            Habits aren't about willpower or discipline. They're about
            understanding how your brain works — and designing your life to work
            with it.
          </p>
          <button
            onClick={() => navigate("/habits/new")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Build Your First Habit →
          </button>
        </div>

        <hr className="border-gray-100 mb-10" />

        {/* ── What is a habit? ── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-1">What is a habit?</h2>
          <p className="text-gray-500 text-sm mb-6">
            Every habit follows the same three-step loop. Understanding this
            loop is the first step to changing your behavior.
          </p>

          <div className="space-y-3">
            {habitLoopSteps.map((step) => (
              <div
                key={step.number}
                className={`border rounded-xl p-5 ${step.color}`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`text-2xl font-bold ${step.numberColor} leading-none mt-0.5`}
                  >
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      {step.description}
                    </p>
                    <p className="text-xs text-gray-400 italic">
                      Example: {step.example}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-100 mb-10" />

        {/* ── Why Most Habits Fail ── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-1">Why most habits fail</h2>
          <p className="text-gray-500 text-sm mb-6">
            Tap each myth to see the reality. These misconceptions are the
            reason most people give up too soon.
          </p>

          <div className="space-y-2">
            {myths.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Clickable header row */}
                <button
                  onClick={() => handleMythClick(index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                      Myth
                    </span>
                    <span className="text-sm text-gray-800">{item.myth}</span>
                  </div>
                  <span className="text-gray-400 text-lg ml-4 flex-shrink-0">
                    {openMyth === index ? "−" : "+"}
                  </span>
                </button>

                {/* Expandable reality panel */}
                {openMyth === index && (
                  <div className="px-5 pb-4 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs font-semibold text-green-500 uppercase tracking-wide mt-3 mb-1">
                      Reality
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.reality}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-100 mb-10" />

        {/* ── Relapse & Recovery ── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-1">Relapse is part of it</h2>
          <p className="text-gray-500 text-sm mb-6">
            Missing days doesn't mean you've failed. It means you're human.
            What separates people who build lasting habits is how fast they
            recover.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              <span className="font-semibold">The most important rule:</span>{" "}
              never miss twice in a row. One missed day is an accident. Two
              missed days is the start of a new pattern.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
            <p className="text-sm text-purple-800 leading-relaxed">
              <span className="font-semibold">After you miss, ask:</span> what
              got in the way? Use DayOnes' obstacle planning to write an
              if-then plan so you're prepared next time. That's the whole point
              of the relapse prevention step in the habit wizard.
            </p>
          </div>
        </section>

        <hr className="border-gray-100 mb-10" />

        {/* ── Tips ── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-1">
            Habits that actually stick
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Six principles backed by behavioral science. Apply any one of these
            and your habit becomes significantly more likely to last.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map((tip) => (
              <div
                key={tip.title}
                className="border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <div className="text-2xl mb-3">{tip.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {tip.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-100 mb-10" />

        {/* ── Final CTA ── */}
        <section className="text-center py-4">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
            Ready to start?
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            "Every action is a vote for the <br />
            person you want to become."
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Start small. Stay consistent. The identity follows.
          </p>
          <button
            onClick={() => navigate("/habits/new")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Create a Habit →
          </button>
        </section>

      </div>
    </div>
  );
}