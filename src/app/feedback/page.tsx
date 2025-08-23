export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Feedback</h1>
        <p className="text-lg mb-6">
          We value your feedback. Help us improve by sharing your thoughts.
        </p>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Share Your Thoughts</h2>
            <p>
              Tell us what you like, what you don't like, and how we can improve.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Bug Reports</h2>
            <p>
              Found a bug? Let us know so we can fix it.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Feature Requests</h2>
            <p>
              Have an idea for a new feature? We'd love to hear it.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}