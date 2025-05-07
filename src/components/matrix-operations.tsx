"use client"

import { useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"

const API_BASE_URL = "http://137.184.33.212:8000/api"

const matrixExamples = {
  matrix2x2: {
    name: "2x2 Matrix",
    matrix: [
      [1, 2],
      [3, 4],
    ],
  },
  matrix3x2: {
    name: "3x2 Matrix",
    matrix: [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
  },
  matrix3x3: {
    name: "3x3 Matrix",
    matrix: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
  },
  matrix4x2: {
    name: "4x2 Matrix",
    matrix: [
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ],
  },
}

export default function MatrixOperations() {
  const [matrix, setMatrix] = useState<number[][]>([])
  const [Q, setQ] = useState<number[][]>([])
  const [R, setR] = useState<number[][]>([])
  const [stats, setStats] = useState<any>(null)
  const [token, setToken] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("input")
  const [hasFactorized, setHasFactorized] = useState<boolean>(false)

  const handleFactorize = async () => {
    try {
      setError(null)
      setIsLoading(true)

      const res = await axios.post(
        `${API_BASE_URL}/factorize`,
        { matrix },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )


      setQ(res.data.Q || [])
      setR(res.data.R || [])
      setStats(res.data.stats || [])
      setHasFactorized(true)

      setActiveTab("results")
    } catch (error: any) {
      console.error("Error factorizing matrix:", error)
      setError(error.response?.data?.message || "Failed to factorize matrix. Please check your input and token.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRotate = async () => {
    try {
      setError(null)
      setIsLoading(true)

      const res = await axios.post(
        `${API_BASE_URL}/rotate`,
        {
          qMatrix: Q,
          rMatrix: R,
        },
      )

      if (res.data.qMatrix) {
        setQ(res.data.qMatrix)
      }
      if (res.data.rMatrix) {
        setR(res.data.rMatrix)
      }

      setActiveTab("results")
    } catch (error: any) {
      console.error("Error rotating matrix:", error)
      setError(error.response?.data?.message || "Failed to rotate matrix. Please check your input and token.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMatrixChange = (value: string) => {
    try {
      setMatrix(JSON.parse(value))
      setError(null)
    } catch (e) {
      setError("Invalid JSON format for matrix")
    }
  }

  const loadExample = (exampleKey: string) => {
    const example = matrixExamples[exampleKey as keyof typeof matrixExamples]
    if (example) {
      setMatrix(example.matrix)
      setError(null)
      setHasFactorized(false)
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Input Matrix</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Example Matrices</CardTitle>
              <CardDescription>Select a predefined example to quickly test the API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(matrixExamples).map(([key, example]) => (
                  <Button key={key} variant="outline" onClick={() => loadExample(key)} className="h-auto py-2">
                    {example.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Input Matrix</CardTitle>
              <CardDescription>Enter your matrix in JSON format</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={8}
                value={JSON.stringify(matrix, null, 2)}
                onChange={(e) => handleMatrixChange(e.target.value)}
                placeholder="[[1, 2], [3, 4], [5, 6]]"
                className="font-mono"
              />
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 mb-8">
            <Button onClick={handleFactorize} size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Factorizing...
                </>
              ) : (
                "Factorize Matrix"
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="results">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Q Matrix</CardTitle>
                <CardDescription>Orthogonal matrix from factorization</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] font-mono text-sm">
                  {Q.length > 0 ? JSON.stringify(Q, null, 2) : "No data available"}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>R Matrix</CardTitle>
                <CardDescription>Upper triangular matrix from factorization</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] font-mono text-sm">
                  {R.length > 0 ? JSON.stringify(R, null, 2) : "No data available"}
                </pre>
              </CardContent>
            </Card>
          </div>

          {stats && stats.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Matrix Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] font-mono text-sm">
                  {JSON.stringify(stats, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center gap-4 mb-8">
            <Button onClick={handleRotate} size="lg" disabled={isLoading || !hasFactorized}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rotating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Rotate Q & R Matrices
                </>
              )}
            </Button>
            <Button onClick={() => setActiveTab("input")} variant="outline">
              Back to Input
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
