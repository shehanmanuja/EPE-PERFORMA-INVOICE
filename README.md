# Eximius Power and Energy - Proforma Invoice Generator

A complete, professional, standalone web application built strictly with **Pure HTML, CSS, and Vanilla JavaScript** (Zero Node.js / Zero npm build steps required). It accurately replicates the official **Eximius Power and Energy** Proforma Invoice format and outputs a pixel-perfect, print-ready **A4 PDF**.

---

## 🚀 How to Run the System (භාවිතා කරන ආකාරය)

1. Simply double-click **`start.bat`** or open **`index.html`** in any modern web browser (Google Chrome, Microsoft Edge, Brave, Firefox).
2. No internet connection or server is required — it works 100% offline.

---

## ✨ Key Features & Capabilities

### 1. Exact Template Match (Image 1:1 Reproduction)
- **Top Header**: Curved corporate swoosh, Eximius Power and Energy company logo, full address, contact details, web, and VAT Registration No (`104919200-7000`).
- **Document Meta**: Proforma Invoice title, Reference No, Date, Customer Reference.
- **Customer Information**: Name, VAT No, Address, Phone No, Email.
- **Items Table**: Dynamic item list with columns: `NO`, `DESCRIPTION`, `UNIT`, `RATE`, `QTY`, `AMOUNT`. Padded with standard empty grid lines (minimum 10 rows) to maintain the exact template appearance.
- **Payment Instructions & Bank Transfer**:
  - Bank 1: **Hatton National Bank** (Kolonnawa Branch, Account: 194010012587)
  - Bank 2: **Nations Trust Bank** (Union Place Branch, Account: 100060024944)
  - Bank 3: **Commercial Bank** (Kotahena Branch, Account: 1000681145)
- **Calculations & Totals**:
  - Auto `Rate × Qty = Amount` per row
  - Auto **Total (Subtotal)**
  - Auto **VAT (18%)** calculation (with enable/disable switch & custom % rate option)
  - Auto **Grand Total** (highlighted in grey bar matching the template)
  - **Paid** amount input
  - Auto **Balance Due** calculation
- **Terms & Conditions**:
  - Validity: 07 Days
  - Delivery: 6-8 Weeks
  - Payment Terms: 50% on Order Confirmation and 50% Prior to Delivery
  - Warranty: 10 Years Manufacturer's Product Warranty for Solar PV Inverters
  - Note: All the prices are subject to change based on current tax rates and dollar fluctuations
- **Official Footer**:
  - "This is a computer-generated document. No signature is required."
  - Partner Logos: **AlphaESS** & **SINENG**
  - "Eximius Power and Energy - Exclusive Partner of AlphaESS and SINENG in Sri Lanka"
  - Bottom corporate wave/swoosh decoration.

---

## 🖼️ Background & Logo Setup (ලෝගෝ සහ Background Image දාන විදිය)

### 1. A4 Background Image (Letterhead)
ඔයා සතුව ඇති A4 Background Image එක (Header / Footer graphics සහිත Letterhead එක) පහත ආකාරයට `assets/` folder එකට දමන්න:
- File Name: **`assets/background.jpg`** (හෝ **`assets/background.png`**)
- Web System එකේ **"🖼️ Background & Letterhead"** section එකෙන් Background image එක ON / OFF කිරීමට හෝ File Path එක වෙනස් කිරීමට හැකිය.

### 2. Company & Partner Logos
Logos වෙනම Web UI එකෙන් Upload කිරීමට අවශ්‍ය නොවන පරිදි කෙලින්ම `assets/` folder එකෙන් load වන පරිදි සකස් කර ඇත:
- **Eximius Main Logo**: `assets/logo.png`
- **AlphaESS Logo**: `assets/alphaess.png`
- **SINENG Logo**: `assets/sineng.png`

*(ඔබ PNG files දමන තුරු default high-definition vector SVG ලෝගෝ ස්වයංක්‍රීයව පෙන්වනු ඇත).*

### 3. Pre-printed Letterhead Toggles
ඔබේ Background Image එකේ Company Logo/Address හෝ Partner Logos දැනටමත් Print කර ඇත්නම්, UI එකෙන් **"Show Company Header"** හෝ **"Show Partner Footer"** switch එක OFF කර Double-Printing වැළැක්විය හැක.

---

## 📦 Items Table (Dynamic Rows)
- **ඔබ ඇතුළත් කරන අයිතම (Rows) පමණක්** Table එකේ පෙන්වයි. හිස් rows (empty filler rows) පෙන්වන්නේ නැත.
- අලුත් item එකක් එක් කිරීමට අවශ්‍ය වූ විට **"+ Add Row"** හෝ **"+ Add Item"** button එක click කරන්න.

---

## 🖨️ How to Print / Save as A4 PDF

1. Click the prominent orange **`🖨️ Print / Save A4 PDF`** button (or press `Ctrl + P`).
2. In the print dialog:
   - **Destination**: Choose **"Save as PDF"** (or your printer).
   - **Paper Size**: **A4**.
   - **Margins**: Set to **"None"** or **"Default"**.
   - **Options**: Ensure **"Background graphics"** is checked.
3. Click **Save** to export your high-resolution A4 Proforma Invoice PDF.

---

## 💾 Saving & Loading Invoices

- **Auto-Save**: Changes are automatically saved to your browser's `localStorage` as you type. Refreshing the browser will not erase your draft.
- **Export Draft (JSON)**: Click **"💾 Export Draft"** to download the invoice data as a `.json` backup.
- **Load Draft (JSON)**: Click **"📂 Load Draft"** to load any previously saved invoice.
