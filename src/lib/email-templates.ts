import crypto from "crypto";

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
  image_url?: string
}

type TicketDetails = {
  assetId: number
  userAddress: string
  eventId: string | number
}

// Function to sign the payload
function signPayload(payload: TicketData, privateKey: string): string {
  const payloadString = JSON.stringify(payload)
  const sign = crypto.createSign("SHA256")
  sign.update(payloadString)
  sign.end()
  return sign.sign(privateKey, "hex")
}

export async function generateEmailTemplate(event: Event, ticketDetails: TicketDetails) {
   console.log("generateEmailTemplate function executed")
   // Create ticket data
  const ticketData: TicketData = {
    assetId: ticketDetails.assetId,
    userAddress: ticketDetails.userAddress,
    eventId: ticketDetails.eventId,
    timestamp: new Date().toISOString(),
    eventName: event.event_name,
  }

  // Format date if available
  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  // Get event URL
  const eventUrl = `${process.env.NEXT_PUBLIC_APP_URL}/event/${ticketDetails.eventId}`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Ticket for ${event.event_name}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 0;">
                    <!-- Event Image -->
                    ${
                      event.image_url
                        ? `
                        <div style="width: 100%; height: 200px; overflow: hidden; border-radius: 8px 8px 0 0;">
                          <img 
                            src="${event.image_url.replace("ipfs://", "https://ipfs.io/ipfs/")}"
                            alt="${event.event_name}"
                            style="width: 100%; height: 100%; object-fit: cover;"
                          />
                        </div>
                        `
                        : ""
                    }

                    <div style="padding: 40px;">
                      <!-- Header -->
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td style="text-align: center; padding-bottom: 32px;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">
                              Your Ticket for ${event.event_name} is Confirmed! 🎉
                            </h1>
                          </td>
                        </tr>
                      </table>

                      <!-- Event Details -->
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 32px;">
                        <tr>
                          <td style="padding: 24px;">
                            ${
                              formattedDate
                                ? `
                              <p style="margin: 0 0 12px; font-size: 16px; color: #374151;">
                                📅 Date: ${formattedDate}
                              </p>
                            `
                                : ""
                            }
                            ${
                              event.venue
                                ? `
                              <p style="margin: 0 0 12px; font-size: 16px; color: #374151;">
                                🏢 Venue: ${event.venue}
                              </p>
                            `
                                : ""
                            }
                            ${
                              event.location
                                ? `
                              <p style="margin: 0 0 12px; font-size: 16px; color: #374151;">
                                📍 Location: ${event.location}
                              </p>
                            `
                                : ""
                            }
                          </td>
                        </tr>
                      </table>

                      <!-- View Ticket Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td align="center" style="padding: 32px 0;">
                            <a
                              href="${eventUrl}"
                              style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 500; border-radius: 6px;"
                            >
                              View Your Ticket
                            </a>
                            <p style="margin: 16px 0 0; font-size: 14px; color: #6b7280; text-align: center;">
                              Click the button above to view your ticket QR code
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Ticket Details -->
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 32px;">
                        <tr>
                          <td>
                            <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #111827;">
                              Ticket Details
                            </h2>
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">
                                  Asset ID:
                                </td>
                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">
                                  ${ticketDetails.assetId}
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">
                                  Wallet:
                                </td>
                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace; word-break: break-all;">
                                  ${ticketDetails.userAddress}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Footer -->
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 32px;">
                        <tr>
                          <td style="text-align: center;">
                            <p style="margin: 0; font-size: 14px; color: #6b7280;">
                              Need help? Reply to this email or contact our support team.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

