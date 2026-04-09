# Ready-to-Use Code Templates

Copy and paste these files directly into your project!

---

## 1. ESP32 Service (`lib/esp32-service.ts`)

```typescript
interface FrameStreamEvent {
  frame: Blob
  timestamp: number
  size: number
}

class ESP32Service {
  private esp32IP: string
  private abortController: AbortController | null = null

  constructor(ip: string = process.env.NEXT_PUBLIC_ESP32_IP || "http://192.168.1.100") {
    this.esp32IP = ip
  }

  /**
   * Capture single frame from ESP32
   */
  async captureFrame(): Promise<Blob> {
    try {
      const response = await fetch(`${this.esp32IP}/capture`, {
        method: "GET",
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return response.blob()
    } catch (error) {
      console.error("Capture failed:", error)
      throw new Error(`Failed to capture frame: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Stream continuous video from ESP32
   * Yields individual JPEG frames
   */
  async *streamFrames(): AsyncGenerator<Blob> {
    this.abortController = new AbortController()

    try {
      const response = await fetch(`${this.esp32IP}/stream`, {
        signal: this.abortController.signal,
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Stream not available")
      }

      let buffer = new Uint8Array()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        buffer = new Uint8Array([...buffer, ...value])

        // Parse multipart/x-mixed-replace format
        const boundaryIndex = buffer.indexOf(43) // '--' character code

        while (true) {
          const frameStart = this.findJPEGStart(buffer)
          const frameEnd = this.findJPEGEnd(buffer, frameStart)

          if (frameStart === -1 || frameEnd === -1) break

          const frameData = buffer.slice(frameStart, frameEnd)
          yield new Blob([frameData], { type: "image/jpeg" })

          buffer = buffer.slice(frameEnd)
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Stream stopped")
      } else {
        console.error("Stream error:", error)
        throw error
      }
    }
  }

  /**
   * Get ESP32 device status
   */
  async getStatus(): Promise<{
    ip: string
    ssid: string
    signal: number
    uptime: number
  }> {
    try {
      const response = await fetch(`${this.esp32IP}/status`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response.json()
    } catch (error) {
      throw new Error(`Failed to get status: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Configure camera settings
   */
  async setConfig(config: {
    brightness?: number
    contrast?: number
    saturation?: number
    quality?: number
    resolution?: string
  }): Promise<void> {
    try {
      const response = await fetch(`${this.esp32IP}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      throw new Error(`Failed to set config: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Stop streaming
   */
  stopStream(): void {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  // Helper methods
  private findJPEGStart(buffer: Uint8Array): number {
    for (let i = 0; i < buffer.length - 1; i++) {
      if (buffer[i] === 0xff && buffer[i + 1] === 0xd8) {
        return i
      }
    }
    return -1
  }

  private findJPEGEnd(buffer: Uint8Array, start: number): number {
    if (start === -1) return -1
    for (let i = start + 2; i < buffer.length - 1; i++) {
      if (buffer[i] === 0xff && buffer[i + 1] === 0xd9) {
        return i + 2
      }
    }
    return -1
  }
}

export const esp32Service = new ESP32Service()
```

---

## 2. ML Service - TensorFlow.js (`lib/ml-service.ts`)

```typescript
import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-webgl"

export interface AnalysisResult {
  condition: "healthy" | "good" | "attention"
  confidence: number
  healthScore: number
  metrics: Record<string, number>
  recommendations: string[]
  timestamp: string
}

class MLService {
  private model: tf.GraphModel | null = null
  private modelLoaded = false
  private loadPromise: Promise<void> | null = null

  /**
   * Load ML model from path
   */
  async loadModel(modelPath: string = "/models/health-model/model.json"): Promise<void> {
    // Avoid loading multiple times
    if (this.loadPromise) return this.loadPromise
    if (this.modelLoaded) return

    this.loadPromise = (async () => {
      try {
        this.model = await tf.loadGraphModel(modelPath)
        this.modelLoaded = true
        console.log("✓ ML model loaded successfully")
      } catch (error) {
        console.error("✗ Failed to load model:", error)
        throw new Error(`Model loading failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    })()

    return this.loadPromise
  }

  /**
   * Analyze image blob
   */
  async analyzeImage(imageBlob: Blob): Promise<AnalysisResult> {
    if (!this.modelLoaded || !this.model) {
      throw new Error("Model not loaded. Call loadModel() first.")
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async () => {
        try {
          const img = new Image()

          img.onload = async () => {
            try {
              // Preprocess: resize to 224x224 and normalize
              const tensor = tf.browser
                .fromPixels(img)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .div(tf.scalar(255.0))
                .expandDims(0)

              // Run inference
              const prediction = this.model!.predict(tensor) as tf.Tensor
              const predictionData = await prediction.array()

              // Process output
              const result = this.processOutput(predictionData as number[][])

              // Cleanup tensors
              tensor.dispose()
              prediction.dispose()

              resolve(result)
            } catch (error) {
              reject(new Error(`Inference failed: ${error instanceof Error ? error.message : "Unknown error"}`))
            }
          }

          img.onerror = () => {
            reject(new Error("Failed to load image"))
          }

          img.src = reader.result as string
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error("Failed to read image blob"))
      }

      reader.readAsDataURL(imageBlob)
    })
  }

  /**
   * Analyze multiple images
   */
  async analyzeBatch(imageBlobs: Blob[]): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = []

    for (const blob of imageBlobs) {
      try {
        const result = await this.analyzeImage(blob)
        results.push(result)
      } catch (error) {
        console.error("Batch analysis error:", error)
        // Continue with next image
      }
    }

    return results
  }

  /**
   * Process model output into user-friendly format
   */
  private processOutput(predictionData: number[][]): AnalysisResult {
    const output = predictionData[0]

    // Expected output format:
    // [0] = health_score (0-100)
    // [1] = confidence (0-1)
    // [2] = hydration (0-1)
    // [3] = elasticity (0-1)
    // [4] = texture (0-1)
    // [5] = color (0-1)

    const healthScore = Math.min(100, Math.max(0, output[0] * 100))
    const confidence = Math.round(output[1] * 100)

    let condition: "healthy" | "good" | "attention"
    if (healthScore >= 80) {
      condition = "healthy"
    } else if (healthScore >= 60) {
      condition = "good"
    } else {
      condition = "attention"
    }

    const metrics = {
      "Skin Hydration": Math.round(output[2] * 100),
      Elasticity: Math.round(output[3] * 100),
      Texture: Math.round(output[4] * 100),
      "Color Balance": Math.round(output[5] * 100),
    }

    return {
      condition,
      confidence,
      healthScore: Math.round(healthScore),
      metrics,
      recommendations: this.generateRecommendations(healthScore),
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Generate health recommendations based on score
   */
  private generateRecommendations(score: number): string[] {
    const recommendations: string[] = []

    if (score < 60) {
      recommendations.push("Increase daily water intake")
      recommendations.push("Use SPF 30+ sunscreen daily")
      recommendations.push("Consider professional skincare consultation")
      recommendations.push("Avoid excessive sun exposure")
    } else if (score < 80) {
      recommendations.push("Maintain consistent skincare routine")
      recommendations.push("Increase antioxidant-rich food intake")
      recommendations.push("Include regular exercise in your routine")
      recommendations.push("Use moisturizer daily")
    } else {
      recommendations.push("Keep up your current skincare routine!")
      recommendations.push("Stay hydrated throughout the day")
      recommendations.push("Continue regular exercise")
    }

    recommendations.push("Regular monitoring recommended")
    return recommendations
  }

  /**
   * Clear cached model to free memory
   */
  async dispose(): Promise<void> {
    if (this.model) {
      this.model.dispose()
      this.model = null
      this.modelLoaded = false
    }
    tf.disposeVariables()
  }
}

export const mlService = new MLService()
```

---

## 3. Analysis API Route (`app/api/analyze/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server"

const ML_SERVER_URL = process.env.ML_SERVER_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Expected image." }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 })
    }

    // Forward to ML server
    const mlFormData = new FormData()
    mlFormData.append("file", file)

    const mlResponse = await fetch(`${ML_SERVER_URL}/analyze`, {
      method: "POST",
      body: mlFormData,
      timeout: 30000, // 30 second timeout
    })

    if (!mlResponse.ok) {
      const error = await mlResponse.text()
      console.error("ML Server error:", error)
      return NextResponse.json(
        { error: `ML analysis failed: ${mlResponse.statusText}` },
        { status: 500 }
      )
    }

    const result = await mlResponse.json()

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Analysis error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Analysis failed",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  try {
    const response = await fetch(`${ML_SERVER_URL}/health`)
    const data = await response.json()

    return NextResponse.json({
      status: "ok",
      mlServer: data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: "ML server unreachable",
      },
      { status: 503 }
    )
  }
}
```

---

## 4. Results Save API (`app/api/results/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { sql } from "@vercel/postgres"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    if (!body.scanType || body.healthScore === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save to database
    const result = await sql`
      INSERT INTO analysis_results (
        user_id,
        scan_type,
        health_score,
        confidence,
        condition,
        metrics,
        recommendations,
        created_at
      ) VALUES (
        ${userId},
        ${body.scanType},
        ${body.healthScore},
        ${body.confidence},
        ${body.condition},
        ${JSON.stringify(body.metrics)},
        ${JSON.stringify(body.recommendations)},
        NOW()
      )
      RETURNING id, created_at
    `

    return NextResponse.json({
      id: result.rows[0].id,
      created_at: result.rows[0].created_at,
      message: "Result saved successfully",
    })
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json(
      { error: "Failed to save result", details: error instanceof Error ? error.message : "" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get limit and offset from query params
    const limit = Number(request.nextUrl.searchParams.get("limit")) || 50
    const offset = Number(request.nextUrl.searchParams.get("offset")) || 0

    const results = await sql`
      SELECT 
        id,
        scan_type,
        health_score,
        confidence,
        condition,
        metrics,
        recommendations,
        created_at
      FROM analysis_results
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total FROM analysis_results WHERE user_id = ${userId}
    `

    return NextResponse.json({
      data: results.rows,
      total: countResult.rows[0].total,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Result ID required" }, { status: 400 })
    }

    await sql`
      DELETE FROM analysis_results
      WHERE id = ${id} AND user_id = ${userId}
    `

    return NextResponse.json({ message: "Result deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete result" },
      { status: 500 }
    )
  }
}
```

---

## 5. Python ML Server (`ml_server.py`)

```python
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tensorflow as tf
import numpy as np
from PIL import Image
from io import BytesIO
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="DrGlance ML API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model
MODEL = None
MODEL_PATH = "./models/health_model.h5"

@app.on_event("startup")
async def load_model():
    """Load ML model on startup"""
    global MODEL
    try:
        logger.info(f"Loading model from {MODEL_PATH}")
        MODEL = tf.keras.models.load_model(MODEL_PATH)
        logger.info("✓ Model loaded successfully")
    except Exception as e:
        logger.error(f"✗ Error loading model: {e}")
        MODEL = None

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "model_loaded": MODEL is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze a single image
    Returns health analysis results
    """
    if MODEL is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Expected image.")

    try:
        # Read image
        contents = await file.read()
        image = Image.open(BytesIO(contents)).convert("RGB")

        # Preprocess
        image_array = np.array(image.resize((224, 224)))
        image_array = image_array.astype("float32") / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        # Inference
        logger.info("Running inference...")
        predictions = MODEL.predict(image_array, verbose=0)

        # Process results
        health_score = float(predictions[0][0]) * 100
        confidence = float(predictions[0][1]) * 100

        # Determine condition
        if health_score >= 80:
            condition = "healthy"
        elif health_score >= 60:
            condition = "good"
        else:
            condition = "attention"

        # Extract metrics
        metrics = {
            "Skin Hydration": float(predictions[0][2]) * 100,
            "Elasticity": float(predictions[0][3]) * 100,
            "Texture": float(predictions[0][4]) * 100,
            "Color Balance": float(predictions[0][5]) * 100,
        }

        recommendations = generate_recommendations(health_score)

        logger.info(f"Analysis complete: {condition} (score: {health_score:.1f})")

        return JSONResponse({
            "condition": condition,
            "confidence": round(confidence, 2),
            "healthScore": round(health_score, 2),
            "metrics": {k: round(v, 2) for k, v in metrics.items()},
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat(),
        })

    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/batch-analyze")
async def batch_analyze(files: list[UploadFile] = File(...)):
    """
    Analyze multiple images
    Returns list of results
    """
    if MODEL is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    results = []
    for file in files:
        try:
            contents = await file.read()
            image = Image.open(BytesIO(contents)).convert("RGB")

            image_array = np.array(image.resize((224, 224)))
            image_array = image_array.astype("float32") / 255.0
            image_array = np.expand_dims(image_array, axis=0)

            predictions = MODEL.predict(image_array, verbose=0)

            health_score = float(predictions[0][0]) * 100
            confidence = float(predictions[0][1]) * 100

            condition = "healthy" if health_score >= 80 else "good" if health_score >= 60 else "attention"

            results.append({
                "filename": file.filename,
                "status": "success",
                "condition": condition,
                "healthScore": round(health_score, 2),
                "confidence": round(confidence, 2),
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "status": "error",
                "error": str(e)
            })

    return results

def generate_recommendations(score: float) -> list[str]:
    """Generate health recommendations based on score"""
    recommendations = []

    if score < 60:
        recommendations.extend([
            "Increase daily water intake to 8-10 glasses",
            "Use SPF 30+ sunscreen daily",
            "Consider professional skincare consultation",
            "Avoid excessive sun exposure (use shade 10am-4pm)"
        ])
    elif score < 80:
        recommendations.extend([
            "Maintain consistent skincare routine",
            "Include antioxidant-rich foods in diet",
            "Exercise 30 minutes daily for better circulation",
            "Use a good moisturizer regularly"
        ])
    else:
        recommendations.append("Keep up your current skincare routine!")
        recommendations.append("Stay hydrated throughout the day")
        recommendations.append("Continue regular exercise")

    recommendations.append("Perform regular monitoring (weekly recommended)")
    return recommendations

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## 6. Environment Configuration (`.env.local`)

```env
# Frontend
NEXT_PUBLIC_ESP32_IP=http://192.168.1.100
NEXT_PUBLIC_ML_MODEL_PATH=/models/health-model/model.json

# Backend ML Server
ML_SERVER_URL=http://localhost:8000

# Database (PostgreSQL)
POSTGRES_URL=postgresql://user:password@localhost:5432/drglanace

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
CLERK_REDIRECT_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_KEY=your_analytics_key
```

---

## 7. Database Migration SQL

```sql
-- Create analysis results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  scan_type VARCHAR(50) NOT NULL,
  health_score FLOAT NOT NULL,
  confidence FLOAT NOT NULL,
  condition VARCHAR(20) NOT NULL,
  metrics JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  image_url VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_user_results ON analysis_results(user_id DESC, created_at DESC);
CREATE INDEX idx_condition ON analysis_results(condition);
CREATE INDEX idx_scan_type ON analysis_results(scan_type);

-- Create trends view
CREATE OR REPLACE VIEW health_trends AS
SELECT
  user_id,
  scan_type,
  DATE(created_at) as date,
  AVG(health_score) as avg_score,
  COUNT(*) as scan_count,
  MAX(health_score) as max_score,
  MIN(health_score) as min_score
FROM analysis_results
GROUP BY user_id, scan_type, DATE(created_at)
ORDER BY date DESC;
```

---

## 8. Package Dependencies (`package.json` additions)

```json
{
  "dependencies": {
    "@tensorflow/tfjs": "^4.11.0",
    "@tensorflow/tfjs-converter": "^4.11.0",
    "@tensorflow/tfjs-backend-webgl": "^4.11.0",
    "sharp": "^0.32.0"
  },
  "devDependencies": {
    "@types/tensorflow__tfjs": "^3.11.0"
  },
  "scripts": {
    "start:ml": "python ml_server.py",
    "start:all": "concurrently \"npm run dev\" \"python ml_server.py\""
  }
}
```

Install with: `npm install` or `pnpm install`

---

**All templates ready to use! Copy and customize for your needs. 🚀**

