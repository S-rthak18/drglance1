# ML Model Integration Guide

## Overview
This guide explains how to integrate your custom ML model (TensorFlow, PyTorch, or any other framework) to analyze health data and provide real-time results in the DrGlance application.

---

## Part 1: ML Model Setup

### Option A: Using TensorFlow.js (Browser-Based)

#### Best for: Quick prototyping, privacy-focused, real-time analysis

**Advantages:**
- Runs in browser (no server needed)
- Lower latency
- No sensitive data sent to server
- Works offline

**Disadvantages:**
- Limited to JavaScript-compatible models
- Model must fit in browser memory

#### Setup Steps

1. **Convert Your Model**
   ```bash
   # If you have a TensorFlow model
   pip install tensorflowjs

   # Convert SavedModel format
   tensorflowjs_converter \
     --input_format tf_saved_model \
     /path/to/saved_model \
     /path/to/web_model

   # Or convert Keras model
   tensorflowjs_converter \
     --input_format keras \
     model.h5 \
     /path/to/web_model
   ```

2. **Install TensorFlow.js**
   ```bash
   npm install @tensorflow/tfjs @tensorflow/tfjs-converter
   ```

3. **Create ML Service** (`lib/ml-service.ts`)
   ```typescript
   import * as tf from '@tensorflow/tfjs'

   interface HealthAnalysisResult {
     condition: 'healthy' | 'good' | 'attention'
     confidence: number
     metrics: {
       [key: string]: number
     }
     recommendations: string[]
   }

   class MLService {
     private model: tf.GraphModel | null = null
     private modelLoaded = false

     async loadModel(modelPath: string = '/models/health-model/model.json') {
       try {
         this.model = await tf.loadGraphModel(modelPath)
         this.modelLoaded = true
         console.log('Model loaded successfully')
       } catch (error) {
         console.error('Failed to load model:', error)
         throw error
       }
     }

     async analyzeImage(imageBlob: Blob): Promise<HealthAnalysisResult> {
       if (!this.modelLoaded || !this.model) {
         throw new Error('Model not loaded')
       }

       // Convert blob to tensor
       const img = new Image()
       img.src = URL.createObjectURL(imageBlob)

       return new Promise((resolve, reject) => {
         img.onload = async () => {
           try {
             // Preprocess image
             const tensor = tf.browser
               .fromPixels(img)
               .resizeNearestNeighbor([224, 224])
               .toFloat()
               .div(tf.scalar(255.0))
               .expandDims(0)

             // Run inference
             const prediction = this.model!.predict(tensor) as tf.Tensor

             // Process output
             const result = await this.processOutput(prediction)

             // Cleanup
             tensor.dispose()
             prediction.dispose()

             resolve(result)
           } catch (error) {
             reject(error)
           }
         }

         img.onerror = () => {
           reject(new Error('Failed to load image'))
         }
       })
     }

     private async processOutput(output: tf.Tensor): Promise<HealthAnalysisResult> {
       const data = await output.array() as number[][]

       // Assuming output format:
       // [0] = health_score (0-100)
       // [1] = confidence (0-1)
       // [2-5] = metric scores

       const healthScore = Math.round(data[0][0])
       const confidence = Math.round(data[0][1] * 100)

       let condition: 'healthy' | 'good' | 'attention'
       if (healthScore >= 80) condition = 'healthy'
       else if (healthScore >= 60) condition = 'good'
       else condition = 'attention'

       return {
         condition,
         confidence,
         metrics: {
           'Skin Hydration': Math.round(data[0][2] * 100),
           'Elasticity': Math.round(data[0][3] * 100),
           'Texture': Math.round(data[0][4] * 100),
           'Color': Math.round(data[0][5] * 100),
         },
         recommendations: this.generateRecommendations(healthScore),
       }
     }

     private generateRecommendations(score: number): string[] {
       const recommendations: string[] = []

       if (score < 60) {
         recommendations.push('Increase daily hydration')
         recommendations.push('Use SPF protection')
         recommendations.push('Consider professional consultation')
       } else if (score < 80) {
         recommendations.push('Maintain consistent skincare routine')
         recommendations.push('Increase antioxidant intake')
       }

       recommendations.push('Regular monitoring recommended')
       return recommendations
     }
   }

   export const mlService = new MLService()
   ```

4. **Place Model Files**
   ```
   public/
   ├── models/
   │   └── health-model/
   │       ├── model.json
   │       ├── group1-shard1of4.bin
   │       ├── group1-shard2of4.bin
   │       ├── group1-shard3of4.bin
   │       └── group1-shard4of4.bin
   ```

---

### Option B: Using Backend Server (Python FastAPI/Flask)

#### Best for: Complex models, large datasets, production use

**Advantages:**
- Run any ML framework
- More computational power
- Better for heavy models
- Easy to update models

**Disadvantages:**
- Network latency
- Server infrastructure needed
- Data privacy considerations

#### Setup Steps

1. **Install Python Dependencies**
   ```bash
   pip install fastapi uvicorn tensorflow torch opencv-python python-multipart
   ```

