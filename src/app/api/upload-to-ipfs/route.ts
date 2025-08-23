import { NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";

/**
 * Handles POST requests to upload files to IPFS via Pinata.
 * Converts the uploaded file to a buffer and pins it to IPFS.
 * @param req - The incoming request containing the file to upload
 * @returns A JSON response with IPFS hash and URL or error message
 */
export async function POST(req: Request) {
  try {
    console.log("Uploading file to IPFS")
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Create form data for Pinata
    const pinataFormData = new FormData()
    pinataFormData.append("file", buffer, {
      filename: file.name,
      contentType: file.type,
    })

    // Set Pinata options
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    })
    pinataFormData.append("pinataOptions", pinataOptions)

    // Upload to Pinata
    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", pinataFormData, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
        ...pinataFormData.getHeaders(),
      },
    })

    return NextResponse.json({
      success: true,
      ipfsHash: response.data.IpfsHash,
      ipfsUrl: `ipfs://${response.data.IpfsHash}`,
    })
  } catch (error) {
    console.error("IPFS upload error :", error)
    return NextResponse.json({ error: "Failed to upload to IPFS" }, { status: 500 })
  }
}

