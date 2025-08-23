export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <p className="text-lg mb-6">
          Stay updated with the latest news and insights from the Julo NFT Ticketing team.
        </p>
        <div className="space-y-6">
          <article>
            <h2 className="text-2xl font-semibold mb-4">The Future of Event Ticketing</h2>
            <p>
              Explore how blockchain technology is revolutionizing the way we buy and sell event tickets.
            </p>
          </article>
          <article>
            <h2 className="text-2xl font-semibold mb-4">NFT Security Best Practices</h2>
            <p>
              Learn about the security measures we implement to protect your digital assets.
            </p>
          </article>
        </div>
      </div>
    </div>
  )
}