2. **Create ML Server** (`ml_server.py`)
   ```python
   from fastapi import FastAPI, File, UploadFile, HTTPException
   from fastapi.middleware.cors import CORSMiddleware
   from fastapi.responses import JSONResponse
   import tensorflow as tf
   import numpy as np
   import cv2
   from io import BytesIO
   from PIL import Image
   import uvicorn

   app = FastAPI()

   # Enable CORS for frontend
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000", "http://localhost:3001"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )

   # Load model
   MODEL = None

   @app.on_event("startup")
   async def load_model():
       global MODEL
       try:
           MODEL = tf.keras.models.load_model("./models/health_model.h5")
           print("Model loaded successfully")
       except Exception as e:
           print(f"Error loading model: {e}")

   @app.get("/health")
   async def health_check():
       return {"status": "ok", "model_loaded": MODEL is not None}

   @app.post("/analyze")
   async def analyze_image(file: UploadFile = File(...)):
       try:
           # Read image
           contents = await file.read()
           image = Image.open(BytesIO(contents))

           # Preprocess
           image_array = np.array(image.resize((224, 224)))
           image_array = image_array.astype('float32') / 255.0
           image_array = np.expand_dims(image_array, axis=0)

           # Inference
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
               "hydration": float(predictions[0][2]) * 100,
               "elasticity": float(predictions[0][3]) * 100,
               "texture": float(predictions[0][4]) * 100,
               "color": float(predictions[0][5]) * 100,
           }

           return JSONResponse({
               "condition": condition,
               "confidence": round(confidence, 2),
               "healthScore": round(health_score, 2),
               "metrics": {k: round(v, 2) for k, v in metrics.items()},
               "recommendations": generate_recommendations(health_score),
               "timestamp": datetime.now().isoformat(),
           })

       except Exception as e:
           raise HTTPException(status_code=400, detail=str(e))

   @app.post("/batch-analyze")
   async def batch_analyze(files: list[UploadFile] = File(...)):
       """Analyze multiple images"""
       results = []
       for file in files:
           try:
               contents = await file.read()
               image = Image.open(BytesIO(contents))
               # Process same as single analysis
               results.append({"filename": file.filename, "status": "success"})
           except Exception as e:
               results.append({"filename": file.filename, "status": "error", "error": str(e)})
       return results

   def generate_recommendations(score: float):
       """Generate health recommendations based on score"""
       recommendations = []

       if score < 60:
           recommendations.extend([
               "Increase daily water intake",
               "Use SPF 30+ sunscreen daily",
               "Consider professional skincare consultation",
               "Avoid excessive sun exposure"
           ])
       elif score < 80:
           recommendations.extend([
               "Maintain consistent skincare routine",
               "Increase antioxidant-rich food intake",
               "Regular exercise promotes skin health"
           ])
       else:
           recommendations.append("Keep up your current skincare routine!")

       recommendations.append("Regular monitoring recommended")
       return recommendations

   if __name__ == "__main__":
       uvicorn.run(app, host="0.0.0.0", port=8000)
   ```

3. **Run ML Server**
   ```bash
   python ml_server.py
   # Server runs on http://localhost:8000
   ```

4. **Docker Deployment** (Optional)
   ```dockerfile
   FROM python:3.10-slim

   WORKDIR /app

   COPY requirements.txt .
   RUN pip install -r requirements.txt

   COPY . .

   EXPOSE 8000

   CMD ["python", "ml_server.py"]
   ```

   ```bash
   docker build -t health-ml-server .
   docker run -p 8000:8000 health-ml-server
   ```

---

## Part 2: Connect to Next.js Frontend

### Create API Route (`app/api/analyze/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'

// Backend server URL (update based on your setup)
const ML_SERVER_URL = process.env.ML_SERVER_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Forward to ML server
    const mlFormData = new FormData()
    mlFormData.append('file', file)

    const response = await fetch(`${ML_SERVER_URL}/analyze`, {
      method: 'POST',
      body: mlFormData,
    })

    if (!response.ok) {
      throw new Error(`ML Server error: ${response.statusText}`)
    }

    const result = await response.json()

    // Save to database (optional)
    // await saveAnalysisResult(userId, result)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}
```

### Update Camera Feed Component

```typescript
const handleCapture = async () => {
  try {
    setIsAnalyzing(true)
    const frameBlob = await ESP32Service.captureFrame()
    const formData = new FormData()
    formData.append('image', frameBlob, 'capture.jpg')

    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    // Update UI with results
    onAnalysisComplete?.(result)
  } catch (err) {
    setError('Analysis failed')
  } finally {
    setIsAnalyzing(false)
  }
}
```

---

## Part 3: ML Model Training (Your Own Data)

### Training Template (TensorFlow/Keras)

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
from sklearn.model_selection import train_test_split

# Load your dataset
# Expected structure:
# data/
# ├── healthy/
# │   ├── image1.jpg
# │   └── image2.jpg
# └── diseased/
#     ├── image1.jpg
#     └── image2.jpg

def create_model(input_shape=(224, 224, 3)):
    """Create health analysis model"""
    base_model = keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False

    model = keras.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(6, activation='sigmoid')  # 6 outputs
    ])

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='binary_crossentropy',
        metrics=['accuracy']
    )

    return model

def train_model():
    """Train the model"""
    # Load data
    train_datagen = keras.preprocessing.image.ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        zoom_range=0.2
    )

    train_data = train_datagen.flow_from_directory(
        'data/',
        target_size=(224, 224),
        batch_size=32,
        class_mode='binary'
    )

    # Create and train model
    model = create_model()

    history = model.fit(
        train_data,
        epochs=50,
        validation_split=0.2,
        callbacks=[
            keras.callbacks.EarlyStopping(patience=5),
            keras.callbacks.ModelCheckpoint('best_model.h5', save_best_only=True)
        ]
    )

    # Save model
    model.save('health_model.h5')
    return model

if __name__ == '__main__':
    train_model()
```

