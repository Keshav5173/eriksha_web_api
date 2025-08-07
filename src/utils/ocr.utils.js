import Tesseract from "tesseract.js";
import fs from "fs";

// Extract text from image
export const extractTextFromImage = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error("File not found");
  }

  try {
    const result = await Tesseract.recognize(filePath, 'eng', {
      logger: m => console.log(m.status, m.progress)
    });

    return result.data.text;
  } catch (error) {
    console.error("OCR failed:", error);
    return null;
  }
};

// Extract Aadhaar number (format: 1234 5678 9123 or without space)
export const extractAadhaarNumber = (text) => {
  const regex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
  const match = text.match(regex);
  return match ? match[0].replace(/\s/g, "") : null;
};

// Extract DL number (sample regex for Indian DL formats)
export const extractDLNumber = (text) => {
  const regex = /\b[A-Z]{2}\d{2}\s?\d{11}\b/;  // Like RJ14 20240123456
  const match = text.match(regex);
  return match ? match[0].replace(/\s/g, "") : null;
};
