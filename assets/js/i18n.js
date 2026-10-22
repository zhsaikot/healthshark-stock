/**
 * Health Shark Stock & Management System
 * Bilingual Localization (English & বাংলা)
 */

const translations = {
  en: {
    // Brand & Header
    brandName: "Health Shark",
    brandSubtitle: "Stock & Business Management",
    welcomeUser: "Welcome, Manager",
    liveStatus: "Live & Persistent",

    // Navigation Tabs
    navDashboard: "Dashboard",
    navStock: "Stock Inventory",
    navExpenses: "Costing & Expenses",
    navIncome: "Income & Profit",
    navEmployees: "Employees",
    navInvoice: "Invoice Generator",
    navCalculator: "Calculator",
    navReports: "Monthly Reports",

    // Filter Bar
    filterMonth: "Filter Month",
    filterYear: "Year",
    allMonths: "All Months",
    allCategories: "All Categories",
    searchPlaceholder: "Search by name, category or ID...",

    // Top KPIs / Cards
    kpiStockValue: "Total Stock Value",
    kpiStockValueSub: "Current inventory holding cost",
    kpiLowStock: "Low Stock Alerts",
    kpiLowStockSub: "Items below minimum threshold",
    kpiIncome: "Monthly Income",
    kpiIncomeSub: "Total revenue recorded",
    kpiExpense: "Monthly Expenses",
    kpiExpenseSub: "Operating & raw material costs",
    kpiNetProfit: "Net Profit / Loss",
    kpiNetProfitSub: "Income minus total expenses",
    profitMargin: "Profit Margin",

    // Dashboard Sections
    urgentRestockTitle: "Urgent Restock Needed",
    urgentRestockSub: "Items that need immediate kitchen/store restocking",
    financialTrendsTitle: "Financial Performance Overview",
    financialTrendsSub: "Comparison of Income vs Expenses",
    stockDistributionTitle: "Stock Category Breakdown",
    stockDistributionSub: "Inventory value grouped by category",
    recentActivityTitle: "Recent Activity Log",
    noLowStockMsg: "Great! All stock levels are currently healthy.",
    viewAllStock: "View All Stock",

    // Stock Tab
    stockTitle: "Inventory & Raw Materials",
    stockSubtitle: "Monitor all food items, raw ingredients and packaging stock",
    btnAddNewItem: "Add New Item",
    btnQuickStockIn: "Stock In (+)",
    btnQuickStockOut: "Stock Out (-)",
    tabAllItems: "All Items",
    tabRawMaterials: "Raw Ingredients",
    tabFinishedFood: "Finished Food",
    tabPackaging: "Packaging & Boxes",

    // Stock Table Headers
    thItemName: "Item Name",
    thCategory: "Category",
    thUnit: "Unit",
    thCurrentStock: "Current Qty",
    thMinThreshold: "Min Level",
    thCostPrice: "Unit Cost",
    thSellingPrice: "Sell Price",
    thTotalValue: "Total Value",
    thStatus: "Status",
    thActions: "Actions",

    // Status Badges
    statusInStock: "In Stock",
    statusLowStock: "Low Stock",
    statusOutOfStock: "Out of Stock",

    // Expenses Tab
    expensesTitle: "Costing & Expense Log",
    expensesSubtitle: "Track kitchen bazaar, utilities, rent, delivery and supplies",
    btnAddExpense: "Record New Expense",
    thExpenseDate: "Date",
    thExpenseCategory: "Category",
    thExpenseTitle: "Description / Reason",
    thExpenseVendor: "Paid To / Vendor",
    thExpenseMethod: "Payment Method",
    thExpenseAmount: "Amount (৳)",
    totalExpensesLabel: "Total Monthly Expenses",

    // Income & Profit Tab
    incomeTitle: "Sales & Profit Analysis",
    incomeSubtitle: "Daily sales revenue, costs and real-time net profit calculation",
    btnAddSale: "Record Sale",
    thSaleDate: "Date",
    thSaleItem: "Item / Service",
    thSaleQty: "Qty Sold",
    thSaleTotal: "Total Sale (৳)",
    thSaleCost: "Estimated Cost (৳)",
    thSaleProfit: "Net Gain (৳)",
    salesSummaryNote: "Real-time calculation: Net Profit = Total Revenue - Total Expenses",

    // Employees Tab
    employeesTitle: "Staff & Payroll Roster",
    employeesSubtitle: "Manage kitchen team, chef, delivery riders and salary records",
    btnAddEmployee: "Add New Employee",
    thEmpName: "Staff Name",
    thEmpRole: "Designation / Role",
    thEmpPhone: "Phone Number",
    thEmpSalary: "Monthly Salary (৳)",
    thEmpJoinDate: "Joined Date",
    thEmpStatus: "Status",
    statusActive: "Active",
    statusLeave: "On Leave",
    statusResigned: "Resigned",
    totalPayrollLabel: "Total Monthly Payroll Commitment",
    btnRecordPayrollExpense: "Post Payroll to Expenses",

    // Reports & Export/Import Tab
    reportsTitle: "Reports, Backup & Export",
    reportsSubtitle: "Easily generate reports for the business owner or restore backups",
    monthlyReportCardTitle: "Executive Monthly Report for Owner",
    monthlyReportCardSub: "Includes complete financial statement and stock ledger",
    btnDownloadPDF: "Download PDF Report",
    btnExportCSV: "Export to CSV (Excel)",
    btnExportJSON: "Download JSON Backup",
    btnImportBackup: "Restore / Import Data",
    dataSafetyNotice: "All records are securely saved on your device. We recommend downloading a JSON backup at the end of every month.",

    // Modals
    modalAddItemTitle: "Add New Inventory Item",
    modalEditItemTitle: "Edit Inventory Item",
    modalStockInTitle: "Quick Stock In (+ Add Stock)",
    modalStockOutTitle: "Quick Stock Out (- Consume/Waste)",
    modalAddExpenseTitle: "Record Business Expense",
    modalAddSaleTitle: "Record Sales Revenue",
    modalAddEmployeeTitle: "Add Staff Member",
    modalEditEmployeeTitle: "Edit Staff Member",
    modalImportTitle: "Import / Restore Data",
    modalExportTitle: "Export Business & Stock Report",
    labelSelectReportType: "Select Report Type",
    optReportStock: "Stock & Inventory (Live Current Status)",
    optReportSales: "Sales & Food Orders",
    optReportExpenses: "Costing & Expenses",
    optReportProfit: "Profit & Loss (P&L) Summary",
    optReportMaster: "Complete Master Monthly Statement",
    labelSelectPeriod: "Select Period / Date",
    optPeriodToday: "Today's Live Date (Live Inventory)",
    optPeriodMonth: "Specific Month",
    optPeriodAll: "All Time / Annual",
    labelSelectFormat: "Select Export Format",
    optFormatPdf: "PDF Document (.pdf - Formatted for Owner)",
    optFormatCsv: "Excel / CSV Spreadsheet (.csv)",
    btnDownloadReport: "Download Report",

    // Form Labels
    labelItemName: "Item Name (English / বাংলা)",
    labelCategory: "Category",
    labelUnit: "Unit of Measurement",
    labelCurrentQty: "Starting / Current Quantity",
    labelThreshold: "Low Stock Alert Threshold",
    labelUnitCost: "Purchase Price / Unit Cost (৳)",
    labelSellingPrice: "Selling Price (৳ - Optional for ingredients)",
    labelItemType: "Type",
    typeRaw: "Raw Ingredient / Material",
    typeFinished: "Finished Food Menu Item",
    typePackaging: "Packaging & Box",
    labelExpenseDate: "Expense Date",
    labelExpenseAmount: "Expense Amount (৳)",
    labelExpenseTitle: "Expense Purpose / Description",
    labelExpenseCategory: "Expense Category",
    labelExpenseVendor: "Paid To / Vendor Name",
    labelExpenseMethod: "Payment Method",
    labelSaleDate: "Sale Date",
    labelSaleItem: "Food Item Sold",
    labelSaleQty: "Quantity Sold",
    labelSaleAmount: "Total Sale Amount (৳)",
    labelSalePaymentMethod: "Payment Method",
    labelStaffName: "Full Name",
    labelStaffRole: "Designation / Role",
    labelStaffPhone: "Phone Number",
    labelStaffSalary: "Monthly Salary (৳)",
    labelStaffJoinDate: "Joining Date",
    labelStaffStatus: "Status",
    labelQuantityToChange: "Quantity",
    labelReasonNote: "Reason / Notes (e.g. Daily Cooking, Kitchen Wastage, Bazaar)",

    // Buttons & Actions
    btnSave: "Save",
    btnUpdate: "Update",
    btnCancel: "Cancel",
    btnDelete: "Delete",
    btnConfirm: "Confirm",
    btnRestock: "Restock",
    btnClose: "Close",

    // Categories (Food & Stock)
    catRaw: "Raw Ingredients",
    catSnacks: "Snacks & Special Bites",
    catBurgers: "Burgers & Sandwiches",
    catNoodles: "Noodles & Pasta",
    catMeals: "Pre-Order Meals & Combos",
    catDesserts: "Baked Goods & Desserts",
    catPackaging: "Packaging & Boxes",
    catBeverage: "Beverages & Drinks",

    // Expense Categories
    expRawBazaar: "Raw Material & Bazaar",
    expUtility: "Utilities (Gas, Electric, Water)",
    expRent: "Kitchen & Shop Rent",
    expPackaging: "Packaging & Printing",
    expDelivery: "Delivery & Transport",
    expPayroll: "Staff Salaries & Food",
    expEquipment: "Kitchen Equipment & Repairs",
    expMisc: "Miscellaneous / Other",

    // Payment Methods
    payCash: "Cash",
    payBkash: "bKash",
    payNagad: "Nagad",
    payBank: "Bank Transfer",

    // Units
    unitKg: "kg (কেজি)",
    unitGm: "gm (গ্রাম)",
    unitLitre: "Litre (লিটার)",
    unitPcs: "pcs (পিস)",
    unitPacket: "packet (প্যাকেট)",
    unitBox: "box (বক্স)",

    // Months
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],

    // Invoice Generator Tab
    invoiceTitle: "Invoice & Cash Memo Generator",
    invoiceSubtitle: "Generate customer bills, print cash memos, download PDFs, and sync with sales",
    invoiceResetForm: "New Form",
    customerInfoHeading: "Customer Details",
    invoiceNumber: "Invoice No",
    invoiceDate: "Date",
    customerName: "Customer Name",
    customerNamePlaceholder: "e.g. Saikot",
    customerPhone: "Phone Number",
    customerAddress: "Address / Table No / Delivery Location",
    orderType: "Order Type",
    typeDineIn: "Dine-in",
    typeTakeaway: "Takeaway",
    typeDelivery: "Home Delivery",
    addItemHeading: "Select Food Items",
    selectFoodItem: "Select from Menu",
    itemCustomName: "Item Name (Custom)",
    itemPrice: "Price (Tk.)",
    itemQuantity: "Quantity",
    invoiceColItem: "Item",
    invoiceColPrice: "Rate (Tk.)",
    invoiceColQty: "Qty",
    invoiceColTotal: "Total (Tk.)",
    invoiceColAction: "Delete",
    invoiceNotes: "Notes / Special Requests",
    invoiceSummaryHeading: "Bill Summary",
    invSubtotal: "Subtotal:",
    invDiscount: "Discount (Tk.):",
    invDeliveryFee: "Delivery Fee (Tk.):",
    invGrandTotal: "Grand Total:",
    invPaidAmount: "Paid (Tk.)",
    invDueAmount: "Due (Tk.)",
    invPaymentMethod: "Payment Method",
    invSyncSalesCheckbox: "Automatically record this order in Sales Register",
    btnSaveAndPrintInvoice: "Save & Print Memo",
    btnSaveOnlyInvoice: "Save Only",
    btnUpdateAndPrintInvoice: "Update & Print Memo",
    btnUpdateOnlyInvoice: "Update Only",
    editInvoice: "Edit Invoice",
    cancelEdit: "Cancel Edit",
    editingInvoiceBanner: "Editing Invoice",
    toastInvoiceUpdated: "Invoice updated successfully!",
    invoicesHistoryTitle: "Recent Invoices & Cash Memos",
    thInvNumber: "Invoice No",
    thInvDate: "Date",
    thInvCustomer: "Customer",
    thInvItems: "Items",
    thInvTotal: "Total (Tk.)",
    thInvPaid: "Paid",
    thInvDue: "Due",
    thInvAction: "Action",
    invoiceGenTitle: "Invoice & Cash Memo Generator",
    invoiceGenSub: "Generate customer bills, cash memos, and print receipts instantly",
    invoiceDetails: "Customer & Order Details",
    invoiceNo: "Invoice No",
    invoiceItemSelect: "Select Menu / Stock Item",
    invoiceCustomItem: "Or Custom Food Item Name",
    invoiceItemQty: "Quantity",
    invoiceItemPrice: "Price / Rate (Tk.)",
    btnAddInvoiceItem: "Add Item",
    invoiceItemsList: "Billed Items",
    invoiceSubtotal: "Subtotal",
    invoiceDiscount: "Discount (Tk.)",
    invoiceDeliveryCharge: "Delivery Fee (Tk.)",
    invoiceGrandTotal: "Grand Total",
    invoicePaid: "Paid Amount",
    invoiceDue: "Due Amount",
    invoicePaymentMethod: "Payment Method",
    invoiceNote: "Order Notes",
    btnPrintInvoice: "Print / PDF Receipt",
    btnSaveInvoiceToSales: "Save to Sales Ledger",
    btnClearInvoice: "New / Clear Invoice",
    recentInvoicesTitle: "Recent Invoices & Cash Memos",
    recentInvoicesSub: "Archived customer receipts saved in local storage",

    // Calculator Tab
    calcTitle: "Business Calculator",
    calcSubtitle: "Accurate daily arithmetic and business calculations with keyboard support and history tape",
    calcHistoryTapeTitle: "Calculation History & Memory",
    calcClearTape: "Clear",
    calculatorTitle: "Business Calculator",
    calculatorSub: "Quick operational arithmetic & business margin calculation",
    calcHistory: "Calculation History",
    calcClearHistory: "Clear Tape",
    calcCustomNotice: "Custom Business Formula Slot: Send your custom formula rules to plug in specialized food costing recipes here anytime.",
    noItemsAddedYet: "No items added yet. Choose a menu item above and click Add Item.",
    noInvoicesYet: "No invoices generated yet. Create customer bills above to build invoice history.",
    noCalcHistoryYet: "No recent calculations. Key in numbers to see tape history.",
    statusPaid: "Paid",
    statusDue: "Due",

    // Toasts & Messages
    toastItemSaved: "Item saved successfully!",
    toastItemDeleted: "Item deleted.",
    toastStockAdjusted: "Stock updated successfully!",
    toastExpenseSaved: "Expense recorded successfully!",
    toastSaleSaved: "Sale recorded successfully!",
    toastStaffSaved: "Staff member saved successfully!",
    toastDataRestored: "Data successfully restored from backup!",
    toastInvalidData: "Invalid backup file format. Please check the file.",
    confirmDelete: "Are you sure you want to delete this record?",
    confirmRestore: "Restoring data will replace current records. Are you sure?",
    payrollPostedSuccess: "Monthly payroll recorded into expenses successfully!",
    emptyTable: "No records found for the selected month/category.",
    languageName: "English"
  },

  bn: {
    // Brand & Header
    brandName: "হেল্থ শার্ক",
    brandSubtitle: "স্টক ও ব্যবসা ব্যবস্থাপনা ড্যাশবোর্ড",
    welcomeUser: "স্বাগতম, ম্যানেজার",
    liveStatus: "সচল ও নিরাপদ ডাটা",

    // Navigation Tabs
    navDashboard: "ড্যাশবোর্ড",
    navStock: "স্টক ইনভেন্টরি",
    navExpenses: "খরচ ও ব্যয়",
    navIncome: "বিক্রি ও লাভ",
    navEmployees: "কর্মচারীবৃন্দ",
    navInvoice: "ইনভয়েস ও মেমো",
    navCalculator: "ক্যালকুলেটর",
    navReports: "মাসিক রিপোর্ট",

    // Filter Bar
    filterMonth: "মাস নির্বাচন",
    filterYear: "বছর",
    allMonths: "সকল মাস",
    allCategories: "সকল ক্যাটাগরি",
    searchPlaceholder: "নাম, ক্যাটাগরি বা বিবরণ দিয়ে খুঁজুন...",

    // Top KPIs / Cards
    kpiStockValue: "মোট মজুদ পণ্যের মূল্য",
    kpiStockValueSub: "দোকান ও কিচেনের বর্তমান মালামাল",
    kpiLowStock: "কম স্টক সতর্কতা",
    kpiLowStockSub: "যেসব পণ্য দ্রুত কেনা প্রয়োজন",
    kpiIncome: "চলতি মাসের আয় / বিক্রি",
    kpiIncomeSub: "মোট প্রাপ্ত টাকা",
    kpiExpense: "চলতি মাসের মোট খরচ",
    kpiExpenseSub: "কাঁচামাল, বিল ও অন্যান্য ব্যয়",
    kpiNetProfit: "নিট মুনাফা / লাভ",
    kpiNetProfitSub: "আয় থেকে মোট খরচ বাদ দিয়ে",
    profitMargin: "প্রফিট মার্জিন",

    // Dashboard Sections
    urgentRestockTitle: "জরুরিভাবে স্টক বাড়াতে হবে",
    urgentRestockSub: "যেসব কাঁচামাল বা খাবার সর্বনিম্ন সীমার নিচে চলে গেছে",
    financialTrendsTitle: "আয় ও ব্যয়ের তুলনা",
    financialTrendsSub: "মাসিক আয় ও ব্যয়ের তুলনামূলক গ্রাফ",
    stockDistributionTitle: "স্টকের ক্যাটাগরি বিন্যাস",
    stockDistributionSub: "কোন ক্যাটাগরিতে কত টাকার মাল আছে",
    recentActivityTitle: "সাম্প্রতিক কার্যক্রম",
    noLowStockMsg: "আলহামদুলিল্লাহ! বর্তমানে কোনো পণ্যের ঘাটতি নেই।",
    viewAllStock: "সব স্টক দেখুন",

    // Stock Tab
    stockTitle: "মজুদ মালামাল ও কাঁচামাল",
    stockSubtitle: "খাবার তৈরির কাঁচামাল, তৈরি খাদ্য ও প্যাকেজিং বক্সের হিসাব",
    btnAddNewItem: "নতুন আইটেম যোগ করুন",
    btnQuickStockIn: "স্টক বাড়ান (+)",
    btnQuickStockOut: "স্টক কমান / ব্যবহার (-)",
    tabAllItems: "সকল মালামাল",
    tabRawMaterials: "কাঁচামাল",
    tabFinishedFood: "তৈরি খাবার",
    tabPackaging: "বক্স ও প্যাকেট",

    // Stock Table Headers
    thItemName: "পণ্যের নাম",
    thCategory: "ক্যাটাগরি",
    thUnit: "একক",
    thCurrentStock: "বর্তমান মজুদ",
    thMinThreshold: "সতর্কতা সীমা",
    thCostPrice: "ক্রয়মূল্য",
    thSellingPrice: "বিক্রয়মূল্য",
    thTotalValue: "মোট মূল্য",
    thStatus: "অবস্থা",
    thActions: "অ্যাকশন",

    // Status Badges
    statusInStock: "পর্যাপ্ত আছে",
    statusLowStock: "স্টক কম!",
    statusOutOfStock: "স্টক শেষ!",

    // Expenses Tab
    expensesTitle: "খরচ ও ব্যয়ের হিসাব",
    expensesSubtitle: "কাঁচামাল বাজার, গ্যাস, বিদ্যুৎ, দোকান ভাড়া ও ডেলিভারি খরচ",
    btnAddExpense: "নতুন খরচ যোগ করুন",
    thExpenseDate: "তারিখ",
    thExpenseCategory: "ক্যাটাগরি",
    thExpenseTitle: "বিবরণ / কারণ",
    thExpenseVendor: "প্রাপক / দোকান",
    thExpenseMethod: "পেমেন্ট মাধ্যম",
    thExpenseAmount: "পরিমাণ (৳)",
    totalExpensesLabel: "চলতি মাসের মোট খরচ",

    // Income & Profit Tab
    incomeTitle: "বিক্রি ও লাভ-ক্ষতির হিসাব",
    incomeSubtitle: "প্রতিদিনের বিক্রি এবং তাৎক্ষণিক নিট মুনাফা পর্যালোচনা",
    btnAddSale: "বিক্রি লিপিবদ্ধ করুন",
    thSaleDate: "তারিখ",
    thSaleItem: "খাবারের নাম",
    thSaleQty: "পরিমাণ",
    thSaleTotal: "বিক্রি মূল্য (৳)",
    thSaleCost: "আনুমানিক খরচ (৳)",
    thSaleProfit: "লাভ (৳)",
    salesSummaryNote: "স্বয়ংক্রিয় হিসাব: নিট লাভ = মোট বিক্রি - মোট খরচ",

    // Employees Tab
    employeesTitle: "কর্মচারীদের তথ্য ও বেতন তালিকা",
    employeesSubtitle: "কিচেন শেফ, সহকারী, ডেলিভারি স্টাফদের বিস্তারিত ও মাসিক বেতন",
    btnAddEmployee: "নতুন স্টাফ যোগ করুন",
    thEmpName: "কর্মচারীর নাম",
    thEmpRole: "পদবি / দায়িত্ব",
    thEmpPhone: "মোবাইল নম্বর",
    thEmpSalary: "মাসিক বেতন (৳)",
    thEmpJoinDate: "যোগদানের তারিখ",
    thEmpStatus: "অবস্থা",
    statusActive: "কর্মরত",
    statusLeave: "ছুটিতে",
    statusResigned: "অব্যাহতি প্রাপ্ত",
    totalPayrollLabel: "মাসের মোট বেতনের পরিমাণ",
    btnRecordPayrollExpense: "বেতনের টাকা খরচে যুক্ত করুন",

    // Reports & Export/Import Tab
    reportsTitle: "রিপোর্ট ও ডাটা ব্যাকআপ",
    reportsSubtitle: "মালিককে মাসিক রিপোর্ট দেওয়া এবং সম্পূর্ণ ডাটা সংরক্ষণ করার ব্যবস্থা",
    monthlyReportCardTitle: "মালিকের জন্য মাসিক পূর্ণাঙ্গ রিপোর্ট",
    monthlyReportCardSub: "আয়, ব্যয়, নিট লাভ এবং বর্তমান স্টকের পূর্ণ বিবরণী",
    btnDownloadPDF: "PDF রিপোর্ট ডাউনলোড",
    btnExportCSV: "CSV (এক্সেল) ফাইল ডাউনলোড",
    btnExportJSON: "সম্পূর্ণ ব্যাকআপ (JSON) ডাউনলোড",
    btnImportBackup: "ডাটা রিস্টোর / আপলোড",
    dataSafetyNotice: "সকল তথ্য আপনার ডিভাইসেই সুরক্ষিত থাকে। প্রতি মাস শেষে একটি JSON ব্যাকআপ ডাউনলোড করে রাখা উত্তম।",

    // Modals
    modalAddItemTitle: "নতুন পণ্য / কাঁচামাল যুক্ত করুন",
    modalEditItemTitle: "পণ্যের তথ্য পরিবর্তন",
    modalStockInTitle: "স্টক যোগ করুন (+ মাল গ্রহণ)",
    modalStockOutTitle: "স্টক ব্যবহার / অপচয় (- মাল কমেছে)",
    modalAddExpenseTitle: "ব্যয় বা খরচের এন্ট্রি",
    modalAddSaleTitle: "খাবার বিক্রির হিসাব এন্ট্রি",
    modalAddEmployeeTitle: "নতুন কর্মচারীর তথ্য যুক্ত করুন",
    modalEditEmployeeTitle: "কর্মচারীর তথ্য এডিট করুন",
    modalImportTitle: "ডাটা রিস্টোর বা ব্যাকআপ আপলোড",
    modalExportTitle: "রিপোর্ট এক্সপোর্ট ও ডাউনলোড",
    labelSelectReportType: "রিপোর্টের ধরণ নির্বাচন করুন",
    optReportStock: "স্টক ও কাঁচামাল রিপোর্ট (আজকের ফ্রেশ স্টক)",
    optReportSales: "খাবার বিক্রি ও অর্ডারের হিসাব",
    optReportExpenses: "খরচ ও ব্যয়ের খতিয়ান",
    optReportProfit: "লাভ-ক্ষতি ও আর্থিক বিবরণী (P&L)",
    optReportMaster: "সার্বিক মাসিক পূর্ণাঙ্গ স্টেটমেন্ট",
    labelSelectPeriod: "সময়সীমা নির্বাচন করুন",
    optPeriodToday: "আজকের দিন (তাত্ক্ষণিক বর্তমান স্টক)",
    optPeriodMonth: "নির্দিষ্ট মাস",
    optPeriodAll: "সকল মাস / সার্বক্ষণিক",
    labelSelectFormat: "ফাইল ফরম্যাট নির্বাচন করুন",
    optFormatPdf: "PDF ডকুমেন্ট (.pdf - মালিককে পাঠানোর জন্য)",
    optFormatCsv: "এক্সেল / CSV স্প্রেডশিট (.csv)",
    btnDownloadReport: "রিপোর্ট ডাউনলোড করুন",

    // Form Labels
    labelItemName: "পণ্যের নাম (বাংলা / ইংরেজি)",
    labelCategory: "ক্যাটাগরি",
    labelUnit: "পরিমাপক একক",
    labelCurrentQty: "বর্তমান পরিমাণ",
    labelThreshold: "সর্বনিম্ন সতর্কতা সীমা",
    labelUnitCost: "প্রতি এককের কেনা মূল্য (৳)",
    labelSellingPrice: "বিক্রয়মূল্য (৳ - কাঁচামালের জন্য ঐচ্ছিক)",
    labelItemType: "পণ্যের ধরণ",
    typeRaw: "কাঁচামাল / রান্নার উপাদান",
    typeFinished: "তৈরি খাবার মেনু",
    typePackaging: "প্যাকেজিং বক্স বা ব্যাগ",
    labelExpenseDate: "খরচের তারিখ",
    labelExpenseAmount: "খরচের টাকা (৳)",
    labelExpenseTitle: "খরচের বিবরণ / কারণ",
    labelExpenseCategory: "খরচের ক্যাটাগরি",
    labelExpenseVendor: "কাকে দেওয়া হলো / দোকানের নাম",
    labelExpenseMethod: "পেমেন্টের মাধ্যম",
    labelSaleDate: "বিক্রির তারিখ",
    labelSaleItem: "বিক্রিকৃত খাবারের নাম",
    labelSaleQty: "বিক্রির পরিমাণ",
    labelSaleAmount: "মোট বিক্রয় মূল্য (৳)",
    labelSalePaymentMethod: "টাকা পাওয়ার মাধ্যম",
    labelStaffName: "পূর্ণ নাম",
    labelStaffRole: "পদবি / দায়িত্ব",
    labelStaffPhone: "মোবাইল নম্বর",
    labelStaffSalary: "মাসিক বেতন (৳)",
    labelStaffJoinDate: "যোগদানের তারিখ",
    labelStaffStatus: "অবস্থা",
    labelQuantityToChange: "পরিমাণ",
    labelReasonNote: "কারণ বা মন্তব্য (যেমন: দৈনিক রান্না, অপচয়, নতুন বাজার)",

    // Buttons & Actions
    btnSave: "সংরক্ষণ করুন",
    btnUpdate: "আপডেট করুন",
    btnCancel: "বাতিল",
    btnDelete: "মুছে ফেলুন",
    btnConfirm: "নিশ্চিত করুন",
    btnRestock: "মাল কিনুন",
    btnClose: "বন্ধ করুন",

    // Categories (Food & Stock)
    catRaw: "কাঁচামাল",
    catSnacks: "স্ন্যাকস ও স্পেশাল বাইটস",
    catBurgers: "বার্গার ও স্যান্ডউইচ",
    catNoodles: "নুডুলস ও পাস্তা",
    catMeals: "প্রি-অর্ডার মিল ও বিরিয়ানি",
    catDesserts: "মিষ্টান্ন ও ডেজার্ট",
    catPackaging: "বক্স ও প্যাকেট",
    catBeverage: "পানীয় ও ড্রিঙ্কস",

    // Expense Categories
    expRawBazaar: "কাঁচামাল ও বাজার",
    expUtility: "গ্যাস, বিদ্যুৎ ও পানি বিল",
    expRent: "দোকান / কিচেন ভাড়া",
    expPackaging: "বক্স ও প্যাকেজিং খরচ",
    expDelivery: "ডেলিভারি ও পরিবহন খরচ",
    expPayroll: "স্টাফ বেতন ও আপ্যায়ন",
    expEquipment: "যন্ত্রপাতি ক্রয় ও মেরামত",
    expMisc: "অন্যান্য বিবিধ খরচ",

    // Payment Methods
    payCash: "ক্যাশ (নগদ)",
    payBkash: "বিকাশ",
    payNagad: "নগদ (Nagad)",
    payBank: "ব্যাংক ট্রান্সফার",

    // Units
    unitKg: "কেজি",
    unitGm: "গ্রাম",
    unitLitre: "লিটার",
    unitPcs: "পিস",
    unitPacket: "প্যাকেট",
    unitBox: "বক্স",

    // Months
    months: [
      "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ],

    // Invoice Generator Tab
    invoiceTitle: "ইনভয়েস ও ক্যাশ মেমো জেনারেটর",
    invoiceSubtitle: "গ্রাহকের বিল তৈরি, মেমো প্রিন্ট বা পিডিএফ ডাউনলোড করুন এবং বিক্রিতে যুক্ত করুন",
    invoiceResetForm: "নতুন ফর্ম",
    customerInfoHeading: "গ্রাহকের বিবরণ",
    invoiceNumber: "ইনভয়েস নং",
    invoiceDate: "তারিখ",
    customerName: "গ্রাহকের নাম",
    customerNamePlaceholder: "e.g. Saikot",
    customerPhone: "মোবাইল নম্বর",
    customerAddress: "ঠিকানা / টেবিল নং / ডেলিভারি লোকেশন",
    orderType: "অর্ডারের ধরন",
    typeDineIn: "ডাইন-ইন (রেস্তোরাঁয়)",
    typeTakeaway: "পার্সেল (টেকঅ্যাওয়ে)",
    typeDelivery: "হোম ডেলিভারি",
    addItemHeading: "খাবারের আইটেম নির্বাচন",
    selectFoodItem: "মেনু থেকে নির্বাচন",
    itemCustomName: "নাম (কাস্টম)",
    itemPrice: "মূল্য (৳)",
    itemQuantity: "পরিমাণ",
    invoiceColItem: "আইটেম",
    invoiceColPrice: "দর (৳)",
    invoiceColQty: "পরিমাণ",
    invoiceColTotal: "মোট (৳)",
    invoiceColAction: "মুছুন",
    invoiceNotes: "মন্তব্য / বিশেষ অনুরোধ",
    invoiceSummaryHeading: "হিসাব বিবরণী",
    invSubtotal: "মোট খাদ্য মূল্য (Subtotal):",
    invDiscount: "ছাড় (Discount ৳):",
    invDeliveryFee: "ডেলিভারি চার্জ (৳):",
    invGrandTotal: "সর্বমোট (Grand Total):",
    invPaidAmount: "পরিশোধ (৳)",
    invDueAmount: "বকেয়া (৳)",
    invPaymentMethod: "পেমেন্ট মেথড",
    invSyncSalesCheckbox: "এই বিক্রির হিসাব স্বয়ংক্রিয়ভাবে সেলস রেজিস্টারে যুক্ত করুন",
    btnSaveAndPrintInvoice: "সংরক্ষণ ও মেমো প্রিন্ট করুন",
    btnSaveOnlyInvoice: "শুধু সংরক্ষণ করুন",
    btnUpdateAndPrintInvoice: "হালনাগাদ ও মেমো প্রিন্ট করুন",
    btnUpdateOnlyInvoice: "শুধু হালনাগাদ করুন",
    editInvoice: "ইনভয়েস সম্পাদনা",
    cancelEdit: "সম্পাদনা বাতিল",
    editingInvoiceBanner: "সম্পাদনা মোড: ইনভয়েস",
    toastInvoiceUpdated: "ইনভয়েস সফলভাবে হালনাগাদ করা হয়েছে!",
    invoicesHistoryTitle: "সাম্প্রতিক ইনভয়েস ও মেমো তালিকা",
    thInvNumber: "ইনভয়েস নং",
    thInvDate: "তারিখ",
    thInvCustomer: "গ্রাহক",
    thInvItems: "আইটেম সংখ্যা",
    thInvTotal: "মোট টাকা (৳)",
    thInvPaid: "পরিশোধ",
    thInvDue: "বকেয়া",
    thInvAction: "অ্যাকশন",
    invoiceGenTitle: "ইনভয়েস ও ক্যাশ মেমো জেনারেটর",
    invoiceGenSub: "সহজে গ্রাহকের বিল তৈরি, মেমো প্রিন্ট ও পিডিএফ ডাউনলোড করুন",
    invoiceDetails: "গ্রাহক ও অর্ডারের তথ্য",
    invoiceNo: "ইনভয়েস নং",
    invoiceItemSelect: "খাবার / মেনু আইটেম নির্বাচন",
    invoiceCustomItem: "অথবা কাস্টম খাবারের নাম",
    invoiceItemQty: "পরিমাণ",
    invoiceItemPrice: "মূল্য / দর (৳)",
    btnAddInvoiceItem: "বিলে যুক্ত করুন",
    invoiceItemsList: "যুক্ত করা খাবারের তালিকা",
    invoiceSubtotal: "সাবটোটাল",
    invoiceDiscount: "ছাড় / ডিসকাউন্ট (৳)",
    invoiceDeliveryCharge: "ডেলিভারি চার্জ (৳)",
    invoiceGrandTotal: "সর্বমোট বিল",
    invoicePaid: "জমা / পরিশোধ",
    invoiceDue: "বাকি টাকা",
    invoicePaymentMethod: "পরিশোধের মাধ্যম",
    invoiceNote: "বিশেষ নোট / মন্তব্য",
    btnPrintInvoice: "প্রিন্ট / মেমো ডাউনলোড",
    btnSaveInvoiceToSales: "বিক্রি হিসেবে জমা করুন",
    btnClearInvoice: "নতুন ইনভয়েস / ক্লিয়ার",
    recentInvoicesTitle: "সাম্প্রতিক ইনভয়েস ও রসিদ",
    recentInvoicesSub: "পূর্বে তৈরি করা ক্যাশ মেমোর তালিকা ও হিস্টোরি",

    // Calculator Tab
    calcTitle: "হিসাব ক্যালকুলেটর",
    calcSubtitle: "দৈনন্দিন হিসাব-নিকাশ, যোগ-বিয়োগের নির্ভুল ক্যালকুলেটর (কীবোর্ড সাপোর্ট ও হিস্ট্রি টেপ সহ)",
    calcHistoryTapeTitle: "হিস্ট্রি ও ক্যালকুলেশন মেমোরি",
    calcClearTape: "মুছুন",
    calculatorTitle: "হিসাব ক্যালকুলেটর",
    calculatorSub: "দৈনন্দিন যোগ-বিয়োগ ও হিসাব নিকাশের স্মার্ট ক্যালকুলেটর",
    calcHistory: "পূর্ববর্তী হিসাবের হিস্টোরি",
    calcClearHistory: "হিস্টোরি মুছুন",
    calcCustomNotice: "কাস্টম ফর্মুলা স্লট: পরবর্তীতে আপনার ব্যবসার কস্টিং বা লাভ-ক্ষতির স্পেশাল ফর্মুলা দিলে তা এখানে যুক্ত করে দেওয়া হবে।",
    noItemsAddedYet: "এখনো কোনো আইটেম যোগ করা হয়নি। উপরের মেনু থেকে খাবার নির্বাচন করে যুক্ত করুন।",
    noInvoicesYet: "এখনো কোনো ইনভয়েস তৈরি করা হয়নি। উপরে গ্রাহকের বিল তৈরি করলে এখানে সংরক্ষিত থাকবে।",
    noCalcHistoryYet: "কোনো পূর্ববর্তী হিসাব নেই। ক্যালকুলেটরে সংখ্যা টাইপ করলে হিস্ট্রি দেখতে পাবেন।",
    statusPaid: "পরিশোধিত",
    statusDue: "বকেয়া",

    // Toasts & Messages
    toastItemSaved: "পণ্যটি সফলভাবে সংরক্ষিত হয়েছে!",
    toastItemDeleted: "পণ্যটি মুছে ফেলা হয়েছে।",
    toastStockAdjusted: "স্টক সফলভাবে আপডেট করা হয়েছে!",
    toastExpenseSaved: "খরচের হিসাব সংরক্ষণ করা হয়েছে!",
    toastSaleSaved: "বিক্রির হিসাব যোগ করা হয়েছে!",
    toastStaffSaved: "কর্মচারীর তথ্য সংরক্ষণ করা হয়েছে!",
    toastDataRestored: "সফলভাবে ব্যাকআপ থেকে ডাটা ফিরিয়ে আনা হয়েছে!",
    toastInvalidData: "ভুল ব্যাকআপ ফাইল ফরম্যাট। দয়া করে সঠিক ফাইল দিন।",
    confirmDelete: "আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?",
    confirmRestore: "ডাটা রিস্টোর করলে বর্তমান তথ্যের উপর নতুন ডাটা প্রতিস্থাপিত হবে। আপনি কি নিশ্চিত?",
    payrollPostedSuccess: "এই মাসের স্টাফদের বেতন সফলভাবে খরচ তালিকায় যুক্ত হয়েছে!",
    emptyTable: "নির্বাচিত মাস বা ক্যাটাগরিতে কোনো তথ্য পাওয়া যায়নি।",
    languageName: "বাংলা"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem("hs_stock_lang") || "en"; // Default to English on initial entry
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem("hs_stock_lang", lang);
      this.applyTranslations();
      window.dispatchEvent(new CustomEvent("language-changed", { detail: { lang } }));
    }
  }

  t(key) {
    const langObj = translations[this.currentLang] || translations.en;
    return langObj[key] || translations.en[key] || key;
  }

  getMonthName(monthIndex) {
    const list = translations[this.currentLang].months || translations.en.months;
    return list[monthIndex] || "";
  }

  applyTranslations() {
    document.documentElement.lang = this.currentLang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = this.t(key);
      if (text) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const text = this.t(key);
      if (text) el.placeholder = text;
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      const text = this.t(key);
      if (text) el.title = text;
    });

    // Update active state of language toggle buttons
    const bnBtn = document.getElementById("lang-btn-bn");
    const enBtn = document.getElementById("lang-btn-en");
    if (bnBtn && enBtn) {
      if (this.currentLang === "bn") {
        bnBtn.classList.add("bg-brand-700", "text-white", "shadow-sm");
        bnBtn.classList.remove("text-gray-600", "dark:text-gray-300");
        enBtn.classList.remove("bg-brand-700", "text-white", "shadow-sm");
        enBtn.classList.add("text-gray-600", "dark:text-gray-300");
      } else {
        enBtn.classList.add("bg-brand-700", "text-white", "shadow-sm");
        enBtn.classList.remove("text-gray-600", "dark:text-gray-300");
        bnBtn.classList.remove("bg-brand-700", "text-white", "shadow-sm");
        bnBtn.classList.add("text-gray-600", "dark:text-gray-300");
      }
    }
  }

  formatCurrency(amount) {
    const num = Number(amount) || 0;
    if (num < 0) {
      const formatted = Math.abs(num).toLocaleString("en-BD", { maximumFractionDigits: 0 });
      return `-৳${formatted}`;
    }
    const formatted = num.toLocaleString("en-BD", { maximumFractionDigits: 0 });
    return `৳${formatted}`;
  }
}

window.hsI18n = new I18nManager();
