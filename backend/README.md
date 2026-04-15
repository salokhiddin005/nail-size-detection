# Nail Size Detection

Measure the real-world size of a fingernail in millimetres from a single photo,
using a **standard ID-1 bank/credit card** (85.60 × 53.98 mm, ISO/IEC 7810) held
in the same frame as a physical reference for calibration.

![pipeline](outputs/annotated.jpg)

## How it works

The pipeline has three stages:

1. **Card detection** — classical OpenCV (Canny edges → contour scoring by
   aspect ratio, rectangularity and solidity) locates the 4 corners of the
   card in the image. See [scripts/detect_card.py](scripts/detect_card.py).

2. **Nail detection** — a YOLO model (`best.pt`, class 0 = nail) predicts a
   single best bounding box around the fingernail. See
   [scripts/detect_nail.py](scripts/detect_nail.py).

3. **Measurement via homography** — the 4 card corners in pixel space are
   mapped to their known real-world positions in millimetres (85.60 × 53.98 mm)
   using `cv2.findHomography`. This produces a projective transform from
   image pixels → mm on the card plane that correctly handles perspective
   tilt. The nail bounding-box corners are then pushed through that
   transform, and the nail's length and width are read off in mm.
   See [scripts/measure_nail.py](scripts/measure_nail.py).

### Why use homography instead of a flat px/mm ratio?

A simple "pixels per mm" ratio only works if the card lies perfectly
perpendicular to the camera. In practice the card is always slightly tilted,
so a single ratio is wrong at the edges. The homography uses all four
corners, so it compensates for perspective foreshortening automatically —
the measurement remains accurate as long as the nail sits on (approximately)
the same plane as the card.

## Project layout

```
nail-size-detection/
├── main.py                  # entry point — runs the full pipeline
├── config.py                # paths, card size (mm), detector tuning
├── requirements.txt
├── best.pt                  # YOLO weights (nail detector)
├── inputs/
│   └── test_image.jpg       # input photo(s)
├── outputs/
│   └── annotated.jpg        # final annotated result
└── scripts/
    ├── __init__.py
    ├── utils_edges.py       # shared OpenCV helpers
    ├── detect_card.py       # classical card detection
    ├── detect_nail.py       # YOLO nail detection
    └── measure_nail.py      # homography → mm measurement
```

## Setup

Tested with Python 3.10 in a conda environment.

```bash
conda create -n sustainpro python=3.10 -y
conda activate sustainpro
pip install -r requirements.txt
```

Make sure the YOLO weights file `best.pt` is in the project root
(alongside `main.py`).

## Usage

1. Put a photo into `inputs/`. The photo must contain:
   - a standard ID-1 card (credit/debit/ID card — 85.60 × 53.98 mm)
   - a fingernail, ideally resting on or very near the same plane as
     the card
2. Point `IMAGE_PATH` in [config.py](config.py) at your file.
3. Run:

```bash
python main.py
```

Console output:

```
Input image: .../inputs/test_image.jpg
[1/3] Card detected (score=0.82)
[2/3] Nail detected (conf=0.80)
[3/3] Nail size: 15.60 x 15.05 mm
Saved: .../outputs/annotated.jpg
```

The final annotated image is written to `outputs/annotated.jpg`, showing
the detected card (green), the nail bounding box (magenta) and the
measured size label.

## Calibration reference — why the card?

The card acts as a **physical ruler** of known size that is captured in
the same frame, under the same lighting and perspective as the nail. An
ISO/IEC 7810 ID-1 card is ideal because:

- Its dimensions are standardised worldwide: **85.60 × 53.98 mm**
- It is rigid, flat, and rectangular with sharp corners — easy to detect
- Almost everyone has one

## Tuning

Key parameters live in [config.py](config.py):

| Parameter | Purpose |
|---|---|
| `CARD_WIDTH_MM`, `CARD_HEIGHT_MM` | Real-world card size (don't change unless using a non-ID-1 card) |
| `CARD_MIN_SCORE` | Lower if the card is not being detected |
| `CARD_CANNY1`, `CARD_CANNY2` | Canny edge thresholds for card detection |
| `NAIL_CONF` | YOLO confidence threshold for nail detection |
| `NAIL_IMGSZ` | YOLO inference image size |

## Accuracy notes

- Accuracy depends on the nail sitting on (approximately) the same plane
  as the card. If the finger is lifted above the card, the measurement
  will under-report.
- YOLO outputs an **axis-aligned** bounding box. If the finger is rotated
  relative to the image axes, the reported length/width reflect the
  bbox's projection rather than the true nail axis. For tighter results,
  switch to a segmentation model or fit a rotated rectangle to a nail
  mask.
- Camera lens distortion is not corrected. For very wide-angle lenses,
  measurements near the image edges will be biased — keep the card and
  nail near the image centre for best results.
