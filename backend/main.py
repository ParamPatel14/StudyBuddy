import pdfplumber
import pytesseract
from PIL import Image
import fitz  # PyMuPDF
import json
import os
from fastapi import FastAPI, UploadFile, File

app = FastAPI()

UPLOAD_PATH = "uploads/"
JSON_PATH = "extracted_json/"

os.makedirs(UPLOAD_PATH, exist_ok=True)
os.makedirs(JSON_PATH, exist_ok=True)


def extract_text_pdfplumber(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


def extract_text_ocr(pdf_path):
    text = ""
    doc = fitz.open(pdf_path)
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        pix = page.get_pixmap()
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        text += pytesseract.image_to_string(img) + "\n"
    return text.strip()


def is_text_based(text):
    return len(text) > 50  # If > 50 chars extracted → treat as text-based


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    pdf_path = os.path.join(UPLOAD_PATH, file.filename)
    with open(pdf_path, "wb") as f:
        f.write(await file.read())

    # Step 1: Try text extraction
    text = extract_text_pdfplumber(pdf_path)

    # Step 2: If text too small → use OCR
    if not is_text_based(text):
        text = extract_text_ocr(pdf_path)

    # Step 3: Convert to JSON (simple structure for now)
    pdf_json = {
        "filename": file.filename,
        "content": text
    }

    json_path = os.path.join(JSON_PATH, file.filename.replace(".pdf", ".json"))
    with open(json_path, "w", encoding="utf-8") as json_file:
        json.dump(pdf_json, json_file, indent=4)

    return {"status": "success", "json_file": json_path, "preview": text[:200]}

@app.get("/preview-json/{filename}")
def preview_json(filename: str):
    json_path = f"extracted_json/{filename.replace('.pdf', '.json')}"
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["content"][:500]
