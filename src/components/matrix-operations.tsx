"use client"

import { useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

/**
 * Debe ser si o si una variable de entorno
 */
const API_BASE_URL = "http://137.184.33.212:8000"

export default function MatrixOperations() {
  const [Q, setQ] = useState<number[][]>([])
  const [R, setR] = useState<number[][]>([])
  const [stats, setStats] = useState<any>(null)
  const [token, setToken] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleMatrixRotation = async () => {
    try {
      setError(null)
      setIsLoading(true)

      const res = await axios.post(
        `${API_BASE_URL}/api/rotate`,
        { Q, R },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setQ(res.data.rotatedQ || res.data.Q || Q)
      setR(res.data.rotatedR || res.data.R || R)
    } catch (error: any) {
      console.error("Error rotating matrix:", error)
      setError(error.response?.data?.message || "Failed to rotate matrix. Please check your input and token.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStats = async () => {
    try {
      setError(null)
      setIsLoading(true)

      const res = await axios.post(
        `${API_BASE_URL}/api/factorize`,
        { Q, R },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setStats(res.data.stats || res.data)
    } catch (error: any) {
      console.error("Error getting stats:", error)
      setError(error.response?.data?.message || "Failed to get statistics. Please check your input and token.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQChange = (value: string) => {
    try {
      setQ(JSON.parse(value))
      setError(null)
    } catch (e) {
      setError("Invalid JSON format for Q matrix")
    }
  }

  const handleRChange = (value: string) => {
    try {
      setR(JSON.parse(value))
      setError(null)
    } catch (e) {
      setError("Invalid JSON format for R matrix")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Matrix Operations</h1>

      <div className="mb-4 text-center text-sm text-muted-foreground">
        Using API:{" "}
        <a href={`${API_BASE_URL}/api-docs/`} target="_blank" rel="noopener noreferrer" className="underline">
          {API_BASE_URL}/api-docs/
        </a>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Enter your JWT token to authenticate API requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter JWT Token"
            className="w-full"
          />
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Q Matrix</CardTitle>
            <CardDescription>Enter your Q matrix in JSON format</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={6}
              value={JSON.stringify(Q, null, 2)}
              onChange={(e) => handleQChange(e.target.value)}
              placeholder="[[1, 2], [3, 4]]"
              className="font-mono"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>R Matrix</CardTitle>
            <CardDescription>Enter your R matrix in JSON format</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={6}
              value={JSON.stringify(R, null, 2)}
              onChange={(e) => handleRChange(e.target.value)}
              placeholder="[[5, 6], [7, 8]]"
              className="font-mono"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={handleMatrixRotation} size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Rotate Matrix"
          )}
        </Button>
        <Button onClick={handleStats} size="lg" variant="outline" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Get Stats"
          )}
        </Button>
      </div>

      <Tabs defaultValue="matrices" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matrices">Rotated Matrices</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="matrices">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rotated Q Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] font-mono text-sm">
                  {JSON.stringify(Q, null, 2) || "No data available"}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rotated R Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] font-mono text-sm">
                  {JSON.stringify(R, null, 2) || "No data available"}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Matrix Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Q Matrix Stats</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] font-mono text-sm">
                      {JSON.stringify(stats.Q, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">R Matrix Stats</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] font-mono text-sm">
                      {JSON.stringify(stats.R, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No statistics available. Click Get Stats to calculate.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
