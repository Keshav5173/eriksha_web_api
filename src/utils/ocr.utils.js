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


// Utility to clean OCR text
function cleanOCRText(text) {
  return text
    .replace(/]/g, "J")         // Fix common OCR mistake ] → J
    .replace(/\|/g, "I")        // | → I
    .replace(/0/g, "O")         // Zero → O (for names, this might matter)
    .replace(/[^A-Za-z0-9\s:]/g, "") // Remove weird symbols
    .replace(/\s+/g, " ")       // Normalize spaces
    .trim();
}



// Extract DL number (sample regex for Indian DL formats)
export const extractDLNumber = (text) => {
  const regex = /\b[A-Z]{2}\d{2}\s?\d{11}\b/;  // Like RJ14 20240123456
  const match = text.match(regex);
  return match ? match[0].replace(/\s/g, "") : null;
};





// Extract name from Licence Card
export const extractNameFromLicenceCard = (text) => {
  const cleanedText = cleanOCRText(text); // ✅ clean the OCR result
  const regex = /(?:Name|NAME|name)[:\s]+([A-Za-z]+\s[A-Za-z]+(?:\s[A-Za-z]+)*?)(?=\s(?:S\/O|D\/O|W\/O|Son|Daughter|Wife|Address|License|\d|$))/i;
  const match = cleanedText.match(regex);
  return match ? match[1].trim() : null;
};

// Extract Owner Name from RC
// Extract Owner Name from RC
export const extractOwnerNameFromRCUnlabeled = (text) => {
  const cleanedText = cleanOCRText(text);

  // Stop-words with fuzzy partial matches to catch OCR mistakes
  const stopWords = "(Fue|Fye|Son|Daug|Wif|Addr|Licen|Petro|Dies|Elec)";

  // Try same-line extraction first
  const sameLineMatch = cleanedText.match(
    new RegExp(`Owner\\s*Name\\s*[:\\-]?\\s*([A-Za-z\\s]+?)(?=\\s${stopWords}|$)`, "i")
  );
  if (sameLineMatch) return sameLineMatch[1].trim();

  // Try multi-line fallback
  const lines = cleanedText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const ownerIndex = lines.findIndex(line => /Owner Name/i.test(line));
  if (ownerIndex !== -1 && ownerIndex + 1 < lines.length) {
    return lines[ownerIndex + 1].replace(/[^A-Za-z\s]/g, "").trim();
  }

  return null;
};







export const extractVehicleNumber = (text) => {
  const regex = /\b[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{1,4}\b/; 
  const match = text.match(regex);
  return match ? match[0] : null;
};
