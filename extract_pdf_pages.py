import os
import fitz  # PyMuPDF

pdf_path = "Portofolio RismatulM.pdf"
output_dir = "assets"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)
    print(f"Created directory: {output_dir}")

print("Opening PDF...")
doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

for i in range(len(doc)):
    page = doc[i]
    # DPI 150 gives a good balance between file size and readability for a web portfolio
    pix = page.get_pixmap(dpi=150)
    output_path = os.path.join(output_dir, f"page_{i+1}.png")
    pix.save(output_path)
    print(f"Saved {output_path}")

print("Done extracting pages.")
