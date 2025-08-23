export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">What is Julo NFT Ticketing?</h2>
            <p>
              Julo NFT Ticketing is a platform that uses blockchain technology to create unique, verifiable digital tickets for events.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">How do NFT tickets work?</h2>
            <p>
              NFT tickets are unique digital assets stored on the blockchain, ensuring authenticity and preventing counterfeiting.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Is it secure?</h2>
            <p>
              Yes, our platform uses advanced encryption and blockchain technology to ensure the security of your tickets.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}