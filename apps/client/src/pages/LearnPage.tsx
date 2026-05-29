import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// ─── useScrollReveal hook ─────────────────────────────────────────────────────

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ─── AnimatedSection ──────────────────────────────────────────────────────────

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, visible } = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const habitLoopSteps = [
  {
    number: "01",
    title: "Cue",
    description: "A trigger that kicks off the behavior — a time, place, emotion, or existing habit.",
    example: "You pour your morning coffee.",
    bg: "bg-blue-50",
    border: "border-blue-200",
    numColor: "text-blue-500",
  },
  {
    number: "02",
    title: "Routine",
    description: "The behavior itself. The action you're trying to wire into your life.",
    example: "You sit down and read for 10 minutes.",
    bg: "bg-purple-50",
    border: "border-purple-200",
    numColor: "text-purple-500",
  },
  {
    number: "03",
    title: "Reward",
    description: "The benefit your brain registers. Over time it starts craving the cue.",
    example: "You feel calm and focused for the day.",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    numColor: "text-indigo-500",
  },
];

const myths = [
  {
    myth: "You need motivation to build habits.",
    reality: "Motivation is unreliable. What works is a system designed to make the habit easy even when you don't feel like it.",
  },
  {
    myth: "It takes exactly 21 days.",
    reality: "Research shows habit formation takes 18–254 days depending on the person. Consistency matters more than the timeline.",
  },
  {
    myth: "Missing a day means you've failed.",
    reality: "Missing once has almost no long-term impact. What matters is getting back immediately. Missing twice is where habits unravel.",
  },
  {
    myth: "Willpower is the key ingredient.",
    reality: "The most consistent people aren't more disciplined — they've designed their environment so habits are the path of least resistance.",
  },
];

const tips = [
  { icon: "🎯", title: "Start absurdly small", description: "Two minutes counts. Reduce friction until starting feels effortless." },
  { icon: "📍", title: "Stack onto routines", description: "'After I do X, I will do Y.' Pair new habits with ones you already have." },
  { icon: "👁️", title: "Make the cue visible", description: "Environment design beats willpower. Put cues where you'll see them." },
  { icon: "📋", title: "Plan for obstacles", description: "If-then plans dramatically improve follow-through. Write yours in the wizard." },
  { icon: "🎉", title: "Celebrate small wins", description: "A moment of pride after each check-in accelerates the wiring process." },
  { icon: "🔄", title: "Never miss twice", description: "Missing once is an accident. Missing twice is a new pattern forming." },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const [openMyth, setOpenMyth] = useState<number | null>(null);
  const navigate = useNavigate();

  function handleMythClick(index: number) {
    setOpenMyth((prev) => (prev === index ? null : index));
  }

  return (
    <div>
      <Navbar />

      <div className="p-8 max-w-2xl mx-auto">

        {/* ── Hero ── */}
        <AnimatedSection>
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-blue-500 font-medium mb-2">
              Habit Academy
            </p>
            <h1 className="text-3xl font-bold mb-3">
              The science of habits.
            </h1>
          </div>
        </AnimatedSection>

        {/* ── Habit Loop ── */}
        <AnimatedSection>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-1">The habit loop</h2>
            <p className="text-gray-500 text-sm mb-5">
              Every habit follows the same three-step cycle.
            </p>
            <div className="space-y-3">
              {habitLoopSteps.map((step, i) => (
                <AnimatedSection key={step.number} delay={i * 100}>
                  <div className={`border rounded-xl p-5 ${step.bg} ${step.border}`}>
                    <div className="flex items-start gap-4">
                      <span className={`text-2xl font-bold ${step.numColor} leading-none mt-0.5`}>
                        {step.number}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-2">{step.description}</p>
                        <p className="text-xs text-gray-400 italic">eg. {step.example}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <hr className="border-gray-100 mb-10" />

        {/* ── Why habits fail ── */}
        <AnimatedSection>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-1">Why most habits fail</h2>
            <p className="text-gray-500 text-sm mb-5">Tap each myth to see the reality.</p>
            <div className="space-y-2">
              {myths.map((item, index) => (
                <AnimatedSection key={index} delay={index * 80}>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleMythClick(index)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-red-400 uppercase tracking-wide flex-shrink-0">
                          Myth
                        </span>
                        <span className="text-sm text-gray-800">{item.myth}</span>
                      </div>
                      <span className="text-gray-400 text-lg ml-4 flex-shrink-0">
                        {openMyth === index ? "−" : "+"}
                      </span>
                    </button>
                    {openMyth === index && (
                      <div className="px-5 pb-4 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs font-semibold text-green-500 uppercase tracking-wide mt-3 mb-1">
                          Reality
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.reality}</p>
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <hr className="border-gray-100 mb-10" />

        {/* ── Relapse ── */}
        <AnimatedSection>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-1">Relapse is part of it</h2>
            <p className="text-gray-500 text-sm mb-5">
              Missing days doesn't mean failure. What separates lasting habits is recovery speed.
            </p>
            <div className="space-y-3">
              <AnimatedSection delay={100}>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <p className="text-sm text-blue-800 leading-relaxed">
                    <span className="font-semibold">The rule:</span> never miss twice in a row. One missed day is an accident. Two is the start of a new pattern.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={200}>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
                  <p className="text-sm text-purple-800 leading-relaxed">
                    <span className="font-semibold">After you miss:</span> use DayOnes' obstacle plan. Write an if-then response so you're ready next time — that's exactly what Step 5 in the habit wizard is for.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </AnimatedSection>

        <hr className="border-gray-100 mb-10" />

        {/* ── Tips ── */}
        <AnimatedSection>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-1">Habits that actually stick</h2>
            <p className="text-gray-500 text-sm mb-5">Six principles backed by behavioral science.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tips.map((tip, i) => (
                <AnimatedSection key={tip.title} delay={i * 80}>
                  <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                    <div className="text-2xl mb-3">{tip.icon}</div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{tip.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{tip.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        </AnimatedSection>


        {/* ── CTA ── */}
        <AnimatedSection>
          <section className="text-center py-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              "Every action is a vote for the person<br />you want to become."
            </h2>
            <button
              onClick={() => navigate("/habits/new")}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Create a Habit →
            </button>
          </section>
        </AnimatedSection>

      </div>
    </div>
  );
}