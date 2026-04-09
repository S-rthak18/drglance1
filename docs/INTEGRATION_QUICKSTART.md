# Complete Integration Quick Start Guide

## 🚀 Full Stack Setup: Hardware → ML → Web

This guide takes you through the complete setup in **4 main steps**.

---

## Step 1️⃣: ESP32-CAM Hardware (30 mins)

### Hardware Assembly
```
5V Power ──────→ ESP32-CAM [5V]
GND ───────────→ ESP32-CAM [GND]
USB-TTL RX ────→ ESP32-CAM [U0R]
USB-TTL TX ────→ ESP32-CAM [U0T]
USB-TTL GND ───→ ESP32-CAM [GND]
```

### Code Upload
1. Install Arduino IDE + ESP32 board package
2. Copy the firmware code from `ESP32_CAM_INTEGRATION.md`
3. Set `ssid` and `password` to your WiFi
4. Set `serverIP` to your laptop/server IP
5. Upload to ESP32

### Verify Connection
```bash
# Find ESP32 IP address from Serial Monitor
# Should see: "WiFi connected" and "192.168.1.X"
```

**Documentation**: See `docs/ESP32_CAM_INTEGRATION.md` - Part 1 & 2

---

## Step 2️⃣: ML Model Server Setup (20 mins)

### Choose Your Setup

#### Option A: Browser-Based (TensorFlow.js) ⚡ EASIEST
```bash
# 1. Convert your model
pip install tensorflowjs
tensorflowjs_converter --input_format keras model.h5 public/models/health-model/

# 2. No server needed! Model runs in browser
# 3. Skip to Step 3
```

#### Option B: Python Backend 🔧 MORE POWERFUL
```bash
# 1. Create directory and install
mkdir ml-server
cd ml-server
pip install fastapi uvicorn tensorflow

# 2. Create ml_server.py (copy from ML_MODEL_INTEGRATION.md)

# 3. Run server
python ml_server.py
# Server runs on http://localhost:8000
```

### Test ML Server
```bash
# Create test image
python -c "from PIL import Image; import numpy as np; Image.fromarray(np.random.randint(0,255,(224,224,3),dtype=np.uint8)).save('test.jpg')"

# Test analysis
curl -X POST -F "file=@test.jpg" http://localhost:8000/analyze
```

**Documentation**: See `docs/ML_MODEL_INTEGRATION.md` - Part 1 & 2

---

## Step 3️⃣: Connect Frontend to Hardware & ML

### 1. Create ESP32 Service
Create `lib/esp32-service.ts` (code provided in ESP32_CAM_INTEGRATION.md)

### 2. Update Environment
```env
# .env.local
ML_SERVER_URL=http://localhost:8000
ESP32_IP=http://192.168.1.100
```

### 3. Create API Route
Create `app/api/analyze/route.ts` (code provided in ML_MODEL_INTEGRATION.md)

### 4. Update Camera Component
Replace camera-feed.tsx with updated version (see both docs)

### Test Connection
```bash
# Start dev server
npm run dev

# Go to http://localhost:3000/dashboard
# Try "Start Stream" → "Capture & Analyze"
```

---

## Step 4️⃣: Database Integration (Optional but Recommended)

