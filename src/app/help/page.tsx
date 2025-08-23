export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Help Center</h1>
        <p className="text-lg mb-6">
          Find answers to your questions and get help with our platform.
        </p>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Getting Started Guide</h2>
            <p>
              Learn the basics of using Julo NFT Ticketing.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
            <p>
              Solutions to common issues and problems.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Video Tutorials</h2>
            <p>
              Watch step-by-step guides on how to use our features.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}