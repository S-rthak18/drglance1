# Common Errors & Solutions

This guide covers the most common issues you'll encounter and how to fix them.

---

## 🔴 Hardware Issues

### Error: "Failed to upload sketch to ESP32"

**Symptoms:** Arduino IDE shows error when uploading code

**Solutions:**
1. **Check COM Port**
   ```
   Tools → Port → Select correct COM port (COM3, COM4, etc.)
   ```

2. **Check Drivers**
   - Install CH340 drivers (USB-TTL chip drivers)
   - Windows: https://sparks.gogo.co.nz/ch340.html
   - Linux: `sudo apt-get install ch340 ftdi-utils`

3. **Fix Connection**
   - Disconnect, wait 5 seconds, reconnect
   - Check USB cable (use data cable, not charge-only)
   - Try different USB port

4. **Check Board Settings**
   ```
   Tools → Board → ESP32 Wrover Module
   Tools → Upload Speed → 115200
   Tools → CPU Frequency → 80MHz
   ```

5. **Hold GPIO0 to GND**
   - During upload: Connect GPIO0 to GND
   - After upload: Disconnect GPIO0 from GND
   - Press Reset button

---

### Error: "No WiFi connection"

**Symptoms:** Serial monitor shows WiFi connection failing

**Solutions:**
1. **Verify WiFi Credentials**
   ```cpp
   const char* ssid = "YOUR_SSID";       // Check spelling
   const char* password = "YOUR_PASSWORD"; // Check length/chars
   ```

2. **Check WiFi Channel**
   - Most ESP32 work on 2.4GHz only
   - Disable 5GHz from router (if available)

3. **Add Debug Output**
   ```cpp
   Serial.println(WiFi.status()); // 6=connected, 8=connecting
   ```

4. **Reset WiFi**
   ```cpp
   WiFi.disconnect(true); // Forget saved networks
   WiFi.begin(ssid, password);
   ```

---

### Error: "Camera init failed with error 0x..."

**Symptoms:** Serial monitor shows camera initialization error

**Solutions:**
1. **Check Power Supply**
   - Need 5V, 2A minimum
   - Add 470µF capacitor between 5V and GND
   - Avoid power through USB (insufficient)

2. **Check GPIO Connections**
   - Verify all camera pin connections
   - Look for bent pins
   - Reseat camera module

3. **Check Camera Module**
   - Ensure OV2640 module (correct model)
   - Camera connector properly seated
   - No dust on lens

4. **Try Different Frame Size**
   ```cpp
   config.frame_size = FRAMESIZE_VGA;  // Try lower resolution
   config.frame_size = FRAMESIZE_QVGA; // Even lower
   ```

---

### Error: "Low frame rate" or "Laggy video"

**Symptoms:** Video feed stutters or freezes

**Solutions:**
1. **Increase Delay Between Frames**
   ```cpp
   delay(200); // Increase from 100ms to 200ms
   ```

2. **Reduce JPEG Quality**
   ```cpp
   config.jpeg_quality = 15; // Reduce from 10 to 15
   // Higher number = lower quality = smaller file = faster
   ```

3. **Reduce Frame Size**
   ```cpp
   config.frame_size = FRAMESIZE_VGA; // 640x480
   // Try: FRAMESIZE_QVGA (320x240)
   // Or:  FRAMESIZE_CIF (352x288)
   ```

4. **Check WiFi Signal**
   - Move ESP32 closer to router
   - Check WiFi RSSI: `Serial.println(WiFi.RSSI())`
   - Good: -30 to -50 dBm
   - Bad: < -70 dBm

5. **Check Network Congestion**
   - Close other connections
   - Move away from other WiFi networks
   - Restart router

---

### Error: "Image looks distorted or blurry"

**Symptoms:** Camera output has artifacts or is out of focus

**Solutions:**
1. **Clean Camera Lens**
   - Use soft cloth
   - No water or solvents

2. **Adjust Camera Settings**
   ```cpp
   s->set_brightness(s, 1);  // Increase brightness
   s->set_contrast(s, 1);    // Increase contrast
   s->set_saturation(s, 1);  // Increase saturation
   ```

3. **Focus Distance**
   - Camera has fixed focus (2-5cm to infinity)
   - Try different distances
   - Some modules have focus adjustment screw

4. **Check Lighting**
   - Ensure adequate lighting
   - Avoid direct bright sunlight
   - Use diffused light

---

## 🔴 Frontend Issues

### Error: "Cannot find module '@/components/esp32-service' or similar"

**Symptoms:** TypeScript error in VS Code