### Setup Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL, then:
psql -U postgres
CREATE DATABASE drglanace;
```

**Option B: Cloud Database**
- Use Vercel Postgres, Supabase, or AWS RDS
- Get connection string

### Create Results Table
```sql
CREATE TABLE analysis_results (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  scan_type VARCHAR(50),
  health_score FLOAT,
  confidence FLOAT,
  condition VARCHAR(20),
  metrics JSONB,
  recommendations JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Add to Environment
```env
# .env.local
POSTGRES_URL=postgresql://user:pass@localhost:5432/drglanace
```

### Create Save API
Create `app/api/results/route.ts` (code provided in ML_MODEL_INTEGRATION.md)

---

## 📋 Complete Checklist

### Hardware Setup
- [ ] ESP32-CAM connected to power (5V, 2A minimum)
- [ ] USB-TTL connections correct
- [ ] WiFi SSID/password updated in code
- [ ] Firmware uploaded successfully
- [ ] ESP32 IP address noted from Serial Monitor

### ML Model Setup
- [ ] TensorFlow.js OR Python backend configured
- [ ] Model files in correct location
- [ ] ML server running on http://localhost:8000 (if using backend)
- [ ] Test image analysis successful

### Frontend Setup
- [ ] ESP32 service created (`lib/esp32-service.ts`)
- [ ] ML analysis API created (`app/api/analyze/route.ts`)
- [ ] Camera feed component updated
- [ ] Environment variables set
- [ ] Dev server running

### Database Setup (Optional)
- [ ] PostgreSQL connected or cloud DB linked
- [ ] Results table created
- [ ] Results API created (`app/api/results/route.ts`)

---

## 🧪 Testing Each Component

### Test 1: ESP32 Connectivity
```bash
# Ping ESP32
ping 192.168.1.100

# Get status
curl http://192.168.1.100/status
# Should return: {"ip":"192.168.1.100","ssid":"your_wifi"...}
```

### Test 2: ML Model
```bash
# For TensorFlow.js: Check browser console
# For Python backend:
curl -X POST -F "file=@test.jpg" http://localhost:8000/analyze
```

### Test 3: Frontend Connection
```javascript
// In browser console at http://localhost:3000/dashboard
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: new FormData() // Add test image
})
console.log(await response.json())
```

---

## 🔍 Troubleshooting Flow

### "Can't connect to ESP32"
1. Check ESP32 powered on (LED blinking)
2. Verify WiFi SSID/password correct
3. Check IP address from Serial Monitor
4. Ping: `ping 192.168.1.100`
5. Check firewall rules (port 80)

### "ML analysis fails"
1. Verify ML server running: `http://localhost:8000/health`
2. Test with curl: `curl -X POST -F "file=@test.jpg" http://localhost:8000/analyze`
3. Check error logs in terminal
4. Verify model file format

### "Frontend can't reach API"
1. Check `.env.local` has correct URLs
2. Dev server must be restarted after env changes
3. Check CORS settings (if using different domain)
4. Browser console for errors (F12)

---

## 🎯 Full Workflow

```
1. User opens Dashboard
   ↓
2. Clicks "Start Stream"
   ↓
3. ESP32-CAM sends live frames → Browser Canvas
   ↓
4. User clicks "Capture & Analyze"
   ↓
5. Frame sent to /api/analyze
   ↓
6. API forwards to ML Server (Python)
   ↓
7. ML model processes image
   ↓
8. Results returned to frontend
   ↓
9. Results displayed in AnalysisPanel
   ↓
10. Optionally saved to database
    ↓
11. Shows in ScanHistory table
```

---

## 📊 Performance Targets

| Component | Target | Notes |
|-----------|--------|-------|
| Stream FPS | 10-15 fps | Depends on WiFi bandwidth |
| Analysis Latency | <500ms | TensorFlow.js faster than backend |
| Model Accuracy | >85% | Depends on training data |
| Memory Usage | <256MB | Mobile-friendly |
| Image Resolution | 640x480 | Adjustable in ESP32 code |

---

## 🔐 Security Checklist

- [ ] Don't commit `.env.local` with real keys
- [ ] Use HTTPS for production
- [ ] Validate image input on backend
- [ ] Sanitize user data
- [ ] Use JWT for API authentication
- [ ] Enable Clerk authentication for dashboard
- [ ] Set CORS headers correctly
- [ ] Use strong WiFi password

---

## 🚀 Deployment

### Deploy Frontend
```bash
# Vercel
vercel deploy

# Or Netlify
netlify deploy --prod
```

### Deploy ML Server
```bash
# Docker
docker build -t health-ml .
docker run -p 8000:8000 health-ml

# Or Heroku
git push heroku main
```

### Deploy Database
- Vercel Postgres (easiest)
- AWS RDS
- Supabase
- DigitalOcean

### Update Environment Variables
```
ML_SERVER_URL=https://ml-api.example.com
POSTGRES_URL=postgresql://prod...
ESP32_IP=https://esp32.example.com
```

---

## 📚 File References

| Feature | Files |
|---------|-------|
| **ESP32 Setup** | `docs/ESP32_CAM_INTEGRATION.md` |
| **ML Integration** | `docs/ML_MODEL_INTEGRATION.md` |
| **Hardware Code** | Arduino sketch in ESP32 doc |
| **Backend Server** | `ml_server.py` template in ML doc |
| **Frontend Service** | `lib/esp32-service.ts` |
| **API Routes** | `app/api/analyze/route.ts`, `app/api/results/route.ts` |
| **Components** | `components/camera-feed.tsx`, `components/analysis-panel.tsx` |

---

## 🎓 Learning Resources

- **TensorFlow.js**: https://www.tensorflow.org/js
- **FastAPI**: https://fastapi.tiangolo.com
- **ESP32 Docs**: https://docs.espressif.com
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Clerk Auth**: https://clerk.com/docs

---

## 📞 Support & Next Steps

1. **Start with ESP32 hardware** (most critical)
2. **Set up ML model** (choose TensorFlow.js for speed)
3. **Connect frontend** (should be straightforward)
4. **Add database** (optional, for data persistence)
5. **Test end-to-end** workflow
6. **Deploy** to production

**Good luck! 🚀**

