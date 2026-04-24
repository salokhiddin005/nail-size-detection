
# original


# import base64
# from datetime import datetime
# from pathlib import Path

# import cv2
# import numpy as np
# from fastapi import FastAPI, File, HTTPException, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles

# from db import get_connection
# from scripts.detect_card import detect_card
# from scripts.detect_nail import detect_nail
# from scripts.measure_nail import measure_nail

# app = FastAPI(title="AI Nail Size Detector API", version="1.0.0")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=False,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# BASE_DIR = Path(__file__).resolve().parent
# OUTPUT_DIR = BASE_DIR / "outputs"
# OUTPUT_DIR.mkdir(exist_ok=True)

# app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR)), name="outputs")


# def recommend_size(width_mm: float) -> str:
#     if width_mm < 11:
#         return "XS"
#     if width_mm < 13:
#         return "S"
#     if width_mm < 15:
#         return "M"
#     if width_mm < 17:
#         return "L"
#     return "XL"


# def encode_jpeg_data_url(img) -> str:
#     ok, buf = cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 88])
#     if not ok:
#         return ""
#     return "data:image/jpeg;base64," + base64.b64encode(buf.tobytes()).decode("ascii")


# def save_analysis_to_db(
#     length_mm: float,
#     width_mm: float,
#     recommended_size: str,
#     annotated_image_path: str,
# ) -> None:
#     conn = None
#     cursor = None
#     try:
#         conn = get_connection()
#         cursor = conn.cursor()
#         cursor.execute(
#             """
#             INSERT INTO analysis_history
#             (length_mm, width_mm, recommended_size, annotated_image_path)
#             VALUES (%s, %s, %s, %s)
#             """,
#             (
#                 float(length_mm),
#                 float(width_mm),
#                 recommended_size,
#                 annotated_image_path,
#             ),
#         )
#         conn.commit()
#     finally:
#         if cursor is not None:
#             cursor.close()
#         if conn is not None and conn.is_connected():
#             conn.close()


# @app.get("/api/health")
# def health():
#     return {"ok": True}


# @app.get("/api/history")
# def get_history():
#     conn = None
#     cursor = None
#     try:
#         conn = get_connection()
#         cursor = conn.cursor(dictionary=True)
#         cursor.execute(
#             """
#             SELECT
#                 id,
#                 created_at,
#                 length_mm,
#                 width_mm,
#                 recommended_size,
#                 annotated_image_path
#             FROM analysis_history
#             ORDER BY created_at DESC, id DESC
#             """
#         )
#         rows = cursor.fetchall()

#         items = []
#         for row in rows:
#             created_at = row["created_at"]
#             annotated_image_path = row["annotated_image_path"] or ""
#             annotated_image_url = annotated_image_path if annotated_image_path else None

#             items.append(
#                 {
#                     "id": row["id"],
#                     "created_at": created_at.isoformat() if created_at else None,
#                     "length_mm": float(row["length_mm"]),
#                     "width_mm": float(row["width_mm"]),
#                     "recommended_size": row["recommended_size"],
#                     "annotated_image_path": annotated_image_path,
#                     "annotated_image_url": annotated_image_url,
#                 }
#             )

#         return {"ok": True, "items": items}
#     finally:
#         if cursor is not None:
#             cursor.close()
#         if conn is not None and conn.is_connected():
#             conn.close()


# @app.delete("/api/history/{item_id}")
# def delete_history_item(item_id: int):
#     conn = None
#     cursor = None

#     try:
#         conn = get_connection()
#         cursor = conn.cursor(dictionary=True)

#         cursor.execute(
#             """
#             SELECT annotated_image_path
#             FROM analysis_history
#             WHERE id = %s
#             """,
#             (item_id,),
#         )
#         row = cursor.fetchone()

#         if not row:
#             raise HTTPException(status_code=404, detail="History item not found")

#         annotated_image_path = row["annotated_image_path"] or ""

#         cursor.execute("DELETE FROM analysis_history WHERE id = %s", (item_id,))
#         conn.commit()

