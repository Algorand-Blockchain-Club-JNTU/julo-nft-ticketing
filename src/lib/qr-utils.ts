import * as QRCode from "qrcode"

// Types for our data structures
export type TicketData = {
  assetId: number
  userAddress: string
  eventId: string | number
  timestamp: string
  eventName: string
}

export type QRPayload = {
  payload: TicketData
  signature: string
}

// Function to sign the payload using Web Crypto API
export async function signPayload(payload: TicketData, privateKey: string): Promise<string> {
  // Convert the payload to a string
  const payloadString = JSON.stringify(payload)

  // Convert the string to a Uint8Array
  const encoder = new TextEncoder()
  const data = encoder.encode(payloadString)

  // Create a hash of the data using SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)

  // Convert the hash to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return hashHex
}

// Function to generate QR code as data URL
export async function generateQRCodeDataURL(data: string): Promise<string> {
  console.log("Generating QR code data URL")
  try {
    return await QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",
      margin: 4,
      width: 400,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      rendererOpts: {
        quality: 1,
      },
    })
  } catch (err) {
    console.error("Error generating QR code:", err)
    throw new Error("Failed to generate QR code")
  }
}

