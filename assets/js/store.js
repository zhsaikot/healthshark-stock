/**
 * Health Shark Stock & Management System
 * Persistent Data Store & Calculations
 */

class DataStore {
  constructor() {
    this.storageKey = "health_shark_stock_db_v1";
    this.data = {
      items: [],
      expenses: [],
      sales: [],
      employees: [],
      invoices: [],
      activityLog: []
    };
    this.currentMonth = new Date().getMonth(); // 0 to 11
    this.currentYear = new Date().getFullYear();
    this.selectedMonthFilter = String(this.currentMonth); // 'all' or '0'..'11'
    this.selectedYearFilter = String(this.currentYear);
  }

  async init() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.data = JSON.parse(stored);
        this.data.invoices = this.data.invoices || [];
      } else if (typeof SEED_DATA !== "undefined") {
        this.data = JSON.parse(JSON.stringify(SEED_DATA));
        this.data.invoices = this.data.invoices || [];
        this.save();
      }
    } catch (e) {
      console.warn("Storage load error, initializing fresh seed:", e);
      if (typeof SEED_DATA !== "undefined") {
        this.data = JSON.parse(JSON.stringify(SEED_DATA));
      }
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error("LocalStorage write failed:", e);
    }
    window.dispatchEvent(new CustomEvent("store-updated"));
  }

  // --- LOG ACTIVITY ---
  addActivity(action, type = "info") {
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const date = new Date().toISOString().split("T")[0];
    this.data.activityLog = this.data.activityLog || [];
    this.data.activityLog.unshift({
      id: "log-" + Date.now(),
      time: `${date} ${time}`,
      action,
      type
    });
    if (this.data.activityLog.length > 30) {
      this.data.activityLog.pop();
    }
  }

  // --- STOCK ITEMS ---
  getItems(filter = {}) {
    let list = [...(this.data.items || [])];

    if (filter.category && filter.category !== "all") {
      list = list.filter((i) => i.category === filter.category);
    }
    if (filter.type && filter.type !== "all") {
      list = list.filter((i) => i.type === filter.type);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (i) =>
          (i.name && i.name.toLowerCase().includes(q)) ||
          (i.id && i.id.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getItemById(id) {
    return (this.data.items || []).find((i) => i.id === id);
  }

  saveItem(item) {
    item.updatedAt = new Date().toISOString().split("T")[0];
    if (!item.id) {
      item.id = "item-" + Date.now();
      this.data.items.push(item);
      this.addActivity(`Added new inventory item: ${item.name}`, "stock");
    } else {
      const idx = this.data.items.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        this.data.items[idx] = { ...this.data.items[idx], ...item };
        this.addActivity(`Updated item: ${item.name}`, "stock");
      } else {
        this.data.items.push(item);
        this.addActivity(`Added new inventory item: ${item.name}`, "stock");
      }
    }
    this.save();
    return item;
  }

  deleteItem(id) {
    const item = this.getItemById(id);
    this.data.items = this.data.items.filter((i) => i.id !== id);
    if (item) this.addActivity(`Deleted item: ${item.name}`, "stock");
    this.save();
  }

  adjustStock(id, delta, reason = "") {
    const item = this.getItemById(id);
    if (!item) return;

    const oldQty = Number(item.quantity) || 0;
    const newQty = Math.max(0, Math.round((oldQty + Number(delta)) * 100) / 100);
    item.quantity = newQty;
    item.updatedAt = new Date().toISOString().split("T")[0];

    const direction = delta > 0 ? "Stock In (+)" : "Stock Out (-)";
    this.addActivity(`${direction} ${Math.abs(delta)} ${item.unit || ""} for ${item.name} (${reason || "Manual update"})`, delta > 0 ? "stock" : "alert");
    this.save();
  }

  parseDate(dStr) {
    if (!dStr) return new Date();
    if (typeof dStr === "string" && /^\d{4}-\d{2}-\d{2}/.test(dStr)) {
      const parts = dStr.split("T")[0].split("-").map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date(dStr);
  }

  // --- EXPENSES ---
  getExpenses(monthFilter = "all", yearFilter = null) {
    let list = [...(this.data.expenses || [])];
    if (monthFilter !== "all") {
      const targetMonth = Number(monthFilter);
      list = list.filter((exp) => {
        const d = this.parseDate(exp.date);
        return d.getMonth() === targetMonth;
      });
    }
    if (yearFilter && yearFilter !== "all") {
      const targetYear = Number(yearFilter);
      list = list.filter((exp) => this.parseDate(exp.date).getFullYear() === targetYear);
    }
    // Sort descending by date
    return list.sort((a, b) => this.parseDate(b.date) - this.parseDate(a.date));
  }

  saveExpense(expense) {
    if (!expense.id) {
      expense.id = "exp-" + Date.now();
      this.data.expenses.push(expense);
      this.addActivity(`Recorded expense: ৳${expense.amount} for ${expense.title}`, "expense");
    } else {
      const idx = this.data.expenses.findIndex((e) => e.id === expense.id);
      if (idx !== -1) {
        this.data.expenses[idx] = { ...this.data.expenses[idx], ...expense };
      } else {
        this.data.expenses.push(expense);
        this.addActivity(`Recorded expense: ৳${expense.amount} for ${expense.title}`, "expense");
      }
    }
    this.save();
    return expense;
  }

  deleteExpense(id) {
    this.data.expenses = this.data.expenses.filter((e) => e.id !== id);
    this.save();
  }

  // --- SALES & REVENUE ---
  getSales(monthFilter = "all", yearFilter = null) {
    let list = [...(this.data.sales || [])];
    if (monthFilter !== "all") {
      const targetMonth = Number(monthFilter);
      list = list.filter((sale) => this.parseDate(sale.date).getMonth() === targetMonth);
    }
    if (yearFilter && yearFilter !== "all") {
      const targetYear = Number(yearFilter);
      list = list.filter((sale) => this.parseDate(sale.date).getFullYear() === targetYear);
    }
    return list.sort((a, b) => this.parseDate(b.date) - this.parseDate(a.date));
  }

  saveSale(sale) {
    if (!sale.id) {
      sale.id = "sale-" + Date.now();
      this.data.sales.push(sale);
      this.addActivity(`Recorded sale: ৳${sale.total} (${sale.item})`, "sale");
    } else {
      const idx = this.data.sales.findIndex((s) => s.id === sale.id);
      if (idx !== -1) {
        this.data.sales[idx] = { ...this.data.sales[idx], ...sale };
      } else {
        this.data.sales.push(sale);
        this.addActivity(`Recorded sale: ৳${sale.total} (${sale.item})`, "sale");
      }
    }
    this.save();
    return sale;
  }

  addSale(sale) {
    return this.saveSale(sale);
  }

  deleteSale(id) {
    this.data.sales = this.data.sales.filter((s) => s.id !== id);
    this.save();
  }

  // --- EMPLOYEES ---
  getEmployees() {
    return this.data.employees || [];
  }

  saveEmployee(emp) {
    if (!emp.id) {
      emp.id = "emp-" + Date.now();
      this.data.employees.push(emp);
      this.addActivity(`Added staff member: ${emp.name}`, "info");
    } else {
      const idx = this.data.employees.findIndex((e) => e.id === emp.id);
      if (idx !== -1) {
        this.data.employees[idx] = { ...this.data.employees[idx], ...emp };
      } else {
        this.data.employees.push(emp);
        this.addActivity(`Added staff member: ${emp.name}`, "info");
      }
    }
    this.save();
    return emp;
  }

  deleteEmployee(id) {
    this.data.employees = this.data.employees.filter((e) => e.id !== id);
    this.save();
  }

  postPayrollToExpenses(monthFilter = "all", year = new Date().getFullYear()) {
    const activeStaff = this.getEmployees().filter((e) => e.status !== "statusResigned");
    const totalSalary = activeStaff.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);
    if (totalSalary <= 0) return 0;

    let targetDate = new Date().toISOString().split("T")[0];
    let monthLabel = "";

    const yNum = Number(year) || new Date().getFullYear();
    if (monthFilter !== "all") {
      const mIdx = Number(monthFilter);
      monthLabel = window.hsI18n ? window.hsI18n.getMonthName(mIdx) : `Month ${mIdx + 1}`;
      const now = new Date();
      if (now.getMonth() === mIdx && now.getFullYear() === yNum) {
        targetDate = now.toISOString().split("T")[0];
      } else {
        // Target last day or 1st day of chosen month
        targetDate = `${yNum}-${String(mIdx + 1).padStart(2, "0")}-28`;
      }
    } else {
      const curM = new Date().getMonth();
      monthLabel = window.hsI18n ? window.hsI18n.getMonthName(curM) : "Current Month";
    }

    const payrollExpense = {
      id: "exp-payroll-" + Date.now(),
      date: targetDate,
      category: "expPayroll",
      title: `Monthly Staff Salary Payroll (${monthLabel} ${yNum})`,
      vendor: `Health Shark Team (${activeStaff.length} Employees)`,
      method: "payBank",
      amount: totalSalary
    };
    this.saveExpense(payrollExpense);
    return totalSalary;
  }

  // --- METRICS & AGGREGATIONS ---
  getStockMetrics() {
    const items = this.data.items || [];
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const urgentItems = [];

    items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const cost = Number(item.costPrice) || 0;
      const threshold = Number(item.threshold) || 0;

      totalValue += qty * cost;

      if (qty === 0) {
        outOfStockCount++;
        urgentItems.push(item);
      } else if (qty <= threshold) {
        lowStockCount++;
        urgentItems.push(item);
      }
    });

    return {
      totalItems: items.length,
      totalValue,
      lowStockCount,
      outOfStockCount,
      urgentItems
    };
  }

  getFinancialMetrics(monthFilter = "all", yearFilter = null) {
    const sales = this.getSales(monthFilter, yearFilter);
    const expenses = this.getExpenses(monthFilter, yearFilter);

    const totalIncome = sales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    const totalCostOfGoods = sales.reduce((sum, s) => sum + (Number(s.cost) || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;

    return {
      totalIncome,
      totalCostOfGoods,
      totalExpenses,
      netProfit,
      profitMargin
    };
  }

  // --- INVOICE MANAGEMENT ---
  getInvoices() {
    this.data.invoices = this.data.invoices || [];
    return this.data.invoices;
  }

  getNextInvoiceNumber() {
    this.data.invoices = this.data.invoices || [];
    const count = this.data.invoices.length + 1;
    return `HS-INV-${String(count).padStart(4, "0")}`;
  }

  addInvoice(invoice) {
    this.data.invoices = this.data.invoices || [];
    const newInvoice = {
      id: "inv_" + Date.now(),
      invoiceNumber: invoice.invoiceNumber || this.getNextInvoiceNumber(),
      customerName: invoice.customerName || "Walking Customer",
      customerPhone: invoice.customerPhone || "",
      orderType: invoice.orderType || "Dine-in",
      date: invoice.date || new Date().toISOString().split("T")[0],
      items: invoice.items || [],
      subtotal: Number(invoice.subtotal) || 0,
      discount: Number(invoice.discount) || 0,
      deliveryFee: Number(invoice.deliveryFee) || 0,
      grandTotal: Number(invoice.grandTotal) || 0,
      paidAmount: Number(invoice.paidAmount) || 0,
      dueAmount: Number(invoice.dueAmount) || 0,
      paymentMethod: invoice.paymentMethod || "Cash",
      note: invoice.note || "",
      createdAt: new Date().toISOString()
    };
    this.data.invoices.unshift(newInvoice);
    this.addActivity(`New Invoice ${newInvoice.invoiceNumber} created (৳${newInvoice.grandTotal})`, "success");
    this.save();
    return newInvoice;
  }

  getInvoiceById(id) {
    this.data.invoices = this.data.invoices || [];
    return this.data.invoices.find((inv) => inv.id === id);
  }

  updateInvoice(id, updatedFields) {
    this.data.invoices = this.data.invoices || [];
    const idx = this.data.invoices.findIndex((inv) => inv.id === id);
    if (idx === -1) return null;

    const existing = this.data.invoices[idx];
    const updated = {
      ...existing,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    this.data.invoices[idx] = updated;
    this.addActivity(`Updated Invoice ${updated.invoiceNumber} (৳${updated.grandTotal})`, "info");
    this.save();
    return updated;
  }

  updateLinkedSale(invoiceId, invoiceNumber, saleData) {
    this.data.sales = this.data.sales || [];
    const idx = this.data.sales.findIndex(
      (s) => s.invoiceId === invoiceId || s.invoiceNumber === invoiceNumber
    );

    if (idx !== -1) {
      this.data.sales[idx] = {
        ...this.data.sales[idx],
        ...saleData,
        invoiceId,
        invoiceNumber
      };
      this.addActivity(`Updated sale record for Invoice ${invoiceNumber}: ৳${saleData.total}`, "sale");
      this.save();
      return this.data.sales[idx];
    } else {
      return this.saveSale({
        ...saleData,
        invoiceId,
        invoiceNumber
      });
    }
  }

  deleteInvoice(id) {
    this.data.invoices = this.data.invoices || [];
    const idx = this.data.invoices.findIndex((inv) => inv.id === id);
    if (idx !== -1) {
      const removed = this.data.invoices.splice(idx, 1)[0];
      this.addActivity(`Invoice ${removed.invoiceNumber} deleted`, "warning");
      this.save();
      return true;
    }
    return false;
  }

  // --- BACKUP & RESTORE ---
  exportDatabase() {
    return JSON.stringify(this.data, null, 2);
  }

  importDatabase(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.items && !parsed.expenses) {
        throw new Error("Invalid structure");
      }
      this.data = {
        items: parsed.items || [],
        expenses: parsed.expenses || [],
        sales: parsed.sales || [],
        employees: parsed.employees || [],
        invoices: parsed.invoices || [],
        activityLog: parsed.activityLog || []
      };
      this.save();
      return true;
    } catch (err) {
      console.error("Database import failed:", err);
      return false;
    }
  }

  resetToSeed() {
    if (typeof SEED_DATA !== "undefined") {
      this.data = JSON.parse(JSON.stringify(SEED_DATA));
      this.save();
    }
  }
}

window.hsStore = new DataStore();
