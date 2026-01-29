from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf

from PIL import Image, ImageDraw



MODEL_PATH = "lstm_drawing_classifier.h5"
CNN_MODEL_PATH = "doodle_classifier_model.h5"

try:
    cnn_model = tf.keras.models.load_model(CNN_MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load CNN model: {e}")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")


def vector_to_image(
    strokes: np.ndarray,
    image_size: int = 255,
    stroke_width: int = 3,
    save_path: str = "drawing.png",
) -> Image.Image:
    """
    Converts QuickDraw-style [dx, dy, pen] data into a 64x64 image.
    Background is white, strokes are black.
    """


    x, y = 0.0, 0.0
    points = []

    for dx, dy, pen in strokes:
        x += dx
        y += dy
        points.append((x, y, int(pen)))

    points = np.array(points)


    min_x, min_y = points[:, 0].min(), points[:, 1].min()
    max_x, max_y = points[:, 0].max(), points[:, 1].max()

    scale = max(max_x - min_x, max_y - min_y)
    scale = scale if scale > 0 else 1.0

    points[:, 0] = (points[:, 0] - min_x) / scale * (image_size - 4) + 2
    points[:, 1] = (points[:, 1] - min_y) / scale * (image_size - 4) + 2


    img = Image.new("L", (image_size, image_size), 255)  # 255 = white
    draw = ImageDraw.Draw(img)

    
    for i in range(1, len(points)):
        if points[i - 1][2] == 1: 
            draw.line(
                (
                    points[i - 1][0],
                    points[i - 1][1],
                    points[i][0],
                    points[i][1],
                ),
                fill=0,  
                width=stroke_width,
            )

  
    if save_path:
        img.save(save_path)

    return img

def predict_cnn(image: Image.Image) -> tuple[int, float]:
    """
    Runs CNN inference on a 64x64 grayscale image.
    """
    image = image.resize((64, 64))
    x = np.array(image, dtype=np.float32) / 255.0
    x = np.expand_dims(x, axis=(0, -1))  

    y = cnn_model.predict(x, verbose=0)
    idx = int(np.argmax(y, axis=1)[0])
    confidence = float(np.max(y) * 100)

    return idx, confidence

app = FastAPI(title="LSTM Prediction API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],         
    allow_headers=["*"],          
)

class PredictionRequest(BaseModel):
    data: list  # expected shape: [[x1, y1, p1], [x2, y2, p2], ...]


class PredictionResponse(BaseModel):
    predicted_index: int
    confidence_percentage: float


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
      
        input_data = np.array(request.data, dtype=np.float32)

       
        input_data = np.expand_dims(input_data, axis=0)

     
        predictions = model.predict(input_data)

       
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]) * 100)

        return PredictionResponse(
            predicted_index=predicted_index,
            confidence_percentage=round(confidence, 2)
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict_cnn", response_model=PredictionResponse)
def predict_cnn_route(request: PredictionRequest):
    try:
        strokes = np.array(request.data, dtype=np.float32)

        # Convert vector drawing → image
        image = vector_to_image(strokes)

        # CNN inference
        predicted_index, confidence = predict_cnn(image)

        return PredictionResponse(
            predicted_index=predicted_index,
            confidence_percentage=round(confidence, 2)
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))