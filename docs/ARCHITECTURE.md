# System Architecture & Data Flow

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DRGLANACE COMPLETE SYSTEM                            │
└─────────────────────────────────────────────────────────────────────────────┘

                              HARDWARE LAYER
                          ┌─────────────────┐
                          │   ESP32-CAM     │
                          │  + OV2640       │
                          │  Camera Module  │
                          └────────┬────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │   WiFi/MQTT Stream         │
                    │   JPEG Frames @ 10 FPS     │
                    ▼                            ▼

         ┌────────────────────────────────────────────────┐
         │         BROWSER (Next.js Frontend)             │
         ├────────────────────────────────────────────────┤
         │                                                │
         │  ┌──────────────────────────────────────────┐ │
         │  │  Dashboard Page                          │ │
         │  │  ┌────────────┐      ┌──────────────┐   │ │
         │  │  │ Sidebar    │      │ Header       │   │ │
         │  │  └────────────┘      └──────────────┘   │ │
         │  │                                         │ │
         │  │  ┌─────────────────────────────────┐   │ │
         │  │  │    Camera Feed (Canvas)         │   │ │
         │  │  │   • ESP32 Stream Renderer       │   │ │
         │  │  │   • Real-time Video            │   │ │
         │  │  └─────────────────────────────────┘   │ │
         │  │                                         │ │
         │  │  ┌──────────────┐  ┌──────────────┐   │ │
         │  │  │Analysis      │  │Health        │   │ │
         │  │  │Panel         │  │Metrics       │   │ │
         │  │  └──────────────┘  └──────────────┘   │ │
         │  │                                         │ │
         │  │  ┌──────────────┐  ┌──────────────┐   │ │
         │  │  │Recommend     │  │Scan History  │   │ │
         │  │  │ations Panel  │  │Table         │   │ │
         │  │  └──────────────┘  └──────────────┘   │ │
         │  │                                         │ │
         │  │  ┌──────────────────────────────────┐  │ │
         │  │  │  Device Status (ESP32 Config)    │  │ │
         │  │  └──────────────────────────────────┘  │ │
         │  │                                         │ │
         │  └──────────────────────────────────────────┘ │
         │                                                │
         └────────────────────────────────────────────────┘
                  │                            │
          ┌───────┴──────┐            ┌────────┴─────────┐
          │ ESP32Service │            │   fetch API      │
          │ • capture()  │            │   /api/analyze   │
          │ • stream()   │            │                  │
          │ • getStatus()│            └────────┬─────────┘
          └───────┬──────┘                     │
                  │                            │
          HTTP   │                      HTTP   │
          GET    │                      POST   │
          /stream│                            │
          /capture                            │
                  │                            ▼
    ┌─────────────▼──────────────┐  ┌────────────────────────┐
    │     ESP32 Web Server       │  │  Next.js API Server    │
    │                            │  ├────────────────────────┤
    │ • /stream - MJPEG          │  │                        │
    │ • /capture - Single JPEG   │  │  app/api/analyze/      │
    │ • /status - Device info    │  │  • Validate image      │
    │ • /config - Settings       │  │  • Forward to ML       │
    └────────────────────────────┘  │  • Return results      │
                                    └────────────┬───────────┘
                                                 │
                                          HTTP   │
                                          POST   │
                                                 ▼
    ┌──────────────────────────────────────────────────┐
    │      ML Analysis Server (Python FastAPI)         │
    ├──────────────────────────────────────────────────┤
    │                                                  │
    │  • /analyze - Single image analysis             │
    │  • /batch-analyze - Multiple images             │
    │  • /health - Server status                      │
    │                                                  │
    │  Model: TensorFlow/PyTorch                      │
    │  Input: 224x224 RGB image                       │
    │  Output: {                                       │
    │    condition, confidence, metrics,              │
    │    healthScore, recommendations                 │
    │  }                                              │
    └──────────────────────────────────────────────────┘
                            │
                            │ Results (JSON)
                            │
                            ▼
    ┌──────────────────────────────────────────────────┐
    │      PostgreSQL Database                        │
    ├──────────────────────────────────────────────────┤
    │                                                  │
    │  analysis_results:                              │
    │  • user_id, scan_type                          │
    │  • health_score, confidence                    │
    │  • condition, metrics (JSONB)                  │
    │  • recommendations (JSONB)                     │
    │  • created_at, updated_at                      │
    │                                                  │
    └──────────────────────────────────────────────────┘
