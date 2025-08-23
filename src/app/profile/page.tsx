export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Profile</h1>
        <p className="text-lg mb-6">
          Manage your account settings and preferences.
        </p>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            <p>
              Update your name, email, and other personal details.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Security Settings</h2>
            <p>
              Manage your password and security preferences.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notification Preferences</h2>
            <p>
              Choose how you want to receive notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}