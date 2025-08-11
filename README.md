# Project Title: Don't know yet!

## 🔍 Project Description

This project streamlines the secure registration and verification of e-riksha owners through official government channels like e-Mitra. It ensures fair ownership by identifying and removing users with multiple e-rikshas while securely issuing encrypted QR codes to legitimate single-ownership owners. All sensitive data is encrypted, stored securely in MongoDB, and can only be decrypted through the official app.

---



## ⚙️ Workflow (API Registration Endpoint)

1. **Document Upload**
   - User submits required documents: Driving Licence, Vehicle Document (RC), and optionally Aadhar via the `/register` API endpoint.

2. **OCR Extraction**
   - The system extracts text from uploaded images using OCR:
     - Extracts Driving Licence Number and Driver Name from the Licence Card.
     - Extracts Owner Name and Vehicle Number from the Vehicle Document.

3. **Validation**
   - Checks if all required data (DL Number, Driver Name, Owner Name, Vehicle Number) is successfully extracted.
   - Verifies that the Licence Card holder, Vehicle Owner, and provided Name are the same person.

4. **Data Hashing & Storage**
   - Sensitive fields (DL Number, Vehicle Number, Phone Number) are hashed using bcrypt.
   - Owner and vehicle uniqueness is checked in the database (`unique_eriksha` collection).
   - If unique, the vehicle and owner are recorded.

5. **Document Upload to Cloudinary**
   - Uploaded documents are stored securely on Cloudinary.
   - Document URLs are linked to the Eriksha record.

6. **Response**
   - On success, the API responds with registration confirmation, saved Eriksha data, document URLs, and extracted DL Number.

---

### API Flowchart

```text
+-----------------------------+
|   POST /register endpoint   |
+-------------+---------------+
              |
              v
+-----------------------------+
|  Upload documents (DL, RC)  |
+-------------+---------------+
              |
              v
+-----------------------------+
|   OCR: Extract key fields   |
+-------------+---------------+
              |
              v
+-----------------------------+
| Validate & match owner info |
+-------------+---------------+
              |
              v
+-----------------------------+
| Hash sensitive data         |
+-------------+---------------+
              |
              v
+-----------------------------+
| Check uniqueness in DB      |
+-------------+---------------+
              |
              v
+-----------------------------+
| Upload docs to Cloudinary   |
+-------------+---------------+
              |
              v
+-----------------------------+
| Save Eriksha & docs in DB   |
+-------------+---------------+
              |
              v
+-----------------------------+
|   Respond with success      |
+-----------------------------+
