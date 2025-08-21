export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Julo NFT Ticketing</h1>
        <p className="text-lg mb-6">
          Julo NFT Ticketing is a revolutionary platform that combines blockchain technology
          with event management to create unique, verifiable digital tickets.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>
              To provide secure, transparent, and innovative ticketing solutions
              for events worldwide using NFT technology.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Technology</h2>
            <p>
              Built on Algorand blockchain with IPFS for metadata storage,
              ensuring immutability and decentralization.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}