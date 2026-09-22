#!/usr/bin/env python3
"""
Create PNG versions of the favicon for download
"""

from PIL import Image, ImageDraw
import os

def create_png_favicon():
    # Create different sizes
    sizes = [16, 32, 64, 128, 256, 512]
    
    for size in sizes:
        # Create image with transparent background
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Colors (blue gradient theme)
        blue = (37, 99, 235)  # #2563eb
        purple = (124, 58, 237)  # #7c3aed
        pink = (219, 39, 119)  # #db2777
        
        # Scale factors based on size
        scale = size / 32.0
        
        # Draw stethoscope head (circle)
        center_x, center_y = size // 2, int(size // 2 - 4 * scale)
        radius = int(6 * scale)
        draw.ellipse([center_x - radius, center_y - radius, center_x + radius, center_y + radius], 
                     outline=blue, width=max(1, int(3 * scale)))
        
        # Draw stethoscope tubing (curved line)
        points = []
        for i in range(0, int(20 * scale)):
            x = center_x + (i - 10 * scale) * 0.8
            y = center_y + 3 * scale + (i - 10 * scale) * 0.3
            points.append((x, y))
        
        if len(points) > 1:
            for i in range(len(points) - 1):
                draw.line([points[i], points[i + 1]], fill=blue, width=max(1, int(2 * scale)))
        
        # Draw earpieces
        earpiece_size = max(1, int(1.5 * scale))
        draw.ellipse([int(8 * scale), int(20 * scale), int(8 * scale) + earpiece_size, int(20 * scale) + earpiece_size], fill=blue)
        draw.ellipse([int(24 * scale), int(20 * scale), int(24 * scale) + earpiece_size, int(20 * scale) + earpiece_size], fill=blue)
        
        # Draw medical cross in center
        cross_x, cross_y = center_x, center_y
        cross_width = max(1, int(2 * scale))
        cross_height = max(1, int(1.5 * scale))
        draw.rectangle([cross_x - cross_width, cross_y - cross_height, cross_x + cross_width, cross_y + cross_height], fill=blue)
        draw.rectangle([cross_x - cross_height, cross_y - cross_width, cross_x + cross_height, cross_y + cross_width], fill=blue)
        
        # Save PNG
        filename = f'public/favicon_{size}x{size}.png'
        img.save(filename, format='PNG')
        print(f"Created {filename}")
    
    print("All PNG favicon sizes created successfully!")

if __name__ == "__main__":
    try:
        create_png_favicon()
    except ImportError:
        print("PIL not available. Please install Pillow: pip install Pillow")
