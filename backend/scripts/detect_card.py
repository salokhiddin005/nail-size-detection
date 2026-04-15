
# original


# from pathlib import Path
# import cv2
# import numpy as np
# from ultralytics import YOLO

# from config import CARD_MODEL_PATH, CARD_CONF, CARD_IOU, CARD_IMGSZ, CARD_CLASS_ID

# _model = None


# def _get_model():
#     global _model
#     if _model is None:
#         if not Path(CARD_MODEL_PATH).exists():
#             raise FileNotFoundError(f"Card model not found: {CARD_MODEL_PATH}")
#         _model = YOLO(str(CARD_MODEL_PATH))
#     return _model


# def _to_bgr(frame):
#     if isinstance(frame, str):
#         return cv2.imread(frame)

#     if frame is None:
#         return None

#     if len(frame.shape) == 2:
#         return cv2.cvtColor(frame, cv2.COLOR_GRAY2BGR)

#     if frame.shape[2] == 4:
#         return cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)

#     return frame


# def detect_card(frame):
#     frame = _to_bgr(frame)
#     if frame is None:
#         return None

#     model = _get_model()

#     result = model.predict(
#         source=frame,
#         conf=CARD_CONF,
#         iou=CARD_IOU,
#         imgsz=CARD_IMGSZ,
#         classes=[CARD_CLASS_ID],
#         max_det=1,
#         save=False,
#         verbose=False,
#     )[0]

#     if result.boxes is None or len(result.boxes) == 0:
#         return None

#     confs = result.boxes.conf.cpu().numpy()
#     idx = int(confs.argmax())

#     xyxy = result.boxes.xyxy[idx].cpu().numpy().tolist()

#     x1, y1, x2, y2 = xyxy

#     card_box = np.array([
#         [x1, y1],
#         [x2, y1],
#         [x2, y2],
#         [x1, y2],
#     ], dtype=np.float32)

#     return {
#         "bbox": xyxy,
#         "card_box": card_box,
#         "score": float(confs[idx]),
#     }



from pathlib import Path

import cv2
import numpy as np
from ultralytics import YOLO

from config import CARD_MODEL_PATH, CARD_CONF, CARD_IOU, CARD_IMGSZ, CARD_CLASS_ID


_model = None
MIN_CARD_SCORE = 0.50


def _get_model():
    global _model
    if _model is None:
        if not Path(CARD_MODEL_PATH).exists():
            raise FileNotFoundError(f"Card model not found: {CARD_MODEL_PATH}")
        _model = YOLO(str(CARD_MODEL_PATH))
    return _model


def _to_bgr(frame):
    if isinstance(frame, str):
        return cv2.imread(frame)

    if frame is None:
        return None

    if not isinstance(frame, np.ndarray):
        return None

    if frame.ndim == 2:
        return cv2.cvtColor(frame, cv2.COLOR_GRAY2BGR)

    if frame.ndim == 3 and frame.shape[2] == 4:
        return cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)

    return frame.copy()


def detect_card(frame):
    frame = _to_bgr(frame)
    if frame is None:
        return None

    model = _get_model()

    result = model.predict(
        source=frame,
        conf=CARD_CONF,
        iou=CARD_IOU,
        imgsz=CARD_IMGSZ,
        classes=[CARD_CLASS_ID],
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

    if best_conf < MIN_CARD_SCORE:
        return None

    xyxy = result.boxes.xyxy[idx].cpu().numpy().astype(np.float32)
    x1, y1, x2, y2 = xyxy.tolist()

    card_box = np.array(
        [
            [x1, y1],
            [x2, y1],
            [x2, y2],
            [x1, y2],
        ],
        dtype=np.float32,
    )

    return {
        "bbox": xyxy,
        "card_box": card_box,
        "score": best_conf,
    }