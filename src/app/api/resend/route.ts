import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateEmailTemplate } from "@/lib/email-templates";
import * as QRCode from "qrcode";
import crypto from "crypto";
const resend = new Resend(process.env.RESEND_API_KEY)
// Types for our data structures
type TicketData = {
  assetId: number
  userAddress: string
  eventId: string | number
  timestamp: string
  eventName: string
}

type QRPayload = {
  payload: TicketData
  signature: string
}

type Event = {
  event_name: string
  description?: string
  location?: string
  venue?: string
  event_date?: string
}

type TicketDetails = {
  assetId: number
  userAddress: string
  eventId: string | number
}

/**
 * Signs the ticket data payload using SHA256 and the provided private key.
 * @param payload - The ticket data to sign
 * @param privateKey - The private key for signing
 * @returns The hexadecimal signature
 */
function signPayload(payload: TicketData, privateKey: string): string {
  const payloadString = JSON.stringify(payload)
  const sign = crypto.createSign("SHA256")
  sign.update(payloadString)
  sign.end()
  return sign.sign(privateKey, "hex")
}

/**
 * Generates a QR code from the provided data and returns it as a data URL.
 * @param data - The data to encode in the QR code
 * @returns A promise that resolves to the QR code data URL
 */
async function generateQRCodeDataURL(data: string): Promise<string> {
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


async function generateQRCodeBase64(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      margin: 4,
      width: 400,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
}
export async function POST(request: Request) {
  try {
    const { email, audienceId, event, ticketDetails } = await request.json()

    // Add contact to audience
    await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId,
    })

    // Generate and send email if ticketDetails are provided
    if (ticketDetails) {
      const htmlContent =  await generateEmailTemplate(event, ticketDetails)
      const ticketData: TicketData = {
        assetId: ticketDetails.assetId,
        userAddress: ticketDetails.userAddress,
        eventId: ticketDetails.eventId,
        timestamp: new Date().toISOString(),
        eventName: event.event_name,
      }
    
      // Sign the data
      const signature = signPayload(ticketData, process.env.TICKET_SIGNING_PRIVATE_KEY || "")
    
      // Create QR payload
      const qrPayload: QRPayload = {
        payload: ticketData,
        signature,
      }
    
      // Generate QR code
      const qrDataUrl = await generateQRCodeBase64(JSON.stringify(qrPayload));
      console.log("QR DATA URL:",qrDataUrl)
      // Extract base64 data from Data URL
      const base64Data = qrDataUrl.split(',')[1];

      console.log("QR DATA URL:",base64Data)

      await resend.emails.send({
        from: "Events <events@jntuhceh.site>",
        to: email,
        subject: `Your Ticket for ${event.event_name} is Confirmed! 🎉`,
        html: htmlContent,
        attachments: [
          {
            content: base64Data,
            filename: 'image.png', // Set the appropriate filename and extension
            contentType: 'image/png',
            
          },
        ],
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Resend API Error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}


