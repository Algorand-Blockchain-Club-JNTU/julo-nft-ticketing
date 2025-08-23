export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>
        <p className="text-lg mb-6">
          Configure your account and application preferences.
        </p>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
            <p>
              Basic settings for your account.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Privacy Settings</h2>
            <p>
              Control your privacy and data sharing preferences.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Advanced Settings</h2>
            <p>
              Advanced options for power users.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}