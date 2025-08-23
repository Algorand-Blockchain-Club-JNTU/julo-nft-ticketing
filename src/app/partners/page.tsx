export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Our Partners</h1>
        <p className="text-lg mb-6">
          We collaborate with leading organizations to bring you the best event experiences.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Technology Partners</h2>
            <ul className="space-y-2">
              <li>Algorand Blockchain</li>
              <li>IPFS</li>
              <li>Supabase</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Event Partners</h2>
            <ul className="space-y-2">
              <li>Local Event Organizers</li>
              <li>Music Festivals</li>
              <li>Sports Events</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}