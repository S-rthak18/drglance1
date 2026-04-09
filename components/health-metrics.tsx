"use client"

import { TrendingUp, TrendingDown, Droplets, Sun, Activity, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const metrics = [
  {
    name: "Overall Health Score",
    value: "87",
    unit: "/100",
    change: "+5",
    trend: "up",
    icon: Heart,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    name: "Hydration Level",
    value: "78",
    unit: "%",
    change: "+2",
    trend: "up",
    icon: Droplets,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    name: "UV Exposure",
    value: "Low",
    unit: "",
    change: "Safe",
    trend: "neutral",
    icon: Sun,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    name: "Skin Condition",
    value: "Good",
    unit: "",
    change: "Stable",
    trend: "neutral",
    icon: Activity,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
]

export function HealthMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", metric.bgColor)}>
                <metric.icon className={cn("w-5 h-5", metric.color)} />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  metric.trend === "up"
                    ? "text-chart-3 bg-chart-3/10"
                    : metric.trend === "down"
                      ? "text-destructive bg-destructive/10"
                      : "text-muted-foreground bg-secondary",
                )}
              >
                {metric.trend === "up" && <TrendingUp className="w-3 h-3" />}
                {metric.trend === "down" && <TrendingDown className="w-3 h-3" />}
                {metric.change}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{metric.name}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
