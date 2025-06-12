"use client"

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";
import Link from "next/link";
import { Calendar, MapPin, Search, Filter, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const categories = [
  { id: "all", name: "All Events", color: "bg-primary" },
  { id: "ai", name: "AI", color: "bg-blue-500" },
  { id: "arts", name: "Arts & Culture", color: "bg-purple-500" },
  { id: "climate", name: "Climate", color: "bg-green-500" },
  { id: "fitness", name: "Fitness", color: "bg-orange-500" },
  { id: "wellness", name: "Wellness", color: "bg-pink-500" },
  { id: "crypto", name: "Crypto", color: "bg-yellow-500" },
  { id: "other", name: "Other", color: "bg-gray-500" },
]

const priceRanges = [
  { id: "all", name: "All Prices" },
  { id: "free", name: "Free Events" },
  { id: "paid", name: "Paid Events" },
]

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true })

      setEvents(data || [])
      setFilteredEvents(data || [])
      setIsLoading(false)
    }

    fetchEvents()
  }, [])

  // Filter events based on search, category, and price range
  useEffect(() => {
    let filtered = [...events]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.event_name.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) => event.category === selectedCategory)
    }

    // Price filter
    if (selectedPriceRange !== "all") {
      if (selectedPriceRange === "free") {
        filtered = filtered.filter((event) => event.ticket_price === 0)
      } else {
        filtered = filtered.filter((event) => event.ticket_price > 0)
      }
    }

    setFilteredEvents(filtered)
  }, [searchQuery, selectedCategory, selectedPriceRange, events])

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedPriceRange("all")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Hero Section with Search */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-gray-900 to-gray-900" />

        <div className="relative pt-20 pb-32 container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary/50 to-white bg-clip-text text-transparent">
              Discover Amazing Events
            </h1>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Find and join the most exciting events in your area
            </p>

            {/* Search Bar */}
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search events by name, location, or description..."
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-800/50 border-gray-700 backdrop-blur-xl focus:ring-2 focus:ring-primary/50 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-2 h-10 w-10 rounded-xl border-gray-700 hover:bg-gray-700"
                onClick={clearFilters}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters */}
            <div className="mt-8 flex flex-col items-center gap-6">
              {/* Categories */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={cn(
                      "h-9 rounded-full border border-transparent",
                      "hover:border-primary/50 hover:bg-gray-800/50",
                      "data-[state=open]:bg-gray-800/50",
                      category.id === selectedCategory && "bg-primary/10 border-primary/50",
                    )}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className={cn("w-2 h-2 rounded-full mr-2", category.color)} />
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Price Range */}
              <div className="flex flex-wrap justify-center gap-2">
                {priceRanges.map((range) => (
                  <Button
                    key={range.id}
                    variant="ghost"
                    className={cn(
                      "h-9 rounded-full border border-transparent",
                      "hover:border-primary/50 hover:bg-gray-800/50",
                      "data-[state=open]:bg-gray-800/50",
                      range.id === selectedPriceRange && "bg-primary/10 border-primary/50",
                    )}
                    onClick={() => setSelectedPriceRange(range.id)}
                  >
                    {range.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== "all" || selectedPriceRange !== "all" || searchQuery) && (
        <div className="container mx-auto px-4 -mt-12 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 flex-wrap">
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="rounded-full pl-2 pr-1 py-1 bg-gray-800/90 backdrop-blur-xl">
                  Category: {categories.find((c) => c.id === selectedCategory)?.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-1 hover:bg-gray-700"
                    onClick={() => setSelectedCategory("all")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedPriceRange !== "all" && (
                <Badge variant="secondary" className="rounded-full pl-2 pr-1 py-1 bg-gray-800/90 backdrop-blur-xl">
                  Price: {priceRanges.find((p) => p.id === selectedPriceRange)?.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-1 hover:bg-gray-700"
                    onClick={() => setSelectedPriceRange("all")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="rounded-full pl-2 pr-1 py-1 bg-gray-800/90 backdrop-blur-xl">
                  Search: {searchQuery}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-1 hover:bg-gray-700"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" />
              <p className="text-gray-400 mt-4">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">No events found matching your criteria</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Link key={event.event_id} href={`/event/${event.event_id}`}>
                  <Card className="group relative h-full overflow-hidden border-0 bg-gradient-to-t from-gray-800/90 to-gray-800/50 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                    <CardContent className="p-0">
                      {/* Image with Gradient Overlay */}
                      <div className="aspect-[5/3] relative overflow-hidden">
                        <img
                          src={event.image_url.replace("ipfs://", "https://ipfs.io/ipfs/") || "/placeholder.svg"}
                          alt={event.event_name || "Event image"}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-80" />

                        {/* Price Badge */}
                        <Badge
                          className={cn(
                            "absolute top-4 right-4 backdrop-blur-md border-0",
                            event.ticket_price === 0
                              ? "bg-green-500/80 hover:bg-green-500/90"
                              : "bg-primary/80 hover:bg-primary/90",
                          )}
                        >
                          {event.ticket_price === 0 ? "Free" : `${event.ticket_price} ALGO`}
                        </Badge>

                        {/* Category Badge */}
                        <Badge
                          className={cn(
                            "absolute top-4 left-4 backdrop-blur-md border-0",
                            categories.find((c) => c.id === event.category)?.color.replace("bg-", "bg-opacity-80 "),
                          )}
                        >
                          {categories.find((c) => c.id === event.category)?.name || "Other"}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                          {event.event_name}
                        </h3>
                        <p className="text-gray-400 line-clamp-2 mb-4 text-sm">{event.description}</p>

                        {/* Event Details */}
                        <div className="flex items-center text-sm text-gray-400 gap-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary" />
                            {format(new Date(event.event_date), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

