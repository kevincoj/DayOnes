import ProfileSection from '../components/settings/ProfileSection'
import NotificationSection from '../components/settings/NotificationSection'
import PrivacySection from '../components/settings/PrivacySection'
import SaveButton from '../components/settings/SaveButton'

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          Settings
        </h1>

        <ProfileSection />
        <NotificationSection />
        <PrivacySection />

        <SaveButton />
      </div>
    </div>
  )
}
import SettingsCard from "../components/settings/SettingsCard";

export default function Settings() {
  return (
    <div>
      <h1>Settings</h1>

      <SettingsCard />
    </div>
  );
}