```

---

## Detailed Data Flow

### 1️⃣ Capture & Stream Flow

```
User clicks "Start Stream"
        │
        ▼
┌─────────────────────────────────────┐
│ camera-feed.tsx                     │
│ • useState(isStreaming)             │
│ • useEffect runs                    │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ ESP32Service.streamFrames()         │
│ • Opens /stream endpoint            │
│ • Reads multipart JPEG data         │
│ • Yields individual frames          │
└────────────┬────────────────────────┘
             │
             ▼
   ┌─────────────────────────┐
   │ ESP32 Web Server        │
   │ GET /stream             │
   │ Returns: multipart/x-mixed-replace
   │ Content: JPEG frames    │
   └─────────────┬───────────┘
                 │
      MJPEG Stream (10-15 FPS)
                 │
                 ▼
   ┌─────────────────────────┐
   │ Canvas Element          │
   │ • ctx.drawImage()       │
   │ • Renders each frame    │
   │ • Shows live video      │
   └─────────────────────────┘
```

### 2️⃣ Capture & Analysis Flow

```
User clicks "Capture & Analyze"
        │
        ▼
┌──────────────────────────────────────┐
│ CameraFeed Component                 │
│ handleCapture()                      │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ ESP32Service.captureFrame()          │
│ GET /capture                         │
│ Returns: Single JPEG blob            │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Create FormData                      │
│ formData.append('image', blob)       │
└────────────┬───────────────────────┘
             │
        POST │
             ▼
┌──────────────────────────────────────┐
│ Next.js: /api/analyze                │
│ • Receive FormData                   │
│ • Validate image                     │
└────────────┬───────────────────────┘
             │
        POST │
             ▼
┌──────────────────────────────────────┐
│ ML Server: /analyze                  │
│ • Load image                         │
│ • Resize to 224x224                  │
│ • Normalize (0-1)                    │
│ • Run inference                      │
│ • Process output                     │
└────────────┬───────────────────────┘
             │
     JSON    │
             ▼
┌──────────────────────────────────────┐
│ {                                    │
│   "condition": "healthy",            │
│   "healthScore": 87,                 │
│   "confidence": 92,                  │
│   "metrics": {                       │
│     "Hydration": 85,                 │
│     "Elasticity": 90,                │
│     ...                              │
│   },                                 │
│   "recommendations": [...]           │
│ }                                    │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ AnalysisPanel Component              │
│ • Display results                    │
│ • Show recommendations               │
│ • Add to scan history                │
└──────────────────────────────────────┘
```

### 3️⃣ Save Results Flow

```
Analysis Complete
        │
        ▼
┌──────────────────────────────────────┐
│ User clicks "Save"                   │
│ or auto-save enabled                 │
└────────────┬───────────────────────┘
             │
        POST │
             ▼
