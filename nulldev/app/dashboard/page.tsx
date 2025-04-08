"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ApiResponse {
  message: string
  timestamp: string
}

export default function Dashboard() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/hello")
        const apiData = await response.json()
        setData(apiData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <div className="ml-auto font-bold">nulldev Dashboard</div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>API Connection</CardTitle>
                <CardDescription>Data fetched from the Node.js backend</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : data ? (
                  <div className="space-y-2">
                    <div className="font-medium">Message:</div>
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{data.message}</div>
                    <div className="font-medium">Timestamp:</div>
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{data.timestamp}</div>
                  </div>
                ) : (
                  <div className="text-red-500">Failed to load data</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Send Data to API</CardTitle>
                <CardDescription>Test the POST endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const message = formData.get("message")

                    try {
                      const response = await fetch("/api/hello", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ message }),
                      })

                      const result = await response.json()
                      alert(`Response: ${JSON.stringify(result, null, 2)}`)
                    } catch (error) {
                      console.error("Error posting data:", error)
                      alert("Error sending data to API")
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <input
                      id="message"
                      name="message"
                      className="w-full p-2 border rounded"
                      placeholder="Enter a message to send"
                      required
                    />
                  </div>
                  <Button type="submit">Send to API</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">© 2025 nulldev. All rights reserved.</p>
      </footer>
    </div>
  )
}
