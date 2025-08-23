export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>
        <p className="text-lg mb-6">
          Comprehensive guides and API documentation for developers and users.
        </p>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p>
              Learn how to integrate with our platform and start using NFT tickets.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
            <p>
              Detailed API documentation for all endpoints and features.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">SDKs and Libraries</h2>
            <p>
              Download our SDKs and libraries for easy integration.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}