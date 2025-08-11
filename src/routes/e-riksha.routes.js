import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { Eriksha } from "../models/e-riksha.models.js";
import { Document } from "../models/document.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import {extractTextFromImage, extractDLNumber, extractNameFromLicenceCard, extractOwnerNameFromRCUnlabeled, extractVehicleNumber } from "../utils/ocr.utils.js";

import bcrypt from "bcrypt";
import { unique_eriksha } from "../models/unique_erikshas.models.js";

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
    if (!files?.licenceCard || !files?.vehicleDoc) {
      return res.status(400).json({ error: "All documents must be uploaded" });
    }

    // OCR Extraction
   


    const vechicleDocText = await extractTextFromImage(files.vehicleDoc[0].path);
    // console.log("Extracted Vechicle details are: ", vechicleDocText);


    const licenceText = await extractTextFromImage(files.licenceCard[0].path);
    // console.log("Extracted Licence Text:\n", licenceText);


    // extract dl number from licence card
    const dlNumber = extractDLNumber(licenceText);
    console.log("Dl Number: ", dlNumber);


    // Extract Name from licence Card

    const driverName = extractNameFromLicenceCard(licenceText);
    console.log("DriverName: ", driverName);

    // extract owner name from RC card
    const e_riksha_OwnerName = extractOwnerNameFromRCUnlabeled(vechicleDocText);
    console.log("Vechicle Owner: ", e_riksha_OwnerName);

    // extract vechicle number from RC card

    const erikshaVechicalNo = extractVehicleNumber(vechicleDocText);
    console.log("Vechicle number: ",erikshaVechicalNo);

    // if any of these doesn't exist return failed

    if (!driverName || !dlNumber || !e_riksha_OwnerName || !erikshaVechicalNo) {
      return res.status(422).json({ error: "Unable to extract data please try again!" });
    }
    
    // check if licence card holder and vechicle owner are same person

    if(driverName!==e_riksha_OwnerName || e_riksha_OwnerName!==Name){
      return res.status(422).json({error: "Licence card holder and vechical owner are not same!"});
    }
    
    

    //  First, create Eriksha with validation (unhashed data)
    const erikshaRaw = new Eriksha({
      Name:e_riksha_OwnerName,
      dlNumber,
      eriksha_number: erikshaVechicalNo,
      phoneNo
    });

    await erikshaRaw.validate(); // Explicit validation before hashing

    //  Now hash sensitive fields manually
    erikshaRaw.dlNumber = await bcrypt.hash(dlNumber.toUpperCase(), 10);
    erikshaRaw.eriksha_number = await bcrypt.hash(erikshaVechicalNo.toUpperCase(), 10);
    erikshaRaw.phoneNo = await bcrypt.hash(phoneNo, 10);


    // Before creating Eriksha, check if vehicle exists in unique_erikshas
    const existingVehicle = await unique_eriksha.findOne({
      vechicleOwner: erikshaRaw.Name.toUpperCase()
    });

    if (!existingVehicle) {
      // Save it into unique_erikshas
      await unique_eriksha.create({
        vechicleNumber: erikshaVechicalNo.toUpperCase(),
        vechicleOwner: Name,
      });
    }

    //  Save Eriksha after validation + hashing
    const savedEriksha = await erikshaRaw.save();


    //  Upload documents to Cloudinary
    const [licenceUrl, vehicleUrl] = await Promise.all([
      uploadOnCloudinary(files.licenceCard[0].path),
      uploadOnCloudinary(files.vehicleDoc[0].path)
    ]);

    if (!licenceUrl || !vehicleUrl) {
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }


    // Create Document records
    // const documents = await Document.insertMany([
    //   {
    //     Name: "Licence Card",
    //     documentFile: licenceUrl.secure_url,
    //     owner: savedEriksha._id
    //   },
    //   {
    //     Name: "Vehicle Document",
    //     documentFile: vehicleUrl.secure_url,
    //     owner: savedEriksha._id
    //   }
    // ]);

    //  Link documents to Eriksha and save
   savedEriksha.document = [
    {
      name: "Licence Card",
      file: licenceUrl.secure_url
    },
    {
      name: "Vehicle Document",
      file: vehicleUrl.secure_url
    }
  ];

  await savedEriksha.save();


    // Respond with success
    return res.status(201).json({
      message: "Registration successful",
      eriksha: savedEriksha,
      documents: savedEriksha.document,
      extracted: { dlNumber }
    });


  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;
