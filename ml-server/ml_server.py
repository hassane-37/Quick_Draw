from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import base64
from io import BytesIO
from PIL import Image, ImageDraw

# Model paths
MODEL_PATH = "lstm_drawing_classifier.h5"
CNN_MODEL_PATH = "doodle_classifier_model_v2.h5"

# Load models
try:
    cnn_model = tf.keras.models.load_model(CNN_MODEL_PATH)
    print(f"✅ CNN model loaded successfully from {CNN_MODEL_PATH}")
except Exception as e:
    raise RuntimeError(f"Failed to load CNN model: {e}")

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"✅ LSTM model loaded successfully from {MODEL_PATH}")
except Exception as e:
    raise RuntimeError(f"Failed to load LSTM model: {e}")


# =============================================================================
# Image Processing Helper Functions
# =============================================================================

def rdp_simplify(points, epsilon=2.0):
    """
    Ramer-Douglas-Peucker algorithm for simplifying a polyline.
    """
    if len(points) < 3:
        return points
    
    # Find the point with the maximum distance from the line between first and last
    dmax = 0
    index = 0
    end = len(points) - 1
    
    for i in range(1, end):
        d = perpendicular_distance(points[i], points[0], points[end])
        if d > dmax:
            index = i
            dmax = d
    
    # If max distance is greater than epsilon, recursively simplify
    if dmax > epsilon:
        # Recursive call
        rec_results1 = rdp_simplify(points[:index+1], epsilon)
        rec_results2 = rdp_simplify(points[index:], epsilon)
        
        # Build the result list
        result = np.vstack([rec_results1[:-1], rec_results2])
    else:
        result = np.array([points[0], points[end]])
    
    return result

def perpendicular_distance(point, line_start, line_end):
    """
    Calculate perpendicular distance from point to line.
    """
    if np.array_equal(line_start, line_end):
        return np.linalg.norm(point - line_start)
    
    num = np.abs(np.cross(line_end - line_start, line_start - point))
    denom = np.linalg.norm(line_end - line_start)
    return num / denom

def resample_stroke(points, spacing=1.0):
    """
    Resample a stroke with uniform spacing.
    """
    if len(points) < 2:
        return points
    
    resampled = [points[0]]
    accumulated_distance = 0.0
    
    for i in range(1, len(points)):
        segment_length = np.linalg.norm(points[i] - points[i-1])
        accumulated_distance += segment_length
        
        while accumulated_distance >= spacing:
            # Calculate ratio for interpolation
            ratio = (accumulated_distance - spacing) / segment_length
            ratio = 1 - ratio
            
            # Interpolate point
            new_point = points[i-1] + ratio * (points[i] - points[i-1])
            resampled.append(new_point)
            accumulated_distance -= spacing
    
    # Add last point
    if not np.array_equal(resampled[-1], points[-1]):
        resampled.append(points[-1])
    
    return np.array(resampled)

