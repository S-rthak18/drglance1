"use client"

import { Lightbulb, ArrowRight, Shield, Droplet, Moon, Apple } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const recommendations = [
  {
    id: 1,
    title: "Increase Daily Water Intake",
    description:
      "Based on your hydration analysis, we recommend drinking at least 8 glasses of water daily to improve skin elasticity.",
    priority: "high",
    category: "Hydration",
    icon: Droplet,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    id: 2,
    title: "Apply SPF 30+ Sunscreen",
    description:
      "UV analysis suggests moderate exposure. Use broad-spectrum sunscreen for protection against sun damage.",
    priority: "medium",
    category: "Protection",
    icon: Shield,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    id: 3,
    title: "Improve Sleep Quality",
    description: "Dark circles detected. Aim for 7-9 hours of quality sleep to reduce under-eye appearance.",
    priority: "medium",
    category: "Lifestyle",
    icon: Moon,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    id: 4,
    title: "Add Antioxidant-Rich Foods",
    description: "Include berries, leafy greens, and nuts in your diet to support skin health from within.",
    priority: "low",
    category: "Nutrition",
    icon: Apple,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
]

export function RecommendationsPanel() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-chart-4" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Recommendations</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Personalized health tips</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", rec.bgColor)}>
                  <rec.icon className={cn("w-4 h-4", rec.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">{rec.title}</h4>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 text-[10px] px-1.5",
                        rec.priority === "high"
                          ? "border-destructive/30 text-destructive"
                          : rec.priority === "medium"
                            ? "border-chart-4/30 text-chart-4"
                            : "border-chart-3/30 text-chart-3",
                      )}
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{rec.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{rec.category}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
