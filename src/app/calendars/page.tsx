import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {  Plus } from "lucide-react";
import Link from "next/link";

export default function CalendarsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Calendars</h1>
          <Link href="/create">

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">My Calendars</h2>
            <Card className="bg-gray-900/50 border-white/10">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-lg font-medium">No Calendars</p>
                  <p className="text-sm text-gray-400">You are not an admin of any calendars.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Subscribed Calendars</h2>
            <Card className="bg-gray-900/50 border-white/10">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-lg font-medium">No Subscriptions</p>
                  <p className="text-sm text-gray-400">You have not subscribed to any calendars.</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

