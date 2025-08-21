import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, Clock, Coins } from "lucide-react";

const algorandBenefits = [
  {
    title: "Secure",
    description:
      "Pure proof-of-stake consensus mechanism ensures maximum security and decentralization",
    icon: <Shield className="h-12 w-12 mb-4 text-purple-500" />,
  },
  {
    title: "Fast",
    description: "Less than 4.5 seconds block finality for quick ticket transactions",
    icon: <Zap className="h-12 w-12 mb-4 text-purple-500" />,
  },
  {
    title: "Scalable",
    description: "Handles over 6,000 transactions per second for seamless event ticketing",
    icon: <Clock className="h-12 w-12 mb-4 text-purple-500" />,
  },
  {
    title: "Cost-Effective",
    description:
      "Minimal transaction fees make ticketing affordable for organizers and attendees",
    icon: <Coins className="h-12 w-12 mb-4 text-purple-500" />,
  },
];

const featureGroups = [
  [
    {
      title: "Smart Contract Ticketing",
      description:
        "Automated ticket distribution and validation through Algorand smart contracts",
    },
    {
      title: "Transparent Pricing",
      description:
        "All transactions are recorded on the blockchain for complete transparency",
    },
    {
      title: "NFT Integration",
      description: "Unique NFT tickets with special perks and collectible value",
    },
  ],
  [
    {
      title: "Instant Settlements",
      description: "Real-time payment processing and ticket delivery",
    },
    {
      title: "Secondary Market",
      description: "Secure peer-to-peer ticket resale with price controls",
    },
    {
      title: "Community Governance",
      description: "Platform decisions made through community voting",
    },
  ],
];

export default function HomePage() {
    console.log("HomePage component initialized")
    console.log("Rendering hero section")
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
            <Button
              size="lg"
              variant="outline"
              className="border-purple-600 text-purple-400 hover:bg-purple-600/10"
            >
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
              Our platform leverages Algorand's powerful blockchain technology to provide a secure, efficient, and
              transparent ticketing experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {algorandBenefits.map((benefit, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-colors"
              >
                <CardContent className="p-6">
                  {benefit.icon}
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
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
            {featureGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-8">
                {group.map((feature, idx) => (
                  <div key={idx}>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
