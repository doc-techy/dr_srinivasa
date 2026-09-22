#!/usr/bin/env python3
"""
Create a simple favicon.ico file with a stethoscope design
"""

from PIL import Image, ImageDraw
import os

def create_favicon():
    # Create a 32x32 image with transparent background
    size = 32
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors (blue gradient theme)
    blue = (37, 99, 235)  # #2563eb
    purple = (124, 58, 237)  # #7c3aed
    pink = (219, 39, 119)  # #db2777
    
    # Draw stethoscope head (circle)
    center_x, center_y = size // 2, size // 2 - 4
    radius = 6
    draw.ellipse([center_x - radius, center_y - radius, center_x + radius, center_y + radius], 
                 outline=blue, width=3)
    
    # Draw stethoscope tubing (curved line)
    points = []
    for i in range(0, 20):
        x = center_x + (i - 10) * 0.8
        y = center_y + 3 + (i - 10) * 0.3
        points.append((x, y))
    
    if len(points) > 1:
        for i in range(len(points) - 1):
            draw.line([points[i], points[i + 1]], fill=blue, width=2)
    
    # Draw earpieces
    draw.ellipse([8, 20, 10, 22], fill=blue)
    draw.ellipse([22, 20, 24, 22], fill=blue)
    
    # Draw medical cross in center
    cross_x, cross_y = center_x, center_y
    draw.rectangle([cross_x - 2, cross_y - 1, cross_x + 2, cross_y + 1], fill=blue)
    draw.rectangle([cross_x - 1, cross_y - 2, cross_x + 1, cross_y + 2], fill=blue)
    
    # Save as ICO
    img.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32)])
    print("Favicon created successfully!")

if __name__ == "__main__":
    try:
        create_favicon()
    except ImportError:
        print("PIL not available, creating a simple text-based favicon...")
        # Fallback: create a simple text file
        with open('public/favicon.ico', 'w') as f:
            f.write("Simple favicon placeholder")
