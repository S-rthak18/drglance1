"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { CameraFeed } from "./camera-feed"
import { AnalysisPanel } from "./analysis-panel"
import { HealthMetrics } from "./health-metrics"
import { RecommendationsPanel } from "./recommendations-panel"
import { ScanHistory } from "./scan-history"
import { DeviceStatus } from "./device-status"

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"oral" | "eye" | "skin">("skin")

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-[1800px] mx-auto space-y-6">
            {/* Top Section - Camera and Analysis */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <CameraFeed activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
              <div className="xl:col-span-1">
                <AnalysisPanel activeTab={activeTab} />
              </div>
            </div>

            {/* Middle Section - Metrics */}
            <HealthMetrics />

            {/* Bottom Section - Recommendations and History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecommendationsPanel />
              </div>
              <div className="lg:col-span-1">
                <DeviceStatus />
              </div>
            </div>

            {/* Scan History */}
            <ScanHistory />
          </div>
        </main>
      </div>
    </div>
  )
}
