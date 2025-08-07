# Project Title: Don't know yet!

## 🔍 Project Description

This project streamlines the secure registration and verification of e-riksha owners through official government channels like e-Mitra. It ensures fair ownership by identifying and removing users with multiple e-rikshas while securely issuing encrypted QR codes to legitimate single-ownership owners. All sensitive data is encrypted, stored securely in MongoDB, and can only be decrypted through the official app.

---

## ⚙️ Workflow

1. **Document Collection**
   - E-riksha owners upload their **driving licence**, **vehicle registration**, and other documents through an authorized government portal or **e-Mitra**.

2. **Data Extraction**
   - System extracts key details like:
     - Driving Licence Number
     - Registration/RC Number
     - Owner Information
     - Other relevant fields (if needed)

3. **Data Encryption & Storage**
   - All sensitive information is **encrypted** before being stored.
   - Encrypted data is saved securely in a **MongoDB database**.

4. **Duplicate Detection & Filtering**
   - During verification, the database is scanned.
   - Owners with **multiple e-rikshas** are identified and **removed**.
   - Only **single-ownership** owners are retained.

5. **QR Code Generation**
   - Eligible owners are issued a **QR code** containing:
     - Encrypted personal and vehicle data
     - Their **designated route/work zone**
   - QR code data is **decryptable only through the official app** to maintain data privacy and security.

---

## 📊 Flowchart

```text
+-----------------------------+
|     Start (Owner Input)     |
+-------------+---------------+
              |
              v
+-----------------------------+
| Upload documents via e-Mitra|
+-------------+---------------+
              |
              v
+-----------------------------+
| Extract DL & RC details     |
+-------------+---------------+
              |
              v
+-----------------------------+
| Encrypt data and store in DB|
+-------------+---------------+
              |
              v
+-----------------------------+
|  Scan DB for duplicates     |
+------+------+--------------+
       |     |
     Yes     No
       |      |
       v      v
+-------------+-----------------+
| Remove multi-e-riksha owners |
+------------------------------+
              |
              v
+-----------------------------+
| Generate encrypted QR code  |
| (With route and details)    |
+-------------+---------------+
              |
              v
+-----------------------------+
|     Data only decryptable    |
|     via our secure app       |
+-------------+---------------+
              |
              v
+-----------------------------+
|             End             |
+-----------------------------+
