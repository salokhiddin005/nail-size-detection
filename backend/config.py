from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent

# =========================
# MODEL PATHS
# =========================
# Nail YOLO model
MODEL_PATH = PROJECT_ROOT / "best.pt"

# Credit card YOLO model
# Put your trained card model here if you have one.
# Example: PROJECT_ROOT / "card_best.pt"
CARD_MODEL_PATH = PROJECT_ROOT / "model" / "best_credit_card.pt"
# =========================
# REAL CARD SIZE
# =========================
# ISO/IEC 7810 ID-1 credit/debit card size
CARD_WIDTH_MM = 85.60
CARD_HEIGHT_MM = 53.98
CARD_ASPECT_RATIO = CARD_WIDTH_MM / CARD_HEIGHT_MM

# =========================
# NAIL YOLO SETTINGS
# =========================
NAIL_CONF = 0.25
NAIL_IOU = 0.45
NAIL_IMGSZ = 640
NAIL_CLASS_ID = 0

# =========================
# CARD YOLO SETTINGS
# =========================
CARD_USE_YOLO = True
CARD_CONF = 0.25
CARD_IOU = 0.45
CARD_IMGSZ = 640
CARD_CLASS_ID = 0

# =========================
# CARD CV FALLBACK SETTINGS
# =========================
CARD_MIN_RATIO = 1.35
CARD_MAX_RATIO = 1.75

CARD_MIN_AREA_RATIO = 0.015
CARD_MAX_AREA_RATIO = 0.70

CARD_MIN_RECTANGULARITY = 0.75
CARD_MIN_SOLIDITY = 0.90
CARD_MIN_SCORE = 0.45

CARD_BLUR_KSIZE = 5
CARD_CANNY1 = 60
CARD_CANNY2 = 140
CARD_CLOSE_KSIZE = 5
CARD_CLOSE_ITER = 2


