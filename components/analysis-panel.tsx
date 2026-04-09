"use client"
import { Brain, AlertCircle, CheckCircle2, Clock, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface AnalysisPanelProps {
  activeTab: "oral" | "eye" | "skin"
}

export function AnalysisPanel({ activeTab }: AnalysisPanelProps) {
  const analysisResults = {
    skin: {
      condition: "Healthy",
      confidence: 94,
      issues: [
        { name: "Hydration Level", status: "good", value: 78 },
        { name: "Oil Balance", status: "warning", value: 62 },
        { name: "Texture", status: "good", value: 85 },
        { name: "Pore Visibility", status: "good", value: 71 },
      ],
    },
    oral: {
      condition: "Good",
      confidence: 89,
      issues: [
        { name: "Gum Health", status: "good", value: 82 },
        { name: "Plaque Level", status: "warning", value: 45 },
        { name: "Teeth Color", status: "good", value: 76 },
        { name: "Inflammation", status: "good", value: 12 },
      ],
    },
    eye: {
      condition: "Healthy",
      confidence: 92,
      issues: [
        { name: "Redness Level", status: "good", value: 15 },
        { name: "Clarity", status: "good", value: 88 },
        { name: "Yellow Index", status: "good", value: 8 },
        { name: "Irritation", status: "good", value: 10 },
      ],
    },
  }

  const currentAnalysis = analysisResults[activeTab]

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-chart-2" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Analysis</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">ML Model Results</p>
            </div>
          </div>
          <div
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
              currentAnalysis.condition === "Healthy" ? "bg-chart-3/10 text-chart-3" : "bg-chart-4/10 text-chart-4",
            )}
          >
            {currentAnalysis.condition === "Healthy" ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
            {currentAnalysis.condition}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Confidence Score */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Confidence Score</span>
            <span className="text-2xl font-bold text-primary">{currentAnalysis.confidence}%</span>
          </div>
          <Progress value={currentAnalysis.confidence} className="h-2" />
        </div>

        {/* Analysis Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Detected Metrics
          </h4>

          {currentAnalysis.issues.map((issue, index) => (
            <div key={index} className="p-3 rounded-lg bg-secondary/30 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{issue.name}</span>
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    issue.status === "good"
                      ? "bg-chart-3"
                      : issue.status === "warning"
                        ? "bg-chart-4"
                        : "bg-destructive",
                  )}
                />
              </div>
              <div className="flex items-center gap-3">
                <Progress
                  value={issue.value}
                  className={cn(
                    "h-1.5 flex-1",
                    issue.status === "good"
                      ? "[&>div]:bg-chart-3"
                      : issue.status === "warning"
                        ? "[&>div]:bg-chart-4"
                        : "[&>div]:bg-destructive",
                  )}
                />
                <span className="text-xs text-muted-foreground w-8">{issue.value}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Last Analysis Time */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Last analyzed: 2 minutes ago
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
