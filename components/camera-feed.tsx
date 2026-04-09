"use client"

import { useState } from "react"
import { Camera, Zap, RefreshCw, Maximize2, Settings2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface CameraFeedProps {
  activeTab: "oral" | "eye" | "skin"
  onTabChange: (tab: "oral" | "eye" | "skin") => void
}

export function CameraFeed({ activeTab, onTabChange }: CameraFeedProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [isConnected, setIsConnected] = useState(true)

  const handleCapture = () => {
    setIsCapturing(true)
    setTimeout(() => setIsCapturing(false), 1000)
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Live Scanner</CardTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <div
                  className={cn("w-2 h-2 rounded-full", isConnected ? "bg-chart-3 animate-pulse" : "bg-destructive")}
                />
                <span className="text-xs text-muted-foreground">
                  {isConnected ? "ESP32-CAM Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as typeof activeTab)}>
            <TabsList className="bg-secondary">
              <TabsTrigger
                value="skin"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Skin
              </TabsTrigger>
              <TabsTrigger
                value="oral"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Oral
              </TabsTrigger>
              <TabsTrigger
                value="eye"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Eye
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Camera Feed Area */}
        <div className="relative aspect-video bg-secondary/50 mx-4 rounded-lg overflow-hidden border border-border">
          {/* Placeholder for camera feed */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-primary/50" />
            </div>
            <p className="text-muted-foreground text-sm">Camera feed will appear here</p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Position your {activeTab === "skin" ? "skin area" : activeTab === "oral" ? "mouth" : "eye"} in frame
            </p>
          </div>

          {/* Scanning overlay */}
          {isCapturing && (
            <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-primary rounded-lg animate-pulse">
                <div className="w-full h-0.5 bg-primary" />
              </div>
            </div>
          )}

          {/* Camera controls overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-background/50 hover:bg-background/70 border-0"
              >
                <Settings2 className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-background/50 hover:bg-background/70 border-0"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-background/50 hover:bg-background/70 border-0"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            onClick={handleCapture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Capturing...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Capture Image
              </>
            )}
          </Button>
          <Button variant="secondary" className="flex-1 border border-border">
            <Zap className="w-4 h-4 mr-2 text-chart-4" />
            Analyze with AI
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