### Convert for TensorFlow.js

```bash
# After training and saving model
tensorflowjs_converter \
  --input_format keras \
  health_model.h5 \
  public/models/health-model/
```

---

## Part 4: Database Integration (Store Results)

### Create Results Table

```sql
CREATE TABLE analysis_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  scan_type VARCHAR(50),
  health_score FLOAT,
  confidence FLOAT,
  condition VARCHAR(20),
  metrics JSONB,
  recommendations JSONB,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_created ON analysis_results(user_id, created_at DESC);
```

### API to Save Results (`app/api/results/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const result = await sql`
      INSERT INTO analysis_results (
        user_id,
        scan_type,
        health_score,
        confidence,
        condition,
        metrics,
        recommendations
      ) VALUES (
        ${userId},
        ${body.scanType},
        ${body.healthScore},
        ${body.confidence},
        ${body.condition},
        ${JSON.stringify(body.metrics)},
        ${JSON.stringify(body.recommendations)}
      )
      RETURNING *
    `

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json(
      { error: 'Failed to save result' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const results = await sql`
      SELECT * FROM analysis_results
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 50
    `

    return NextResponse.json(results.rows)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
}
```

---

## Part 5: Environment Configuration

### `.env.local` Setup

```env
# ML Server
ML_SERVER_URL=http://localhost:8000
# or for production
# ML_SERVER_URL=https://ml-api.example.com

# Database
POSTGRES_URL=postgresql://user:password@localhost:5432/drglanace

# ESP32
ESP32_IP=http://192.168.1.100

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

---

## Part 6: Complete Workflow

### Step 1: User Initiates Scan
```
User clicks "Capture & Analyze" button
↓
ESP32-CAM captures live frame
↓
Frame sent to Next.js frontend
```

### Step 2: Image Analysis
```
Frame → Next.js API (/api/analyze)
↓
Sent to ML Server (Python FastAPI)
↓
Model runs inference
↓
Results returned (health score, metrics, recommendations)
```

### Step 3: Display & Store Results
```
Results displayed in AnalysisPanel component
↓
Saved to database via /api/results
↓
Added to ScanHistory table
↓
User can view history and trends
```

---

## Testing ML Integration

### 1. Test ML Server Locally

```bash
# Create test image
python -c "
from PIL import Image
import numpy as np
img = Image.fromarray(np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8))
img.save('test.jpg')
"

# Send to ML server
curl -X POST -F "file=@test.jpg" http://localhost:8000/analyze
```

### 2. Test Frontend Integration

```typescript
// In browser console
const formData = new FormData()
const response = await fetch('/test-image.jpg')
const blob = await response.blob()
formData.append('image', blob)

fetch('/api/analyze', {
  method: 'POST',
  body: formData
}).then(r => r.json()).then(console.log)
```

---

## Performance Optimization

### Model Optimization

```python
# Quantization (smaller, faster)
import tensorflow as tf

converter = tf.lite.TFLiteConverter.from_saved_model('model_path')
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# This reduces model size by ~75%
with open('model_quantized.tflite', 'wb') as f:
    f.write(tflite_model)
```

### Caching Results

```typescript
// Memoize analysis to avoid re-analyzing same image
const analysisCache = new Map<string, AnalysisResult>()

async function analyzeWithCache(blob: Blob) {
  const hash = await hashBlob(blob)
  
  if (analysisCache.has(hash)) {
    return analysisCache.get(hash)!
  }
  
  const result = await analyzeImage(blob)
  analysisCache.set(hash, result)
  return result
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Model loading fails | Check path, ensure model files exist |
| Inference timeout | Reduce image resolution, optimize model |
| GPU not detected | Install CUDA drivers, update TensorFlow |
| CORS error | Add frontend URL to CORS middleware |
| Poor accuracy | Retrain with more data, adjust thresholds |
| Slow predictions | Use quantization, optimize for edge devices |

---

## Next Steps

1. **Prepare Training Data** - Collect labeled health images
2. **Train Custom Model** - Use provided template
3. **Deploy ML Server** - Use Docker for consistency
4. **Connect Hardware** - Setup ESP32-CAM stream
5. **Test Integration** - Verify end-to-end workflow
6. **Monitor Performance** - Track accuracy and latency
7. **Iterate** - Improve model with feedback

