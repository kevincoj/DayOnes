import { type ReactNode, useState } from "react";

type ToggleProps = {
	checked: boolean;
	onChange: (checked: boolean) => void;
};

type RowProps = {
	label: string;
	sub?: string;
	last?: boolean;
	children: ReactNode;
};

type SectionProps = {
	title: string;
	children: ReactNode;
};

type ChipProps = {
	label: string;
	active: boolean;
	onClick: () => void;
};

type DangerButtonProps = {
	label: string;
	onClick: () => void;
};

const Toggle = ({ checked, onChange }: ToggleProps) => (
	<button
		onClick={() => onChange(!checked)}
		style={{
			width: 40,
			height: 22,
			borderRadius: 11,
			border: "none",
			cursor: "pointer",
			background: checked ? "var(--accent)" : "var(--border)",
			position: "relative",
			padding: 0,
			flexShrink: 0,
		}}
	>
		<span
			style={{
				position: "absolute",
				top: 3,
				left: checked ? 21 : 3,
				width: 16,
				height: 16,
				borderRadius: "50%",
				background: "var(--bg)",
				transition: "left 0.2s",
				display: "block",
			}}
		/>
	</button>
);

const Row = ({ label, sub, last, children }: RowProps) => (
	<div
		style={{
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "12px 16px",
			borderBottom: last ? "none" : "0.5px solid var(--border)",
		}}
	>
		<div>
			<div style={{ fontSize: 14, color: "var(--text-h)" }}>{label}</div>
			{sub && (
				<div style={{ fontSize: 11, color: "var(--text)", marginTop: 2 }}>
					{sub}
				</div>
			)}
		</div>
		{children}
	</div>
);

const Section = ({ title, children }: SectionProps) => (
	<div style={{ marginBottom: "1.25rem" }}>
		<p
			style={{
				fontSize: 11,
				fontWeight: 600,
				letterSpacing: "0.1em",
				textTransform: "uppercase",
				color: "var(--text)",
				margin: "0 0 0.5rem 4px",
			}}
		>
			{title}
		</p>
		<div
			style={{
				background: "var(--bg)",
				border: "0.5px solid var(--border)",
				borderRadius: 12,
				overflow: "hidden",
			}}
		>
			{children}
		</div>
	</div>
);

const Chip = ({ label, active, onClick }: ChipProps) => (
	<button
		onClick={onClick}
		style={{
			fontSize: 12,
			padding: "3px 10px",
			borderRadius: 20,
			cursor: "pointer",
			fontFamily: "inherit",
			border: active ? `1.5px solid var(--accent)` : "0.5px solid var(--border)",
			background: active ? "var(--accent-bg)" : "transparent",
			color: active ? "var(--accent)" : "var(--text)",
			fontWeight: active ? 600 : 400,
		}}
	>
		{label}
	</button>
);

const DangerButton = ({ label, onClick }: DangerButtonProps) => (
	<button
		onClick={onClick}
		style={{
			fontSize: 12,
			padding: "4px 12px",
			borderRadius: 8,
			cursor: "pointer",
			fontFamily: "inherit",
			border: "0.5px solid var(--border)",
			background: "transparent",
			color: "var(--text-h)",
		}}
	>
		{label}
	</button>
);

const greetings = ["hey", "hi", "hello", "howdy", "yo"];
const randomGreeting = () => greetings[Math.floor(Math.random() * greetings.length)];