#         if annotated_image_path:
#             try:
#                 file_name = Path(annotated_image_path).name
#                 local_file = OUTPUT_DIR / file_name
#                 if local_file.exists():
#                     local_file.unlink()
#             except Exception:
#                 pass

#         return {"ok": True, "deleted_id": item_id}

#     finally:
#         if cursor is not None:
#             cursor.close()
#         if conn is not None and conn.is_connected():
#             conn.close()


# @app.post("/api/analyze")
# async def analyze(image: UploadFile = File(...)):
#     raw = await image.read()
#     if not raw:
#         raise HTTPException(status_code=400, detail="Empty file")

#     arr = np.frombuffer(raw, dtype=np.uint8)
#     frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
#     if frame is None:
#         raise HTTPException(status_code=400, detail="Could not decode image")

#     max_side = 1280
#     h, w = frame.shape[:2]
#     scale = min(max_side / max(h, w), 1.0)
#     if scale < 1.0:
#         frame = cv2.resize(frame, (int(w * scale), int(h * scale)))

#     cv2.imwrite(str(BASE_DIR / "debug_webcam_input.jpg"), frame)

#     original_b64 = encode_jpeg_data_url(frame)

#     card = detect_card(frame)
#     if not card:
#         return {
#             "ok": False,
#             "error": "no_card",
#             "message": (
#                 "We couldn't find a bank card in your photo. Make sure the full "
#                 "card is visible, well-lit, and lying flat next to your finger."
#             ),
#             "original": original_b64,
#         }

#     nail = detect_nail(frame)
#     if not nail:
#         return {
#             "ok": False,
#             "error": "no_nail",
#             "message": (
#                 "We found the card but couldn't detect a fingernail. Place a "
#                 "finger on the card so the nail is clearly visible."
#             ),
#             "original": original_b64,
#         }

#     try:
#         result = measure_nail(frame, card, nail, output_path=None)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Measurement failed: {e}")

#     if "measurement" not in result or "annotated" not in result:
#         raise HTTPException(status_code=500, detail="Measurement output is incomplete")

#     m = result["measurement"]
#     length_mm = round(float(m["length_mm"]), 2)
#     width_mm = round(float(m["width_mm"]), 2)
#     rec = recommend_size(width_mm)

#     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
#     filename = f"{timestamp}_annotated.jpg"
#     filepath = OUTPUT_DIR / filename

#     ok = cv2.imwrite(str(filepath), result["annotated"])
#     if not ok:
#         raise HTTPException(status_code=500, detail="Failed to save annotated image locally")

#     annotated_image_url = f"/outputs/{filename}"

#     save_analysis_to_db(
#         length_mm=length_mm,
#         width_mm=width_mm,
#         recommended_size=rec,
#         annotated_image_path=annotated_image_url,
#     )

#     card_box = card.get("card_box")
#     if hasattr(card_box, "tolist"):
#         card_box = card_box.tolist()

#     nail_bbox = nail.get("bbox")
#     if hasattr(nail_bbox, "tolist"):
#         nail_bbox = nail_bbox.tolist()

#     return {
#         "ok": True,
#         "length_mm": length_mm,
#         "width_mm": width_mm,
#         "size": rec,
#         "annotated_image_url": annotated_image_url,
#         "measurement": {
#             "length_mm": length_mm,
#             "width_mm": width_mm,
#         },
#         "recommended_size": rec,
#         "original": original_b64,
#         "annotated": encode_jpeg_data_url(result["annotated"]),
#         "saved": {
#             "annotated_image_path": annotated_image_url,
#             "annotated_image_url": annotated_image_url,
#             "created_at": datetime.now().isoformat(),
#         },
#         "card": {
#             "confidence": float(card.get("score", 0.0)),
#             "bbox": card_box,
#         },
#         "nail": {
#             "confidence": float(nail.get("conf", 0.0)),
#             "bbox": nail_bbox,
#         },
#     }


# original

