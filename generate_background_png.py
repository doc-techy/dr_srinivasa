#!/usr/bin/env python3
"""
Script to generate a PNG image from the background pattern component.
This script creates an HTML file with the background pattern and captures it as PNG.
"""

import os
import base64
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def create_html_file():
    """Create an HTML file with the background pattern"""
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Background Pattern</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
    </style>
</head>
<body class="m-0 p-0 overflow-hidden">
    <div class="fixed inset-0 pointer-events-none">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%230284c7\\' fill-opacity=\\'0.03\\'%3E%3Cpath d=\\'M50 0L100 50L50 100L0 50z\\'/%3E%3C/g%3E%3C/svg%3E');"></div>
        <div class="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>
</body>
</html>
"""
    
    with open('background_pattern.html', 'w') as f:
        f.write(html_content)
    
    return os.path.abspath('background_pattern.html')

def generate_png_with_selenium(html_file_path, output_path='background_pattern.png', width=1920, height=1080):
    """Generate PNG using Selenium WebDriver"""
    try:
        # Setup Chrome options
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument(f'--window-size={width},{height}')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-logging')
        chrome_options.add_argument('--disable-web-security')
        chrome_options.add_argument('--allow-running-insecure-content')
        
        # Initialize WebDriver
        driver = webdriver.Chrome(options=chrome_options)
        
        # Load the HTML file
        driver.get(f'file://{html_file_path}')
        
        # Wait for the page to load and animations to start
        time.sleep(3)
        
        # Set window size
        driver.set_window_size(width, height)
        
        # Take screenshot
        driver.save_screenshot(output_path)
        
        print(f"✅ PNG generated successfully: {output_path}")
        print(f"📏 Dimensions: {width}x{height}")
        
        # Cleanup
        driver.quit()
        
        return True
        
    except Exception as e:
        print(f"❌ Error generating PNG with Selenium: {e}")
        return False

def generate_png_with_pillow():
    """Alternative method using Pillow to create a static version"""
    try:
        from PIL import Image, ImageDraw, ImageFilter
        import math
        
        # Create a new image with transparent background
        width, height = 1920, 1080
        img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Create gradient background (simplified version)
        for y in range(height):
            # Blue to purple gradient
            blue_intensity = int(255 * (1 - y / height) * 0.05)
            purple_intensity = int(255 * (y / height) * 0.05)
            
            for x in range(width):
                # Create gradient effect
                gradient_factor = x / width
                r = int(blue_intensity * (1 - gradient_factor) + purple_intensity * gradient_factor)
                g = int(blue_intensity * 0.3 * (1 - gradient_factor) + purple_intensity * 0.3 * gradient_factor)
                b = int(blue_intensity * 0.8 * (1 - gradient_factor) + purple_intensity * 0.8 * gradient_factor)
                
                img.putpixel((x, y), (r, g, b, 10))
        
        # Add geometric pattern (diamond shapes)
        pattern_size = 100
        for y in range(0, height, pattern_size):
            for x in range(0, width, pattern_size):
                # Diamond shape
                center_x, center_y = x + pattern_size // 2, y + pattern_size // 2
                points = [
                    (center_x, center_y - pattern_size // 2),  # top
                    (center_x + pattern_size // 2, center_y),  # right
                    (center_x, center_y + pattern_size // 2),  # bottom
                    (center_x - pattern_size // 2, center_y)   # left
                ]
                draw.polygon(points, fill=(2, 132, 199, 8))  # Blue with low opacity
        
        # Add blur circles (simplified)
        # Top right circle
        circle1 = Image.new('RGBA', (288, 288), (0, 0, 0, 0))
        draw1 = ImageDraw.Draw(circle1)
        draw1.ellipse([0, 0, 288, 288], fill=(59, 130, 246, 25))  # Blue circle
        circle1 = circle1.filter(ImageFilter.GaussianBlur(radius=50))
        img.paste(circle1, (width - 288 - 80, 80), circle1)
        
        # Bottom left circle
        circle2 = Image.new('RGBA', (384, 384), (0, 0, 0, 0))
        draw2 = ImageDraw.Draw(circle2)
        draw2.ellipse([0, 0, 384, 384], fill=(99, 102, 241, 25))  # Indigo circle
        circle2 = circle2.filter(ImageFilter.GaussianBlur(radius=50))
        img.paste(circle2, (80, height - 384 - 80), circle2)
        
        # Save the image
        output_path = 'background_pattern_pillow.png'
        img.save(output_path, 'PNG')
        
        print(f"✅ PNG generated successfully with Pillow: {output_path}")
        print(f"📏 Dimensions: {width}x{height}")
        
        return True
        
    except ImportError:
        print("❌ Pillow not installed. Install with: pip install Pillow")
        return False
    except Exception as e:
        print(f"❌ Error generating PNG with Pillow: {e}")
        return False

def main():
    """Main function to generate the PNG"""
    print("🎨 Generating PNG from background pattern...")
    
    # Create HTML file
    html_file = create_html_file()
    print(f"📄 Created HTML file: {html_file}")
    
    # Try Selenium first (more accurate)
    print("\n🔄 Attempting to generate PNG with Selenium...")
    success = generate_png_with_selenium(html_file)
    
    if not success:
        print("\n🔄 Selenium failed, trying Pillow alternative...")
        success = generate_png_with_pillow()
    
    if success:
        print("\n🎉 PNG generation completed!")
    else:
        print("\n❌ Failed to generate PNG. Please install required dependencies:")
        print("   pip install selenium pillow")
        print("   Also ensure Chrome/Chromium is installed for Selenium")
    
    # Cleanup HTML file
    try:
        os.remove(html_file)
        print(f"🧹 Cleaned up HTML file")
    except:
        pass

if __name__ == "__main__":
    main()