export default function Settings() {
	const [name, setName] = useState("Alex");
	const [email, setEmail] = useState("alex@email.com");
	
	// Habit Tracking
	const [habitCategories, setHabitCategories] = useState("health,productivity,learning");
	const [allowArchive, setAllowArchive] = useState(true);
	const [defaultDifficulty, setDefaultDifficulty] = useState("medium");
	
	// Goal Tracking
	const [goalTracking, setGoalTracking] = useState(true);
	const [completionTarget, setCompletionTarget] = useState("80");
	
	// Statistics & Display
	const [showStats, setShowStats] = useState(true);
	const [streaks, setStreaks] = useState(true);
	const [weeklyDigest, setWeeklyDigest] = useState(true);
	const [showHeatmap, setShowHeatmap] = useState(true);
	
	// Notifications
	const [reminders, setReminders] = useState(true);
	const [reminderTime, setReminderTime] = useState("08:00");
	const [missedDayAlert, setMissedDayAlert] = useState(true);
	const [weekStart, setWeekStart] = useState("monday");
	
	// Display
	const [theme, setTheme] = useState("system");
	const [defaultView, setDefaultView] = useState("weekly");
	
	const [saved, setSaved] = useState(false);
	const [greeting] = useState(randomGreeting());

	const save = () => {
		setSaved(true);
		setTimeout(() => setSaved(false), 2200);
	};

	const inputStyle = {
		border: "0.5px solid var(--border)",
		background: "var(--bg)",
		textAlign: "right" as const,
		fontSize: 14,
		color: "var(--text)",
		outline: "none",
		padding: "4px 8px",
		borderRadius: 4,
		fontFamily: "inherit",
	};

	return (
		<div style={{ maxWidth: 520, margin: "0 auto", padding: "1.75rem 1rem 3rem", fontFamily: "var(--sans)" }}>
			<h2 style={{ margin: "0 0 0.2rem", fontSize: 24, fontWeight: 500, color: "var(--text-h)" }}>Settings</h2>
			<p style={{ margin: "0 0 1.5rem", fontSize: 14, color: "var(--text)" }}>
				{greeting} {name || "there"}, configure your habits below
			</p>

			<Section title="Profile">
				<Row label="Name" sub="personalize your experience">
					<input value={name} onChange={event => setName(event.target.value)} placeholder="your name" style={{...inputStyle, width: 160}} />
				</Row>
				<Row label="Email" sub="for digests and notifications" last>
					<input value={email} onChange={event => setEmail(event.target.value)} style={{...inputStyle, width: 160}} />
				</Row>
			</Section>

			<Section title="Habit Tracking">
				<Row label="Habit categories" sub="comma-separated tags">
					<input value={habitCategories} onChange={event => setHabitCategories(event.target.value)} placeholder="health, work" style={{...inputStyle, width: 140, fontSize: 12}} />
				</Row>
				<Row label="Default difficulty" sub="when creating habits">
					<div style={{ display: "flex", gap: 4 }}>
						{["easy", "medium", "hard"].map(diff => (
							<Chip key={diff} label={diff} active={defaultDifficulty === diff} onClick={() => setDefaultDifficulty(diff)} />
						))}
					</div>
				</Row>
				<Row label="Allow archiving" sub="hide completed habits" last>
					<Toggle checked={allowArchive} onChange={setAllowArchive} />
				</Row>
			</Section>

			<Section title="Goals">
				<Row label="Track goals" sub="set targets per habit">
					<Toggle checked={goalTracking} onChange={setGoalTracking} />
				</Row>
				<Row label="Completion target" sub={goalTracking ? "weekly target %" : "disabled"} last>
					<input
						type="number"
						min="0"
						max="100"
						value={completionTarget}
						disabled={!goalTracking}
						onChange={event => setCompletionTarget(event.target.value)}
						style={{...inputStyle, width: 60, opacity: goalTracking ? 1 : 0.4, cursor: goalTracking ? "text" : "not-allowed"}}
					/>
				</Row>
			</Section>

			<Section title="Statistics & Display">
				<Row label="Show statistics" sub="habit performance charts">
					<Toggle checked={showStats} onChange={setShowStats} />
				</Row>
				<Row label="Show streaks" sub="consecutive days count">
					<Toggle checked={streaks} onChange={setStreaks} />
				</Row>
				<Row label="Show activity heatmap" sub="visual year overview">
					<Toggle checked={showHeatmap} onChange={setShowHeatmap} />
				</Row>
				<Row label="Default view" sub="when you open app" last>
					<div style={{ display: "flex", gap: 4 }}>
						{["daily", "weekly", "monthly"].map(view => (
							<Chip key={view} label={view} active={defaultView === view} onClick={() => setDefaultView(view)} />
						))}
					</div>
				</Row>
			</Section>

			<Section title="Notifications">
				<Row label="Daily reminders" sub="keep you on track">
					<Toggle checked={reminders} onChange={setReminders} />
				</Row>
				<Row label="Reminder time" sub={reminders ? "when to notify" : "reminders off"}>
					<input
						type="time"
						value={reminderTime}
						disabled={!reminders}
						onChange={event => setReminderTime(event.target.value)}
						style={{ ...inputStyle, width: 80, opacity: reminders ? 1 : 0.4, cursor: reminders ? "text" : "not-allowed" }}
					/>
				</Row>
				<Row label="Weekly digest" sub="sunday progress summary">
					<Toggle checked={weeklyDigest} onChange={setWeeklyDigest} />
				</Row>
				<Row label="Missed day alert" sub="when you skip a habit" last>
					<Toggle checked={missedDayAlert} onChange={setMissedDayAlert} />
				</Row>
			</Section>

			<Section title="Display">
				<Row label="Week starts on">
					<div style={{ display: "flex", gap: 4 }}>
						{["sunday", "monday"].map(day => (
							<Chip key={day} label={day.slice(0, 3)} active={weekStart === day} onClick={() => setWeekStart(day)} />
						))}
					</div>
				</Row>
				<Row label="Theme" last>
					<div style={{ display: "flex", gap: 4 }}>
						{["light", "system", "dark"].map(nextTheme => (
							<Chip key={nextTheme} label={nextTheme} active={theme === nextTheme} onClick={() => setTheme(nextTheme)} />
						))}
					</div>
				</Row>
			</Section>

			<Section title="Data">
				<Row label="Export my data" sub="backup as JSON">
					<button
						onClick={() => alert("exporting habits...")}
						style={{
							fontSize: 12,
							padding: "4px 12px",
							borderRadius: 8,
							cursor: "pointer",
							fontFamily: "inherit",
							border: "0.5px solid var(--border)",
							background: "var(--accent-bg)",
							color: "var(--accent)",
							fontWeight: 500,
							transition: "opacity 0.2s",
						}}
					>
						export
					</button>
				</Row>
				<Row label="Reset all progress" sub="delete all habit logs" last>
					<DangerButton label="reset" onClick={() => confirm("Delete all logs? Habits will remain.") && alert("reset complete.")} />
				</Row>
			</Section>

			<button
				onClick={save}
				style={{
					width: "100%",
					padding: "12px",
					marginTop: "1rem",
					borderRadius: 8,
					border: "none",
					background: saved ? "var(--accent)" : "var(--accent)",
					color: saved ? "var(--text-h)" : "var(--bg)",
					fontWeight: 600,
					fontSize: 14,
					cursor: "pointer",
					fontFamily: "inherit",
					transition: "opacity 0.3s",
					opacity: saved ? 0.8 : 1,
				}}
			>
				{saved ? "✓ Saved" : "Save Settings"}
			</button>
		</div>
	);
}
