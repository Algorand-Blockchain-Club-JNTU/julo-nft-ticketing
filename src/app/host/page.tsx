"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import { createClient } from "@supabase/supabase-js"
import { format } from "date-fns"
import Link from "next/link"
import { Calendar, MapPin, Users, Ticket, Settings, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton" // Add this import

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Profile Section Skeleton */}
      <div className="grid md:grid-cols-[2fr,1fr] gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-5 w-8" />
                    </div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Section Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-72 rounded-lg" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-[250px,1fr,auto] gap-6">
                  <Skeleton className="h-[200px]" />
                  <div className="p-6 md:p-4 space-y-4">
                    <div>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3 mt-1" />
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="p-6 md:p-4 flex items-center">
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HostPage() {
  console.log("HostPage component initialized")
  const { activeAddress } = useWallet()
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      if (!activeAddress) return

      try {
        console.log("Fetching host dashboard data")
        // Fetch user profile
        const { data: profile } = await supabase.from("users").select("*").eq("wallet_address", activeAddress).single()

        if (!profile) {
          // Create user profile if it doesn't exist
          const { data: newProfile } = await supabase
            .from("users")
            .insert([
              {
                wallet_address: activeAddress,
                created_at: new Date().toISOString(),
              },
            ])
            .select()
            .single()

          setUserProfile(newProfile)
          
          // Send welcome NFT to new user
          fetch('/api/welcome-nft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAddress: activeAddress })
          })
        } else {
          setUserProfile(profile)
        }

        // Fetch events created by this wallet
        const { data: userEvents } = await supabase
          .from("events")
          .select("*")
          .eq("created_by", activeAddress)
          .order("event_date", { ascending: false })

        setEvents(userEvents || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activeAddress])

  if (!activeAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-gray-800/50 border-gray-700">
          <CardContent className="p-6 text-center">
            <Ticket className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-4">
              Please connect your wallet to view your hosted events and manage your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            // Rest of your existing JSX remains the same
            <div className="space-y-8">
              {/* Host Profile Section */}
              <div className="grid md:grid-cols-[2fr,1fr] gap-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h1 className="text-2xl font-bold mb-2">Host Dashboard</h1>
                        <p className="text-gray-400">Manage your events and profile</p>
                      </div>
                      <Button variant="outline" asChild>
                        <Link href="/create">
                          Create New Event
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="bg-gray-900/50 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Ticket className="w-5 h-5 text-primary" />
                            <Badge variant="outline">{events.length}</Badge>
                          </div>
                          <h3 className="font-medium">Total Events</h3>
                          <p className="text-sm text-gray-400">Events you've created</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900/50 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Users className="w-5 h-5 text-green-500" />
                            <Badge variant="outline">{events.reduce((acc, event) => acc + event.max_tickets, 0)}</Badge>
                          </div>
                          <h3 className="font-medium">Total Tickets</h3>
                          <p className="text-sm text-gray-400">Across all events</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900/50 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <Badge variant="outline">
                              {events.filter((e) => new Date(e.event_date) > new Date()).length}
                            </Badge>
                          </div>
                          <h3 className="font-medium">Upcoming Events</h3>
                          <p className="text-sm text-gray-400">Events yet to happen</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">Profile Details</h2>
                      <Button variant="ghost" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Wallet Address</label>
                        <p className="font-mono text-sm truncate">{activeAddress}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Member Since</label>
                        <p>{format(new Date(userProfile?.created_at || new Date()), "MMMM d, yyyy")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Events Section */}
              <div className="space-y-6">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="bg-gray-800/50">
                    <TabsTrigger value="all">All Events</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-6">
                    <EventsList events={events} />
                  </TabsContent>

                  <TabsContent value="upcoming" className="mt-6">
                    <EventsList events={events.filter((event) => new Date(event.event_date) > new Date())} />
                  </TabsContent>

                  <TabsContent value="past" className="mt-6">
                    <EventsList events={events.filter((event) => new Date(event.event_date) <= new Date())} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Your existing EventsList component remains the same
function EventsList({ events }: { events: any[] }) {
  if (events.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-12 text-center">
          <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
          <p className="text-gray-400 mb-6">Start creating events to see them listed here.</p>
          <Button asChild>
            <Link href="/create">Create Your First Event</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <Card key={event.event_id} className="bg-gray-800/50 border-gray-700 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-[250px,1fr,auto] gap-6">
              <div className="aspect-[4/3] md:aspect-auto relative">
                <img
                  src={event.image_url.replace("ipfs://", "https://ipfs.io/ipfs/") || "/placeholder.svg"}
                  alt={event.event_name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge
                  className="absolute bottom-2 left-2"
                  variant={new Date(event.event_date) > new Date() ? "default" : "secondary"}
                >
                  {new Date(event.event_date) > new Date() ? "Upcoming" : "Past"}
                </Badge>
              </div>

              <div className="p-6 md:p-4 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{event.event_name}</h3>
                  <p className="text-gray-400 line-clamp-2">{event.description}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-primary" />
                    {format(new Date(event.event_date), "MMMM d, yyyy")}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1.5 text-primary" />
                    {event.max_tickets} tickets
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-4 flex items-center">
                <Button asChild variant="outline">
                  <Link href={`/event/manage/${event.event_id}`}>
                    Manage Event
                    <Settings className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

