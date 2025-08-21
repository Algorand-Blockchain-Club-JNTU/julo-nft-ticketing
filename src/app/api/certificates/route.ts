import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

/**
 * Handles POST requests to mint certificates for event attendees.
 * Verifies event ownership, checks if the event is completed, and creates certificates.
 * @param request - The incoming request containing eventId, attendeeAddresses, and creatorAddress
 * @returns A JSON response with success status or error message
 */
export async function POST(request: Request) {
  try {
    const { eventId, attendeeAddresses, creatorAddress } = await request.json()

    // Verify event owner
    const { data: event } = await supabase
      .from("events")
      .select("*")
      .eq("event_id", eventId)
      .eq("created_by", creatorAddress)
      .single()

    if (!event) {
      return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 403 })
    }

    // Check if event is completed
    if (new Date(event.event_date) > new Date()) {
      return NextResponse.json({ error: "Event not yet completed" }, { status: 400 })
    }

    // Create certificates for attendees
    const certificates = attendeeAddresses.map((address: string) => ({
      event_id: eventId,
      attendee_address: address,
      certificate_id: Math.floor(Math.random() * 1000000),
      issued_at: new Date().toISOString(),
      metadata: {
        eventName: event.event_name,
        eventDate: event.event_date,
        certificateType: "participation"
      }
    }))

    const { error } = await supabase.from("certificates").insert(certificates)
    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      message: `${certificates.length} certificates minted successfully` 
    })
  } catch (error) {
    console.error("Certificate minting error:", error)
    return NextResponse.json({ error: "Failed to mint certificates" }, { status: 500 })
  }
}