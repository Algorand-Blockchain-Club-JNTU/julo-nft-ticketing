import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, Clock, Coins } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black z-0" />
        <div className="container relative z-10 px-4 py-32 mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Experience the Future of Events
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover, create, and attend events powered by Algorand blockchain technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Explore Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600/10">
              Create Event
            </Button>
          </div>
        </div>
      </section>

      {/* Algorand Benefits Section */}
      <section className="py-24 bg-black">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Algorand Blockchain?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform leverages Algorand &apos; s powerful blockchain technology to provide a secure, efficient, and
              transparent ticketing experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">Secure</h3>
                <p className="text-gray-400">
                  Pure proof-of-stake consensus mechanism ensures maximum security and decentralization
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardContent className="p-6">
                <Zap className="h-12 w-12 mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">Fast</h3>
                <p className="text-gray-400">Less than 4.5 seconds block finality for quick ticket transactions</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">Scalable</h3>
                <p className="text-gray-400">Handles over 6,000 transactions per second for seamless event ticketing</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardContent className="p-6">
                <Coins className="h-12 w-12 mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">Cost-Effective</h3>
                <p className="text-gray-400">
                  Minimal transaction fees make ticketing affordable for organizers and attendees
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Algorand</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience the next generation of event ticketing with blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Smart Contract Ticketing</h3>
                <p className="text-gray-400">
                  Automated ticket distribution and validation through Algorand smart contracts
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-gray-400">
                  All transactions are recorded on the blockchain for complete transparency
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">NFT Integration</h3>
                <p className="text-gray-400">Unique NFT tickets with special perks and collectible value</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Instant Settlements</h3>
                <p className="text-gray-400">Real-time payment processing and ticket delivery</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secondary Market</h3>
                <p className="text-gray-400">Secure peer-to-peer ticket resale with price controls</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Community Governance</h3>
                <p className="text-gray-400">Platform decisions made through community voting</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