┌──────────────────────────────────────┐
│ /api/results                         │
│ • Get userId from Clerk              │
│ • Validate data                      │
│ • Format for database                │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ PostgreSQL INSERT                    │
│ INSERT INTO analysis_results         │
│   (user_id, condition, ...)          │
│ VALUES (...)                         │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ ScanHistory Table Updated            │
│ • Query latest results               │
│ • Display in table                   │
└──────────────────────────────────────┘
```

---

## Network Communication Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                       WiFi Network (192.168.1.x)                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐        ┌──────────────────────┐       │
│  │   ESP32-CAM          │        │   Laptop/PC          │       │
│  │   192.168.1.100:80   │◄──────►│   192.168.1.X:3000   │       │
│  │                      │        │   192.168.1.X:8000   │       │
│  │  • /stream           │        │                      │       │
│  │  • /capture          │        │  • Next.js Dev       │       │
│  │  • /status           │        │  • ML Server         │       │
│  │  • /config           │        │                      │       │
│  └──────────────────────┘        └──────────────────────┘       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
          │                                  │
          │                                  │
          └──────────────────┬───────────────┘
                             │
                    Internet (optional)
                             │
           ┌─────────────────┴────────────────┐
           │                                  │
           ▼                                  ▼
    ┌────────────────┐              ┌─────────────────┐
    │ Cloud Database │              │ ML Server Cloud │
    │ (Production)   │              │ (AWS/Heroku)    │
    └────────────────┘              └─────────────────┘
```

---

## Component Dependency Tree

```
app/
├── page.tsx (Landing)
├── layout.tsx (Root with Clerk)
├── dashboard/
│   └── page.tsx
│       └── Dashboard Component
│           ├── Sidebar
│           ├── Header
│           ├── CameraFeed
│           │   └── Uses: ESP32Service
│           ├── AnalysisPanel
│           ├── HealthMetrics
│           ├── RecommendationsPanel
│           ├── ScanHistory
│           │   └── Uses: /api/results
│           └── DeviceStatus
│
├── api/
│   ├── analyze/
│   │   └── route.ts (ML Analysis)
│   │       └── Uses: ML Server (http://localhost:8000)
│   │
│   └── results/
│       └── route.ts (Database Operations)
│           └── Uses: PostgreSQL
│
└── lib/
    ├── esp32-service.ts (Hardware)
    │   └── Uses: ESP32 Web Server
    │
    └── ml-service.ts (ML Client)
        └── Uses: TensorFlow.js
```

---

## State Management Flow

```
┌─────────────────────────────────────┐
│ Dashboard Component (Root)          │
│                                     │
│ State:                              │
│ • sidebarOpen: boolean              │
│ • activeTab: 'skin'|'oral'|'eye'   │
└─────────────┬───────────────────────┘
              │
    ┌─────────┼─────────┬─────────┐
    │         │         │         │
    ▼         ▼         ▼         ▼
┌────────┐ ┌───────┐ ┌────────┐ ┌──────────┐
│Sidebar │ │Header │ │Camera  │ │Analysis  │
│        │ │       │ │Feed    │ │Panel     │
│ • open │ │• menu │ │        │ │          │
│ • onClose├─button│ │State:  │ │State:    │
└────────┘ └───────┘ │• stream│ │• results │
                    │• analyzing│ │• confidence│
                    │• error  │ │• condition│
                    │• activeTab │ │• metrics │
                    │• esp32Status│ │• recommendations│
                    └────────┘ └──────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────────┐
│ Operation Initiated                 │
└────────────┬────────────────────────┘
             │
             ▼
    ┌────────────────┐
    │ Try Block      │
    │ Execute Task   │
    └────────┬───────┘
             │
       ┌─────┴──────┐
       │            │
      YES          NO (Error)
       │            │
       ▼            ▼
   Success    ┌──────────────────┐
              │ catch(error)     │
              │                  │
              │ • Log error      │
              │ • Set error UI   │
              │ • Retry logic    │
              │ • User message   │
              └──────────────────┘
```

---

## Database Schema

