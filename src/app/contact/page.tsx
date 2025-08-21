export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <p className="text-lg mb-6">
          Get in touch with the Julo NFT Ticketing team. We're here to help!
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Support</h2>
            <p className="mb-4">
              For technical support or questions about your tickets,
              email us at support@julo-nft-ticketing.com
            </p>
            <h2 className="text-2xl font-semibold mb-4">Business Inquiries</h2>
            <p>
              Interested in partnering or have business questions?
              Contact us at business@julo-nft-ticketing.com
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
            <p className="mb-4">
              Stay updated with our latest news and events on social media.
            </p>
            <ul className="space-y-2">
              <li>Twitter: @JuloNFT</li>
              <li>Discord: Julo Community</li>
              <li>Telegram: @JuloSupport</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}