export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">System Status</h1>
        <p className="text-lg mb-6">
          Check the current status of our services and systems.
        </p>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">API Status</h2>
            <p>
              All systems are operational.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Blockchain Status</h2>
            <p>
              Algorand network is running smoothly.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">IPFS Status</h2>
            <p>
              IPFS network is fully operational.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}