```
analysis_results:
┌─────────────────────────────────────┐
│ Column              │ Type           │
├─────────────────────┼────────────────┤
│ id (PK)             │ SERIAL         │
│ user_id (FK)        │ TEXT           │
│ scan_type           │ VARCHAR(50)    │
│ health_score        │ FLOAT          │
│ confidence          │ FLOAT          │
│ condition           │ VARCHAR(20)    │
│ metrics             │ JSONB          │
│ recommendations     │ JSONB          │
│ image_url           │ VARCHAR(255)   │
│ created_at          │ TIMESTAMP      │
│ updated_at          │ TIMESTAMP      │
└─────────────────────┴────────────────┘

Indexes:
• (user_id, created_at DESC)
• (condition)
• (scan_type)
```

---

## Performance Metrics

```
Component              │ Time    │ Target
─────────────────────────────────────────
ESP32 Frame Capture    │ 100ms   │ <200ms
WiFi Transmission      │ 50ms    │ <100ms
Canvas Render          │ 16ms    │ <33ms (60fps)
API Request            │ 500ms   │ <1s
ML Inference           │ 800ms   │ <2s
Database Write         │ 50ms    │ <100ms
Total End-to-End       │ ~2s     │ <5s
─────────────────────────────────────────

Frame Rate:
• Stream: 10-15 FPS
• Capture: Single frame
• Analysis: 1 per capture
```

---

## Security Layers

```
┌─────────────────────────────────────────────┐
│          SECURITY ARCHITECTURE              │
└─────────────────────────────────────────────┘

Layer 1: WiFi Security
• SSID: Hidden
• WPA2/WPA3 encryption
• Strong password

Layer 2: Authentication
• Clerk JWT tokens
• Protected API routes
• User ID verification

Layer 3: API Validation
• File type validation
• File size limits
• Input sanitization
• Rate limiting

Layer 4: Data Protection
• HTTPS/TLS in production
• CORS configuration
• PostgreSQL encryption
• Secure key storage

Layer 5: ML Model Security
• No sensitive data in inference
• Output validation
• Error message sanitization
```

---

## Deployment Architecture (Production)

```
┌──────────────────────────────────────────────────────────────┐
│                      PRODUCTION SETUP                        │
└──────────────────────────────────────────────────────────────┘

Home/Lab:
┌──────────────┐
│ ESP32-CAM    │ (Local WiFi)
└──────┬───────┘
       │ Port Forwarding (Optional)
       │
Home Router ──► Internet ──┐
                           │
Cloud:                      │
┌──────────────────────────┼──────────────────┐
│                          │                  │
├──────────────────────────┴────────────────┬─┘
│
│ ┌──────────────────────────────┐
│ │ Vercel (Next.js Frontend)    │
│ │ • Deployed from Git          │
│ │ • Auto SSL                   │
│ │ • CDN enabled                │
│ │ • https://drglanace.app      │
│ └──────────┬───────────────────┘
│            │
│ ┌──────────▼───────────────────┐
│ │ Heroku/AWS (ML Server)       │
│ │ • Python FastAPI             │
│ │ • Docker container           │
│ │ • GPU support (optional)     │
│ │ • https://ml-api.drglanace   │
│ └──────────┬───────────────────┘
│            │
│ ┌──────────▼───────────────────┐
│ │ AWS RDS (PostgreSQL)         │
│ │ • Managed database           │
│ │ • Automated backups          │
│ │ • Encryption at rest         │
│ └──────────────────────────────┘
│
└──────────────────────────────────────────┘
```

---

## Technology Stack Summary

```
Frontend:
• Next.js 16 (React 19)
• TypeScript
• Tailwind CSS
• Shadcn/UI Components
• Clerk Authentication
• TensorFlow.js (optional)

Backend (Optional):
• Python 3.10+
• FastAPI
• TensorFlow/PyTorch
• Uvicorn

Hardware:
• ESP32-CAM (OV2640)
• WiFi connectivity
• 5V power supply

Database:
• PostgreSQL
• Vercel Postgres (cloud)

Deployment:
• Vercel (frontend)
• Heroku/AWS (backend)
• AWS RDS/Supabase (database)
```

---

**This architecture supports scalability from local prototype to production healthcare application! 🚀**

