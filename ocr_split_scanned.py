import os
import pytesseract
import pypdf
import gc
from pdf2image import convert_from_path

pdf_dir = "extracted_pdfs"
scanned_years = [2015, 2017, 2020, 2021, 2022]

for y in scanned_years:
    pdf_path = os.path.join(pdf_dir, f"{y}.pdf")
    txt_path = os.path.join(pdf_dir, f"{y}.txt")
    
    if not os.path.exists(pdf_path):
        continue
        
    print(f"\nProcessing scanned paper: {pdf_path} with column split OCR...")
    try:
        reader = pypdf.PdfReader(pdf_path)
        num_pages = len(reader.pages)
        print(f"Total pages: {num_pages}")
        
        with open(txt_path, "w", encoding="utf-8") as f_out:
            for p in range(1, num_pages + 1):
                print(f"  Page {p}/{num_pages}...")
                images = convert_from_path(pdf_path, first_page=p, last_page=p)
                if images:
                    img = images[0]
                    width, height = img.size
                    
                    # Split page into left and right columns
                    mid = width // 2
                    left_img = img.crop((0, 0, mid, height))
                    right_img = img.crop((mid, 0, width, height))
                    
                    # OCR each column
                    left_text = pytesseract.image_to_string(left_img)
                    right_text = pytesseract.image_to_string(right_img)
                    
                    # Combine columns in reading order
                    f_out.write(f"\n--- Page {p} Column 1 ---\n" + left_text)
                    f_out.write(f"\n--- Page {p} Column 2 ---\n" + right_text)
                    f_out.flush()
                    
                    del images
                    gc.collect()
                    
        print(f"Successfully finished column-split OCR for Year {y} and saved to {txt_path}.")
    except Exception as e:
        print(f"OCR failed for Year {y}: {e}")
        
print("\nScanned papers column-split OCR completed!")
