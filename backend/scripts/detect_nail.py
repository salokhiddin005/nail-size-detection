# original

# from pathlib import Path

# import cv2
# import numpy as np
# from ultralytics import YOLO

# from config import MODEL_PATH, NAIL_CONF, NAIL_IOU, NAIL_IMGSZ, NAIL_CLASS_ID


# _model = None


# def _get_model():
#     global _model
#     if _model is None:
#         if not Path(MODEL_PATH).exists():
#             raise FileNotFoundError(f"YOLO nail model not found: {MODEL_PATH}")
#         _model = YOLO(str(MODEL_PATH))
#     return _model


# def _to_bgr_frame(frame):
#     """
#     Accepts:
#     - webcam numpy frame
#     - uploaded image as numpy array
#     - file path string
#     Returns BGR numpy image
#     """
#     if frame is None:
#         return None

#     if isinstance(frame, str):
#         img = cv2.imread(frame)
#         return img

#     if not isinstance(frame, np.ndarray):
#         return None

#     if frame.ndim == 2:
#         return cv2.cvtColor(frame, cv2.COLOR_GRAY2BGR)

#     if frame.ndim == 3 and frame.shape[2] == 4:
#         return cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)

#     return frame.copy()


# def detect_nail(frame):
#     frame_bgr = _to_bgr_frame(frame)
#     if frame_bgr is None:
#         return None

#     result = _get_model().predict(
#         source=frame_bgr,
#         conf=NAIL_CONF,
#         iou=NAIL_IOU,
#         imgsz=NAIL_IMGSZ,
#         classes=[NAIL_CLASS_ID],
#         max_det=1,
#         agnostic_nms=True,
#         save=False,
#         show=False,
#         verbose=False,
#     )[0]

#     if result.boxes is None or len(result.boxes) == 0:
#         return None

#     confs = result.boxes.conf.cpu().numpy()
#     idx = int(confs.argmax())

#     bbox = result.boxes.xyxy[idx].cpu().numpy().tolist()

#     return {
#         "bbox": bbox,
#         "conf": float(confs[idx]),
#     }


from pathlib import Path

import cv2
import numpy as np
from ultralytics import YOLO

from config import MODEL_PATH, NAIL_CONF, NAIL_IOU, NAIL_IMGSZ, NAIL_CLASS_ID


_model = None
MIN_NAIL_SCORE = 0.50


def _get_model():
    global _model
    if _model is None:
        if not Path(MODEL_PATH).exists():
            raise FileNotFoundError(f"YOLO nail model not found: {MODEL_PATH}")
        _model = YOLO(str(MODEL_PATH))
    return _model


def _to_bgr_frame(frame):
    if frame is None:
        return None

    if isinstance(frame, str):
        return cv2.imread(frame)

    if not isinstance(frame, np.ndarray):
        return None

    if frame.ndim == 2:
        return cv2.cvtColor(frame, cv2.COLOR_GRAY2BGR)

    if frame.ndim == 3 and frame.shape[2] == 4:
        return cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)

    return frame.copy()


def detect_nail(frame):
    frame_bgr = _to_bgr_frame(frame)
    if frame_bgr is None:
        return None

    result = _get_model().predict(
        source=frame_bgr,
        conf=NAIL_CONF,
        iou=NAIL_IOU,
        imgsz=NAIL_IMGSZ,
        classes=[NAIL_CLASS_ID],
        max_det=1,
        agnostic_nms=True,
        save=False,
        show=False,
        verbose=False,
    )[0]

    if result.boxes is None or len(result.boxes) == 0:
        return None

    confs = result.boxes.conf.cpu().numpy()
    idx = int(confs.argmax())
    best_conf = float(confs[idx])

    if best_conf < MIN_NAIL_SCORE:
        return None

    bbox = result.boxes.xyxy[idx].cpu().numpy().astype(np.float32)

    return {
        "bbox": bbox,
        "conf": best_conf,
    }