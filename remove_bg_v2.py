from rembg import remove
from PIL import Image
import io
import os

def process_image(input_path, output_path):
    print(f"Processing {input_path} -> {output_path}")
    if not os.path.exists(input_path):
        print(f"Error: {input_path} does not exist.")
        return
    with open(input_path, 'rb') as i:
        input_data = i.read()
        output_data = remove(input_data)
        with open(output_path, 'wb') as o:
            o.write(output_data)

brain_dir = r"C:\Users\Administrator\.gemini\antigravity\brain\e6e6a4df-047a-4d02-82d0-4d161bdbd9ed"

# New high-quality sources on solid white
logo_input = os.path.join(brain_dir, "logo_v3_masterwork_1776651067254.png")
favicon_input = os.path.join(brain_dir, "favicon_v3_masterwork_1776651119184.png")

target_logo = r"d:\Project\GithubPage_PerBrand\public\images\logo.png"
target_favicon = r"d:\Project\GithubPage_PerBrand\public\favicon.png"

try:
    process_image(logo_input, target_logo)
    process_image(favicon_input, target_favicon)
    print("Clean transparent assets created successfully!")
except Exception as e:
    print(f"Error: {e}")
