import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { Eriksha } from "../models/e-riksha.models.js";
import { Document } from "../models/document.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import {extractTextFromImage, extractDLNumber, extractAadhaarNumber } from "../utils/ocr.utils.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Handle 3 specific files
const uploadFields = upload.fields([
  { name: 'aadhar', maxCount: 1 },
  { name: 'licenceCard', maxCount: 1 },
  { name: 'vehicleDoc', maxCount: 1 }
]);

router.post("/register", uploadFields, async (req, res) => {
  try {
    const { Name, phoneNo } = req.body;
    const files = req.files;

    //  Validate presence of files
    if (!files?.aadhar || !files?.licenceCard || !files?.vehicleDoc) {
      return res.status(400).json({ error: "All documents must be uploaded" });
    }

    // OCR Extraction
    const aadharText = await extractTextFromImage(files.aadhar[0].path);
    console.log("Extracted Aadhaar Text:\n", aadharText);
    const licenceText = await extractTextFromImage(files.licenceCard[0].path);
    console.log("Extracted Licence Text:\n", licenceText);


    const aadhaarNumber = extractAadhaarNumber(aadharText);
    const dlNumber = extractDLNumber(licenceText);

    console.log("Aadhar number: ", aadhaarNumber);
    console.log("DL number: ", dlNumber);

    if (!aadhaarNumber || !dlNumber) {
      return res.status(422).json({ error: "Unable to extract Aadhaar or DL number" });
    }
    
    //  Upload documents to Cloudinary
    const [aadharUrl, licenceUrl, vehicleUrl] = await Promise.all([
      uploadOnCloudinary(files.aadhar[0].path),
      uploadOnCloudinary(files.licenceCard[0].path),
      uploadOnCloudinary(files.vehicleDoc[0].path)
    ]);

    if (!aadharUrl || !licenceUrl || !vehicleUrl) {
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }

    //  First, create Eriksha with validation (unhashed data)
    const erikshaRaw = new Eriksha({
      Name,
      dlNumber,
      aadharNo: aadhaarNumber,
      phoneNo
    });

    await erikshaRaw.validate(); // Explicit validation before hashing

    //  Now hash sensitive fields manually
    erikshaRaw.dlNumber = await bcrypt.hash(dlNumber.toUpperCase(), 10);
    erikshaRaw.aadharNo = await bcrypt.hash(aadhaarNumber.toUpperCase(), 10);
    erikshaRaw.phoneNo = await bcrypt.hash(phoneNo, 10);

    //  Save Eriksha after validation + hashing
    const savedEriksha = await erikshaRaw.save();

    // Create Document records
    const documents = await Document.insertMany([
      {
        Name: "Aadhar Card",
        documentFile: aadharUrl.secure_url,
        owner: savedEriksha._id
      },
      {
        Name: "Licence Card",
        documentFile: licenceUrl.secure_url,
        owner: savedEriksha._id
      },
      {
        Name: "Vehicle Document",
        documentFile: vehicleUrl.secure_url,
        owner: savedEriksha._id
      }
    ]);

    //  Link documents to Eriksha and save
    savedEriksha.document = documents.map(doc => doc._id);
    await savedEriksha.save();

    //  Respond with success
    return res.status(201).json({
      message: "Registration successful",
      eriksha: savedEriksha,
      documents,
      extracted: { aadhaarNumber, dlNumber }
    });

  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;
