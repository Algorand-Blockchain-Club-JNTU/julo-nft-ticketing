export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-lg mb-6">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </p>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account,
              purchase tickets, or contact us for support.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p>
              We use the information to provide our services, process transactions,
              send communications, and improve our platform.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@julo-nft-ticketing.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}