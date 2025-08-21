import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

/**
 * Handles POST requests to send a welcome NFT to a user.
 * Checks if the user already has a welcome NFT and updates the database accordingly.
 * @param request - The incoming request containing the userAddress
 * @returns A JSON response with success status or error message
 */
export async function POST(request: Request) {
  try {
    const { userAddress } = await request.json()

    // Check if user already has welcome NFT
    const { data: existingUser } = await supabase
      .from("users")
      .select("welcome_nft_id")
      .eq("wallet_address", userAddress)
      .single()

    if (existingUser?.welcome_nft_id) {
      return NextResponse.json({ message: "Welcome NFT already sent" })
    }

    // Update user record with welcome NFT
    const { error } = await supabase
      .from("users")
      .upsert({
        wallet_address: userAddress,
        welcome_nft_id: Math.floor(Math.random() * 1000000),
        created_at: new Date().toISOString()
      })

    if (error) throw error

    return NextResponse.json({ success: true, message: "Welcome NFT sent!" })
  } catch (error) {
    console.error("Welcome NFT Error:", error)
    return NextResponse.json({ error: "Failed to send welcome NFT" }, { status: 500 })
  }
}