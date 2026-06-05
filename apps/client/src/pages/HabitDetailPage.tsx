import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import type {PartnerUser} from "../types/habit";
import type {Habit} from "../types/habit";
import Navbar from "../components/Navbar";
import PactIcon from "../components/PactIcon";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface CalendarProps {
  logDates: string[];
  createdAt: string;
  onLogDate: (date: string) => void;
  onRemoveDate: (date: string) => void;
}

interface ReadOnlyCalendarProps {
  logDates: string[];
  createdAt: string;
}

function HabitCalendar({
  logDates,
  createdAt,
  onLogDate,
  onRemoveDate,
}: CalendarProps) {
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-CA");
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const logSet = new Set(logDates);
  const createdStr = new Date(createdAt).toLocaleDateString("en-CA");
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const isNextDisabled =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (isNextDisabled) return;
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
    setSelectedDay(null);
  }

  function handleDayClick(
    dateStr: string,
    isFuture: boolean,
    isBeforeStart: boolean
  ) {
    if (isFuture || isBeforeStart) return;
    setSelectedDay((prev) => (prev === dateStr ? null : dateStr));
  }

  const isLogged = selectedDay ? logSet.has(selectedDay) : false;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1 px-2 hover:bg-gray-100 rounded text-gray-500"
        >
          ←
        </button>
        <span className="font-medium text-gray-700">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          disabled={isNextDisabled}
          className="p-1 px-2 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({length: firstDay}).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({length: daysInMonth}).map((_, i) => {
          const day = i + 1;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          const isFuture = dateStr > todayStr;
          const isBeforeStart = dateStr < createdStr;
          const isLoggedDay = logSet.has(dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = selectedDay === dateStr;
          const isClickable = !isFuture && !isBeforeStart;

          return (
            <button
              key={day}
              onClick={() => handleDayClick(dateStr, isFuture, isBeforeStart)}
              disabled={!isClickable}
              className={[
                "aspect-square rounded-md text-xs flex items-center justify-center transition-all",
                isLoggedDay ? "bg-green-400 text-white font-medium" : "",
                isToday && !isLoggedDay
                  ? "ring-2 ring-blue-400 text-gray-700"
                  : "",
                isSelected
                  ? "ring-2 ring-offset-1 ring-gray-400 scale-110"
                  : "",
                isClickable && !isLoggedDay
                  ? "hover:bg-green-100 text-gray-700 cursor-pointer"
                  : "",
                isClickable && isLoggedDay
                  ? "hover:bg-green-500 cursor-pointer"
                  : "",
                !isClickable ? "text-gray-200 cursor-default" : "",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {new Date(selectedDay + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          {isLogged ? (
            <button
              onClick={() => {
                onRemoveDate(selectedDay);
                setSelectedDay(null);
              }}
              className="text-sm px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
              Remove check-in
            </button>
          ) : (
            <button
              onClick={() => {
                onLogDate(selectedDay);
                setSelectedDay(null);
              }}
              className="text-sm px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              Check in for this day
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PartnerCalendar({logDates, createdAt}: ReadOnlyCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const logSet = new Set(logDates);
  const todayStr = today.toLocaleDateString("en-CA");
  const createdStr = new Date(createdAt).toLocaleDateString("en-CA");
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const isNextDisabled =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (isNextDisabled) return;
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1 px-2 hover:bg-gray-100 rounded text-gray-500"
        >
          ←
        </button>
        <span className="font-medium text-gray-700">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          disabled={isNextDisabled}
          className="p-1 px-2 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({length: firstDay}).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({length: daysInMonth}).map((_, i) => {
          const day = i + 1;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          const isFuture = dateStr > todayStr;
          const isBeforeStart = dateStr < createdStr;
          const isLoggedDay = logSet.has(dateStr);
          const isToday = dateStr === todayStr;

          return (
            <div
              key={day}
              className={[
                "aspect-square rounded-md text-xs flex items-center justify-center",
                isLoggedDay ? "bg-purple-400 text-white font-medium" : "",
                isToday && !isLoggedDay
                  ? "ring-2 ring-blue-400 text-gray-700"
                  : "",
                isFuture || isBeforeStart ? "text-gray-200" : "text-gray-700",
              ].join(" ")}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HabitDetailPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const {user} = useAuth();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const [showPactInvite, setShowPactInvite] = useState(false);
  const [pactSearch, setPactSearch] = useState("");
  const [pactResults, setPactResults] = useState<PartnerUser[]>([]);
  const [isPactSearching, setIsPactSearching] = useState(false);
  const [pactMessage, setPactMessage] = useState("");

  const [partnerLogs, setPartnerLogs] = useState<string[]>([]);
  const [partnerUsername, setPartnerUsername] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHabit() {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/habits/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      if (!res.ok) {
        navigate("/home");
        return;
      }
      const data = await res.json();
      setHabit(data);
      setLoading(false);
    }
    fetchHabit();
  }, [id]);

  useEffect(() => {
    if (!habit || habit.socialMode !== "pact") return;

    async function fetchPartnerLogs() {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/pacts/habit/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      if (!res.ok) return;
      const data = await res.json();
      setPartnerLogs(data.partnerLogs ?? []);
      setPartnerUsername(data.partnerUsername ?? null);
    }
    fetchPartnerLogs();
  }, [habit]);

  async function handleCheckIn(dateStr?: string) {
    if (!habit) return;
    setChecking(true);
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:3001/api/habits/${habit.id}/log`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dateStr ? {date: dateStr} : {}),
      }
    );
    if (res.ok) {
      const isToday =
        !dateStr || dateStr === new Date().toISOString().split("T")[0];
      setHabit((prev) =>
        prev
          ? {
              ...prev,
              logDates: [
                ...prev.logDates,
                dateStr ?? new Date().toISOString().split("T")[0],
              ],
              loggedToday: isToday ? true : prev.loggedToday,
              totalCompleted: prev.totalCompleted + 1,
              currentStreak: isToday
                ? prev.currentStreak + 1
                : prev.currentStreak,
            }
          : prev
      );
    }
    setChecking(false);
  }

  async function handleRemoveDate(dateStr: string) {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:3001/api/habits/${habit!.id}/log`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({date: dateStr}),
      }
    );
    if (res.ok) {
      const isToday = dateStr === new Date().toLocaleDateString("en-CA");
      setHabit((prev) =>
        prev
          ? {
              ...prev,
              logDates: prev.logDates.filter((d) => d !== dateStr),
              loggedToday: isToday ? false : prev.loggedToday,
              totalCompleted: prev.totalCompleted - 1,
              currentStreak: isToday
                ? Math.max(0, prev.currentStreak - 1)
                : prev.currentStreak,
            }
          : prev
      );
    }
  }

  useEffect(() => {
    if (pactSearch.trim() === "") {
      setPactResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      setIsPactSearching(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3001/api/users/search?q=${pactSearch}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          }
        );
        const data = await res.json();
        setPactResults(data);
      } finally {
        setIsPactSearching(false);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [pactSearch]);

  async function handleSendPactInvite(partnerUsername: string) {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3001/api/pacts/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({habitId: habit!.id, partnerUsername}),
    });

    if (res.ok) {
      await fetch(`http://localhost:3001/api/habits/${habit!.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({...habit, socialMode: "pact"}),
      });
      setHabit((prev) => (prev ? {...prev, socialMode: "pact"} : prev));
      setPactMessage(`Pact invite sent to @${partnerUsername}!`);
      setPactSearch("");
      setPactResults([]);
      setShowPactInvite(false);
    } else {
      const data = await res.json();
      setPactMessage(data.error ?? "Something went wrong.");
    }
  }

  if (loading || !habit) return <p className="p-8 text-gray-500">Loading...</p>;

  const startDate = new Date(habit.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isPact = habit.socialMode === "pact";

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={() => navigate("/home")}
              className="text-sm text-gray-400 hover:text-gray-600 mb-2 block"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-800">{habit.name}</h1>
              {isPact && (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                  <PactIcon />
                  Pact
                </span>
              )}
              {!isPact && habit.userId === user?.id && (
                <button
                  onClick={() => setShowPactInvite((prev) => !prev)}
                  className="text-xs font-semibold px-3 py-1 border border-purple-300 text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                >
                  + Start a Pact
                </button>
              )}
            </div>
            {habit.description && (
              <p className="text-gray-500 mt-1">{habit.description}</p>
            )}
          </div>
          <button
            onClick={() => handleCheckIn()}
            disabled={habit.loggedToday || checking}
            className={`text-sm px-4 py-2 rounded-lg transition-colors font-medium ${
              habit.loggedToday
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {habit.loggedToday ? "Done today ✓" : checking ? "..." : "Check in"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">
              🔥 {habit.currentStreak}
            </p>
            <p className="text-xs text-gray-500 mt-1">day streak</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">
              {habit.totalCompleted}
            </p>
            <p className="text-xs text-gray-500 mt-1">total check-ins</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {habit.logsThisWeek}/{habit.frequency}
            </p>
            <p className="text-xs text-gray-500 mt-1">days this week</p>
          </div>
        </div>

        {showPactInvite && (
          <div className="border border-purple-200 rounded-xl p-5 bg-purple-50/40 space-y-3">
            <h2 className="text-sm font-semibold text-purple-700">
              Invite a partner to this Pact
            </h2>
            <input
              type="text"
              placeholder="Search by username..."
              value={pactSearch}
              onChange={(e) => setPactSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {isPactSearching && (
              <p className="text-xs text-gray-400">Searching...</p>
            )}
            {pactResults.length > 0 && (
              <ul className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100 bg-white">
                {pactResults.map((u) => (
                  <li key={u.id}>
                    <button
                      onClick={() => handleSendPactInvite(u.username)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      @{u.username}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {pactMessage && (
              <p className="text-xs text-purple-600">{pactMessage}</p>
            )}
          </div>
        )}

        {/* Calendar — side by side if pact, single if not */}
        {isPact ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-600 mb-4">You</h2>
              <HabitCalendar
                logDates={habit.logDates}
                createdAt={habit.createdAt}
                onLogDate={handleCheckIn}
                onRemoveDate={handleRemoveDate}
              />
            </div>
            <div className="border border-purple-200 rounded-xl p-5 bg-purple-50/30">
              <h2 className="text-sm font-semibold text-purple-600 mb-4">
                {partnerUsername ? `@${partnerUsername}` : "Partner"}
              </h2>
              {partnerUsername ? (
                <PartnerCalendar
                  logDates={partnerLogs}
                  createdAt={habit.createdAt}
                />
              ) : (
                <p className="text-sm text-gray-400 text-center mt-8">
                  No partner yet. Your invite may still be pending.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-600 mb-4">
              Check-in History
            </h2>
            <HabitCalendar
              logDates={habit.logDates}
              createdAt={habit.createdAt}
              onLogDate={handleCheckIn}
              onRemoveDate={handleRemoveDate}
            />
          </div>
        )}

        {/* Goal details */}
        <div className="border rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-600">Goals</h2>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Frequency</span>
            <span className="font-medium">{habit.frequency} days / week</span>
          </div>
          {habit.durationWeeks && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium">{habit.durationWeeks} weeks</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Started</span>
            <span className="font-medium">{startDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mode</span>
            <span className="font-medium capitalize">{habit.socialMode}</span>
          </div>
        </div>

        {/* Habit anchors */}
        {(habit.triggerCue || habit.microVersion || habit.reward) && (
          <div className="border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-600">
              Habit Anchors
            </h2>
            {habit.triggerCue && (
              <div>
                <p className="text-xs text-gray-400 mb-1">After I...</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                  {habit.triggerCue}
                </p>
              </div>
            )}
            {habit.microVersion && (
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  If I'm busy, I'll at least...
                </p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                  {habit.microVersion}
                </p>
              </div>
            )}
            {habit.reward && (
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  When I hit a milestone, I will...
                </p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                  {habit.reward}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