**Solutions:**
1. **Restart Dev Server**
   ```bash
   # Stop: Ctrl+C
   npm run dev
   ```

2. **Check File Exists**
   ```bash
   # Check these exist:
   lib/esp32-service.ts
   lib/ml-service.ts
   app/api/analyze/route.ts
   ```

3. **Clear TypeScript Cache**
   ```bash
   rm -r .next
   npm run dev
   ```

4. **Verify Import Path**
   - Check tsconfig.json has "@" path alias
   - Import should be: `import { esp32Service } from "@/lib/esp32-service"`

---

### Error: "Failed to connect to ESP32" in browser

**Symptoms:** "Connection refused" or "Network error"

**Solutions:**
1. **Verify ESP32 IP Address**
   ```bash
   # Check Serial Monitor output
   # Should see: "192.168.1.100"
   
   # Or find it:
   ping 192.168.1.100
   ```

2. **Update Environment Variable**
   ```env
   # .env.local
   NEXT_PUBLIC_ESP32_IP=http://192.168.1.100
   
   # Restart dev server after changing!
   ```

3. **Check Firewall**
   ```powershell
   # Windows
   Get-NetFirewallRule -DisplayName "Allow HTTP"
   
   # If not found, add rule:
   New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
   ```

4. **Check ESP32 Web Server**
   ```
   Open browser: http://192.168.1.100/status
   Should return: {"ip":"192.168.1.100","ssid":"..."}
   ```

5. **Try Without Port Number**
   ```env
   NEXT_PUBLIC_ESP32_IP=192.168.1.100
   # Not: http://192.168.1.100
   ```

---

### Error: "Stream stops after a few seconds"

**Symptoms:** Video starts then freezes or disconnects

**Solutions:**
1. **Check ESP32 Power**
   - Might be resetting due to low power
   - Use separate 5V power supply

2. **Add Error Handling**
   ```typescript
   // In camera-feed.tsx
   try {
     for await (const frame of ESP32Service.streamFrames()) {
       // Process frame
     }
   } catch (error) {
     console.error("Stream error:", error)
     // Try reconnecting
   }
   ```

3. **Add Reconnection Logic**
   ```typescript
   const retryStream = async (maxAttempts = 3) => {
     for (let i = 0; i < maxAttempts; i++) {
       try {
         return await ESP32Service.streamFrames()
       } catch (e) {
         if (i < maxAttempts - 1) {
           await new Promise(r => setTimeout(r, 1000)) // Wait 1s
         }
       }
     }
   }
   ```

---

### Error: "CORS error" in browser console

**Symptoms:** "Access to XMLHttpRequest blocked by CORS policy"

