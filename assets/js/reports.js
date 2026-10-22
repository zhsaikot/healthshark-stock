/**
 * Health Shark Stock & Management System
 * Enhanced Reports Engine: PDF, CSV, and JSON Export / Import
 * With complete Unicode text sanitization and multi-category report generator
 */

class ReportsEngine {
  constructor() {
    this.logoBase64 = null;
    this.loadLogo();
  }

  // Preload logo for PDF embedding
  async loadLogo() {
    try {
      const response = await fetch("assets/images/logo.png");
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        this.logoBase64 = reader.result;
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.warn("Could not load logo for PDF:", e);
    }
  }

  /**
   * Clean text for jsPDF standard Helvetica font
   * Strips Bengali / non-Latin-1 characters to completely prevent encoding corruption / Mojibake
   */
  cleanPdfText(str) {
    if (!str) return "";
    let text = String(str);

    // 1. If string contains parentheses with Bengali like "Chinigura Polao Rice (পোলাও চাল)", extract English part
    if (text.includes("(") && text.includes(")")) {
      const cleaned = text.replace(/\([^)]*[\u0980-\u09FF][^)]*\)/g, "").trim();
      if (cleaned.length > 0) {
        text = cleaned;
      }
    }

    // 2. Map known categories and payment methods
    const categoryMap = {
      catRaw: "Raw Ingredients",
      catFrozen: "Frozen Food",
      catMeals: "Pre-Order Meals & Combos",
      catBurgers: "Burgers & Sandwiches",
      catSnacks: "Snacks & Bites",
      catDesserts: "Baked Goods & Desserts",
      catPackaging: "Packaging & Boxes",
      catBeverage: "Beverages",
      expRawBazaar: "Raw Material & Bazaar",
      expUtility: "Utilities (Gas/Electric/Water)",
      expRent: "Kitchen & Shop Rent",
      expPackaging: "Packaging & Printing",
      expDelivery: "Delivery & Transport",
      expPayroll: "Staff Salaries & Food",
      expEquipment: "Kitchen Equipment & Repairs",
      expMisc: "Miscellaneous",
      payCash: "Cash",
      payBkash: "bKash",
      payNagad: "Nagad",
      payBank: "Bank Transfer",
      unitKg: "kg",
      unitGm: "gm",
      unitLitre: "Litre",
      unitPcs: "pcs",
      unitPacket: "packet",
      unitBox: "box",
      statusActive: "Active",
      statusLeave: "On Leave",
      statusResigned: "Resigned"
    };

    if (categoryMap[text]) {
      return categoryMap[text];
    }

    // 3. Replace currency symbol ৳ with Tk.
    text = text.replace(/৳/g, "Tk. ");

    // 4. Remove any remaining Bengali Unicode characters (\u0980-\u09FF)
    text = text.replace(/[\u0980-\u09FF]+/g, "").trim();

    // 5. Clean up extra spaces or orphaned punctuation
    text = text.replace(/\s+/g, " ").replace(/\(\s*\)/g, "").trim();

    return text || "Item";
  }

  // --- BRANDED PDF HEADER HELPER ---
  renderPdfHeader(doc, title, subtitle, dateString) {
    // Top Brand Green Banner (#14532d)
    doc.setFillColor(20, 83, 45);
    doc.rect(0, 0, 210, 36, "F");

    // Add Logo if available
    if (this.logoBase64) {
      try {
        doc.addImage(this.logoBase64, "PNG", 14, 6, 24, 24);
      } catch (err) {
        console.warn("PDF addImage error:", err);
      }
    }

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("HEALTH SHARK", 44, 15);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Healthy Food Store & Kitchen | Dhaka, Bangladesh", 44, 21);
    doc.text("Mirpur Area | Hotline: 01789-474381", 44, 26);

    doc.setFontSize(8.5);
    doc.text(`Generated: ${dateString}`, 196, 26, { align: "right" });

    // Subheader section
    doc.setTextColor(20, 83, 45);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title.toUpperCase(), 14, 46);

    if (subtitle) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(subtitle, 14, 51);
    }
  }

  // --- PDF FOOTER HELPER ---
  renderPdfFooter(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Health Shark System | Confidential Owner Statement | Page ${i} of ${pageCount}`, 14, 290);
      doc.text("Owner Signature: _______________________", 140, 290);
    }
  }

  // =========================================================================
  // 1. STOCK & INVENTORY REPORT (TODAY'S AS-OF-DATE LIVE REPORT)
  // =========================================================================
  exportStockReport(format = "pdf") {
    const items = window.hsStore.getItems();
    const metrics = window.hsStore.getStockMetrics();
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    if (format === "csv") {
      this.exportStockCSV();
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    this.renderPdfHeader(
      doc,
      "Current Stock & Inventory Valuation Report",
      `Live Inventory Position as of Today (${today}) — Official Report for Owner`,
      today
    );

    // KPI Summary Box
    const cardY = 56;
    const cards = [
      { title: "Total Stock Value", value: `Tk. ${metrics.totalValue.toLocaleString()}`, color: [20, 83, 45] },
      { title: "Total Items", value: `${metrics.totalItems} Items`, color: [30, 41, 59] },
      { title: "Low Stock Items", value: `${metrics.lowStockCount} Items`, color: [217, 119, 6] },
      { title: "Out of Stock", value: `${metrics.outOfStockCount} Items`, color: [220, 38, 38] }
    ];

    cards.forEach((c, idx) => {
      const x = 14 + idx * 46;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, cardY, 43, 20, 2, 2, "FD");

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text(c.title.toUpperCase(), x + 4, cardY + 6);

      doc.setFontSize(11);
      doc.setTextColor(c.color[0], c.color[1], c.color[2]);
      doc.text(c.value, x + 4, cardY + 15);
    });

    let currentY = cardY + 28;

    // Urgent Low Stock Warning Table (if any)
    if (metrics.urgentItems.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(185, 28, 28);
      doc.text(`ATTENTION: LOW STOCK ITEMS NEEDING RESTOCK (${metrics.urgentItems.length})`, 14, currentY);

      const alertRows = metrics.urgentItems.map((item) => [
        this.cleanPdfText(item.name),
        this.cleanPdfText(item.category),
        `${item.quantity} ${this.cleanPdfText(item.unit)}`,
        `${item.threshold} ${this.cleanPdfText(item.unit)}`,
        `Tk. ${Number(item.costPrice).toLocaleString()}`,
        item.quantity === 0 ? "OUT OF STOCK" : "LOW STOCK"
      ]);

      doc.autoTable({
        startY: currentY + 3,
        head: [["Item Name", "Category", "Current Qty", "Min Threshold", "Unit Cost", "Status"]],
        body: alertRows,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica" },
        headStyles: { fillColor: [185, 28, 28], textColor: 255 },
        margin: { left: 14, right: 14 }
      });

      currentY = doc.lastAutoTable.finalY + 9;
    }

    // Complete Inventory Ledger Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`COMPLETE INVENTORY LEDGER (${items.length} Items)`, 14, currentY);

    const stockRows = items.map((item) => {
      const qty = Number(item.quantity) || 0;
      const cost = Number(item.costPrice) || 0;
      const sell = Number(item.sellingPrice) || 0;
      const totalCost = qty * cost;
      const totalSell = qty * sell;
      let status = "IN STOCK";
      if (qty === 0) status = "OUT";
      else if (qty <= item.threshold) status = "LOW";

      return [
        this.cleanPdfText(item.name),
        this.cleanPdfText(item.category),
        `${qty} ${this.cleanPdfText(item.unit)}`,
        `Tk. ${cost.toLocaleString()}`,
        sell > 0 ? `Tk. ${sell.toLocaleString()}` : "-",
        `Tk. ${totalCost.toLocaleString()}`,
        sell > 0 ? `Tk. ${totalSell.toLocaleString()}` : "-",
        status
      ];
    });

    doc.autoTable({
      startY: currentY + 3,
      head: [["Item Name", "Category", "Quantity", "Unit Cost", "Sell Price", "Total Cost", "Total Sell", "Status"]],
      body: stockRows,
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica" },
      headStyles: { fillColor: [20, 83, 45], textColor: 255 },
      margin: { left: 14, right: 14 }
    });

    this.renderPdfFooter(doc);
    doc.save(`HealthShark_Stock_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  }

  // =========================================================================
  // 2. SALES & REVENUE REPORT
  // =========================================================================
  exportSalesReport(format = "pdf", monthIndex = "all", year = new Date().getFullYear()) {
    const sales = window.hsStore.getSales(monthIndex, year);
    const monthName = monthIndex === "all" ? "All Months" : window.hsI18n.getMonthName(Number(monthIndex));
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    if (format === "csv") {
      this.exportSalesCSV(monthIndex, year);
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const totalIncome = sales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    const totalCost = sales.reduce((sum, s) => sum + (Number(s.cost) || 0), 0);
    const totalProfit = totalIncome - totalCost;

    this.renderPdfHeader(
      doc,
      `Sales & Revenue Statement — ${monthName.toUpperCase()} ${year}`,
      `Total Food Sales, Itemized Orders and Net Revenue`,
      today
    );

    // Financial KPI Blocks
    const cardY = 56;
    const cards = [
      { title: "Total Sales Revenue", value: `Tk. ${totalIncome.toLocaleString()}`, color: [22, 163, 74] },
      { title: "Estimated Food Cost", value: `Tk. ${totalCost.toLocaleString()}`, color: [100, 116, 139] },
      { title: "Net Sales Margin", value: `Tk. ${totalProfit.toLocaleString()}`, color: [20, 83, 45] },
      { title: "Total Transactions", value: `${sales.length} Orders`, color: [30, 41, 59] }
    ];

    cards.forEach((c, idx) => {
      const x = 14 + idx * 46;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, cardY, 43, 20, 2, 2, "FD");

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text(c.title.toUpperCase(), x + 4, cardY + 6);

      doc.setFontSize(11);
      doc.setTextColor(c.color[0], c.color[1], c.color[2]);
      doc.text(c.value, x + 4, cardY + 15);
    });

    const rows = sales.map((s) => [
      s.date,
      this.cleanPdfText(s.item),
      s.quantity,
      `Tk. ${Number(s.total).toLocaleString()}`,
      s.cost ? `Tk. ${Number(s.cost).toLocaleString()}` : "-",
      `Tk. ${(Number(s.total || 0) - Number(s.cost || 0)).toLocaleString()}`,
      this.cleanPdfText(s.method)
    ]);

    doc.autoTable({
      startY: cardY + 28,
      head: [["Date", "Food Item / Order", "Qty", "Total Revenue", "Cost", "Net Gain", "Payment Method"]],
      body: rows.length > 0 ? rows : [["-", "No sales records found for this period", "-", "Tk. 0", "-", "Tk. 0", "-"]],
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica" },
      headStyles: { fillColor: [20, 83, 45], textColor: 255 },
      margin: { left: 14, right: 14 }
    });

    this.renderPdfFooter(doc);
    doc.save(`HealthShark_Sales_Report_${year}_${monthName.replace(/\s+/g, "_")}.pdf`);
  }

  // =========================================================================
  // 3. EXPENSES & COSTING REPORT
  // =========================================================================
  exportExpensesReport(format = "pdf", monthIndex = "all", year = new Date().getFullYear()) {
    const expenses = window.hsStore.getExpenses(monthIndex, year);
    const monthName = monthIndex === "all" ? "All Months" : window.hsI18n.getMonthName(Number(monthIndex));
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    if (format === "csv") {
      this.exportExpensesCSV(monthIndex, year);
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    this.renderPdfHeader(
      doc,
      `Costing & Expense Ledger — ${monthName.toUpperCase()} ${year}`,
      `Kitchen Bazaar, Utilities, Shop Rent, Delivery and Operations`,
      today
    );

    // Top Expense KPI Box
    const cardY = 56;
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(14, cardY, 90, 20, 2, 2, "FD");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(185, 28, 28);
    doc.text("TOTAL MONTHLY EXPENDITURE", 18, cardY + 7);
    doc.setFontSize(13);
    doc.text(`Tk. ${totalExpenses.toLocaleString()}`, 18, cardY + 16);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(108, cardY, 88, 20, 2, 2, "FD");

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("TOTAL EXPENSE ENTRIES", 112, cardY + 7);
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text(`${expenses.length} Records`, 112, cardY + 16);

    const rows = expenses.map((e) => [
      e.date,
      this.cleanPdfText(e.category),
      this.cleanPdfText(e.title),
      this.cleanPdfText(e.vendor) || "-",
      this.cleanPdfText(e.method),
      `Tk. ${Number(e.amount).toLocaleString()}`
    ]);

    doc.autoTable({
      startY: cardY + 28,
      head: [["Date", "Category", "Description / Purpose", "Paid To", "Method", "Amount"]],
      body: rows.length > 0 ? rows : [["-", "-", "No expenses recorded for this period", "-", "-", "Tk. 0"]],
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica" },
      headStyles: { fillColor: [220, 38, 38], textColor: 255 },
      margin: { left: 14, right: 14 }
    });

    this.renderPdfFooter(doc);
    doc.save(`HealthShark_Expenses_Report_${year}_${monthName.replace(/\s+/g, "_")}.pdf`);
  }

  // =========================================================================
  // 4. PROFIT & LOSS (P&L) FINANCIAL SUMMARY
  // =========================================================================
  exportProfitLossReport(format = "pdf", monthIndex = "all", year = new Date().getFullYear()) {
    const fin = window.hsStore.getFinancialMetrics(monthIndex, year);
    const monthName = monthIndex === "all" ? "All Months" : window.hsI18n.getMonthName(Number(monthIndex));
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    if (format === "csv") {
      let csv = "Health Shark Profit & Loss Statement\n";
      csv += `Period,${monthName} ${year}\n`;
      csv += `Generated Date,${today}\n\n`;
      csv += "Metric,Amount (BDT)\n";
      csv += `Total Revenue / Sales,${fin.totalIncome}\n`;
      csv += `Cost of Goods Sold (COGS),${fin.totalCostOfGoods}\n`;
      csv += `Operating Expenses,${fin.totalExpenses}\n`;
      csv += `Net Profit / Loss,${fin.netProfit}\n`;
      csv += `Net Profit Margin %,${fin.profitMargin}%\n`;
      this.downloadFile(csv, `HealthShark_ProfitLoss_${year}_${monthName}.csv`, "text/csv;charset=utf-8;");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    this.renderPdfHeader(
      doc,
      `Profit & Loss (P&L) Statement — ${monthName.toUpperCase()} ${year}`,
      `Executive Financial Statement Prepared for Business Owner`,
      today
    );

    const cardY = 56;
    const cards = [
      { title: "Total Revenue", value: `Tk. ${fin.totalIncome.toLocaleString()}`, color: [22, 163, 74] },
      { title: "Total Expenses", value: `Tk. ${fin.totalExpenses.toLocaleString()}`, color: [220, 38, 38] },
      { title: "Net Profit", value: `Tk. ${fin.netProfit.toLocaleString()}`, color: fin.netProfit >= 0 ? [20, 83, 45] : [220, 38, 38] },
      { title: "Profit Margin", value: `${fin.profitMargin}%`, color: fin.netProfit >= 0 ? [20, 83, 45] : [220, 38, 38] }
    ];

    cards.forEach((c, idx) => {
      const x = 14 + idx * 46;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, cardY, 43, 22, 2, 2, "FD");

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text(c.title.toUpperCase(), x + 4, cardY + 7);

      doc.setFontSize(12);
      doc.setTextColor(c.color[0], c.color[1], c.color[2]);
      doc.text(c.value, x + 4, cardY + 16);
    });

    const pnlTable = [
      ["Gross Food Sales & Pre-Orders", `Tk. ${fin.totalIncome.toLocaleString()}`, "100.0%"],
      ["Less: Direct Cost of Ingredients (COGS)", `Tk. (${fin.totalCostOfGoods.toLocaleString()})`, `${fin.totalIncome > 0 ? ((fin.totalCostOfGoods / fin.totalIncome) * 100).toFixed(1) : 0}%`],
      ["Gross Operating Margin", `Tk. ${(fin.totalIncome - fin.totalCostOfGoods).toLocaleString()}`, `${fin.totalIncome > 0 ? (((fin.totalIncome - fin.totalCostOfGoods) / fin.totalIncome) * 100).toFixed(1) : 0}%`],
      ["Less: Kitchen Operating Expenses & Utilities", `Tk. (${fin.totalExpenses.toLocaleString()})`, `${fin.totalIncome > 0 ? ((fin.totalExpenses / fin.totalIncome) * 100).toFixed(1) : 0}%`],
      ["NET BUSINESS PROFIT / (LOSS)", `Tk. ${fin.netProfit.toLocaleString()}`, `${fin.profitMargin}%`]
    ];

    doc.autoTable({
      startY: cardY + 30,
      head: [["Financial Account / Item", "Amount (BDT)", "% of Revenue"]],
      body: pnlTable,
      theme: "grid",
      styles: { fontSize: 9.5, cellPadding: 4, font: "helvetica" },
      headStyles: { fillColor: [20, 83, 45], textColor: 255 },
      columnStyles: {
        0: { fontStyle: "bold" },
        1: { halign: "right" },
        2: { halign: "center" }
      },
      margin: { left: 14, right: 14 }
    });

    this.renderPdfFooter(doc);
    doc.save(`HealthShark_Profit_Loss_${year}_${monthName.replace(/\s+/g, "_")}.pdf`);
  }

  // =========================================================================
  // 5. MASTER ALL-IN-ONE MONTHLY EXECUTIVE STATEMENT
  // =========================================================================
  exportMasterReport(format = "pdf", monthIndex = "all", year = new Date().getFullYear()) {
    if (format === "csv") {
      this.exportStockCSV();
      this.exportExpensesCSV(monthIndex, year);
      this.exportSalesCSV(monthIndex, year);
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const monthName = monthIndex === "all" ? "All Months" : window.hsI18n.getMonthName(Number(monthIndex));
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    const fin = window.hsStore.getFinancialMetrics(monthIndex, year);
    const stock = window.hsStore.getStockMetrics();

    this.renderPdfHeader(
      doc,
      `Comprehensive Master Report — ${monthName.toUpperCase()} ${year}`,
      `Financial Performance, Inventory Valuation and Low Stock Status`,
      today
    );

    // KPI Cards
    const cardY = 56;
    const cards = [
      { title: "Monthly Sales", value: `Tk. ${fin.totalIncome.toLocaleString()}`, color: [22, 163, 74] },
      { title: "Monthly Expenses", value: `Tk. ${fin.totalExpenses.toLocaleString()}`, color: [220, 38, 38] },
      { title: "Net Profit", value: `Tk. ${fin.netProfit.toLocaleString()}`, color: fin.netProfit >= 0 ? [20, 83, 45] : [220, 38, 38] },
      { title: "Stock Valuation", value: `Tk. ${stock.totalValue.toLocaleString()}`, color: [15, 118, 110] }
    ];

    cards.forEach((c, idx) => {
      const x = 14 + idx * 46;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, cardY, 43, 20, 2, 2, "FD");

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text(c.title.toUpperCase(), x + 4, cardY + 6);

      doc.setFontSize(11);
      doc.setTextColor(c.color[0], c.color[1], c.color[2]);
      doc.text(c.value, x + 4, cardY + 15);
    });

    let currentY = cardY + 28;

    // Low Stock Alerts Table
    if (stock.urgentItems.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(185, 28, 28);
      doc.text(`ATTENTION: LOW STOCK ITEMS NEEDING RESTOCK (${stock.urgentItems.length})`, 14, currentY);

      const alertRows = stock.urgentItems.map((item) => [
        this.cleanPdfText(item.name),
        this.cleanPdfText(item.category),
        `${item.quantity} ${this.cleanPdfText(item.unit)}`,
        `${item.threshold} ${this.cleanPdfText(item.unit)}`,
        `Tk. ${Number(item.costPrice).toLocaleString()}`,
        item.quantity === 0 ? "OUT OF STOCK" : "LOW STOCK"
      ]);

      doc.autoTable({
        startY: currentY + 3,
        head: [["Item Name", "Category", "Current Stock", "Min Level", "Unit Cost", "Status"]],
        body: alertRows,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica" },
        headStyles: { fillColor: [185, 28, 28], textColor: 255 },
        margin: { left: 14, right: 14 }
      });

      currentY = doc.lastAutoTable.finalY + 9;
    }

    // Expense Summary Table
    const expenses = window.hsStore.getExpenses(monthIndex, year);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`EXPENSE LEDGER — ${monthName.toUpperCase()} ${year} (Total: Tk. ${fin.totalExpenses.toLocaleString()})`, 14, currentY);

    const expenseRows = expenses.slice(0, 15).map((exp) => [
      exp.date,
      this.cleanPdfText(exp.category),
      this.cleanPdfText(exp.title),
      this.cleanPdfText(exp.vendor) || "-",
      this.cleanPdfText(exp.method),
      `Tk. ${Number(exp.amount).toLocaleString()}`
    ]);

    doc.autoTable({
      startY: currentY + 3,
      head: [["Date", "Category", "Description", "Paid To", "Method", "Amount"]],
      body: expenseRows.length > 0 ? expenseRows : [["-", "-", "No expense recorded for this month", "-", "-", "Tk. 0"]],
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica" },
      headStyles: { fillColor: [20, 83, 45], textColor: 255 },
      margin: { left: 14, right: 14 }
    });

    currentY = doc.lastAutoTable.finalY + 9;

    // Current Inventory Table
    const items = window.hsStore.getItems();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`CURRENT INVENTORY VALUATION (Total Value: Tk. ${stock.totalValue.toLocaleString()})`, 14, currentY);

    const stockRows = items.map((item) => [
      this.cleanPdfText(item.name),
      this.cleanPdfText(item.category),
      `${item.quantity} ${this.cleanPdfText(item.unit)}`,
      `Tk. ${Number(item.costPrice).toLocaleString()}`,
      `Tk. ${(Number(item.quantity || 0) * Number(item.costPrice || 0)).toLocaleString()}`,
      item.quantity <= item.threshold ? "LOW" : "OK"
    ]);

    doc.autoTable({
      startY: currentY + 3,
      head: [["Item Name", "Category", "Quantity", "Unit Cost", "Total Asset Value", "Health"]],
      body: stockRows,
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica" },
      headStyles: { fillColor: [30, 41, 59], textColor: 255 },
      margin: { left: 14, right: 14 }
    });

    this.renderPdfFooter(doc);
    doc.save(`HealthShark_Master_Report_${year}_${monthName.replace(/\s+/g, "_")}.pdf`);
  }

  // --- DISPATCHER BASED ON MODAL SELECTION ---
  dispatchExport(type, format, period, monthIndex, year) {
    if (period === "today") {
      this.exportStockReport(format);
      return;
    }

    const m = period === "all" ? "all" : monthIndex;
    const y = year || new Date().getFullYear();

    switch (type) {
      case "stock":
        this.exportStockReport(format);
        break;
      case "sales":
        this.exportSalesReport(format, m, y);
        break;
      case "expenses":
        this.exportExpensesReport(format, m, y);
        break;
      case "profit":
        this.exportProfitLossReport(format, m, y);
        break;
      case "master":
      default:
        this.exportMasterReport(format, m, y);
        break;
    }
  }

  // Legacy method mapped to master report
  async generateMonthlyPDF(monthIndex, year) {
    this.exportMasterReport("pdf", monthIndex, year);
  }

  // CSV Helpers
  exportStockCSV() {
    const items = window.hsStore.getItems();
    let csv = "Item ID,Item Name,Category,Type,Unit,Quantity,Threshold,Unit Cost (BDT),Selling Price (BDT),Total Cost (BDT),Total Selling Value (BDT)\n";

    items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const cost = Number(item.costPrice) || 0;
      const sell = Number(item.sellingPrice) || 0;
      const totalCost = qty * cost;
      const totalSell = qty * sell;

      const row = [
        `"${item.id || ""}"`,
        `"${this.cleanPdfText(item.name)}"`,
        `"${this.cleanPdfText(item.category)}"`,
        `"${this.cleanPdfText(item.type)}"`,
        `"${this.cleanPdfText(item.unit)}"`,
        qty,
        item.threshold,
        cost,
        sell,
        totalCost,
        totalSell
      ];
      csv += row.join(",") + "\n";
    });

    this.downloadFile(csv, `HealthShark_Stock_Ledger_${new Date().toISOString().split("T")[0]}.csv`, "text/csv;charset=utf-8;");
  }

  exportExpensesCSV(monthIndex, year) {
    const expenses = window.hsStore.getExpenses(monthIndex, year);
    let csv = "Expense ID,Date,Category,Description,Paid To / Vendor,Payment Method,Amount (BDT)\n";

    expenses.forEach((e) => {
      const row = [
        `"${e.id}"`,
        `"${e.date}"`,
        `"${this.cleanPdfText(e.category)}"`,
        `"${this.cleanPdfText(e.title)}"`,
        `"${this.cleanPdfText(e.vendor)}"`,
        `"${this.cleanPdfText(e.method)}"`,
        e.amount
      ];
      csv += row.join(",") + "\n";
    });

    this.downloadFile(csv, `HealthShark_Expenses_${year}_Month_${monthIndex}.csv`, "text/csv;charset=utf-8;");
  }

  exportSalesCSV(monthIndex, year) {
    const sales = window.hsStore.getSales(monthIndex, year);
    let csv = "Sale ID,Date,Item / Service,Quantity,Estimated Cost (BDT),Total Revenue (BDT),Net Profit (BDT),Payment Method\n";

    sales.forEach((s) => {
      const netGain = (Number(s.total) || 0) - (Number(s.cost) || 0);
      const row = [
        `"${s.id}"`,
        `"${s.date}"`,
        `"${this.cleanPdfText(s.item)}"`,
        s.quantity,
        s.cost || 0,
        s.total,
        netGain,
        `"${this.cleanPdfText(s.method)}"`
      ];
      csv += row.join(",") + "\n";
    });

    this.downloadFile(csv, `HealthShark_Sales_${year}_Month_${monthIndex}.csv`, "text/csv;charset=utf-8;");
  }

  // JSON Full Backup
  exportFullBackupJSON() {
    const jsonStr = window.hsStore.exportDatabase();
    const dateStr = new Date().toISOString().split("T")[0];
    this.downloadFile(jsonStr, `HealthShark_Full_Backup_${dateStr}.json`, "application/json");
  }

  importJSONFile(file, onSuccess, onError) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const success = window.hsStore.importDatabase(content);
      if (success) {
        if (onSuccess) onSuccess();
      } else {
        if (onError) onError();
      }
    };
    reader.onerror = () => {
      if (onError) onError();
    };
    reader.readAsText(file);
  }

  printInvoiceReceipt(inv) {
    const printWindow = window.open("", "_blank", "width=700,height=800");
    if (!printWindow) {
      alert("Please allow popups to print invoices.");
      return;
    }

    const itemsHtml = (inv.items || [])
      .map(
        (item, idx) => `
      <tr>
        <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; font-size: 13px;">${idx + 1}</td>
        <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; font-size: 13px; font-weight: bold;">${item.name}</td>
        <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; font-size: 13px; text-align: center;">${item.qty} ${item.unit || ""}</td>
        <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; font-size: 13px; text-align: right;">Tk. ${Number(item.price).toLocaleString()}</td>
        <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; font-size: 13px; text-align: right; font-weight: bold;">Tk. ${(item.qty * item.price).toLocaleString()}</td>
      </tr>
    `
      )
      .join("");

    const logoSrc = this.logoBase64 || "assets/images/logo.png";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice - ${inv.invoiceNumber}</title>
  <style>
    @page { size: auto; margin: 15mm; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 0; padding: 20px; }
    .invoice-card { max-width: 550px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { text-align: center; border-bottom: 2px solid #15803d; padding-bottom: 16px; margin-bottom: 16px; }
    .brand-logo { height: 60px; width: auto; object-fit: contain; margin-bottom: 8px; display: inline-block; }
    .brand-title { font-size: 26px; font-weight: 900; color: #14532d; margin: 0; }
    .brand-sub { font-size: 12px; color: #15803d; font-weight: 700; text-transform: uppercase; margin-top: 2px; }
    .brand-contact { font-size: 12px; color: #64748b; margin-top: 4px; }
    .meta-grid { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 16px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { background: #f8fafc; color: #475569; font-size: 12px; font-weight: 800; padding: 8px 6px; text-align: left; border-bottom: 2px solid #cbd5e1; }
    .totals-box { margin-left: auto; width: 240px; font-size: 13px; line-height: 1.8; }
    .totals-row { display: flex; justify-content: space-between; }
    .grand-total { font-size: 16px; font-weight: 900; color: #15803d; border-top: 2px solid #15803d; padding-top: 6px; margin-top: 6px; }
    .footer { text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 14px; margin-top: 20px; }
    @media print {
      body { padding: 0; }
      .invoice-card { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: center; margin-bottom: 16px;">
    <button onclick="window.print()" style="background: #15803d; color: white; border: none; padding: 10px 24px; font-size: 14px; font-weight: bold; border-radius: 8px; cursor: pointer;">
      🖨️ Print / Save PDF
    </button>
  </div>
  <div class="invoice-card">
    <div class="header">
      <img src="${logoSrc}" alt="Health Shark Logo" class="brand-logo" onerror="this.style.display='none'" />
      <h1 class="brand-title">HEALTH SHARK</h1>
      <div class="brand-sub">Fresh & Healthy Cloud Kitchen</div>
      <div class="brand-contact">Mirpur, Dhaka • Hotline: 01789-474381</div>
    </div>
    <div class="meta-grid">
      <div>
        <strong>Invoice No:</strong> ${inv.invoiceNumber}<br />
        <strong>Date:</strong> ${inv.date}<br />
        <strong>Order Type:</strong> ${inv.orderType || "Dine-in"}
      </div>
      <div style="text-align: right;">
        <strong>Customer:</strong> ${inv.customerName || "Walking Customer"}<br />
        <strong>Phone:</strong> ${inv.customerPhone || "N/A"}<br />
        <strong>Payment:</strong> ${inv.paymentMethod || "Cash"}
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 25px;">#</th>
          <th>Item</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Rate</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml || '<tr><td colspan="5" style="text-align:center; padding:12px;">No items</td></tr>'}
      </tbody>
    </table>
    <div class="totals-box">
      <div class="totals-row">
        <span>Subtotal:</span>
        <strong>Tk. ${Number(inv.subtotal).toLocaleString()}</strong>
      </div>
      ${inv.discount > 0 ? `<div class="totals-row" style="color: #dc2626;"><span>Discount:</span><strong>- Tk. ${Number(inv.discount).toLocaleString()}</strong></div>` : ""}
      ${inv.deliveryFee > 0 ? `<div class="totals-row"><span>Delivery Fee:</span><strong>+ Tk. ${Number(inv.deliveryFee).toLocaleString()}</strong></div>` : ""}
      <div class="totals-row grand-total">
        <span>Grand Total:</span>
        <span>Tk. ${Number(inv.grandTotal).toLocaleString()}</span>
      </div>
      <div class="totals-row" style="font-size: 12px; margin-top: 4px;">
        <span>Paid Amount:</span>
        <span>Tk. ${Number(inv.paidAmount).toLocaleString()}</span>
      </div>
      ${inv.dueAmount > 0 ? `<div class="totals-row" style="color: #dc2626; font-size: 12px; font-weight: bold;"><span>Due Amount:</span><span>Tk. ${Number(inv.dueAmount).toLocaleString()}</span></div>` : ""}
    </div>
    ${inv.note ? `<div style="font-size: 12px; color: #64748b; margin-top: 14px; font-style: italic;"><strong>Note:</strong> ${inv.note}</div>` : ""}
    <div class="footer">
      Thank you for choosing Health Shark! Eat Healthy, Live Strong.<br />
      Software: healthshark-stock | Powered by Health Shark
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  <\/script>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  downloadFile(content, fileName, mimeType) {
    const blob = new Blob(["\uFEFF" + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

window.hsReports = new ReportsEngine();
