function FeedbackSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <p className="leading-relaxed">{children}</p>
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-10">Feedback</h1>
        <p className="text-lg md:text-xl mb-10 leading-relaxed">
          We value your feedback. Help us improve by sharing your thoughts.
        </p>

        <div className="space-y-8">
          <FeedbackSection title="Share Your Thoughts">
            Tell us what you like, what you don't like, and how we can improve.
          </FeedbackSection>

          <FeedbackSection title="Bug Reports">
            Found a bug? Let us know so we can fix it.
          </FeedbackSection>

          <FeedbackSection title="Feature Requests">
            Have an idea for a new feature? We'd love to hear it.
          </FeedbackSection>
        </div>
      </div>
    </div>
  )
}