# import base64
# import time
# from datetime import datetime
# from pathlib import Path

# import cv2
# import numpy as np
# from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles

# from db import get_connection
# from scripts.detect_card import detect_card
# from scripts.detect_nail import detect_nail
# from scripts.measure_nail import measure_nail

# app = FastAPI(title="AI Nail Size Detector API", version="1.0.0")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=False,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# BASE_DIR = Path(__file__).resolve().parent
# OUTPUT_DIR = BASE_DIR / "outputs"
# OUTPUT_DIR.mkdir(exist_ok=True)

# app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR)), name="outputs")

# # Webcam-only memory for stabilization / fallback
# LAST_GOOD_RESULT = None
# LAST_GOOD_TS = 0.0
# LAST_CARD = None
# LAST_NAIL = None
# FALLBACK_SECONDS = 1.2
# SMOOTH_ALPHA = 0.65


# def recommend_size(width_mm: float) -> str:
#     if width_mm < 11:
#         return "XS"
#     if width_mm < 13:
#         return "S"
#     if width_mm < 15:
#         return "M"
#     if width_mm < 17:
#         return "L"
#     return "XL"


# def encode_jpeg_data_url(img) -> str:
#     ok, buf = cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 88])
#     if not ok:
#         return ""
#     return "data:image/jpeg;base64," + base64.b64encode(buf.tobytes()).decode("ascii")


# def save_analysis_to_db(
#     length_mm: float,
#     width_mm: float,
#     recommended_size: str,
#     annotated_image_path: str,
# ) -> None:
#     conn = None
#     cursor = None
#     try:
#         conn = get_connection()
#         cursor = conn.cursor()
#         cursor.execute(
#             """
#             INSERT INTO analysis_history
#             (length_mm, width_mm, recommended_size, annotated_image_path)
#             VALUES (%s, %s, %s, %s)
#             """,
#             (
#                 float(length_mm),
#                 float(width_mm),
#                 recommended_size,
#                 annotated_image_path,
#             ),
#         )
#         conn.commit()
#     finally:
#         if cursor is not None:
#             cursor.close()
#         if conn is not None and conn.is_connected():
#             conn.close()


# def smooth_box(prev_box, new_box, alpha=SMOOTH_ALPHA):
#     if prev_box is None:
#         return new_box
#     prev_box = np.asarray(prev_box, dtype=np.float32)
#     new_box = np.asarray(new_box, dtype=np.float32)
#     return alpha * new_box + (1.0 - alpha) * prev_box


# def smooth_detection(prev_card, prev_nail, card, nail):
#     smoothed_card = card
#     smoothed_nail = nail

#     if card is not None and card.get("card_box") is not None:
#         new_card_box = np.asarray(card["card_box"], dtype=np.float32)
#         prev_card_box = None if prev_card is None else prev_card.get("card_box")
#         smoothed_card = dict(card)
#         smoothed_card["card_box"] = smooth_box(prev_card_box, new_card_box)

#         x_coords = smoothed_card["card_box"][:, 0]
#         y_coords = smoothed_card["card_box"][:, 1]
#         smoothed_card["bbox"] = np.array(
#             [x_coords.min(), y_coords.min(), x_coords.max(), y_coords.max()],
#             dtype=np.float32,
#         )

#     if nail is not None and nail.get("bbox") is not None:
#         new_nail_box = np.asarray(nail["bbox"], dtype=np.float32)
#         prev_nail_box = None if prev_nail is None else prev_nail.get("bbox")
#         smoothed_nail = dict(nail)
#         smoothed_nail["bbox"] = smooth_box(prev_nail_box, new_nail_box)

#     return smoothed_card, smoothed_nail