def vector_to_image(
    strokes: np.ndarray,
    image_size: int = 256,
    stroke_width: int = 2,
    save_path: str = None,
) -> Image.Image:
    """
    Converts QuickDraw-style [dx, dy, pen] data into a high-resolution image with preprocessing.
    Used for visualization and LSTM model.
    
    Steps:
    1. Align to top-left (minimum = 0)
    2. Scale to maximum = 255
    3. Resample strokes with 1 pixel spacing
    4. Simplify with RDP algorithm (epsilon = 2.0)
    
    Args:
        strokes: numpy array of shape (n, 3) with [dx, dy, pen] format
        image_size: output image size (default 256x256)
        stroke_width: width of drawn lines
        save_path: optional path to save image
    
    Returns:
        PIL Image (grayscale, white background, black strokes)
    """
    if len(strokes) == 0:
        return Image.new("L", (image_size, image_size), 255)
    
    # Convert cumulative deltas to absolute coordinates
    x, y = 0.0, 0.0
    points = []
    stroke_segments = []  # Store separate strokes
    current_stroke = []
    
    for dx, dy, pen in strokes:
        x += dx
        y += dy
        
        if pen == 1:  # Pen is down, drawing
            current_stroke.append([x, y])
        else:  # Pen is up
            if current_stroke:
                stroke_segments.append(np.array(current_stroke))
                current_stroke = []
    
    # Add last stroke if exists
    if current_stroke:
        stroke_segments.append(np.array(current_stroke))
    
    if not stroke_segments:
        # Empty drawing
        img = Image.new("L", (image_size, image_size), 255)
        if save_path:
            img.save(save_path)
        return img
    
    # Step 1: Align to top-left corner (minimum = 0)
    all_points = np.vstack(stroke_segments)
    min_x, min_y = all_points[:, 0].min(), all_points[:, 1].min()
    
    for i in range(len(stroke_segments)):
        stroke_segments[i][:, 0] -= min_x
        stroke_segments[i][:, 1] -= min_y
    
    # Step 2: Uniformly scale to maximum = 255
    all_points = np.vstack(stroke_segments)
    max_x, max_y = all_points[:, 0].max(), all_points[:, 1].max()
    max_val = max(max_x, max_y)
    
    if max_val > 0:
        scale_factor = 255.0 / max_val
        for i in range(len(stroke_segments)):
            stroke_segments[i] *= scale_factor
    
    # Step 3: Resample all strokes with 1 pixel spacing
    resampled_strokes = []
    for stroke in stroke_segments:
        resampled = resample_stroke(stroke, spacing=1.0)
        resampled_strokes.append(resampled)
    
    # Step 4: Simplify with Ramer-Douglas-Peucker (epsilon = 2.0)
    simplified_strokes = []
    for stroke in resampled_strokes:
        if len(stroke) > 2:
            simplified = rdp_simplify(stroke, epsilon=2.0)
            simplified_strokes.append(simplified)
        else:
            simplified_strokes.append(stroke)
    
    # Create image
    img = Image.new("L", (image_size, image_size), 255)  # White background
    draw = ImageDraw.Draw(img)
    
    # Draw all strokes
    for stroke in simplified_strokes:
        for i in range(1, len(stroke)):
            draw.line(
                (
                    float(stroke[i-1][0]),
                    float(stroke[i-1][1]),
                    float(stroke[i][0]),
                    float(stroke[i][1]),
                ),
                fill=0,  # Black
                width=stroke_width,
            )
    
    if save_path:
        img.save(save_path)
    
    return img

def vector_to_image_64(
    strokes: np.ndarray,
    image_size: int = 64,
    stroke_width: int = 1,
    save_path: str = None,
) -> Image.Image:
    """
    Optimized version for CNN: Creates 64x64 images directly without intermediate resizing.
    Same preprocessing as vector_to_image but optimized for target size.
    
    Args:
        strokes: numpy array of shape (n, 3) with [dx, dy, pen] format
        image_size: output image size (default 64x64 for CNN)
        stroke_width: width of drawn lines (thinner for smaller image)
        save_path: optional path to save image
    
    Returns:
        PIL Image 64x64 (grayscale, white background, black strokes)
    """
    if len(strokes) == 0:
        return Image.new("L", (image_size, image_size), 255)
    
    # Convert cumulative deltas to absolute coordinates
    x, y = 0.0, 0.0
    stroke_segments = []
    current_stroke = []
    
    for dx, dy, pen in strokes:
        x += dx
        y += dy
        
        if pen == 1:  # Pen is down, drawing
            current_stroke.append([x, y])
        else:  # Pen is up
            if current_stroke:
                stroke_segments.append(np.array(current_stroke))
                current_stroke = []
    
    if current_stroke:
        stroke_segments.append(np.array(current_stroke))
    
    if not stroke_segments:
        return Image.new("L", (image_size, image_size), 255)
    
    # Align to top-left corner
    all_points = np.vstack(stroke_segments)
    min_x, min_y = all_points[:, 0].min(), all_points[:, 1].min()
    
    for i in range(len(stroke_segments)):
        stroke_segments[i][:, 0] -= min_x
        stroke_segments[i][:, 1] -= min_y
    
    # Scale to fit image_size (with padding)
    all_points = np.vstack(stroke_segments)
    max_x, max_y = all_points[:, 0].max(), all_points[:, 1].max()
    max_val = max(max_x, max_y)
    
    if max_val > 0:
        # Scale to fit with 2px padding on each side
        scale_factor = (image_size - 4) / max_val
        for i in range(len(stroke_segments)):
            stroke_segments[i] = stroke_segments[i] * scale_factor + 2
    
    # Create image and draw
    img = Image.new("L", (image_size, image_size), 255)
    draw = ImageDraw.Draw(img)
    
    for stroke in stroke_segments:
        for i in range(1, len(stroke)):
            draw.line(
                (
                    float(stroke[i-1][0]),
                    float(stroke[i-1][1]),
                    float(stroke[i][0]),
                    float(stroke[i][1]),
                ),
                fill=0,
                width=stroke_width,
            )
    
    if save_path:
        img.save(save_path)
    
    return img

