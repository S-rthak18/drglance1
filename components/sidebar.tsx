"use client"

import { Camera, LayoutDashboard, History, Settings, HelpCircle, X, Cpu, Activity, FileText, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "#", current: true },
  { name: "Scanners", icon: Camera, href: "#", current: false },
  { name: "History", icon: History, href: "#", current: false },
  { name: "Reports", icon: FileText, href: "#", current: false },
  { name: "Devices", icon: Cpu, href: "#", current: false },
  { name: "Analytics", icon: Activity, href: "#", current: false },
]

const secondaryNavigation = [
  { name: "Notifications", icon: Bell, href: "#" },
  { name: "Settings", icon: Settings, href: "#" },
  { name: "Help", icon: HelpCircle, href: "#" },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border",
          "transform transition-transform duration-300 ease-in-out lg:transform-none",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">DrGlance</h1>
                <p className="text-xs text-muted-foreground">AI Analysis</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Main</p>
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  item.current
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
                {item.current && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </a>
            ))}

            <div className="pt-6">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Support</p>
              {secondaryNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </a>
              ))}
            </div>
          </nav>

          {/* Device Status */}
          <div className="p-4 border-t border-border">
            <div className="p-3 rounded-lg bg-secondary">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-foreground">ESP32-CAM</span>
              </div>
              <p className="text-xs text-muted-foreground">Connected • 192.168.1.100</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
