import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

type UserDetails = {
  email: string
  firstName: string
  lastName: string
}

export async function getOrCreateUser(walletAddress: string, userDetails?: UserDetails) {
  console.log("getOrCreateUser function executed")
  try {
    // First, check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("user_id")
      .eq("wallet_address", walletAddress)
      .single()

    if (existingUser) {
      // If user exists and we have new details, update them
      if (userDetails) {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            email: userDetails.email,
            first_name: userDetails.firstName,
            last_name: userDetails.lastName,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", existingUser.user_id)

        if (updateError) throw updateError
      }
      return { user_id: existingUser.user_id, error: null }
    }

    // If user doesn't exist, create new user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          wallet_address: walletAddress,
          email: userDetails?.email,
          first_name: userDetails?.firstName,
          last_name: userDetails?.lastName,
          created_at: new Date().toISOString(),
        },
      ])
      .select("user_id")
      .single()

    if (error) {
      throw error
    }

    return { user_id: newUser.user_id, error: null }
  } catch (error) {
    console.error("Error in getOrCreateUser:", error)
    return { user_id: null, error }
  }
}