# def clone_result_payload(payload):
#     if payload is None:
#         return None
#     return {
#         "ok": payload["ok"],
#         "length_mm": payload["length_mm"],
#         "width_mm": payload["width_mm"],
#         "size": payload["size"],
#         "annotated_image_url": payload["annotated_image_url"],
#         "measurement": dict(payload["measurement"]),
#         "recommended_size": payload["recommended_size"],
#         "original": payload["original"],
#         "annotated": payload["annotated"],
#         "saved": dict(payload["saved"]),
#         "card": {
#             "confidence": payload["card"]["confidence"],
#             "bbox": payload["card"]["bbox"],
#         },
#         "nail": {
#             "confidence": payload["nail"]["confidence"],
#             "bbox": payload["nail"]["bbox"],
#         },
#         "fallback_used": True,
#     }


# def make_absolute_output_url(request: Request, path: str | None) -> str | None:
#     if not path:
#         return None

#     if path.startswith("http://") or path.startswith("https://"):
#         return path

#     base = str(request.base_url).rstrip("/")

#     if path.startswith("/"):
#         return f"{base}{path}"

#     return f"{base}/{path}"


# def output_file_exists(path: str | None) -> bool:
#     if not path:
#         return False

#     file_name = Path(path).name
#     return (OUTPUT_DIR / file_name).exists()


# @app.get("/api/health")
# def health():
#     return {"ok": True}


# @app.get("/api/history")
# def get_history(request: Request):
#     conn = None
#     cursor = None
#     try:
#         conn = get_connection()
#         cursor = conn.cursor(dictionary=True)
#         cursor.execute(
#             """
#             SELECT
#                 id,
#                 created_at,
#                 length_mm,
#                 width_mm,
#                 recommended_size,
#                 annotated_image_path
#             FROM analysis_history
#             ORDER BY created_at DESC, id DESC
#             """
#         )
#         rows = cursor.fetchall()

#         items = []
#         for row in rows:
#             created_at = row["created_at"]
#             annotated_image_path = row["annotated_image_path"] or ""

#             if output_file_exists(annotated_image_path):
#                 annotated_image_url = make_absolute_output_url(request, annotated_image_path)
#             else:
#                 annotated_image_url = None

#             items.append(
#                 {
#                     "id": row["id"],
#                     "created_at": created_at.isoformat() if created_at else None,
#                     "length_mm": float(row["length_mm"]),
#                     "width_mm": float(row["width_mm"]),
#                     "recommended_size": row["recommended_size"],
#                     "annotated_image_path": annotated_image_path,
#                     "annotated_image_url": annotated_image_url,
#                     "image_exists": annotated_image_url is not None,
#                 }
#             )

#         return {"ok": True, "items": items}
#     finally:
#         if cursor is not None:
#             cursor.close()
#         if conn is not None and conn.is_connected():
#             conn.close()


# @app.delete("/api/history/{item_id}")
# def delete_history_item(item_id: int):
#     conn = None
#     cursor = None

#     try:
#         conn = get_connection()
#         cursor = conn.cursor(dictionary=True)

#         cursor.execute(
#             """
#             SELECT annotated_image_path
#             FROM analysis_history
#             WHERE id = %s
#             """,
#             (item_id,),
#         )
#         row = cursor.fetchone()

#         if not row:
#             raise HTTPException(status_code=404, detail="History item not found")

#         annotated_image_path = row["annotated_image_path"] or ""

#         cursor.execute("DELETE FROM analysis_history WHERE id = %s", (item_id,))
#         conn.commit()

#         if annotated_image_path:
#             try:
#                 file_name = Path(annotated_image_path).name
#                 local_file = OUTPUT_DIR / file_name
#                 if local_file.exists():
#                     local_file.unlink()
#             except Exception:
#                 pass

#         return {"ok": True, "deleted_id": item_id}

#     finally:
#         if cursor is not None:
#             cursor.close()
#         if conn is not None and conn.is_connected():
#             conn.close()


# @app.post("/api/analyze")
# async def analyze(
#     request: Request,
#     image: UploadFile = File(...),
#     source: str = Form("upload"),
# ):
#     global LAST_GOOD_RESULT, LAST_GOOD_TS, LAST_CARD, LAST_NAIL