**Solutions:**
1. **If Using Python Backend**
   ```python
   # ml_server.py
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000", "http://localhost:3001"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **For ESP32 (Can't set CORS headers)**
   ```
   Use Next.js API route as proxy:
   Frontend → Next.js /api/capture → ESP32
   ```

3. **Check Chrome DevTools**
   - F12 → Console tab
   - Look for specific CORS error
   - Check "allowed" origins

---

## 🔴 ML/AI Issues

### Error: "Model loading failed"

**Symptoms:** TensorFlow.js can't load model

**Solutions:**
1. **Check File Path**
   ```
   Should be: /models/health-model/model.json
   Files location: public/models/health-model/
   ```

2. **Verify All Files Present**
   ```
   public/models/health-model/
   ├── model.json              ✓ Required
   ├── group1-shard1of4.bin   ✓ Required
   ├── group1-shard2of4.bin   ✓ Required
   ├── group1-shard3of4.bin   ✓ Required
   └── group1-shard4of4.bin   ✓ Required
   ```

3. **Check Conversion Format**
   ```bash
   # Correct format:
   tensorflowjs_converter --input_format keras model.h5 public/models/health-model/
   
   # Creates model.json + .bin files
   ```

4. **Check Browser Console**
   ```javascript
   // Try loading in console:
   tf.loadGraphModel('/models/health-model/model.json')
     .then(model => console.log('Loaded!'))
     .catch(e => console.error(e))
   ```

---

### Error: "ML Server returns 400 Bad Request"

**Symptoms:** Image analysis fails with 400 error

**Solutions:**
1. **Check File Format**
   ```python
   # In ml_server.py, check:
   if not file.content_type.startswith("image/"):
       raise HTTPException(status_code=400, detail="Invalid file type")
   ```

2. **Check File Size**
   ```python
   # Might have size limit:
   if file.size > 10 * 1024 * 1024:
       raise HTTPException(status_code=400, detail="File too large")
   ```

3. **Test with Curl**
   ```bash
   curl -X POST -F "file=@test.jpg" http://localhost:8000/analyze
   
   # If fails, check:
   # 1. File is valid JPEG
   # 2. Server is running
   # 3. Port 8000 is accessible
   ```

---

### Error: "ML inference timeout"

**Symptoms:** Analysis takes > 30 seconds or times out

**Solutions:**
1. **Reduce Image Size**
   ```python
   # In ml_server.py:
   image = Image.open(BytesIO(contents)).convert("RGB")
   image_array = np.array(image.resize((224, 224)))  # Try (128, 128)
   ```

2. **Optimize Model**
   ```bash
   # Quantize model (smaller = faster):
   python -c "
   import tensorflow as tf
   converter = tf.lite.TFLiteConverter.from_saved_model('model')
   converter.optimizations = [tf.lite.Optimize.DEFAULT]
   tflite_model = converter.convert()
   with open('model.tflite', 'wb') as f:
       f.write(tflite_model)
   "
   ```

3. **Check Server Performance**
   ```bash
   # Monitor:
   nvidia-smi  # GPU usage (if available)
   top         # CPU usage
   free -h     # Memory usage
   ```

4. **Increase API Timeout**
   ```typescript
   // In app/api/analyze/route.ts:
   const mlResponse = await fetch(`${ML_SERVER_URL}/analyze`, {
     method: "POST",
     body: mlFormData,
     timeout: 60000, // Increase from 30s to 60s
   })
   ```

---

### Error: "Model accuracy is poor"

**Symptoms:** ML predictions don't match expected results

**Solutions:**
1. **Check Input Preprocessing**
   ```
   Model trained on 224x224 images?
   Normalized to 0-1 range?
   Correct color order (RGB not BGR)?
   ```

2. **Verify Model Conversion**
   - Original model accuracy in Python good?
   - After conversion to TensorFlow.js still good?
   - Test both to compare

3. **Retrain with Better Data**
   ```python
   # Use more diverse training data
   # More samples = better accuracy
   # Target: 1000+ images per class
   ```

4. **Increase Model Complexity**
   ```python
   # Use larger base model:
   model = keras.applications.MobileNetV3Large()  # Instead of V2
   ```

---

## 🔴 Database Issues

### Error: "Database connection refused"

**Symptoms:** "ECONNREFUSED localhost:5432"

**Solutions:**
1. **Check PostgreSQL Running**
   ```bash
   # Windows: Check Services
   # Linux:
   sudo systemctl status postgresql
   
   # Mac:
   brew services list
   ```

2. **Start PostgreSQL**
   ```bash
   # Linux:
   sudo systemctl start postgresql
   
   # Mac:
   brew services start postgresql
   
   # Windows: Use Services app
   ```

3. **Verify Connection String**
   ```env
   # Should be:
   POSTGRES_URL=postgresql://user:password@localhost:5432/drglanace
   
   # Components:
   # - user: usually 'postgres'
   # - password: what you set during install
   # - localhost: 127.0.0.1
   # - 5432: default port
   # - drglanace: database name
   ```

---

### Error: "table analysis_results does not exist"

**Symptoms:** SQL query fails - table not found

**Solutions:**
1. **Create Table**
   ```sql
   CREATE TABLE analysis_results (
     id SERIAL PRIMARY KEY,
     user_id TEXT NOT NULL,
     scan_type VARCHAR(50),
     health_score FLOAT,
     confidence FLOAT,
     condition VARCHAR(20),
     metrics JSONB,
     recommendations JSONB,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Verify Table Created**
   ```sql
   -- In psql:
   \dt analysis_results
   -- Should show table info
   ```

3. **Check Database Name**
   ```bash
   # List databases:
   psql -l
   
   # Should see 'drglanace'
   # If not, create it:
   createdb drglanace
   ```

---

### Error: "Permission denied" on database operations

**Symptoms:** Query succeeds but insert fails

**Solutions:**
1. **Check User Permissions**
   ```sql
   -- As superuser:
   GRANT ALL PRIVILEGES ON DATABASE drglanace TO postgres;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
   ```

2. **Verify User Credentials**
   ```bash
   # Connect with correct user:
   psql -U postgres -d drglanace
   ```

---

## 🔴 Deployment Issues

### Error: "Vercel deployment fails"

**Symptoms:** Deployment error after git push

**Solutions:**
1. **Check Build Logs**
   ```
   Vercel Dashboard → Deployments → [Latest] → Logs
   Look for errors in "Build" section
   ```

2. **Common Issues**
   - Missing environment variables
   - TypeScript errors
   - Module not found
   - Port already in use

3. **Add to vercel.json**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "env": {
       "ML_SERVER_URL": "@ml_server_url",
       "POSTGRES_URL": "@postgres_url"
     }
   }
   ```

---

### Error: "ML Server doesn't start after deployment"

**Symptoms:** Service crashes or doesn't respond

**Solutions:**
1. **Check Logs**
   ```bash
   # Heroku:
   heroku logs --tail
   
   # AWS:
   # Check CloudWatch logs
   ```

2. **Check Port**
   ```python
   # Use environment variable for port:
   import os
   port = int(os.environ.get("PORT", 8000))
   uvicorn.run(app, host="0.0.0.0", port=port)
   ```

3. **Verify Dependencies**
   ```
   Ensure all imports available
   Check requirements.txt has all packages
   Test locally first
   ```

---

## 🟡 Performance Issues

### Problem: "Analysis takes > 5 seconds"

**Solutions:**
1. **Profile the Bottleneck**
   ```typescript
   console.time("Total")
   console.time("Upload")
   // ... upload code
   console.timeEnd("Upload")
   
   console.time("Analysis")
   // ... analysis code
   console.timeEnd("Analysis")
   console.timeEnd("Total")
   ```

2. **Optimization Steps**
   - Reduce image size before upload
   - Use PNG compression
   - Cache model (TensorFlow.js)
   - Use GPU if available (Python)

---

### Problem: "Dashboard loads slowly"

**Solutions:**
1. **Code Split**
   ```typescript
   // Use dynamic imports:
   import dynamic from 'next/dynamic'
   const AnalysisPanel = dynamic(() => import('@/components/analysis-panel'))
   ```

2. **Optimize Images**
   - Compress ESP32 images
   - Use WebP format
   - Lazy load components

3. **Monitor Bundle Size**
   ```bash
   npm run build
   # Check .next/static/chunks size
   ```

---

## 🟡 Data Issues

### Problem: "Results not saving to database"

**Solutions:**
1. **Check Connection**
   ```bash
   # Test connection:
   psql -U postgres -d drglanace -c "SELECT 1"
   ```

2. **Verify Schema**
   ```sql
   -- Check table structure:
   \d analysis_results
   ```

3. **Add Logging**
   ```typescript
   console.log("Saving:", body)
   const result = await sql`...`
   console.log("Saved:", result)
   ```

---

### Problem: "User can see other users' data"

**Solutions:**
1. **Verify User Isolation**
   ```typescript
   // Always filter by userId:
   const result = await sql`
     SELECT * FROM analysis_results
     WHERE user_id = ${userId}  // Critical!
   `
   ```

2. **Check Clerk Integration**
   ```typescript
   const { userId } = await auth()
   if (!userId) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
   }
   ```

---

## ✅ Debugging Checklist

When something breaks:

- [ ] Check browser console (F12)
- [ ] Check terminal for errors
- [ ] Check network tab (F12 → Network)
- [ ] Test individual components
- [ ] Check environment variables (.env.local)
- [ ] Verify all services running
- [ ] Check firewall rules
- [ ] Restart dev server
- [ ] Clear cache (npm cache clean --force)
- [ ] Check logs (browser, server, database)

---

## 🆘 Still Stuck?

### Debug Tips

1. **Add Extensive Logging**
   ```typescript
   console.log("Step 1: Starting...")
   console.log("Step 2: Data =", data)
   console.log("Step 3: Response =", response)
   ```

2. **Test in Isolation**
   ```bash
   # Test only ESP32:
   curl http://192.168.1.100/stream
   
   # Test only ML:
   curl -X POST -F "file=@test.jpg" http://localhost:8000/analyze
   
   # Test only API:
   # Use Postman or curl
   ```

3. **Use Browser DevTools**
   - F12 → Console tab
   - F12 → Network tab
   - F12 → Storage tab

4. **Check System Resources**
   ```bash
   # Monitor while running:
   # Windows: Task Manager
   # Linux: top / htop
   # Mac: Activity Monitor
   ```

---

## 📞 When to Seek Help

- Error message not in this guide
- Problem persists after trying solutions
- Multiple components failing
- System resource issues
- Third-party service issues

**Then:**
1. Check official docs for that component
2. Search Stack Overflow
3. Check GitHub issues
4. Ask in community forums
5. Contact vendor support

---

**Good luck debugging! 🐛→🐞**

