export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Latest News</h1>
        <p className="text-lg mb-6">
          Stay informed about the latest developments in NFT ticketing and blockchain events.
        </p>
        <div className="space-y-6">
          <article>
            <h2 className="text-2xl font-semibold mb-4">Julo Launches New Features</h2>
            <p>
              We're excited to announce new features that make event management easier than ever.
            </p>
          </article>
          <article>
            <h2 className="text-2xl font-semibold mb-4">Partnership with Major Event Organizer</h2>
            <p>
              We've partnered with a leading event organizer to bring NFT tickets to more events.
            </p>
          </article>
          <article>
            <h2 className="text-2xl font-semibold mb-4">Security Updates</h2>
            <p>
              Learn about the latest security enhancements we've implemented.
            </p>
          </article>
        </div>
      </div>
    </div>
  )
}