#     raw = await image.read()
#     if not raw:
#         raise HTTPException(status_code=400, detail="Empty file")

#     arr = np.frombuffer(raw, dtype=np.uint8)
#     frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
#     if frame is None:
#         raise HTTPException(status_code=400, detail="Could not decode image")

#     max_side = 1280
#     h, w = frame.shape[:2]
#     scale = min(max_side / max(h, w), 1.0)
#     if scale < 1.0:
#         frame = cv2.resize(frame, (int(w * scale), int(h * scale)))

#     debug_name = "debug_webcam_input.jpg" if source == "webcam" else "debug_upload_input.jpg"
#     cv2.imwrite(str(BASE_DIR / debug_name), frame)

#     original_b64 = encode_jpeg_data_url(frame)

#     card = detect_card(frame)
#     nail = detect_nail(frame)

#     use_webcam_memory = source == "webcam"
#     now = time.time()

#     # Webcam-only fallback
#     if card is None or nail is None:
#         if use_webcam_memory and LAST_GOOD_RESULT is not None and (now - LAST_GOOD_TS) <= FALLBACK_SECONDS:
#             fallback_payload = clone_result_payload(LAST_GOOD_RESULT)
#             fallback_payload["original"] = original_b64
#             return fallback_payload

#         if card is None:
#             return {
#                 "ok": False,
#                 "error": "no_card",
#                 "message": (
#                     "We couldn't find a bank card in your photo. Make sure the full "
#                     "card is visible, well-lit, and lying flat next to your finger."
#                 ),
#                 "original": original_b64,
#             }

#         return {
#             "ok": False,
#             "error": "no_nail",
#             "message": (
#                 "We found the card but couldn't detect a fingernail. Place a "
#                 "finger on the card so the nail is clearly visible."
#             ),
#             "original": original_b64,
#         }

#     # Webcam-only smoothing
#     if use_webcam_memory:
#         card, nail = smooth_detection(LAST_CARD, LAST_NAIL, card, nail)
#         LAST_CARD = card
#         LAST_NAIL = nail

#     try:
#         result = measure_nail(frame, card, nail, output_path=None)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Measurement failed: {e}")

#     if "measurement" not in result or "annotated" not in result:
#         raise HTTPException(status_code=500, detail="Measurement output is incomplete")

#     m = result["measurement"]
#     length_mm = round(float(m["length_mm"]), 2)
#     width_mm = round(float(m["width_mm"]), 2)
#     rec = recommend_size(width_mm)

#     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
#     filename = f"{timestamp}_annotated.jpg"
#     filepath = OUTPUT_DIR / filename

#     ok = cv2.imwrite(str(filepath), result["annotated"])
#     if not ok:
#         raise HTTPException(status_code=500, detail="Failed to save annotated image locally")

#     annotated_image_path = f"/outputs/{filename}"
#     annotated_image_url = make_absolute_output_url(request, annotated_image_path)

#     save_analysis_to_db(
#         length_mm=length_mm,
#         width_mm=width_mm,
#         recommended_size=rec,
#         annotated_image_path=annotated_image_path,
#     )

#     card_box = card.get("card_box")
#     if hasattr(card_box, "tolist"):
#         card_box = card_box.tolist()

#     nail_bbox = nail.get("bbox")
#     if hasattr(nail_bbox, "tolist"):
#         nail_bbox = nail_bbox.tolist()

#     response_payload = {
#         "ok": True,
#         "length_mm": length_mm,
#         "width_mm": width_mm,
#         "size": rec,
#         "annotated_image_url": annotated_image_url,
#         "measurement": {
#             "length_mm": length_mm,
#             "width_mm": width_mm,
#         },
#         "recommended_size": rec,
#         "original": original_b64,
#         "annotated": encode_jpeg_data_url(result["annotated"]),
#         "saved": {
#             "annotated_image_path": annotated_image_path,
#             "annotated_image_url": annotated_image_url,
#             "created_at": datetime.now().isoformat(),
#         },
#         "card": {
#             "confidence": float(card.get("score", 0.0)),
#             "bbox": card_box,
#         },
#         "nail": {
#             "confidence": float(nail.get("conf", 0.0)),
#             "bbox": nail_bbox,
#         },
#         "fallback_used": False,
#     }

