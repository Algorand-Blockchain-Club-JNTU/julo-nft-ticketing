export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <p className="text-lg mb-6">
          Manage your events, tickets, and account settings.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Events</h2>
            <p>
              View and manage the events you've created.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Tickets</h2>
            <p>
              See all the tickets you've purchased.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}