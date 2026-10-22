/**
 * Health Shark Stock & Management System
 * Reports Engine: PDF, CSV, and JSON Export / Import
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

  // --- PDF REPORT FOR BUSINESS OWNER ---
  async generateMonthlyPDF(monthIndex, year) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("PDF library is loading. Please try again in a few seconds.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const isBengali = window.hsI18n.getLang() === "bn";
    const monthName = monthIndex === "all" ? (isBengali ? "সকল মাস" : "All Months") : window.hsI18n.getMonthName(Number(monthIndex));
    const reportTitle = `Monthly Business & Stock Report — ${monthName} ${year}`;
    const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    // Financial calculations
    const fin = window.hsStore.getFinancialMetrics(monthIndex, year);
    const stock = window.hsStore.getStockMetrics();

    // 1. Header Banner
    doc.setFillColor(20, 83, 45); // Health Shark Brand Dark Green (#14532d)
    doc.rect(0, 0, 210, 36, "F");

    // Try embedding logo
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
    doc.text("HEALTH SHARK", 44, 16);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Healthy Food Store & Kitchen | Dhaka, Bangladesh", 44, 22);
    doc.text("Mirpur Area | Hotline: 01789-474381 | Web: zhsaikot.github.io/healthshark", 44, 28);

    doc.setFontSize(9);
    doc.text(`Generated: ${dateStr}`, 155, 28);

    // 2. Executive Report Subheader
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(reportTitle.toUpperCase(), 14, 46);

    // 3. KPI Cards / Summary Blocks (4 Column Grid)
    const cardY = 52;
    const cardWidth = 43;
    const cardHeight = 22;

    const cards = [
      { title: "Monthly Sales", value: `Tk. ${fin.totalIncome.toLocaleString()}`, color: [22, 163, 74] },
      { title: "Monthly Expenses", value: `Tk. ${fin.totalExpenses.toLocaleString()}`, color: [220, 38, 38] },
      { title: "Net Profit", value: `Tk. ${fin.netProfit.toLocaleString()}`, color: fin.netProfit >= 0 ? [21, 128, 61] : [220, 38, 38] },
      { title: "Stock Valuation", value: `Tk. ${stock.totalValue.toLocaleString()}`, color: [15, 118, 110] }
    ];

    cards.forEach((c, idx) => {
      const x = 14 + idx * (cardWidth + 2.5);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, cardY, cardWidth, cardHeight, 2, 2, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text(c.title.toUpperCase(), x + 4, cardY + 7);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(c.color[0], c.color[1], c.color[2]);
      doc.text(c.value, x + 4, cardY + 16);
    });

    let currentY = cardY + cardHeight + 8;

    // 4. Low Stock Alerts Section (if any)
    if (stock.urgentItems.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(185, 28, 28);
      doc.text(`ATTENTION: LOW STOCK ITEMS NEEDING RESTOCK (${stock.urgentItems.length})`, 14, currentY);

      const alertRows = stock.urgentItems.map((item) => [
        item.name,
        window.hsI18n.t(item.category) || item.category,
        `${item.quantity} ${window.hsI18n.t(item.unit) || item.unit}`,
        `${item.threshold} ${window.hsI18n.t(item.unit) || item.unit}`,
        `Tk. ${item.costPrice}`,
        item.quantity === 0 ? "OUT OF STOCK" : "LOW STOCK"
      ]);

      doc.autoTable({
        startY: currentY + 3,
        head: [["Item Name", "Category", "Current Stock", "Min Level", "Unit Cost", "Status"]],
        body: alertRows,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [185, 28, 28], textColor: 255 },
        margin: { left: 14, right: 14 }
      });

      currentY = doc.lastAutoTable.finalY + 8;
    }

    // 5. Monthly Expenses Summary Table
    const expenses = window.hsStore.getExpenses(monthIndex, year);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(`EXPENSE LEDGER — ${monthName.toUpperCase()} ${year} (Total: Tk. ${fin.totalExpenses.toLocaleString()})`, 14, currentY);

    const expenseRows = expenses.slice(0, 15).map((exp) => [
      exp.date,
      window.hsI18n.t(exp.category) || exp.category,
      exp.title,
      exp.vendor || "-",
      window.hsI18n.t(exp.method) || exp.method,
      `Tk. ${Number(exp.amount).toLocaleString()}`
    ]);

    doc.autoTable({
      startY: currentY + 3,
      head: [["Date", "Category", "Description", "Paid To", "Method", "Amount"]],
      body: expenseRows.length > 0 ? expenseRows : [["-", "-", "No expense recorded for this month", "-", "-", "Tk. 0"]],
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [20, 83, 45], textColor: 255 },
      margin: { left: 14, right: 14 }
    });

    currentY = doc.lastAutoTable.finalY + 8;

    // 6. Complete Inventory Valuation Table
    const items = window.hsStore.getItems();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(`CURRENT INVENTORY STATUS & VALUATION (Total Value: Tk. ${stock.totalValue.toLocaleString()})`, 14, currentY);

    const stockRows = items.map((item) => [
      item.name,
      window.hsI18n.t(item.category) || item.category,
      `${item.quantity} ${window.hsI18n.t(item.unit) || item.unit}`,
      `Tk. ${item.costPrice}`,
      `Tk. ${(item.quantity * item.costPrice).toLocaleString()}`,
      item.quantity <= item.threshold ? "LOW" : "OK"
    ]);

    doc.autoTable({
      startY: currentY + 3,
      head: [["Item Name", "Category", "Quantity", "Unit Cost", "Total Asset Value", "Health"]],
      body: stockRows,
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 41, 59], textColor: 255 },
      margin: { left: 14, right: 14 }
    });

    // 7. Footer / Signatures
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Health Shark Stock System | Confidential Business Document | Page ${i} of ${pageCount}`, 14, 290);
      doc.text("Owner Sign: ___________________", 150, 290);
    }

    // Save PDF
    const filename = `HealthShark_Report_${year}_${monthName.replace(/\s+/g, "_")}.pdf`;
    doc.save(filename);
  }

  // --- CSV EXPORT (EXCEL COMPATIBLE) ---
  exportStockCSV() {
    const items = window.hsStore.getItems();
    let csv = "Item ID,Item Name,Category,Type,Unit,Quantity,Threshold,Unit Cost (BDT),Selling Price (BDT),Total Valuation (BDT)\n";

    items.forEach((item) => {
      const totalVal = (Number(item.quantity) || 0) * (Number(item.costPrice) || 0);
      const row = [
        `"${item.id || ""}"`,
        `"${(item.name || "").replace(/"/g, '""')}"`,
        `"${window.hsI18n.t(item.category) || item.category}"`,
        `"${window.hsI18n.t(item.type) || item.type}"`,
        `"${window.hsI18n.t(item.unit) || item.unit}"`,
        item.quantity,
        item.threshold,
        item.costPrice,
        item.sellingPrice || 0,
        totalVal
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
        `"${window.hsI18n.t(e.category) || e.category}"`,
        `"${(e.title || "").replace(/"/g, '""')}"`,
        `"${(e.vendor || "").replace(/"/g, '""')}"`,
        `"${window.hsI18n.t(e.method) || e.method}"`,
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
        `"${(s.item || "").replace(/"/g, '""')}"`,
        s.quantity,
        s.cost || 0,
        s.total,
        netGain,
        `"${window.hsI18n.t(s.method) || s.method}"`
      ];
      csv += row.join(",") + "\n";
    });

    this.downloadFile(csv, `HealthShark_Sales_${year}_Month_${monthIndex}.csv`, "text/csv;charset=utf-8;");
  }

  // --- JSON BACKUP EXPORT & RESTORE ---
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

  // Generic File Downloader Helper
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
