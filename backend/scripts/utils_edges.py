from pathlib import Path

import cv2
import numpy as np


def ensure_dir(path):
    Path(path).mkdir(parents=True, exist_ok=True)


def save_image(path, img):
    path = Path(path)
    ensure_dir(path.parent)
    cv2.imwrite(str(path), img)


def make_edges(frame, blur_ksize=(5, 5), canny1=50, canny2=150,
               close_ksize=(5, 5), close_iter=2):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, blur_ksize, 0)
    edges = cv2.Canny(blurred, canny1, canny2)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, close_ksize)
    return cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel, iterations=close_iter)


def order_points(pts):
    pts = np.asarray(pts, dtype=np.float32).reshape(4, 2)
    s = pts.sum(axis=1)
    diff = np.diff(pts, axis=1).ravel()
    tl = pts[np.argmin(s)]
    br = pts[np.argmax(s)]
    tr = pts[np.argmin(diff)]
    bl = pts[np.argmax(diff)]
    return np.array([tl, tr, br, bl], dtype=np.float32)


def draw_polygon(img, polygon, color=(0, 255, 0), thickness=2):
    pts = np.asarray(polygon, dtype=np.int32).reshape(-1, 1, 2)
    cv2.polylines(img, [pts], isClosed=True, color=color, thickness=thickness)


def put_label(img, text, pos, color=(0, 255, 0), scale=0.7, thickness=2):
    cv2.putText(img, text, pos, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thickness, cv2.LINE_AA)
