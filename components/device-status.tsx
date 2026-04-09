"use client"

import { useState } from "react"
import { Cpu, Wifi, WifiOff, Battery, Thermometer, HardDrive, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function DeviceStatus() {
  const [ipAddress, setIpAddress] = useState("192.168.1.100")
  const [isConnected, setIsConnected] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnected(true)
      setIsConnecting(false)
    }, 2000)
  }

  const deviceStats = [
    { label: "Signal", value: "-45 dBm", icon: Wifi, status: "good" },
    { label: "Battery", value: "85%", icon: Battery, status: "good" },
    { label: "Temp", value: "42°C", icon: Thermometer, status: "warning" },
    { label: "Storage", value: "2.1 GB", icon: HardDrive, status: "good" },
  ]

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Cpu className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Device Status</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">ESP32-CAM Module</p>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
              isConnected ? "bg-chart-3/10 text-chart-3" : "bg-destructive/10 text-destructive",
            )}
          >
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isConnected ? "Online" : "Offline"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Form */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="ip" className="text-xs text-muted-foreground">
              Device IP Address
            </Label>
            <Input
              id="ip"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="192.168.x.x"
              className="bg-secondary border-border"
            />
          </div>
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className={cn(
              "w-full",
              isConnected
                ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : isConnected ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reconnect
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 mr-2" />
                Connect Device
              </>
            )}
          </Button>
        </div>

        {/* Device Stats */}
        {isConnected && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            {deviceStats.map((stat, index) => (
              <div key={index} className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon
                    className={cn(
                      "w-3.5 h-3.5",
                      stat.status === "good"
                        ? "text-chart-3"
                        : stat.status === "warning"
                          ? "text-chart-4"
                          : "text-destructive",
                    )}
                  />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-sm font-medium text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
