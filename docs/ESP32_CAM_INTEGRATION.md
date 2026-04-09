# ESP32-CAM Integration Guide

## Overview
This guide explains how to connect your ESP32-CAM hardware to the DrGlance web application and stream real-time camera feeds.

---

## Part 1: ESP32-CAM Hardware Setup

### Requirements
- **ESP32-CAM Module** (with OV2640 camera)
- **USB-TTL Converter** (CH340 or similar)
- **5V Power Supply** (2A minimum)
- **Jumper Wires**
- **Micro USB Cable**

### Hardware Connection

#### Pinout Diagram
```
ESP32-CAM Pin Connections:

Camera Pins (Built-in):
- Camera Module: Connected internally
- No additional wiring needed

Power Pins:
- 5V (Red) → 5V Power Supply
- GND (Black) → GND Power Supply

Programming Pins (USB-TTL):
- U0R → RX (USB-TTL RX pin)
- U0T → TX (USB-TTL TX pin)
- GND → GND (USB-TTL GND pin)

GPIO Pins (Optional - for additional sensors):
- GPIO12 → A0 (Light sensor)
- GPIO13 → A1 (Temperature sensor)
```

#### Step-by-Step Connection

1. **Power Supply Connection**
   - Connect 5V+ to the 5V pin on ESP32-CAM
   - Connect GND to the GND pin
   - Use a capacitor (470µF) between 5V and GND for stability

2. **USB-TTL Connection** (for initial programming)
   - TX (USB-TTL) → U0R (ESP32-CAM)
   - RX (USB-TTL) → U0T (ESP32-CAM)
   - GND (USB-TTL) → GND (ESP32-CAM)

3. **Boot Mode Setup**
   - Connect GPIO0 to GND (for programming mode)
   - Connect GPIO2 to GND (for Flash mode)
   - Keep both low during upload

4. **Reset Button** (Optional)
   - Connect a momentary button between RST and GND
   - Press to reset the device

---

## Part 2: ESP32 Firmware Setup

### Prerequisites
- Arduino IDE or PlatformIO
- ESP32 Board Package installed
- Libraries: WiFi, WebServer, esp_camera

### Installation Steps

#### 1. Install Arduino IDE
```bash
# Download from: https://www.arduino.cc/en/software
# Install Arduino IDE for your OS
```

#### 2. Add ESP32 Board Support
In Arduino IDE:
1. File → Preferences
2. Add to "Additional Boards Manager URLs":
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```
3. Tools → Board → Boards Manager
4. Search "ESP32" and install "esp32 by Espressif Systems"

#### 3. Required Libraries
```
Sketch → Include Library → Manage Libraries

Search and install:
- ArduinoJSON (by Benoit Blanchon)
- WiFi (built-in)
- WebServer (built-in)
```

### Upload Firmware Code

Create a new sketch with this code:

```cpp
#include <WiFi.h>
#include <WebServer.h>
#include "esp_camera.h"
#include "esp_timer.h"
#include "img_converters.h"
#include "Arduino.h"

// Camera configuration
#define PWDN_GPIO_NUM 32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 0
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27

#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 21
#define Y4_GPIO_NUM 19
#define Y3_GPIO_NUM 18
#define Y2_GPIO_NUM 5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define PCLK_GPIO_NUM 22

// WiFi Configuration
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* serverIP = "192.168.1.X";  // Your laptop/server IP

WebServer server(80);

