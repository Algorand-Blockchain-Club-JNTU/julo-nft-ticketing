export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Careers</h1>
        <p className="text-lg mb-6">
          Join our team and help shape the future of event ticketing.
        </p>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Open Positions</h2>
            <ul className="space-y-4">
              <li>
                <h3 className="text-xl font-medium">Blockchain Developer</h3>
                <p>Work on cutting-edge NFT and blockchain technologies.</p>
              </li>
              <li>
                <h3 className="text-xl font-medium">Frontend Developer</h3>
                <p>Build amazing user interfaces for our platform.</p>
              </li>
              <li>
                <h3 className="text-xl font-medium">DevOps Engineer</h3>
                <p>Ensure our infrastructure is robust and scalable.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}