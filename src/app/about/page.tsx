export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-10">
          About Julo NFT Ticketing
        </h1>
        <p className="text-lg md:text-xl mb-10 leading-relaxed">
          Julo NFT Ticketing is a revolutionary platform that combines blockchain
          technology with event management to create unique, verifiable digital
          tickets.
        </p>

        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p className="leading-relaxed">
              To provide secure, transparent, and innovative ticketing solutions
              for events worldwide using NFT technology.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Technology</h2>
            <p className="leading-relaxed">
              Built on Algorand blockchain with IPFS for metadata storage,
              ensuring immutability and decentralization.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