void setup() {
  Serial.begin(115200);
  delay(10);

  // Initialize camera
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sda = SIOD_GPIO_NUM;
  config.pin_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 10;
  config.fb_count = 1;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  // Sensor Settings
  sensor_t *s = esp_camera_sensor_get();
  s->set_brightness(s, 0);        // -2 to 2
  s->set_contrast(s, 0);          // -2 to 2
  s->set_saturation(s, 0);        // -2 to 2
  s->set_special_effect(s, 0);    // 0 to 6 (0 - No Effect, 1 - Negative, 2 - Grayscale, 3 - Red Tint, 4 - Green Tint, 5 - Blue Tint, 6 - Sepia)
  s->set_whitebal(s, 1);          // 0 = Disable , 1 = Enable
  s->set_awb_gain(s, 1);          // 0 = Disable , 1 = Enable
  s->set_wb_mode(s, 0);           // 0 to 4 - if awb_gain enabled (0 - Auto, 1 - Sunny, 2 - Cloudy, 3 - Office, 4 - Home)
  s->set_expose_ctrl(s, 1);       // 0 = Disable , 1 = Enable
  s->set_aec2(s, 0);              // 0 = Disable , 1 = Enable
  s->set_gain_ctrl(s, 1);         // 0 = Disable , 1 = Enable
  s->set_agc_gain(s, 0);          // 0 to 30
  s->set_gainceiling(s, (gainceiling_t)0);  // 0 to 6
  s->set_bpc(s, 0);               // 0 = Disable , 1 = Enable
  s->set_wpc(s, 1);               // 0 = Disable , 1 = Enable
  s->set_raw_gma(s, 1);           // 0 = Disable , 1 = Enable
  s->set_lenc(s, 1);              // 0 = Disable , 1 = Enable
  s->set_hmirror(s, 0);           // 0 = Disable , 1 = Enable
  s->set_vflip(s, 0);             // 0 = Disable , 1 = Enable
  s->set_dcw(s, 1);               // 0 = Disable , 1 = Enable
  s->set_colorbar(s, 0);          // 0 = Disable , 1 = Enable

  // Connect to WiFi
  WiFi.begin(ssid, password);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println(WiFi.localIP());
  }

  // Setup routes
  server.on("/capture", handleCapture);
  server.on("/stream", handleStream);
  server.on("/status", handleStatus);
  server.begin();

  Serial.println("Server started");
}

void loop() {
  server.handleClient();
}

void handleCapture() {
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    server.send(500, "text/plain", "Camera capture failed");
    return;
  }

  server.send_P(200, "image/jpeg", (const char *)fb->buf, fb->len);
  esp_camera_fb_return(fb);
}

void handleStream() {
  WiFiClient client = server.client();
  String response = "HTTP/1.1 200 OK\r\n";
  response += "Content-Type: multipart/x-mixed-replace; boundary=frame\r\n\r\n";
  server.sendContent(response);

  while (client.connected()) {
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) {
      break;
    }

    String part = "--frame\r\nContent-Type: image/jpeg\r\nContent-length: ";
    part += fb->len;
    part += "\r\n\r\n";
    server.sendContent(part);
    server.sendContent_P((const char *)fb->buf, fb->len);
    server.sendContent("\r\n");
    esp_camera_fb_return(fb);
    delay(100);  // 100ms between frames = ~10 FPS
  }
}

void handleStatus() {
  String json = "{\"ip\":\"" + WiFi.localIP().toString() + "\",";
  json += "\"ssid\":\"" + String(ssid) + "\",";
  json += "\"signal\":" + String(WiFi.RSSI()) + ",";
  json += "\"uptime\":" + String(millis() / 1000) + "}";
  server.send(200, "application/json", json);
}
```

### Upload Settings

1. **Board**: ESP32 Wrover Module
2. **Upload Speed**: 115200
3. **CPU Frequency**: 80MHz
4. **Flash Frequency**: 40MHz
5. **Flash Mode**: QIO
6. **Flash Size**: 4MB
7. **Port**: COM3 (or your USB port)

---

## Part 3: Connect to Next.js Frontend

### Create ESP32 Service (`lib/esp32-service.ts`)

```typescript
class ESP32Service {
  private esp32IP: string

  constructor(ip: string = "http://192.168.1.100") {
    this.esp32IP = ip
  }

  // Get current frame
  async captureFrame(): Promise<Blob> {
    const response = await fetch(`${this.esp32IP}/capture`)
    return response.blob()
  }

