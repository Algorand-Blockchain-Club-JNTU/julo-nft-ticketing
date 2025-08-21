"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Loader2 } from "lucide-react"
import { toast } from "react-toastify"

interface CertificateMintingProps {
  eventId: string
  eventName: string
  eventDate: string
  creatorAddress: string
  attendees: string[]
}

export function CertificateMinting({
  eventId,
  eventName,
  eventDate,
  creatorAddress,
  attendees
}: CertificateMintingProps) {
  console.log("CertificateMinting component initialized")
  const [isMinting, setIsMinting] = useState(false)
  const [certificatesMinted, setCertificatesMinted] = useState(false)

  const handleMintCertificates = async () => {
    setIsMinting(true)
    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          attendeeAddresses: attendees,
          creatorAddress
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setCertificatesMinted(true)
        toast.success(data.message)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error("Failed to mint certificates")
    } finally {
      setIsMinting(false)
    }
  }

  const isEventCompleted = new Date(eventDate) <= new Date()

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Participation Certificates</h3>
          </div>
          <Badge variant={isEventCompleted ? "default" : "secondary"}>
            {isEventCompleted ? "Event Completed" : "Event Pending"}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{attendees.length} attendees eligible for certificates</span>
          </div>
          
          {isEventCompleted && !certificatesMinted && (
            <Button 
              onClick={handleMintCertificates}
              disabled={isMinting || attendees.length === 0}
              className="w-full"
            >
              {isMinting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Minting Certificates...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 mr-2" />
                  Mint Participation Certificates
                </>
              )}
            </Button>
          )}
          
          {certificatesMinted && (
            <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Award className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-green-400 font-medium">Certificates Minted Successfully!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}