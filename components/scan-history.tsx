"use client"

import { useState } from "react"
import { History, Download, Eye, Trash2, MoreHorizontal, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const scanHistory = [
  { id: 1, type: "skin", date: "Today, 2:34 PM", result: "Healthy", confidence: 94 },
  { id: 2, type: "oral", date: "Today, 11:20 AM", result: "Good", confidence: 89 },
  { id: 3, type: "eye", date: "Yesterday, 4:15 PM", result: "Healthy", confidence: 92 },
  { id: 4, type: "skin", date: "Yesterday, 10:00 AM", result: "Attention", confidence: 76 },
  { id: 5, type: "oral", date: "2 days ago", result: "Good", confidence: 88 },
]

export function ScanHistory() {
  const [filter, setFilter] = useState("all")

  const filteredHistory = filter === "all" ? scanHistory : scanHistory.filter((scan) => scan.type === filter)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-5/10 flex items-center justify-center">
              <History className="w-5 h-5 text-chart-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Scan History</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{scanHistory.length} total scans</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="bg-secondary h-9">
                <TabsTrigger
                  value="all"
                  className="text-xs h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="skin"
                  className="text-xs h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Skin
                </TabsTrigger>
                <TabsTrigger
                  value="oral"
                  className="text-xs h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Oral
                </TabsTrigger>
                <TabsTrigger
                  value="eye"
                  className="text-xs h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Eye
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" className="h-9 border-border bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Scan
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Result
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Confidence
                </th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHistory.map((scan) => (
                <tr key={scan.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">#{scan.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="capitalize border-border">
                      {scan.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{scan.date}</td>
                  <td className="py-3 px-4">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-sm font-medium",
                        scan.result === "Healthy" || scan.result === "Good" ? "text-chart-3" : "text-chart-4",
                      )}
                    >
                      {scan.result === "Healthy" || scan.result === "Good" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      {scan.result}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            scan.confidence >= 90 ? "bg-chart-3" : scan.confidence >= 80 ? "bg-primary" : "bg-chart-4",
                          )}
                          style={{ width: `${scan.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{scan.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="py-12 text-center">
            <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No scan history found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Capture your first image to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