  // Stream video frames
  async *streamFrames() {
    const response = await fetch(`${this.esp32IP}/stream`)
    const reader = response.body?.getReader()

    if (!reader) throw new Error("Stream not available")

    let buffer = new Uint8Array()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer = new Uint8Array([...buffer, ...value])

      // Find JPEG boundaries
      const jpegStart = findJPEGStart(buffer)
      const jpegEnd = findJPEGEnd(buffer, jpegStart)

      if (jpegStart !== -1 && jpegEnd !== -1) {
        const jpeg = buffer.slice(jpegStart, jpegEnd)
        yield new Blob([jpeg], { type: "image/jpeg" })

        buffer = buffer.slice(jpegEnd)
      }
    }
  }

  // Get device status
  async getStatus(): Promise<any> {
    const response = await fetch(`${this.esp32IP}/status`)
    return response.json()
  }

  // Set configuration
  async setConfig(config: any): Promise<void> {
    await fetch(`${this.esp32IP}/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    })
  }
}

function findJPEGStart(buffer: Uint8Array): number {
  for (let i = 0; i < buffer.length - 1; i++) {
    if (buffer[i] === 0xff && buffer[i + 1] === 0xd8) {
      return i
    }
  }
  return -1
}

function findJPEGEnd(buffer: Uint8Array, start: number): number {
  for (let i = start + 2; i < buffer.length - 1; i++) {
    if (buffer[i] === 0xff && buffer[i + 1] === 0xd9) {
      return i + 2
    }
  }
  return -1
}

export default new ESP32Service()
```

### Update Camera Feed Component (`components/camera-feed.tsx`)

```typescript
"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ESP32Service from "@/lib/esp32-service"
import { Settings, Maximize2, RotateCcw, Loader } from "lucide-react"

interface CameraFeedProps {
  activeTab: "skin" | "oral" | "eye"
  onTabChange: (tab: "skin" | "oral" | "eye") => void
}

export function CameraFeed({ activeTab, onTabChange }: CameraFeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [esp32Status, setEsp32Status] = useState<string>("Connecting...")
  const [error, setError] = useState<string | null>(null)

  // Start streaming frames
  useEffect(() => {
    let abortController = new AbortController()

    const startStream = async () => {
      try {
        setIsStreaming(true)
        setError(null)

        // Check ESP32 status first
        const status = await ESP32Service.getStatus()
        setEsp32Status(`Connected • ${status.ip}`)

        // Stream frames to canvas
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        for await (const frameBlob of ESP32Service.streamFrames()) {
          if (abortController.signal.aborted) break

          const url = URL.createObjectURL(frameBlob)
          const img = new Image()

          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            URL.revokeObjectURL(url)
          }

          img.src = url
        }
      } catch (err) {
        setError(`Connection failed: ${err instanceof Error ? err.message : "Unknown error"}`)
        setEsp32Status("Disconnected")
        setIsStreaming(false)
      }
    }

    if (isStreaming) {
      startStream()
    }

    return () => {
      abortController.abort()
    }
  }, [isStreaming])

  const handleCapture = async () => {
    try {
      setIsAnalyzing(true)
      const frameBlob = await ESP32Service.captureFrame()
      const formData = new FormData()
      formData.append("image", frameBlob)

      // Send to ML API (see ML Integration section)
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      console.log("Analysis result:", result)
    } catch (err) {
      setError("Capture failed")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Live Scanner</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{esp32Status}</p>
          </div>
          {error && <div className="text-xs text-red-600">{error}</div>}
        </div>

        {/* Scan Type Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skin">Skin</TabsTrigger>
            <TabsTrigger value="oral">Oral</TabsTrigger>
            <TabsTrigger value="eye">Eye</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Camera Feed */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="w-full h-full object-cover"
          />

          {!isStreaming && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Button onClick={() => setIsStreaming(true)} className="gap-2">
                {isStreaming ? <Loader className="animate-spin" /> : null}
                Start Stream
              </Button>
            </div>
          )}

          {/* Scanning Overlay */}
          {isStreaming && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border-2 border-cyan-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 bg-linear-to-b from-cyan-500/10 via-transparent to-cyan-500/10" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={handleCapture}
            disabled={!isStreaming || isAnalyzing}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            {isAnalyzing ? (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              "Capture & Analyze"
            )}
          </Button>

          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Maximize2 className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsStreaming(!isStreaming)}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## Part 4: Network Configuration

### Find ESP32 IP Address

After uploading code and power cycling ESP32:

1. **Check Serial Monitor** (115200 baud):
   ```
   WiFi connected
   192.168.1.100
   ```

2. **Alternative - Router Admin Panel**:
   - Access router (usually 192.168.1.1)
   - Look for connected devices
   - Find ESP32-CAM in list

3. **Update in Code**:
   - Replace `ESP32_IP` in `camera-feed.tsx`
   - Update ESP32Service instantiation

### Firewall Rules

If stream doesn't work:

**Windows:**
```powershell
# Allow port 80
New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
```

**Linux:**
```bash
sudo ufw allow 80/tcp
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Camera not initializing | Check GPIO connections, try different FRAMESIZE |
| No WiFi connection | Verify SSID/password, check router range |
| Stream latency high | Reduce JPEG quality, increase frame size threshold |
| No image output | Check USB power (need 2A min), verify camera module |
| Connection refused | Ping ESP32 IP, check firewall rules |
| Distorted image | Adjust camera settings (brightness, contrast) |

---

## Performance Tips

- **Frame Rate**: Adjust `delay()` in handleStream (lower = higher FPS)
- **Quality**: Modify `jpeg_quality` (1-63, higher = better but slower)
- **Resolution**: Change `FRAMESIZE_VGA` to other options
- **Bandwidth**: Reduce resolution if WiFi is slow

