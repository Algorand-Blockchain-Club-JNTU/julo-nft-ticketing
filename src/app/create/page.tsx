"use client"

import { useState } from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "react-toastify"
import algosdk from "algosdk"
import { createClient } from "@supabase/supabase-js"
import { Clock, MapPin, Map } from "lucide-react"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface EventMetadata {
  name: string
  description: string
  location: string
  date: string
  image: string
  maxTickets: number
  ticketPrice: number
  venue: string
  organizer: string
  category: string
  requiresApproval: boolean
}



/**
 * Slices an array into chunks of a specified size.
 * @param arr - The array to slice
 * @param chunkSize - The size of each chunk
 * @returns An array of chunks
 */
function sliceIntoChunks(arr: any[], chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

/**
 * CreateEventPage component for creating new events and minting NFT tickets.
 * Handles form submission, image upload to IPFS, and blockchain transactions.
 */
export default function CreateEventPage() {
  const { activeAddress, algodClient, transactionSigner } = useWallet()
  const [ipfsHash, setIpfsHash] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    maxTickets: "",
    ticketPrice: "",
    eventMetadata: {
      venue: "",
      organizer: "",
      category: "",
      requiresApproval: false,
    },
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("/placeholder.svg")
  const [isUploading, setIsUploading] = useState(false)
  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true)
      console.log("Starting image upload to IPFS")

      // Preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setImageFile(file)

      // Upload to IPFS
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-to-ipfs", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload to IPFS")
      }

      const data = await response.json()
      setIpfsHash(data.ipfsHash)
      toast.success("Image uploaded to IPFS successfully!")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image to IPFS")
    } finally {
      setIsUploading(false)
    }
  }

  const createTicketNFTs = async () => {
    console.log("Starting ticket creation process")
    if (!activeAddress || !algodClient || !transactionSigner) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!ipfsHash) {
      toast.error("Please upload an event image first")
      return
    }

    if (!date) {
      toast.error("Please select an event date")
      return
    }

    try {
      setIsCreating(true)

      // Prepare metadata
      const metadata: EventMetadata = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        date: date.toISOString(),
        image: `ipfs://${ipfsHash}`,
        maxTickets: Number.parseInt(formData.maxTickets),
        ticketPrice: Number.parseFloat(formData.ticketPrice),
        venue: formData.eventMetadata.venue,
        organizer: formData.eventMetadata.organizer,
        category: formData.eventMetadata.category,
        requiresApproval: formData.eventMetadata.requiresApproval,
      }

      const suggestedParams = await algodClient.getTransactionParams().do()

      // Create multiple NFT creation transactions
      // Create multiple NFT creation transactions
      const transactions = []
      for (let i = 0; i < metadata.maxTickets; i++) {
          const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
            sender: activeAddress,
            total: 1,
            decimals: 0,
            assetName: `${formData.name} Ticket #${i + 1}`,
            unitName: "NFT",
            assetURL: `ipfs://${ipfsHash}`,
            manager: activeAddress,
            reserve: activeAddress,
            freeze: activeAddress,
            clawback: activeAddress,
            defaultFrozen: false,
            suggestedParams,
            note: new TextEncoder().encode(
              JSON.stringify({
                standard: "arc69",
                ...metadata,
                ticketNumber: i + 1,
              }),
            ),
          })
          transactions.push(txn)
        } 
        console.log("transactions: ", transactions);
        // Assign a group ID to all transactions
        // algosdk.assignGroupID(transactions)

        // Sign all transactions
        const signedTxns = await transactionSigner(
          transactions,
          transactions.map((_, i) => i),
        )
        console.log("signedTxns: ", signedTxns);
        // Filter out null transactions
        let signedAssetTransactions;

        signedAssetTransactions = sliceIntoChunks(signedTxns, 1)
        const nonNullSignedTxns = signedTxns.filter((txn): txn is Uint8Array => txn !== null)

        if (nonNullSignedTxns.length !== signedTxns.length) {
          throw new Error("Some transactions were not signed properly")
        }

        // Send transactions in groups of 16 (Algorand's group size limit)
        const chunkSize = 16
        const assetIds = [];

for (let i = 0; i < signedAssetTransactions.length; i++) {
  try {
    const { txid } = await algodClient.sendRawTransaction(signedAssetTransactions[i]).do();
    const result = await algosdk.waitForConfirmation(algodClient, txid, 4);

    if (result.hasOwnProperty("assetIndex")) {
      // The confirmed result returns an assetIndex for the first txn.
      
     
      assetIds.push(Number(result["assetIndex"]));
    } else if (result.innerTxns) {
      // If innerTxns are provided, map and convert to numbers.
      const groupAssetIds = result.innerTxns.map((tx) => Number(tx["assetIndex"])).filter((id) => !isNaN(id));
      console.log("Group Asset IDs from innerTxns:", groupAssetIds);
      assetIds.push(...groupAssetIds);
    } else {
      toast.error("Could not retrieve asset IDs from confirmation");
    }

    if (i % 5 === 0) {
      toast.success(`Transaction ${i + 1} of ${signedAssetTransactions.length} confirmed!`, {
        autoClose: 1000,
      });
    }
  } catch (err) {
    console.error(err);
    toast.error(`Transaction ${i + 1} of ${signedAssetTransactions.length} failed!`, {
      autoClose: 1000,
    });
  }

  await new Promise((resolve) => setTimeout(resolve, 20));
}

