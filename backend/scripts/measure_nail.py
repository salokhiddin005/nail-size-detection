from pathlib import Path

import cv2
import numpy as np

from config import CARD_WIDTH_MM, CARD_HEIGHT_MM
from scripts.utils_edges import (
    ensure_dir,
    save_image,
    order_points,
    draw_polygon,
    put_label,
)


def _build_card_homography(card_box_px):
    """Map image pixels -> mm on the card plane using ISO/IEC 7810 ID-1 size."""
    src = order_points(card_box_px)
    tl, tr, _, bl = src
    edge_top = float(np.linalg.norm(tr - tl))
    edge_left = float(np.linalg.norm(bl - tl))

    long_mm = max(CARD_WIDTH_MM, CARD_HEIGHT_MM)
    short_mm = min(CARD_WIDTH_MM, CARD_HEIGHT_MM)

    if edge_top >= edge_left:
        dst_mm = np.array(
            [[0, 0], [long_mm, 0], [long_mm, short_mm], [0, short_mm]],
            dtype=np.float32,
        )
    else:
        dst_mm = np.array(
            [[0, 0], [short_mm, 0], [short_mm, long_mm], [0, long_mm]],
            dtype=np.float32,
        )

    H, _ = cv2.findHomography(src, dst_mm)
    return H


def _measure_bbox_mm(bbox_xyxy, H):
    x1, y1, x2, y2 = bbox_xyxy
    corners_px = np.array(
        [[[x1, y1], [x2, y1], [x2, y2], [x1, y2]]], dtype=np.float32
    )
    corners_mm = cv2.perspectiveTransform(corners_px, H)[0]

    horizontal_mm = (
        float(np.linalg.norm(corners_mm[1] - corners_mm[0]))
        + float(np.linalg.norm(corners_mm[3] - corners_mm[2]))
    ) / 2.0
    vertical_mm = (
        float(np.linalg.norm(corners_mm[2] - corners_mm[1]))
        + float(np.linalg.norm(corners_mm[0] - corners_mm[3]))
    ) / 2.0

    return {
        "length_mm": max(horizontal_mm, vertical_mm),
        "width_mm": min(horizontal_mm, vertical_mm),
    }


def measure_nail(frame, card_result, nail_result, output_path=None):
    """
    Measure nail size in mm using the detected card as a calibration reference.

    Args:
        frame: Original input image.
        card_result: Detection result for the card. Must contain "card_box".
        nail_result: Detection result for the nail. Must contain "bbox".
        output_path: Optional path to save the annotated output image.
                     If None, image is not saved.

    Returns:
        dict with:
        - measurement: {"length_mm": ..., "width_mm": ...}
        - annotated: annotated image array
        - output_path: saved output path or None
    """
    H = _build_card_homography(card_result["card_box"])
    measurement = _measure_bbox_mm(nail_result["bbox"], H)

    annotated = frame.copy()
    draw_polygon(annotated, card_result["card_box"], color=(0, 255, 0), thickness=3)

    x1, y1, x2, y2 = map(int, nail_result["bbox"])
    cv2.rectangle(annotated, (x1, y1), (x2, y2), (255, 0, 255), 2)

    label = f"Nail: {measurement['length_mm']:.1f} x {measurement['width_mm']:.1f} mm"
    put_label(annotated, label, (20, 40), color=(0, 255, 255), scale=0.9)
    put_label(
        annotated,
        "card ref: 85.60 x 53.98 mm",
        (20, 75),
        color=(0, 255, 0),
        scale=0.6,
    )

    saved_output_path = None
    if output_path is not None:
        saved_output_path = Path(output_path)
        ensure_dir(saved_output_path.parent)
        save_image(saved_output_path, annotated)

    return {
        "measurement": measurement,
        "annotated": annotated,
        "output_path": saved_output_path,
    }