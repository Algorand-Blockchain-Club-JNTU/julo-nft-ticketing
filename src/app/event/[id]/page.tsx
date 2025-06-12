"use client"

import React, { useEffect, useState } from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import { createClient } from "@supabase/supabase-js"
import { format } from "date-fns"
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Users, ArrowLeft, Ticket, Loader2, WalletCards, Clock4, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-toastify"
import { getOrCreateUser } from "@/lib/userCreation";
import algosdk from "algosdk"
import { UserDetailsDialog } from "@/components/user-details-dialog";
import { type QRPayload, generateQRCodeDataURL, signPayload } from "@/lib/qr-utils"

// Initialize Supabase client

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

type RequestStatus = {
  exists: boolean
  status: "pending" | "approved" | "rejected" | null
  assetId?: number // Add assetId to the type
}

function EventSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative h-[40vh] overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div>
              <Skeleton className="h-8 w-24 mb-4" />
              <Skeleton className="h-12 w-3/4 mb-4" />
              <div className="flex flex-wrap gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-32" />
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-[1fr,300px] gap-8">
              <div className="space-y-8">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <Skeleton className="h-8 w-40 mb-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-[200px] w-full" />
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const router = useRouter()
  const { activeAddress, algodClient, transactionSigner } = useWallet()
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [requestStatus, setRequestStatus] = useState<RequestStatus>({ exists: false, status: null, assetId: undefined })
  const [availableTickets, setAvailableTickets] = useState<number>(0)
  const [showUserDetailsDialog, setShowUserDetailsDialog] = useState(false)
  const [userDetailsSubmitted, setUserDetailsSubmitted] = useState(false)
  const [user_id, setUserId] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching data for event:", resolvedParams.id)

        // Fetch event details
        const { data: event } = await supabase.from("events").select("*").eq("event_id", resolvedParams.id).single()

        setEvent(event)

        // Get count of available tickets
        const { data: tickets } = await supabase
          .from("tickets")
          .select("ticket_id", { count: "exact" })
          .eq("event_id", resolvedParams.id)
          .eq("opted_in", false)

        setAvailableTickets(tickets?.length || 0)

        // If wallet is connected, check for existing requests
        if (activeAddress) {
          console.log("Checking requests for wallet:", activeAddress)

          const { data: existingRequest, error } = await supabase
            .from("requests")
            .select("request_status, asset_id") // Add asset_id to the select
            .eq("event_id", resolvedParams.id)
            .eq("wallet_address", activeAddress)
            .order("requested_at", { ascending: false })
            .limit(1)
            .single()

          console.log("Existing request:", existingRequest, "Error:", error)

          if (existingRequest) {
            setRequestStatus({
              exists: true,
              status: existingRequest.request_status,
              assetId: existingRequest.asset_id, // Set the assetId
            })
          } else {
            setRequestStatus({ exists: false, status: null, assetId: undefined })
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [resolvedParams.id, activeAddress])

  useEffect(() => {
    const generateQR = async () => {
      if (requestStatus.status === "approved" && event && activeAddress && requestStatus.assetId) {
        setIsGeneratingQR(true)
        try {
          console.log("Generating QR code with:", {
            assetId: requestStatus.assetId,
            userAddress: activeAddress,
            eventId: event.event_id,
          })

          const ticketData = {
            assetId: requestStatus.assetId,
            userAddress: activeAddress,
            eventId: event.event_id,
            timestamp: new Date().toISOString(),
            eventName: event.event_name,
          }

          const signature = await signPayload(ticketData, process.env.NEXT_PUBLIC_TICKET_SIGNING_KEY || "")
          const qrPayload: QRPayload = {
            payload: ticketData,
            signature,
          }

          const qrDataUrl = await generateQRCodeDataURL(JSON.stringify(qrPayload))
          console.log("QR code generated successfully:", qrDataUrl ? "success" : "failed")
          setQrCode(qrDataUrl)
        } catch (error) {
          console.error("Error generating QR code:", error)
          toast.error("Failed to generate ticket QR code")
        } finally {
          setIsGeneratingQR(false)
        }
      }
    }

    generateQR()
  }, [requestStatus.status, requestStatus.assetId, event, activeAddress])

  const handleUserDetailsSubmit = async (userDetails: { email: string; firstName: string; lastName: string }) => {
    try {
      // Get or create user with the provided details
      const { user_id: newUserId, error: userError } = await getOrCreateUser(activeAddress!, userDetails)

      if (userError || !newUserId) {
        throw new Error("Failed to get or create user")
      }

      setUserId(newUserId)
      setUserDetailsSubmitted(true)
      setShowUserDetailsDialog(false)

      // Continue with the purchase process
      handlePurchaseTicket()
    } catch (error) {
      console.error("Error saving user details:", error)
      toast.error("Failed to save user details. Please try again.")
    }
  }
  const handlePurchaseTicket = async () => {
    if (!activeAddress || !event) return

    try {
      setIsPurchasing(true)

      // Get or create user and get their user_id
      if (!userDetailsSubmitted) {
        setShowUserDetailsDialog(true)
        return
      }

      // Get available tickets that haven't been opted into
      const { data: availableTickets } = await supabase
        .from("tickets")
        .select("ticket_id, asset_id")
        .eq("event_id", resolvedParams.id)
        .eq("opted_in", false)
        .limit(1)

      if (!availableTickets || availableTickets.length === 0) {
        toast.error("No tickets available for this event")
        return
      }

      const assetID = availableTickets[0].asset_id

      const suggestedParams = await algodClient.getTransactionParams().do()
      const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: activeAddress,
        receiver: activeAddress,
        suggestedParams,
        assetIndex: assetID,
        amount: 0,
      })

      const signedTxns = await transactionSigner([optInTxn], [0])
      const { txid } = await algodClient.sendRawTransaction(signedTxns).do()
      await algosdk.waitForConfirmation(algodClient, txid, 4)

      toast.success("Ticket NFTs Opted IN successfully!")
      // Create a request for the ticket
      const { error: requestError } = await supabase.from("requests").insert([
        {
          event_id: resolvedParams.id,
          ticket_id: availableTickets[0].ticket_id,
          user_id: user_id,
          wallet_address: activeAddress,
          asset_id: availableTickets[0].asset_id,
          request_status: "pending",
        },
      ])

      if (requestError) {
        throw requestError
      }

      // Update the ticket's opted_in status
      const { error: updateError } = await supabase
        .from("tickets")
        .update({ opted_in: true })
        .eq("ticket_id", availableTickets[0].ticket_id)

      if (updateError) {
        // If updating the ticket fails, we should delete the request to maintain consistency
        await supabase
          .from("requests")
          .delete()
          .eq("ticket_id", availableTickets[0].ticket_id)
          .eq("wallet_address", activeAddress)

        throw updateError
      }

      // Update local state to reflect the new request
      setRequestStatus({ exists: true, status: "pending" })
      setAvailableTickets((prev) => Math.max(0, prev - 1))
      toast.success("Ticket request submitted successfully!")
      router.refresh()
    } catch (error) {
      console.error("Error purchasing ticket:", error)
      toast.error("Failed to purchase ticket. Please try again.")
    } finally {
      setIsPurchasing(false)
    }
  }

  if (isLoading) {
    return <EventSkeleton />
  }

  const renderTicketActionContent = () => {
    if (!activeAddress) {
      return (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center">
              <WalletCards className="h-8 w-8 mb-2 mx-auto text-gray-400" />
              <p className="text-sm text-gray-400 mb-4">Please connect your wallet to purchase tickets</p>
            </div>
          </CardContent>
        </Card>
      )
    }
    console.log("qrCode", qrCode)
    if (requestStatus.exists) {
      return (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center">
              {requestStatus.status === "pending" ? (
                <>
                  <Clock4 className="h-8 w-8 mb-2 mx-auto text-yellow-500" />
                  <p className="text-sm text-gray-400 mb-4">Your ticket request is pending approval</p>
                </>
              ) : requestStatus.status === "approved" ? (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2 text-center">Your Ticket QR Code</p>
                  {isGeneratingQR ? (
                    <div className="flex justify-center items-center h-[300px]">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : qrCode ? (
                    <img
                      src={qrCode || "/placeholder.svg"}
                      alt="Ticket QR Code"
                      className="w-full max-w-[300px] mx-auto rounded-lg"
                    />
                  ) : (
                    <p className="text-sm text-red-400 text-center">Failed to generate QR code</p>
                  )}
                </div>
              ) : (
                <>
                  <XCircle className="h-8 w-8 mb-2 mx-auto text-red-500" />
                  <p className="text-sm text-gray-400 mb-4">Your ticket request was rejected</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Button className="w-full" size="lg" disabled={isPast || isPurchasing} onClick={handlePurchaseTicket}>
        {isPurchasing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Ticket className="w-4 h-4 mr-2" />
            {isPast ? "Event Ended" : "Purchase Tickets"}
          </>
        )}
      </Button>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
            <p className="text-gray-400">This event doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const eventDate = new Date(event.event_date)
  const isPast = eventDate < new Date()
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative h-[40vh] overflow-hidden">
        <img
          src={event.image_url.replace("ipfs://", "https://ipfs.io/ipfs/") || "/placeholder.svg"}
          alt={event.event_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        <Link
          href="/events"
          className="absolute top-4 left-4 inline-flex items-center text-white hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div>
              <Badge variant={isPast ? "secondary" : "default"} className="mb-4">
                {isPast ? "Past Event" : "Upcoming Event"}
              </Badge>
              <h1 className="text-4xl font-bold text-white mb-4">{event.event_name}</h1>
              <div className="flex flex-wrap gap-6 text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {format(eventDate, "MMMM d, yyyy")}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {format(eventDate, "h:mm a")}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {event.max_tickets} tickets available
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-[1fr,300px] gap-8">
              <div className="space-y-8">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle>About this event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle>Venue Details</CardTitle>
                    <CardDescription>{event.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-gray-400">
                      <p>Venue: {event.venue}</p>
                    </div>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${
                          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                        }&q=${encodeURIComponent(event.venue || event.location)}`}
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700 sticky top-6">
                  <CardHeader>
                    <CardTitle>Ticket Information</CardTitle>
                    <CardDescription>{isPast ? "This event has ended" : "Secure your spot now"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Price per ticket</span>
                        <span className="text-xl font-semibold">{event.ticket_price} ALGO</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Available tickets</span>
                        <span className="text-xl font-semibold">{availableTickets}</span>
                      </div>
                      {renderTicketActionContent()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserDetailsDialog
        isOpen={showUserDetailsDialog}
        onClose={() => {
          setShowUserDetailsDialog(false)
          setIsPurchasing(false)
        }}
        onSubmit={handleUserDetailsSubmit}
      />
    </div>
  )
}

