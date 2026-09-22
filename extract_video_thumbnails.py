#!/usr/bin/env python3
"""
Script to extract thumbnails from video files and save them in the images folder.
The thumbnails will be named after the video files (e.g., intro.mp4 -> intro.jpg)

Thumbnails are automatically cropped and resized to 16:9 aspect ratio (landscape)
with a maximum width of 1280px, which is optimal for the video card layout.

Requirements:
    pip install opencv-python pillow

Usage:
    python extract_video_thumbnails.py
"""

import os
import cv2
from pathlib import Path

def extract_thumbnail(video_path: str, output_path: str, frame_time: float = 1.0, target_ratio: float = 16/9, max_width: int = 1280):
    """
    Extract a thumbnail from a video at a specific time and resize to target aspect ratio.
    
    Args:
        video_path: Path to the input video file
        output_path: Path where the thumbnail will be saved
        frame_time: Time in seconds to extract the frame (default: 1 second)
        target_ratio: Target aspect ratio (width/height), default 16/9 (1.78:1)
        max_width: Maximum width for the thumbnail (default: 1280px)
    """
    try:
        # Open the video file
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            print(f"Error: Could not open video file: {video_path}")
            return False
        
        # Get video FPS
        fps = cap.get(cv2.CAP_PROP_FPS)
        if fps == 0:
            print(f"Warning: Could not get FPS for {video_path}, using frame 30")
            frame_number = 30
        else:
            # Calculate frame number based on time
            frame_number = int(frame_time * fps)
        
        # Set the video position to the desired frame
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
        
        # Read the frame
        ret, frame = cap.read()
        
        if not ret:
            # If frame at specified time doesn't exist, try to get first frame
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()
            if not ret:
                print(f"Error: Could not read frame from {video_path}")
                cap.release()
                return False
        
        # Get original dimensions
        height, width = frame.shape[:2]
        original_ratio = width / height
        
        # Crop and resize to target aspect ratio
        if original_ratio > target_ratio:
            # Video is wider than target - crop width (center crop)
            new_width = int(height * target_ratio)
            x_offset = (width - new_width) // 2
            frame = frame[:, x_offset:x_offset + new_width]
        elif original_ratio < target_ratio:
            # Video is taller than target - crop height (center crop)
            new_height = int(width / target_ratio)
            y_offset = (height - new_height) // 2
            frame = frame[y_offset:y_offset + new_height, :]
        
        # Resize to max_width while maintaining aspect ratio
        final_height, final_width = frame.shape[:2]
        if final_width > max_width:
            scale = max_width / final_width
            new_width = max_width
            new_height = int(final_height * scale)
            frame = cv2.resize(frame, (new_width, new_height), interpolation=cv2.INTER_AREA)
        
        # Save the frame as JPEG
        cv2.imwrite(output_path, frame, [cv2.IMWRITE_JPEG_QUALITY, 90])
        
        cap.release()
        final_h, final_w = frame.shape[:2]
        print(f"✓ Extracted thumbnail: {output_path} ({final_w}x{final_h}, ratio: {final_w/final_h:.2f}:1)")
        return True
        
    except Exception as e:
        print(f"Error processing {video_path}: {str(e)}")
        return False

def main():
    # Define paths
    videos_dir = Path("public/videos")
    images_dir = Path("public/images")
    
    # Create images directory if it doesn't exist
    images_dir.mkdir(parents=True, exist_ok=True)
    
    # Check if videos directory exists
    if not videos_dir.exists():
        print(f"Error: Videos directory not found: {videos_dir}")
        return
    
    # Get all video files
    video_files = list(videos_dir.glob("*.mp4"))
    
    if not video_files:
        print(f"No video files found in {videos_dir}")
        return
    
    print(f"Found {len(video_files)} video file(s)")
    print("Thumbnail aspect ratio: 16:9 (landscape)")
    print("Max width: 1280px")
    print("-" * 50)
    
    # Process each video file
    success_count = 0
    for video_file in video_files:
        # Generate output filename (same name as video but with .jpg extension)
        video_name = video_file.stem  # Get filename without extension
        output_file = images_dir / f"{video_name}.jpg"
        
        # Extract thumbnail (will overwrite existing)
        if extract_thumbnail(str(video_file), str(output_file), target_ratio=16/9, max_width=1280):
            success_count += 1
    
    print("-" * 50)
    print(f"Completed! Successfully extracted {success_count} thumbnail(s)")
    
    # List all generated thumbnails
    if success_count > 0:
        print("\nGenerated thumbnails:")
        for video_file in video_files:
            video_name = video_file.stem
            thumbnail_file = images_dir / f"{video_name}.jpg"
            if thumbnail_file.exists():
                print(f"  - {thumbnail_file}")

if __name__ == "__main__":
    main()