#     if use_webcam_memory:
#         LAST_GOOD_RESULT = clone_result_payload(response_payload)
#         LAST_GOOD_RESULT["fallback_used"] = False
#         LAST_GOOD_TS = now

#     return response_payload

import base64
import os
import time
from datetime import datetime
from pathlib import Path

import cv2
import numpy as np
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, Header, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from scripts.detect_card import detect_card
from scripts.detect_nail import detect_nail
from scripts.measure_nail import measure_nail

app = FastAPI(title="AI Nail Size Detector API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)

app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR)), name="outputs")

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_PUBLISHABLE_KEY = os.getenv("SUPABASE_PUBLISHABLE_KEY", "")
SUPABASE_STORAGE_BUCKET = os.getenv("SUPABASE_STORAGE_BUCKET", "analysis-images")

# Webcam-only memory for stabilization / fallback
LAST_GOOD_RESULT = None
LAST_GOOD_TS = 0.0
LAST_CARD = None
LAST_NAIL = None
FALLBACK_SECONDS = 1.2
SMOOTH_ALPHA = 0.65


def recommend_size(width_mm: float) -> str:
    if width_mm < 11:
        return "XS"
    if width_mm < 13:
        return "S"
    if width_mm < 15:
        return "M"
    if width_mm < 17:
        return "L"
    return "XL"


def encode_jpeg_data_url(img) -> str:
    ok, buf = cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 88])
    if not ok:
        return ""
    return "data:image/jpeg;base64," + base64.b64encode(buf.tobytes()).decode("ascii")


def smooth_box(prev_box, new_box, alpha=SMOOTH_ALPHA):
    if prev_box is None:
        return new_box
    prev_box = np.asarray(prev_box, dtype=np.float32)
    new_box = np.asarray(new_box, dtype=np.float32)
    return alpha * new_box + (1.0 - alpha) * prev_box


def smooth_detection(prev_card, prev_nail, card, nail):
    smoothed_card = card
    smoothed_nail = nail

    if card is not None and card.get("card_box") is not None:
        new_card_box = np.asarray(card["card_box"], dtype=np.float32)
        prev_card_box = None if prev_card is None else prev_card.get("card_box")
        smoothed_card = dict(card)
        smoothed_card["card_box"] = smooth_box(prev_card_box, new_card_box)

        x_coords = smoothed_card["card_box"][:, 0]
        y_coords = smoothed_card["card_box"][:, 1]
        smoothed_card["bbox"] = np.array(
            [x_coords.min(), y_coords.min(), x_coords.max(), y_coords.max()],
            dtype=np.float32,
        )

    if nail is not None and nail.get("bbox") is not None:
        new_nail_box = np.asarray(nail["bbox"], dtype=np.float32)
        prev_nail_box = None if prev_nail is None else prev_nail.get("bbox")
        smoothed_nail = dict(nail)
        smoothed_nail["bbox"] = smooth_box(prev_nail_box, new_nail_box)

    return smoothed_card, smoothed_nail


def clone_result_payload(payload):
    if payload is None:
        return None
    return {
        "ok": payload["ok"],
        "length_mm": payload["length_mm"],
        "width_mm": payload["width_mm"],
        "size": payload["size"],
        "annotated_image_url": payload["annotated_image_url"],
        "measurement": dict(payload["measurement"]),
        "recommended_size": payload["recommended_size"],
        "original": payload["original"],
        "annotated": payload["annotated"],
        "saved": dict(payload["saved"]),
        "card": {
            "confidence": payload["card"]["confidence"],
            "bbox": payload["card"]["bbox"],
        },
        "nail": {
            "confidence": payload["nail"]["confidence"],
            "bbox": payload["nail"]["bbox"],
        },
        "fallback_used": True,
    }