# =============================================================================
# Model Inference Functions
# =============================================================================

def predict_cnn(image: Image.Image) -> tuple[int, float]:
    """
    Runs CNN inference on a 64x64 grayscale image.
    
    Args:
        image: PIL Image (grayscale), should be 64x64
    
    Returns:
        tuple: (predicted_class_index, confidence_percentage)
    """
    # Ensure image is 64x64
    if image.size != (64, 64):
        image = image.resize((64, 64), Image.Resampling.LANCZOS)
    
    # Normalize and prepare for model
    x = np.array(image, dtype=np.float32) / 255.0
    x = np.expand_dims(x, axis=(0, -1))  # Shape: (1, 64, 64, 1)

    # Predict
    y = cnn_model.predict(x, verbose=0)
    idx = int(np.argmax(y, axis=1)[0])
    confidence = float(np.max(y) * 100)

    return idx, confidence

# =============================================================================
# FastAPI App
# =============================================================================

app = FastAPI(title="Quick Draw ML Prediction API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# Request/Response Models
# =============================================================================

class PredictionRequest(BaseModel):
    data: list  # Format: [[dx, dy, pen], [dx, dy, pen], ...]

class PredictionResponse(BaseModel):
    predicted_index: int
    confidence_percentage: float
    image_base64: str = None  # Base64 encoded image

# =============================================================================
# API Endpoints
# =============================================================================

@app.get("/")
def root():
    return {
        "message": "Quick Draw ML API",
        "endpoints": {
            "/predict": "LSTM model predictions",
            "/predict_cnn": "CNN model predictions (10 classes)"
        },
        "models": {
            "lstm": MODEL_PATH,
            "cnn": CNN_MODEL_PATH
        }
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    """
    LSTM model prediction endpoint.
    Expects drawing data in QuickDraw format: [[dx, dy, pen], ...]
    """
    try:
        # Validate input
        if not request.data or len(request.data) < 5:
            raise HTTPException(
                status_code=400, 
                detail="Drawing data too short. Need at least 5 points."
            )
      
        input_data = np.array(request.data, dtype=np.float32)
        input_data = np.expand_dims(input_data, axis=0)  # Add batch dimension

        # Run prediction
        predictions = model.predict(input_data, verbose=0)
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]) * 100)

        # Generate visualization image (256x256 for better quality)
        image = vector_to_image(request.data, image_size=256, save_path=None)
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        return PredictionResponse(
            predicted_index=predicted_index,
            confidence_percentage=round(confidence, 2),
            image_base64=f"data:image/png;base64,{img_str}"
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ LSTM Prediction error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict_cnn", response_model=PredictionResponse)
def predict_cnn_route(request: PredictionRequest):
    """
    CNN model prediction endpoint (optimized for 64x64 input).
    Expects drawing data in QuickDraw format: [[dx, dy, pen], ...]
    Returns prediction for 10 classes (alphabetically sorted).
    """
    try:
        # Validate input
        if not request.data or len(request.data) < 5:
            raise HTTPException(
                status_code=400,
                detail="Drawing data too short. Need at least 5 points."
            )
        
        # Convert to numpy array
        data = np.array(request.data, dtype=np.float32)
        
        # Convert vector drawing → 64x64 image (optimized, no resize needed)
        image = vector_to_image_64(data, image_size=64, save_path=None)

        # Convert image to base64 for frontend display
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        # CNN inference
        predicted_index, confidence = predict_cnn(image)
        
        # Validate prediction index
        if predicted_index < 0 or predicted_index > 9:
            print(f"⚠️ Warning: Invalid predicted_index {predicted_index}, clamping to 0-9")
            predicted_index = max(0, min(9, predicted_index))

        return PredictionResponse(
            predicted_index=predicted_index,
            confidence_percentage=round(confidence, 2),
            image_base64=f"data:image/png;base64,{img_str}"
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ CNN Prediction error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")