console.log("All Collected Asset IDs:", assetIds);

      // Add this validation before the supabase.from("events").insert call
      if (metadata.ticketPrice === undefined || isNaN(metadata.ticketPrice)) {
        toast.error("Please enter a valid ticket price or select Free Event")
        setIsCreating(false)
        return
      }

      // Create event in Supabase
      const { data: event, error: eventError } = await supabase
        .from("events")
        .insert({
          event_name: formData.name,
          event_date: date.toISOString(),
          description: formData.description,
          location: formData.location,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          max_tickets: metadata.maxTickets,
          ticket_price: metadata.ticketPrice,
          venue: metadata.venue,
          organizer: metadata.organizer,
          category: metadata.category,
          requires_approval: metadata.requiresApproval,
          image_url: `ipfs://${ipfsHash}`,
          created_by: activeAddress,
        })
        .select()
        .single()

      if (eventError) throw eventError
        console.log("Asset ID: " , assetIds);
      // Create tickets in Supabase
      const ticketsData = assetIds.map((assetId, index) => ({
        asset_id: assetId,
        event_id: event.event_id,
        metadata: {
          ticketNumber: index + 1,
          ...metadata,
        },
      }))

      const { error: ticketsError } = await supabase.from("tickets").insert(ticketsData)

      if (ticketsError) throw ticketsError

      toast.success("Event created and tickets minted successfully!")
    } catch (error) {
      console.error("Error creating event and minting tickets:", error)
      toast.error("Failed to create event and mint tickets")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          {/* Image Upload Section */}
          <Card className="bg-gray-800/50 border-dashed border-2 border-gray-700 aspect-square relative group">
            <CardContent className="p-0 h-full">
              <label className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    console.log("File selected for upload")
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                  disabled={isUploading}
                />
                <div className="relative w-full h-full">
                  {isUploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Event cover"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="h-8 w-8" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Upload event image</p>
                    </div>
                  )}
                </div>
              </label>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Input
              placeholder="Event Name"
              className="text-3xl h-16 bg-transparent border-none placeholder:text-gray-500"
              value={formData.name}
              onChange={(e) => {
                console.log("Event name changed")
                setFormData({ ...formData, name: e.target.value })
              }}
            />

            <div className="grid gap-4">
              <div className="flex items-center space-x-4">
                <div className="space-y-2 flex-1">
                  <Label>Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-gray-800/50",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {date ? date.toLocaleDateString() : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event Location</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Event Location"
                    className="bg-gray-800/50 flex-1"
                    value={formData.location}
                    onChange={(e) => {
                      console.log("Event location changed")
                      setFormData({ ...formData, location: e.target.value })
                    }}
                  />
                  <Button
                    variant="outline"
                    className="bg-gray-800/50"
                    onClick={() => {
                      console.log("Geolocation button clicked")
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                          setFormData({
                            ...formData,
                            latitude: position.coords.latitude.toString(),
                            longitude: position.coords.longitude.toString(),
                          })
                          toast.success("Location captured!")
                        })
                      }
                    }}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-gray-800/50"
                    onClick={() => {
                      console.log("Maps button clicked")
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.location)}`,
                        "_blank",
                      )
                    }}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
                {formData.latitude && formData.longitude && (
                  <p className="text-xs text-green-400">
                    📍 Location captured: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
                  </p>
                )}
              </div>

              <Textarea
                placeholder="Event Description"
                className="min-h-[100px] bg-gray-800/50"
                value={formData.description}
                onChange={(e) => {
                  console.log("Event description changed")
                  setFormData({ ...formData, description: e.target.value })
                }}
              />

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label>Maximum Tickets</Label>
                  <Input
                    type="number"
                    className="w-32 bg-gray-800/50"
                    value={formData.maxTickets}
                    onChange={(e) => {
                      console.log("Max tickets changed")
                      setFormData({ ...formData, maxTickets: e.target.value })
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label>Ticket Price (ALGO)</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="freeTicket"
                        className="rounded border-gray-700 bg-gray-800/50"
                        onChange={(e) => {
                          console.log("Free ticket checkbox changed")
                          if (e.target.checked) {
                            setFormData({ ...formData, ticketPrice: "0" })
                          }
                        }}
                      />
                      <Label htmlFor="freeTicket" className="text-sm text-gray-400">
                        Free Event
                      </Label>
                    </div>
                  </div>
                  <Input
                    type="number"
                    className="w-32 bg-gray-800/50"
                    value={formData.ticketPrice}
                    onChange={(e) => {
                      console.log("Ticket price changed")
                      setFormData({ ...formData, ticketPrice: e.target.value })
                    }}
                    disabled={formData.ticketPrice === "0"}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Event Category</Label>
                  <Select
                    value={formData.eventMetadata.category}
                    onValueChange={(value) => {
                      console.log("Event category changed")
                      setFormData({
                        ...formData,
                        eventMetadata: { ...formData.eventMetadata, category: value },
                      })
                    }}
                  >
                    <SelectTrigger className="w-32 bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">AI</SelectItem>
                      <SelectItem value="arts">Arts & Culture</SelectItem>
                      <SelectItem value="climate">Climate</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            className="w-full max-w-md bg-primary hover:bg-primary/90"
            onClick={() => {
              console.log("Create event button clicked")
              createTicketNFTs()
            }}
            disabled={isCreating || !activeAddress}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Tickets...
              </>
            ) : (
              "Create Event & Mint Tickets"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