def make_absolute_output_url(request: Request, path: str | None) -> str | None:
    if not path:
        return None

    if path.startswith("http://") or path.startswith("https://"):
        return path

    base = str(request.base_url).rstrip("/")

    if path.startswith("/"):
        return f"{base}{path}"

    return f"{base}/{path}"


def get_bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None

    parts = authorization.split(" ", 1)
    if len(parts) != 2:
        return None

    scheme, token = parts
    if scheme.lower() != "bearer":
        return None

    return token.strip()


def get_current_user_id_from_supabase(access_token: str) -> str:
    if not SUPABASE_URL or not SUPABASE_PUBLISHABLE_KEY:
        raise HTTPException(
            status_code=500,
            detail="Supabase backend environment variables are missing.",
        )

    resp = requests.get(
        f"{SUPABASE_URL}/auth/v1/user",
        headers={
            "Authorization": f"Bearer {access_token}",
            "apikey": SUPABASE_PUBLISHABLE_KEY,
        },
        timeout=15,
    )

    if resp.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid or expired user session: {resp.text}",
        )

    user = resp.json()
    user_id = user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Could not resolve user id.")

    return user_id


def upload_image_to_supabase_storage(
    object_path: str,
    image_bytes: bytes,
    content_type: str = "image/jpeg",
) -> str:
    """Upload raw image bytes to the Supabase Storage bucket and return its public URL."""
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(
            status_code=500,
            detail="Supabase backend environment variables are missing.",
        )

    upload_url = (
        f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_STORAGE_BUCKET}/{object_path}"
    )

    resp = requests.post(
        upload_url,
        headers={
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": content_type,
            "x-upsert": "true",
        },
        data=image_bytes,
        timeout=30,
    )

    if resp.status_code not in (200, 201):
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload image to Supabase Storage: {resp.text}",
        )

    return f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_STORAGE_BUCKET}/{object_path}"


def encode_jpeg_bytes(img, quality: int = 88) -> bytes:
    ok, buf = cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, quality])
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to encode image as JPEG")
    return buf.tobytes()


def save_analysis_to_supabase(
    user_id: str,
    length_mm: float,
    width_mm: float,
    recommended_size: str,
    original_image_url: str | None,
    annotated_image_url: str | None,
) -> None:
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(
            status_code=500,
            detail="Supabase backend environment variables are missing.",
        )

    payload = {
        "user_id": user_id,
        "length_mm": float(length_mm),
        "width_mm": float(width_mm),
        "recommended_size": recommended_size,
        "original_image_url": original_image_url,
        "annotated_image_url": annotated_image_url,
    }

    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/analysis_results",
        headers={
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        json=payload,
        timeout=15,
    )

    if resp.status_code not in (200, 201):
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save analysis to Supabase: {resp.text}",
        )


@app.get("/api/health")
def health():
    return {
        "ok": True,
        "env": {
            "supabase_url_set": bool(SUPABASE_URL),
            "service_role_set": bool(SUPABASE_SERVICE_ROLE_KEY),
            "publishable_key_set": bool(SUPABASE_PUBLISHABLE_KEY),
        },
    }


