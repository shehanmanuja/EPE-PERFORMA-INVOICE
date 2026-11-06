/**
 * EXIMIUS PROFORMA INVOICE GENERATOR
 * Pure Vanilla JavaScript Application (Zero Node.js dependency)
 */

(function () {
  'use strict';

  // Helper for today's date formatted as YYYY-MM-DD
  function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Auto Reference Number Generator (e.g. EPEPI261106-01, EPEQI261106-01, EPETI261106-01)
  function generateRefNumber(docType, dateVal, seq) {
    let prefix = "EPEPI";
    if (docType === "QUOTATION") {
      prefix = "EPEQI";
    } else if (docType === "TAX INVOICE") {
      prefix = "EPETI";
    }

    let dateCode = "261105";
    if (dateVal) {
      const parts = dateVal.split('-');
      if (parts.length === 3) {
        const yy = parts[0].slice(-2);
        const mm = parts[1].padStart(2, '0');
        const dd = parts[2].padStart(2, '0');
        dateCode = `${yy}${mm}${dd}`;
      }
    } else {
      const parts = getTodayDateString().split('-');
      dateCode = `${parts[0].slice(-2)}${parts[1]}${parts[2]}`;
    }

    const s = (seq !== undefined && seq !== null && String(seq).trim() !== "") ? String(seq).trim().replace(/^-+/, '') : "01";
    return `${prefix}${dateCode}-${s}`;
  }

  // Preset Sample Data (can be loaded anytime via the "Sample Data" button)
  const sampleSolarInvoiceData = {
    docType: "PROFORMA INVOICE",
    meta: {
      refNo: "EPEPI261105-01",
      refSeq: "01",
      date: "2026-11-05",
      yourRef: "REQ-SL-2026-04"
    },
    customer: {
      name: "Green Horizon Energy Solutions (Pvt)",
      vatNo: "102938475-7000",
      address: "No. 45/2, Nawala Road, Nugegoda, Sri Lanka",
      phoneNo: "+94 77 345 6789",
      email: "procurement@greenhorizon.lk"
    },
    items: [
      {
        no: 1,
        desc: "AlphaESS Smile-G3-T10-INV 10kW Three Phase Hybrid Inverter with Smart Energy Management System",
        unit: "Nos",
        rate: 585000,
        qty: 1
      },
      {
        no: 2,
        desc: "AlphaESS SMILE-G3-BAT-8.2P High Voltage LiFePO4 Battery Module (8.2kWh, 90% DoD)",
        unit: "Nos",
        rate: 740000,
        qty: 2
      },
      {
        no: 3,
        desc: "SINENG SP-125K-H1 125kW Commercial String Inverter 1500V DC with Smart IV Curve Diagnosis",
        unit: "Nos",
        rate: 1450000,
        qty: 1
      },
      {
        no: 4,
        desc: "Complete DC Surge Protection, Type II SPD, DC Isolators and Balance of System (BoS) Kit",
        unit: "Set",
        rate: 185000,
        qty: 1
      }
    ],
    financials: {
      currencySymbol: "",
      vatEnabled: true,
      vatRate: 18,
      paid: 0
    }
  };

  // Default Clean Invoice Data (All user fields clear and fresh)
  const defaultInvoiceData = {
    docType: "PROFORMA INVOICE",
    meta: {
      refNo: generateRefNumber("PROFORMA INVOICE", getTodayDateString(), "01"),
      refSeq: "01",
      date: getTodayDateString(),
      yourRef: ""
    },
    customer: {
      name: "",
      vatNo: "",
      address: "",
      phoneNo: "",
      email: ""
    },
    items: [
      {
        no: 1,
        desc: "",
        unit: "Nos",
        rate: 0,
        qty: 1
      }
    ],
    financials: {
      currencySymbol: "", // Left blank or prefix if desired
      vatEnabled: true,
      vatRate: 18,
      paid: 0
    },
    banks: {
      bank1: {
        enabled: true,
        accountName: "Eximius Power and Energy (Private) Limited",
        accountNo: "194010012587",
        bank: "Hatton National Bank",
        bankCode: "7083",
        branch: "Kolonnawa Branch",
        branchCode: "104",
        swiftCode: "HBLILKLXXXX"
      },
      bank2: {
        enabled: true,
        accountName: "Eximius Power and Energy (Private) Limited",
        accountNo: "100060024944",
        bank: "Nations Trust Bank",
        bankCode: "7162",
        branch: "Union Place Branch",
        branchCode: "006",
        swiftCode: "NTBCLKLLXXXX"
      },
      bank3: {
        enabled: true,
        accountName: "Eximius Power and Energy (Private) Limited",
        accountNo: "1000681145",
        bank: "Commercial Bank",
        bankCode: "7056",
        branch: "Kotahena Branch",
        branchCode: "012",
        swiftCode: "CCEYLKLX"
      }
    },
    terms: {
      validity: "07 Days",
      delivery: "6-8 Weeks",
      paymentTerms: "50% on Order Confirmation and 50% Prior to Delivery",
      warranty: "10 Years Manufacturer's Product Warranty for Solar PV Inverters",
      note: "All the prices are subject to change based on current tax rates and dollar fluctuations"
    },
    settings: {
      showBackground: true,
      bgImagePath: "assets/background.jpg",
      showHeaderBrand: true,
      showFooterBrand: true
    },
    branding: {
      mainLogo: "assets/logo.svg",
      alphaessLogo: "assets/alphaess.png",
      sinengLogo: "assets/sineng.png"
    }
  };

  // State
  let invoiceData = JSON.parse(JSON.stringify(defaultInvoiceData));
  let currentZoom = 0.9; // 90% default preview fit

  // Storage Key
  const STORAGE_KEY = "eximius_proforma_invoice_data";

  // Init App
  function init() {
    loadSavedData();
    renderForm();
    updateCalculationsAndPreview();
    setupEventListeners();
    applyZoom();
  }

  // Load from localStorage if present
  function loadSavedData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        invoiceData = Object.assign({}, defaultInvoiceData, parsed);
        invoiceData.settings = Object.assign({}, defaultInvoiceData.settings, parsed.settings || {});
        if (!invoiceData.docType) invoiceData.docType = "PROFORMA INVOICE";
        if (!invoiceData.meta) invoiceData.meta = Object.assign({}, defaultInvoiceData.meta);
        if (!invoiceData.meta.refSeq) invoiceData.meta.refSeq = "01";
        if (!invoiceData.meta.date) invoiceData.meta.date = getTodayDateString();

        // Clear legacy sample customer data if present in localStorage
        if (invoiceData.customer && (
          invoiceData.customer.name === "Green Horizon Energy Solutions (Pvt)" ||
          invoiceData.customer.name === "Green Horizon Energy Solutions (Pvt) Ltd" ||
          invoiceData.customer.vatNo === "102938475-7000"
        )) {
          invoiceData.customer = { name: "", vatNo: "", address: "", phoneNo: "", email: "" };
        }

        // Clear legacy sample items if present in localStorage
        if (invoiceData.items && invoiceData.items.length > 0 &&
          invoiceData.items[0].desc && invoiceData.items[0].desc.includes("AlphaESS Smile-G3-T10-INV")) {
          invoiceData.items = [
            { no: 1, desc: "", unit: "Nos", rate: 0, qty: 1 }
          ];
        }

        // Clear legacy sample reference if present
        if (invoiceData.meta && invoiceData.meta.yourRef === "REQ-SL-2026-04") {
          invoiceData.meta.yourRef = "";
        }

        // Ensure auto reference number is present and updated
        if (!invoiceData.meta.refNo || invoiceData.meta.refNo === "EPE/PI/2026/089" || invoiceData.meta.refNo === "EPEPI261105-01") {
          invoiceData.meta.refNo = generateRefNumber(invoiceData.docType, invoiceData.meta.date, invoiceData.meta.refSeq);
        }

        // Ensure background is enabled by default
        if (invoiceData.settings.showBackground === undefined) {
          invoiceData.settings.showBackground = true;
        }
        if (!invoiceData.settings.bgImagePath) {
          invoiceData.settings.bgImagePath = "assets/background.jpg";
        }
        // Upgrade logo path if previously stored as .png
        if (!invoiceData.branding || invoiceData.branding.mainLogo === "assets/logo.png") {
          invoiceData.branding = invoiceData.branding || {};
          invoiceData.branding.mainLogo = "assets/logo.svg";
        }
      } else {
        invoiceData.meta.date = getTodayDateString();
        invoiceData.meta.refNo = generateRefNumber(invoiceData.docType, invoiceData.meta.date, invoiceData.meta.refSeq);
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }

  // Save to localStorage
  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoiceData));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }

  // Setup Global Event Listeners
  function setupEventListeners() {
    // Zoom Buttons
    document.getElementById("btnZoomIn")?.addEventListener("click", () => {
      currentZoom = Math.min(1.5, currentZoom + 0.1);
      applyZoom();
    });

    document.getElementById("btnZoomOut")?.addEventListener("click", () => {
      currentZoom = Math.max(0.5, currentZoom - 0.1);
      applyZoom();
    });

    document.getElementById("btnZoomFit")?.addEventListener("click", () => {
      fitPreviewToScreen();
    });

    document.getElementById("btnZoom100")?.addEventListener("click", () => {
      currentZoom = 1.0;
      applyZoom();
    });

    // Action Buttons
    document.getElementById("btnPrint")?.addEventListener("click", () => {
      window.print();
    });

    document.getElementById("btnSampleData")?.addEventListener("click", () => {
      if (confirm("Load sample solar invoice data?")) {
        invoiceData.customer = JSON.parse(JSON.stringify(sampleSolarInvoiceData.customer));
        invoiceData.items = JSON.parse(JSON.stringify(sampleSolarInvoiceData.items));
        invoiceData.meta.yourRef = sampleSolarInvoiceData.meta.yourRef;
        invoiceData.financials.paid = sampleSolarInvoiceData.financials.paid;
        saveData();
        renderForm();
        updateCalculationsAndPreview();
      }
    });

    document.getElementById("btnClear")?.addEventListener("click", () => {
      if (confirm("Clear all items and customer fields?")) {
        invoiceData.customer = { name: "", vatNo: "", address: "", phoneNo: "", email: "" };
        invoiceData.items = [
          { no: 1, desc: "", unit: "Nos", rate: 0, qty: 1 }
        ];
        invoiceData.financials.paid = 0;
        invoiceData.meta.yourRef = "";
        saveData();
        renderForm();
        updateCalculationsAndPreview();
      }
    });

    document.getElementById("btnExportJSON")?.addEventListener("click", exportJSON);
    document.getElementById("fileImportJSON")?.addEventListener("change", importJSON);

    // Window resize auto-adjust if fit mode
    window.addEventListener("resize", () => {
      // Auto adjust if small screen
      if (window.innerWidth < 1200 && currentZoom > 0.8) {
        fitPreviewToScreen();
      }
    });
  }

  // Apply Zoom Scale to A4 Sheet
  function applyZoom() {
    const box = document.getElementById("a4TransformBox");
    const zoomText = document.getElementById("zoomLevelText");
    if (box) {
      box.style.transform = `scale(${currentZoom})`;
    }
    if (zoomText) {
      zoomText.textContent = `${Math.round(currentZoom * 100)}%`;
    }
  }

  function fitPreviewToScreen() {
    const viewport = document.getElementById("previewViewport");
    if (!viewport) return;
    const viewportWidth = viewport.clientWidth - 60;
    // A4 width in px is approx 794px at standard DPI (210mm)
    const a4WidthPx = 794;
    currentZoom = Math.min(1.2, Math.max(0.45, Math.floor((viewportWidth / a4WidthPx) * 100) / 100));
    applyZoom();
  }

  // Handle Logo Upload (Base64 file reader)
  function handleLogoUpload(e, key) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      invoiceData.branding[key] = event.target.result;
      saveData();
      renderPreview();
    };
    reader.readAsDataURL(file);
  }

  // Format Numbers to Sri Lankan / Standard Currency Format (e.g. 1,450,000.00)
  function formatMoney(num) {
    const val = Number(num) || 0;
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Render Editor Form Fields
  function renderForm() {
    // Document Type & Meta Fields
    const selDoc = document.getElementById("selDocType");
    if (selDoc) selDoc.value = invoiceData.docType || "PROFORMA INVOICE";

    setInputValue("inputRefNo", invoiceData.meta.refNo);
    setInputValue("inputRefSeq", invoiceData.meta.refSeq || "01");
    setInputValue("inputDate", invoiceData.meta.date);
    setInputValue("inputYourRef", invoiceData.meta.yourRef);

    // Customer Fields
    setInputValue("inputCustName", invoiceData.customer.name);
    setInputValue("inputCustVat", invoiceData.customer.vatNo);
    setInputValue("inputCustAddress", invoiceData.customer.address);
    setInputValue("inputCustPhone", invoiceData.customer.phoneNo);
    setInputValue("inputCustEmail", invoiceData.customer.email);

    // Financial Options
    const vatCheckbox = document.getElementById("chkEnableVat");
    if (vatCheckbox) vatCheckbox.checked = invoiceData.financials.vatEnabled;
    setInputValue("inputVatRate", invoiceData.financials.vatRate);
    setInputValue("inputPaidAmount", invoiceData.financials.paid);

    // Terms Fields
    setInputValue("inputTermValidity", invoiceData.terms.validity);
    setInputValue("inputTermDelivery", invoiceData.terms.delivery);
    setInputValue("inputTermPayment", invoiceData.terms.paymentTerms);
    setInputValue("inputTermWarranty", invoiceData.terms.warranty);
    setInputValue("inputTermNote", invoiceData.terms.note);

    // Bank Details
    setInputValue("inputB1AccNo", invoiceData.banks.bank1.accountNo);
    setInputValue("inputB1Bank", invoiceData.banks.bank1.bank);
    setInputValue("inputB1BankCode", invoiceData.banks.bank1.bankCode);
    setInputValue("inputB1Branch", invoiceData.banks.bank1.branch);
    setInputValue("inputB1BranchCode", invoiceData.banks.bank1.branchCode);
    setInputValue("inputB1Swift", invoiceData.banks.bank1.swiftCode);

    setInputValue("inputB2AccNo", invoiceData.banks.bank2.accountNo);
    setInputValue("inputB2Bank", invoiceData.banks.bank2.bank);
    setInputValue("inputB2BankCode", invoiceData.banks.bank2.bankCode);
    setInputValue("inputB2Branch", invoiceData.banks.bank2.branch);
    setInputValue("inputB2BranchCode", invoiceData.banks.bank2.branchCode);
    setInputValue("inputB2Swift", invoiceData.banks.bank2.swiftCode);

    setInputValue("inputB3AccNo", invoiceData.banks.bank3.accountNo);
    setInputValue("inputB3Bank", invoiceData.banks.bank3.bank);
    setInputValue("inputB3BankCode", invoiceData.banks.bank3.bankCode);
    setInputValue("inputB3Branch", invoiceData.banks.bank3.branch);
    setInputValue("inputB3BranchCode", invoiceData.banks.bank3.branchCode);
    setInputValue("inputB3Swift", invoiceData.banks.bank3.swiftCode);

    // Background & Letterhead Settings
    if (!invoiceData.settings) {
      invoiceData.settings = {
        showBackground: true,
        bgImagePath: "assets/background.jpg",
        showHeaderBrand: true,
        showFooterBrand: true
      };
    }
    const bgChk = document.getElementById("chkEnableBg");
    if (bgChk) bgChk.checked = invoiceData.settings.showBackground;
    setInputValue("inputBgPath", invoiceData.settings.bgImagePath);
    const headChk = document.getElementById("chkShowHeaderBrand");
    if (headChk) headChk.checked = invoiceData.settings.showHeaderBrand;
    const footChk = document.getElementById("chkShowFooterBrand");
    if (footChk) footChk.checked = invoiceData.settings.showFooterBrand;

    // Render Items Editor
    renderItemsEditor();

    // Attach Live Input Listeners for Auto-Sync
    attachFormInputListeners();
  }

  function setInputValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined ? val : "";
  }

  // Render Items list in editor
  function renderItemsEditor() {
    const container = document.getElementById("itemsEditorList");
    if (!container) return;

    container.innerHTML = "";

    invoiceData.items.forEach((item, index) => {
      const itemRowAmount = (Number(item.rate) || 0) * (Number(item.qty) || 0);

      const div = document.createElement("div");
      div.className = "item-card";
      div.innerHTML = `
        <div class="item-card-header">
          <span class="item-badge">#${index + 1}</span>
          <div class="item-actions">
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.EximiusApp.duplicateItem(${index})" title="Duplicate">Clone</button>
            <button type="button" class="item-btn-remove" onclick="window.EximiusApp.removeItem(${index})" title="Delete item">Delete</button>
          </div>
        </div>
        <div class="form-group">
          <label>Item Description</label>
          <textarea rows="2" oninput="window.EximiusApp.updateItemProp(${index}, 'desc', this.value)" placeholder="Enter product or service description...">${escapeHtml(item.desc || '')}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group" style="flex: 1.2;">
            <label>Unit</label>
            <input type="text" value="${item.unit || 'Nos'}" oninput="window.EximiusApp.updateItemProp(${index}, 'unit', this.value)" placeholder="Nos, Set, kW" />
          </div>
          <div class="form-group" style="flex: 2;">
            <label>Unit Rate</label>
            <input type="number" step="0.01" value="${item.rate > 0 ? item.rate : ''}" oninput="window.EximiusApp.updateItemProp(${index}, 'rate', this.value)" placeholder="0.00" />
          </div>
          <div class="form-group" style="flex: 1.2;">
            <label>Qty</label>
            <input type="number" min="1" step="1" value="${item.qty || 1}" oninput="window.EximiusApp.updateItemProp(${index}, 'qty', this.value)" />
          </div>
          <div class="form-group" style="flex: 2;">
            <label>Line Total</label>
            <input type="text" readonly value="${formatMoney(itemRowAmount)}" style="background: #f1f5f9; color: #003b71; font-weight: 700; text-align: right;" />
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  }

  // Form input listeners for live real-time sync
  function attachFormInputListeners() {
    const bindInput = (id, targetObj, prop) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.oninput = (e) => {
        targetObj[prop] = e.target.value;
        saveData();
        updateCalculationsAndPreview();
      };
    };

    // Document Type & Ref Auto-Generation
    const selDoc = document.getElementById("selDocType");
    if (selDoc) {
      selDoc.onchange = (e) => {
        invoiceData.docType = e.target.value;
        const autoRef = generateRefNumber(invoiceData.docType, invoiceData.meta.date, invoiceData.meta.refSeq);
        invoiceData.meta.refNo = autoRef;
        setInputValue("inputRefNo", autoRef);
        saveData();
        updateCalculationsAndPreview();
      };
    }

    const inSeq = document.getElementById("inputRefSeq");
    if (inSeq) {
      inSeq.oninput = (e) => {
        invoiceData.meta.refSeq = e.target.value;
        const autoRef = generateRefNumber(invoiceData.docType, invoiceData.meta.date, invoiceData.meta.refSeq);
        invoiceData.meta.refNo = autoRef;
        setInputValue("inputRefNo", autoRef);
        saveData();
        updateCalculationsAndPreview();
      };
    }

    const inDate = document.getElementById("inputDate");
    if (inDate) {
      inDate.onchange = (e) => {
        invoiceData.meta.date = e.target.value;
        const autoRef = generateRefNumber(invoiceData.docType, invoiceData.meta.date, invoiceData.meta.refSeq);
        invoiceData.meta.refNo = autoRef;
        setInputValue("inputRefNo", autoRef);
        saveData();
        updateCalculationsAndPreview();
      };
    }

    // Manual RefNo & YourRef
    bindInput("inputRefNo", invoiceData.meta, "refNo");
    bindInput("inputYourRef", invoiceData.meta, "yourRef");

    // Customer
    bindInput("inputCustName", invoiceData.customer, "name");
    bindInput("inputCustVat", invoiceData.customer, "vatNo");
    bindInput("inputCustAddress", invoiceData.customer, "address");
    bindInput("inputCustPhone", invoiceData.customer, "phoneNo");
    bindInput("inputCustEmail", invoiceData.customer, "email");

    // Financials
    const vatChk = document.getElementById("chkEnableVat");
    if (vatChk) {
      vatChk.onchange = (e) => {
        invoiceData.financials.vatEnabled = e.target.checked;
        saveData();
        updateCalculationsAndPreview();
      };
    }

    const vatRate = document.getElementById("inputVatRate");
    if (vatRate) {
      vatRate.oninput = (e) => {
        invoiceData.financials.vatRate = parseFloat(e.target.value) || 0;
        saveData();
        updateCalculationsAndPreview();
      };
    }

    const paidInput = document.getElementById("inputPaidAmount");
    if (paidInput) {
      paidInput.oninput = (e) => {
        invoiceData.financials.paid = parseFloat(e.target.value) || 0;
        saveData();
        updateCalculationsAndPreview();
      };
    }

    // Terms
    bindInput("inputTermValidity", invoiceData.terms, "validity");
    bindInput("inputTermDelivery", invoiceData.terms, "delivery");
    bindInput("inputTermPayment", invoiceData.terms, "paymentTerms");
    bindInput("inputTermWarranty", invoiceData.terms, "warranty");
    bindInput("inputTermNote", invoiceData.terms, "note");

    // Banks
    bindInput("inputB1AccNo", invoiceData.banks.bank1, "accountNo");
    bindInput("inputB1Bank", invoiceData.banks.bank1, "bank");
    bindInput("inputB1BankCode", invoiceData.banks.bank1.bankCode);
    bindInput("inputB1Branch", invoiceData.banks.bank1.branch);
    bindInput("inputB1BranchCode", invoiceData.banks.bank1.branchCode);
    bindInput("inputB1Swift", invoiceData.banks.bank1.swiftCode);

    bindInput("inputB2AccNo", invoiceData.banks.bank2, "accountNo");
    bindInput("inputB2Bank", invoiceData.banks.bank2.bank);
    bindInput("inputB2BankCode", invoiceData.banks.bank2.bankCode);
    bindInput("inputB2Branch", invoiceData.banks.bank2.branch);
    bindInput("inputB2BranchCode", invoiceData.banks.bank2.branchCode);
    bindInput("inputB2Swift", invoiceData.banks.bank2.swiftCode);

    bindInput("inputB3AccNo", invoiceData.banks.bank3, "accountNo");
    bindInput("inputB3Bank", invoiceData.banks.bank3.bank);
    bindInput("inputB3BankCode", invoiceData.banks.bank3.bankCode);
    bindInput("inputB3Branch", invoiceData.banks.bank3.branch);
    bindInput("inputB3BranchCode", invoiceData.banks.bank3.branchCode);
    bindInput("inputB3Swift", invoiceData.banks.bank3.swiftCode);

    // Settings
    const chkBg = document.getElementById("chkEnableBg");
    if (chkBg) {
      chkBg.onchange = (e) => {
        if (!invoiceData.settings) invoiceData.settings = {};
        invoiceData.settings.showBackground = e.target.checked;
        saveData();
        updateCalculationsAndPreview();
      };
    }
    const inBgPath = document.getElementById("inputBgPath");
    if (inBgPath) {
      inBgPath.oninput = (e) => {
        if (!invoiceData.settings) invoiceData.settings = {};
        invoiceData.settings.bgImagePath = e.target.value;
        saveData();
        updateCalculationsAndPreview();
      };
    }
    const chkHead = document.getElementById("chkShowHeaderBrand");
    if (chkHead) {
      chkHead.onchange = (e) => {
        if (!invoiceData.settings) invoiceData.settings = {};
        invoiceData.settings.showHeaderBrand = e.target.checked;
        saveData();
        updateCalculationsAndPreview();
      };
    }
    const chkFoot = document.getElementById("chkShowFooterBrand");
    if (chkFoot) {
      chkFoot.onchange = (e) => {
        if (!invoiceData.settings) invoiceData.settings = {};
        invoiceData.settings.showFooterBrand = e.target.checked;
        saveData();
        updateCalculationsAndPreview();
      };
    }
  }

  // Update Calculations & Render Live Preview
  function updateCalculationsAndPreview() {
    let subtotal = 0;

    invoiceData.items.forEach((item, idx) => {
      item.no = idx + 1;
      const rate = Number(item.rate) || 0;
      const qty = Number(item.qty) || 0;
      subtotal += rate * qty;
    });

    let vatAmount = 0;
    if (invoiceData.financials.vatEnabled) {
      vatAmount = subtotal * ((Number(invoiceData.financials.vatRate) || 0) / 100);
    }

    const grandTotal = subtotal + vatAmount;
    const paid = Number(invoiceData.financials.paid) || 0;
    const balance = grandTotal - paid;

    // Update Summary in Form Editor
    setText("summarySubtotal", formatMoney(subtotal));
    setText("summaryVat", formatMoney(vatAmount));
    setText("summaryGrandTotal", formatMoney(grandTotal));
    setText("summaryBalance", formatMoney(balance));

    // Render Preview Sheet
    renderPreview({
      subtotal,
      vatAmount,
      grandTotal,
      paid,
      balance
    });
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // Render the A4 sheet live preview
  function renderPreview(calcData) {
    if (!calcData) {
      let subtotal = 0;
      invoiceData.items.forEach(it => {
        subtotal += (Number(it.rate) || 0) * (Number(it.qty) || 0);
      });
      const vat = invoiceData.financials.vatEnabled ? subtotal * ((invoiceData.financials.vatRate || 0) / 100) : 0;
      const grandTotal = subtotal + vat;
      const paid = Number(invoiceData.financials.paid) || 0;
      calcData = {
        subtotal,
        vatAmount: vat,
        grandTotal,
        paid,
        balance: grandTotal - paid
      };
    }

    // Background Image Handling
    const sheet = document.getElementById("invoiceDocument");
    const bgImg = document.getElementById("prevBgImg");
    if (invoiceData.settings && invoiceData.settings.showBackground === false) {
      if (sheet) sheet.style.backgroundImage = 'none';
      if (bgImg) bgImg.style.display = 'none';
    } else {
      const bgUrl = (invoiceData.settings && invoiceData.settings.bgImagePath) ? invoiceData.settings.bgImagePath : 'assets/background.jpg';
      if (sheet) {
        sheet.style.backgroundImage = `url('${bgUrl}')`;
        sheet.style.backgroundSize = "210mm 297mm";
        sheet.style.backgroundPosition = "center top";
        sheet.style.backgroundRepeat = "no-repeat";
      }
      if (bgImg) {
        bgImg.style.display = 'block';
        if (!bgImg.src.endsWith(bgUrl)) {
          bgImg.src = bgUrl;
        }
      }
    }

    // Header & Footer Display Toggles
    const headerEl = document.getElementById("companyBrandContainer");
    if (headerEl) {
      headerEl.style.display = (invoiceData.settings && invoiceData.settings.showHeaderBrand === false) ? "none" : "block";
    }
    const footerEl = document.getElementById("invoiceFooterContainer");
    if (footerEl) {
      footerEl.style.display = (invoiceData.settings && invoiceData.settings.showFooterBrand === false) ? "none" : "block";
    }

    // Set Logos
    setImageSrc("prevMainLogo", invoiceData.branding.mainLogo);
    setImageSrc("prevAlphaessLogo", invoiceData.branding.alphaessLogo);
    setImageSrc("prevSinengLogo", invoiceData.branding.sinengLogo);

    // Document Title & Meta
    setText("prevDocTitle", invoiceData.docType || "PROFORMA INVOICE");
    setText("prevRefNo", invoiceData.meta.refNo || "");
    setText("prevDate", formatDate(invoiceData.meta.date));
    setText("prevYourRef", invoiceData.meta.yourRef || "");

    // Customer
    setText("prevCustName", invoiceData.customer.name || "");
    setText("prevCustVat", invoiceData.customer.vatNo || "");
    setText("prevCustAddress", invoiceData.customer.address || "");
    setText("prevCustPhone", invoiceData.customer.phoneNo || "");
    setText("prevCustEmail", invoiceData.customer.email || "");

    // Items Table Body (Only filled items will be displayed as requested)
    const tbody = document.getElementById("prevTableBody");
    if (tbody) {
      tbody.innerHTML = "";

      invoiceData.items.forEach((item, idx) => {
        const lineTotal = (Number(item.rate) || 0) * (Number(item.qty) || 0);
        const hasDesc = item.desc && item.desc.trim().length > 0;
        const hasRate = Number(item.rate) > 0;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="col-no">${String(idx + 1).padStart(2, '0')}</td>
          <td class="col-desc">${escapeHtml(item.desc || '')}</td>
          <td class="col-unit">${(hasDesc || hasRate) ? escapeHtml(item.unit || '') : ''}</td>
          <td class="col-rate">${hasRate ? formatMoney(item.rate) : ''}</td>
          <td class="col-qty">${(hasDesc || hasRate) ? item.qty : ''}</td>
          <td class="col-amount">${lineTotal > 0 ? formatMoney(lineTotal) : ''}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Calculations Summary
    setText("prevTotal", formatMoney(calcData.subtotal));

    const vatLabel = document.getElementById("prevVatLabel");
    if (vatLabel) {
      vatLabel.textContent = `VAT(${invoiceData.financials.vatRate}%)`;
    }
    setText("prevVatAmount", formatMoney(calcData.vatAmount));
    setText("prevGrandTotal", formatMoney(calcData.grandTotal));
    setText("prevPaid", formatMoney(calcData.paid));
    setText("prevBalance", formatMoney(calcData.balance));

    // Bank Details
    // Bank 1 (HNB)
    setText("prevB1AccNo", invoiceData.banks.bank1.accountNo);
    setText("prevB1Bank", invoiceData.banks.bank1.bank);
    setText("prevB1BankCode", invoiceData.banks.bank1.bankCode);
    setText("prevB1Branch", invoiceData.banks.bank1.branch);
    setText("prevB1BranchCode", invoiceData.banks.bank1.branchCode);
    setText("prevB1Swift", invoiceData.banks.bank1.swiftCode);

    // Bank 2 (NTB)
    setText("prevB2AccNo", invoiceData.banks.bank2.accountNo);
    setText("prevB2Bank", invoiceData.banks.bank2.bank);
    setText("prevB2BankCode", invoiceData.banks.bank2.bankCode);
    setText("prevB2Branch", invoiceData.banks.bank2.branch);
    setText("prevB2BranchCode", invoiceData.banks.bank2.branchCode);
    setText("prevB2Swift", invoiceData.banks.bank2.swiftCode);

    // Bank 3 (Commercial)
    setText("prevB3AccNo", invoiceData.banks.bank3.accountNo);
    setText("prevB3Bank", invoiceData.banks.bank3.bank);
    setText("prevB3BankCode", invoiceData.banks.bank3.bankCode);
    setText("prevB3Branch", invoiceData.banks.bank3.branch);
    setText("prevB3BranchCode", invoiceData.banks.bank3.branchCode);
    setText("prevB3Swift", invoiceData.banks.bank3.swiftCode);

    // Terms
    setText("prevTermValidity", invoiceData.terms.validity);
    setText("prevTermDelivery", invoiceData.terms.delivery);
    setText("prevTermPayment", invoiceData.terms.paymentTerms);
    setText("prevTermWarranty", invoiceData.terms.warranty);
    setText("prevTermNote", invoiceData.terms.note);
  }

  function setImageSrc(id, src) {
    const el = document.getElementById(id);
    if (el && src && el.getAttribute('data-curr-src') !== src) {
      el.setAttribute('data-curr-src', src);
      el.src = src;
    }
  }

  function formatDate(dStr) {
    if (!dStr) return "";
    try {
      const parts = dStr.split('-');
      if (parts.length === 3) {
        // Return DD/MM/YYYY
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    } catch (e) { }
    return dStr;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Export & Import
  function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(invoiceData, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `Eximius_Proforma_${(invoiceData.meta.refNo || 'Invoice').replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const imported = JSON.parse(event.target.result);
        invoiceData = Object.assign({}, defaultInvoiceData, imported);
        saveData();
        renderForm();
        updateCalculationsAndPreview();
        alert("Invoice JSON loaded successfully!");
      } catch (err) {
        alert("Invalid JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // reset
  }

  // Expose global methods for inline events
  window.EximiusApp = {
    addItem: function () {
      invoiceData.items.push({
        no: invoiceData.items.length + 1,
        desc: "",
        unit: "Nos",
        rate: 0,
        qty: 1
      });
      saveData();
      renderItemsEditor();
      updateCalculationsAndPreview();
    },

    removeItem: function (idx) {
      if (invoiceData.items.length <= 1) {
        // Clear instead of removing last item
        invoiceData.items[0] = { no: 1, desc: "", unit: "Nos", rate: 0, qty: 1 };
      } else {
        invoiceData.items.splice(idx, 1);
      }
      saveData();
      renderItemsEditor();
      updateCalculationsAndPreview();
    },

    duplicateItem: function (idx) {
      const target = invoiceData.items[idx];
      if (!target) return;
      const clone = Object.assign({}, target);
      invoiceData.items.splice(idx + 1, 0, clone);
      saveData();
      renderItemsEditor();
      updateCalculationsAndPreview();
    },

    updateItemProp: function (idx, prop, value) {
      if (invoiceData.items[idx]) {
        if (prop === 'rate' || prop === 'qty') {
          invoiceData.items[idx][prop] = Number(value) || 0;
        } else {
          invoiceData.items[idx][prop] = value;
        }
        saveData();
        // Update only calculations and preview for high performance typing
        updateCalculationsAndPreview();

        // Update row total input without full rerender
        const itemCards = document.querySelectorAll(".item-card");
        if (itemCards[idx]) {
          const rowTotalInput = itemCards[idx].querySelectorAll("input")[3];
          if (rowTotalInput) {
            const lineTotal = (Number(invoiceData.items[idx].rate) || 0) * (Number(invoiceData.items[idx].qty) || 0);
            rowTotalInput.value = formatMoney(lineTotal);
          }
        }
      }
    }
  };

  // Launch on DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
