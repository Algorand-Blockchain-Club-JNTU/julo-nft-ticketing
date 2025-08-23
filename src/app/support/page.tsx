export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Support Center</h1>
        <p className="text-lg mb-6">
          Need help? Find answers to common questions or contact our support team.
        </p>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p>
              Learn how to create your account, purchase tickets, and manage your events.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
            <p>
              Common issues and solutions for using our platform.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
            <p>
              Can't find what you're looking for? Reach out to our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}