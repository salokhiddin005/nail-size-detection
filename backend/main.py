import cv2

from backend.config import IMAGE_PATH, OUTPUT_DIR
from scripts.detect_card import detect_card
from scripts.detect_nail import detect_nail
from scripts.measure_nail import measure_nail


def main():
    print(f"Input image: {IMAGE_PATH}")

    frame = cv2.imread(str(IMAGE_PATH))
    if frame is None:
        print(f"ERROR: could not read image: {IMAGE_PATH}")
        return

    card = detect_card(frame)
    if card is None:
        print("No card detected. Aborting.")
        return
    print(f"[1/3] Card detected (score={card['score']:.2f})")

    nail = detect_nail(frame)
    if nail is None:
        print("No nail detected. Aborting.")
        return
    print(f"[2/3] Nail detected (conf={nail['conf']:.2f})")

    output_path = OUTPUT_DIR / "annotated.jpg"
    result = measure_nail(frame, card, nail, output_path)

    m = result["measurement"]
    print(f"[3/3] Nail size: {m['length_mm']:.2f} x {m['width_mm']:.2f} mm")
    print(f"Saved: {result['output_path']}")


if __name__ == "__main__":
    main()