@app.post("/api/analyze")
async def analyze(
    request: Request,
    image: UploadFile = File(...),
    source: str = Form("upload"),
    authorization: str | None = Header(default=None),
):
    global LAST_GOOD_RESULT, LAST_GOOD_TS, LAST_CARD, LAST_NAIL

    access_token = get_bearer_token(authorization)
    if not access_token:
        raise HTTPException(status_code=401, detail="Missing Authorization bearer token.")

    user_id = get_current_user_id_from_supabase(access_token)

    raw = await image.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty file")

    arr = np.frombuffer(raw, dtype=np.uint8)
    frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if frame is None:
        raise HTTPException(status_code=400, detail="Could not decode image")

    max_side = 1280
    h, w = frame.shape[:2]
    scale = min(max_side / max(h, w), 1.0)
    if scale < 1.0:
        frame = cv2.resize(frame, (int(w * scale), int(h * scale)))

    debug_name = "debug_webcam_input.jpg" if source == "webcam" else "debug_upload_input.jpg"
    cv2.imwrite(str(BASE_DIR / debug_name), frame)

    original_b64 = encode_jpeg_data_url(frame)

    card = detect_card(frame)
    nail = detect_nail(frame)

    use_webcam_memory = source == "webcam"
    now = time.time()

    if card is None or nail is None:
        if use_webcam_memory and LAST_GOOD_RESULT is not None and (now - LAST_GOOD_TS) <= FALLBACK_SECONDS:
            fallback_payload = clone_result_payload(LAST_GOOD_RESULT)
            fallback_payload["original"] = original_b64
            return fallback_payload

        if card is None:
            return {
                "ok": False,
                "error": "no_card",
                "message": (
                    "We couldn't find a bank card in your photo. Make sure the full "
                    "card is visible, well-lit, and lying flat next to your finger."
                ),
                "original": original_b64,
            }

        return {
            "ok": False,
            "error": "no_nail",
            "message": (
                "We found the card but couldn't detect a fingernail. Place a "
                "finger on the card so the nail is clearly visible."
            ),
            "original": original_b64,
        }

    if use_webcam_memory:
        card, nail = smooth_detection(LAST_CARD, LAST_NAIL, card, nail)
        LAST_CARD = card
        LAST_NAIL = nail

    try:
        result = measure_nail(frame, card, nail, output_path=None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Measurement failed: {e}")

    if "measurement" not in result or "annotated" not in result:
        raise HTTPException(status_code=500, detail="Measurement output is incomplete")

    m = result["measurement"]
    length_mm = round(float(m["length_mm"]), 2)
    width_mm = round(float(m["width_mm"]), 2)
    rec = recommend_size(width_mm)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")

    original_object_path = f"{user_id}/{timestamp}_original.jpg"
    annotated_object_path = f"{user_id}/{timestamp}_annotated.jpg"

    original_image_url = upload_image_to_supabase_storage(
        original_object_path, encode_jpeg_bytes(frame)
    )
    annotated_image_url = upload_image_to_supabase_storage(
        annotated_object_path, encode_jpeg_bytes(result["annotated"])
    )

    original_image_path = original_object_path
    annotated_image_path = annotated_object_path

    save_analysis_to_supabase(
        user_id=user_id,
        length_mm=length_mm,
        width_mm=width_mm,
        recommended_size=rec,
        original_image_url=original_image_url,
        annotated_image_url=annotated_image_url,
    )

    card_box = card.get("card_box")
    if hasattr(card_box, "tolist"):
        card_box = card_box.tolist()

    nail_bbox = nail.get("bbox")
    if hasattr(nail_bbox, "tolist"):
        nail_bbox = nail_bbox.tolist()

    response_payload = {
        "ok": True,
        "length_mm": length_mm,
        "width_mm": width_mm,
        "size": rec,
        "annotated_image_url": annotated_image_url,
        "measurement": {
            "length_mm": length_mm,
            "width_mm": width_mm,
        },
        "recommended_size": rec,
        "original": original_b64,
        "annotated": encode_jpeg_data_url(result["annotated"]),
        "saved": {
            "original_image_path": original_image_path,
            "original_image_url": original_image_url,
            "annotated_image_path": annotated_image_path,
            "annotated_image_url": annotated_image_url,
            "created_at": datetime.now().isoformat(),
        },
        "card": {
            "confidence": float(card.get("score", 0.0)),
            "bbox": card_box,
        },
        "nail": {
            "confidence": float(nail.get("conf", 0.0)),
            "bbox": nail_bbox,
        },
        "fallback_used": False,
    }

    if use_webcam_memory:
        LAST_GOOD_RESULT = clone_result_payload(response_payload)
        LAST_GOOD_RESULT["fallback_used"] = False
        LAST_GOOD_TS = now

    return response_payload