import numpy as np
from app.models.flood_segmentation.model import FloodSegmentationPipeline

seg_pipe = FloodSegmentationPipeline()
h, w = 512, 512
np.random.seed(101)
dry_img = np.full((h, w, 3), 140, dtype=np.uint8)
dry_img[:, :, 1] = np.random.randint(120, 160, (h, w))

flood_img = dry_img.copy()
y_coords, x_coords = np.ogrid[:h, :w]
river_center = 256 + 60 * np.sin(y_coords / 50.0)
water_mask = np.abs(x_coords - river_center) < 70
flood_img[water_mask] = [30, 70, 140]

for th in [0.45, 0.48, 0.50, 0.52]:
    rd = seg_pipe.segment_image(dry_img, 28.6692, 77.2295, span_deg=0.03, confidence_threshold=th)
    rf = seg_pipe.segment_image(flood_img, 28.6692, 77.2295, span_deg=0.03, confidence_threshold=th)
    print(f"Threshold: {th:.2f} -> Dry ha: {rd['flooded_hectares']:.2f}, Flood ha: {rf['flooded_hectares']:.2f}")
