/**
 * Health Shark Stock & Management System
 * Main Application Controller & UI Logic
 */

class HealthSharkApp {
  constructor() {
    this.currentTab = "dashboard";
    this.theme = localStorage.getItem("hs_stock_theme") || "light";
    this.financialChart = null;
    this.stockCategoryChart = null;
    this.stockFilterType = "all";
    this.stockFilterCategory = "all";
    this.stockSearchQuery = "";
  }

  async init() {
    // 1. Initialize Theme
    this.applyTheme(this.theme);

    // 2. Initialize Data Store
    await window.hsStore.init();

    // 3. Populate Month & Year Dropdowns
    this.populateMonthOptions();
    this.populateYearOptions();

    // 4. Bind Global UI Events
    this.bindEvents();

    // 5. Initialize Bilingual Translations
    window.hsI18n.applyTranslations();

    // 6. Initial Render of Current Tab
    this.switchTab(this.currentTab);
    this.renderAll();

    // 7. Setup Listeners
    window.addEventListener("store-updated", () => {
      this.renderAll();
    });

    window.addEventListener("language-changed", () => {
      this.populateMonthOptions();
      this.populateYearOptions();
      this.renderAll();
    });
  }

  // --- THEME MANAGEMENT ---
  applyTheme(theme) {
    this.theme = theme;
    localStorage.setItem("hs_stock_theme", theme);
    const html = document.documentElement;
    const themeIcon = document.getElementById("theme-icon");

    if (theme === "dark") {
      html.classList.add("dark");
      if (themeIcon) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun", "text-amber-400");
      }
    } else {
      html.classList.remove("dark");
      if (themeIcon) {
        themeIcon.classList.remove("fa-sun", "text-amber-400");
        themeIcon.classList.add("fa-moon", "text-gray-600");
      }
    }

    if (this.financialChart || this.stockCategoryChart) {
      this.renderCharts();
    }
  }

  toggleTheme() {
    const newTheme = this.theme === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);
  }

  // --- TAB NAVIGATION ---
  switchTab(tabId) {
    this.currentTab = tabId;

    // Update active nav links
    document.querySelectorAll(".nav-link").forEach((btn) => {
      const target = btn.getAttribute("data-tab");
      if (target === tabId) {
        btn.classList.add("bg-brand-700", "text-white", "shadow-sm");
        btn.classList.remove("text-gray-600", "hover:bg-gray-100", "dark:text-gray-300", "dark:hover:bg-slate-800");
      } else {
        btn.classList.remove("bg-brand-700", "text-white", "shadow-sm");
        btn.classList.add("text-gray-600", "hover:bg-gray-100", "dark:text-gray-300", "dark:hover:bg-slate-800");
      }
    });

    // Toggle tab panes
    document.querySelectorAll(".tab-pane").forEach((pane) => {
      pane.classList.remove("active");
    });
    const activePane = document.getElementById(`tab-${tabId}`);
    if (activePane) {
      activePane.classList.add("active");
    }

    // Close mobile drawer if open
    const drawer = document.getElementById("mobile-drawer");
    if (drawer && !drawer.classList.contains("hidden")) {
      drawer.classList.add("hidden");
    }

    // Refresh view
    this.renderActiveTab();
  }

  // --- POPULATE MONTH & YEAR OPTIONS ---
  populateMonthOptions() {
    const desktopSelect = document.getElementById("filter-month-select");
    const mobileSelect = document.getElementById("filter-month-select-mobile");
    const saved = window.hsStore.selectedMonthFilter;
    const isBn = window.hsI18n.getLang() === "bn";

    const allMonthsText = isBn ? "সকল মাস (All Months)" : "All Months";
    let html = `<option value="all">${allMonthsText}</option>`;
    for (let m = 0; m < 12; m++) {
      const name = window.hsI18n.getMonthName(m);
      html += `<option value="${m}" ${String(m) === String(saved) ? "selected" : ""}>${name}</option>`;
    }

    if (desktopSelect) desktopSelect.innerHTML = html;
    if (mobileSelect) mobileSelect.innerHTML = html;
  }

  populateYearOptions() {
    const yearSelect = document.getElementById("filter-year-select");
    if (!yearSelect) return;

    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];
    const savedYear = window.hsStore.selectedYearFilter;

    yearSelect.innerHTML = years
      .map((y) => `<option value="${y}" ${y == savedYear ? "selected" : ""}>${y}</option>`)
      .join("");
  }

  // --- RENDER ALL SECTIONS ---
  renderAll() {
    this.renderTopKPIs();
    this.renderActiveTab();
  }

  renderActiveTab() {
    switch (this.currentTab) {
      case "dashboard":
        this.renderDashboard();
        break;
      case "stock":
        this.renderStockTable();
        break;
      case "expenses":
        this.renderExpensesTable();
        break;
      case "income":
        this.renderIncomeTable();
        break;
      case "employees":
        this.renderEmployeesTable();
        break;
      case "reports":
        this.renderReportsTab();
        break;
    }
  }

  // --- TOP KPIS ---
  renderTopKPIs() {
    const m = window.hsStore.selectedMonthFilter;
    const y = window.hsStore.selectedYearFilter;

    const stock = window.hsStore.getStockMetrics();
    const fin = window.hsStore.getFinancialMetrics(m, y);

    // Stock value
    const elStockVal = document.getElementById("kpi-stock-value");
    if (elStockVal) elStockVal.textContent = window.hsI18n.formatCurrency(stock.totalValue);

    // Low stock count
    const elLowStock = document.getElementById("kpi-low-stock-count");
    if (elLowStock) {
      elLowStock.textContent = stock.lowStockCount + stock.outOfStockCount;
      const badge = document.getElementById("kpi-low-stock-badge");
      if (badge) {
        if (stock.lowStockCount + stock.outOfStockCount > 0) {
          badge.classList.remove("hidden");
        } else {
          badge.classList.add("hidden");
        }
      }
    }

    // Monthly Income
    const elIncome = document.getElementById("kpi-monthly-income");
    if (elIncome) elIncome.textContent = window.hsI18n.formatCurrency(fin.totalIncome);

    // Monthly Expenses
    const elExpense = document.getElementById("kpi-monthly-expense");
    if (elExpense) elExpense.textContent = window.hsI18n.formatCurrency(fin.totalExpenses);

    // Net Profit
    const elProfit = document.getElementById("kpi-net-profit");
    const elProfitMargin = document.getElementById("kpi-profit-margin");
    if (elProfit) {
      elProfit.textContent = window.hsI18n.formatCurrency(fin.netProfit);
      if (fin.netProfit >= 0) {
        elProfit.classList.remove("text-red-500", "dark:text-red-400");
        elProfit.classList.add("text-emerald-600", "dark:text-emerald-400");
      } else {
        elProfit.classList.remove("text-emerald-600", "dark:text-emerald-400");
        elProfit.classList.add("text-red-500", "dark:text-red-400");
      }
    }
    if (elProfitMargin) {
      elProfitMargin.textContent = `${fin.profitMargin}%`;
    }
  }

  // --- TAB 1: DASHBOARD ---
  renderDashboard() {
    this.renderCharts();
    this.renderUrgentStock();
    this.renderActivityLog();
  }

  renderUrgentStock() {
    const container = document.getElementById("urgent-stock-list");
    if (!container) return;

    const stock = window.hsStore.getStockMetrics();
    if (!stock.urgentItems || stock.urgentItems.length === 0) {
      container.innerHTML = `
        <div class="py-8 text-center text-gray-500 dark:text-gray-400">
          <div class="w-12 h-12 mx-auto mb-2 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <i class="fa-solid fa-check text-xl"></i>
          </div>
          <p class="font-medium text-sm" data-i18n="noLowStockMsg">${window.hsI18n.t("noLowStockMsg")}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="divide-y divide-gray-100 dark:divide-slate-800">
        ${stock.urgentItems.slice(0, 6).map((item) => {
          const isOut = item.quantity === 0;
          return `
            <div class="py-3 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  isOut ? "bg-red-100 text-red-600 dark:bg-red-950/50" : "bg-amber-100 text-amber-600 dark:bg-amber-950/50"
                }">
                  <i class="fa-solid ${isOut ? "fa-circle-xmark" : "fa-triangle-exclamation"}"></i>
                </div>
                <div>
                  <h4 class="font-bold text-gray-800 dark:text-gray-100 text-sm leading-tight">${item.name}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    ${window.hsI18n.t(item.category) || item.category} • 
                    <span class="font-semibold text-red-600 dark:text-red-400">${item.quantity} ${window.hsI18n.t(item.unit)}</span> 
                    (Min: ${item.threshold} ${window.hsI18n.t(item.unit)})
                  </p>
                </div>
              </div>
              <button 
                onclick="window.hsApp.openQuickStockModal('${item.id}', 1)"
                class="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-brand-700 dark:text-brand-300 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <i class="fa-solid fa-plus"></i> <span data-i18n="btnRestock">${window.hsI18n.t("btnRestock")}</span>
              </button>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  renderActivityLog() {
    const container = document.getElementById("recent-activity-list");
    if (!container) return;

    const logs = window.hsStore.data.activityLog || [];
    if (logs.length === 0) {
      container.innerHTML = `<p class="text-center py-6 text-xs text-gray-400">No recent logs recorded.</p>`;
      return;
    }

    container.innerHTML = logs.slice(0, 7).map((log) => {
      let icon = "fa-circle-info text-blue-500";
      if (log.type === "stock") icon = "fa-boxes-stacked text-emerald-500";
      if (log.type === "alert") icon = "fa-triangle-exclamation text-amber-500";
      if (log.type === "expense") icon = "fa-receipt text-rose-500";
      if (log.type === "sale") icon = "fa-cash-register text-brand-600";

      return `
        <div class="flex items-start gap-3 text-xs py-2 border-b border-gray-100 dark:border-slate-800/60 last:border-0">
          <i class="fa-solid ${icon} mt-0.5"></i>
          <div class="flex-1">
            <p class="text-gray-700 dark:text-gray-200 font-medium leading-tight">${log.action}</p>
            <span class="text-[11px] text-gray-400">${log.time}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  renderCharts() {
    if (!window.Chart) return;

    const isDark = this.theme === "dark";
    const textColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "#1e293b" : "#f1f5f9";

    // --- 1. Financial Performance Bar Chart (Last 6 Months) ---
    const finCanvas = document.getElementById("chart-financial-trends");
    if (finCanvas) {
      if (this.financialChart) this.financialChart.destroy();

      const labels = [];
      const incomeData = [];
      const expenseData = [];
      const currentYear = Number(window.hsStore.selectedYearFilter);

      // Generate last 6 months data
      for (let m = 0; m < 12; m++) {
        labels.push(window.hsI18n.getMonthName(m).substring(0, 3));
        const fin = window.hsStore.getFinancialMetrics(String(m), currentYear);
        incomeData.push(fin.totalIncome);
        expenseData.push(fin.totalExpenses);
      }

      this.financialChart = new Chart(finCanvas, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: window.hsI18n.t("kpiIncome"),
              data: incomeData,
              backgroundColor: "rgba(34, 197, 94, 0.85)",
              borderRadius: 6,
            },
            {
              label: window.hsI18n.t("kpiExpense"),
              data: expenseData,
              backgroundColor: "rgba(239, 68, 68, 0.75)",
              borderRadius: 6,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: textColor, font: { family: "Plus Jakarta Sans", size: 13, weight: "700" } }
            }
          },
          scales: {
            x: {
              ticks: { color: textColor, font: { size: 12, weight: "600" } },
              grid: { display: false }
            },
            y: {
              ticks: {
                color: textColor,
                font: { size: 12, weight: "600" },
                callback: (val) => `৳${val.toLocaleString()}`
              },
              grid: { color: gridColor }
            }
          }
        }
      });
    }

    // --- 2. Stock Category Distribution Doughnut Chart ---
    const catCanvas = document.getElementById("chart-stock-distribution");
    if (catCanvas) {
      if (this.stockCategoryChart) this.stockCategoryChart.destroy();

      const items = window.hsStore.getItems();
      const catTotals = {};

      items.forEach((item) => {
        const catKey = item.category || "catMisc";
        const val = (Number(item.quantity) || 0) * (Number(item.costPrice) || 0);
        catTotals[catKey] = (catTotals[catKey] || 0) + val;
      });

      const catLabels = Object.keys(catTotals).map((k) => window.hsI18n.t(k) || k);
      const catData = Object.values(catTotals);

      this.stockCategoryChart = new Chart(catCanvas, {
        type: "doughnut",
        data: {
          labels: catLabels,
          datasets: [
            {
              data: catData,
              backgroundColor: [
                "#16a34a",
                "#eab308",
                "#3b82f6",
                "#ec4899",
                "#8b5cf6",
                "#06b6d4",
                "#f97316"
              ],
              borderWidth: 2,
              borderColor: isDark ? "#0f172a" : "#ffffff"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: textColor, font: { family: "Plus Jakarta Sans", size: 12, weight: "700" }, boxWidth: 14 }
            }
          },
          cutout: "55%"
        }
      });
    }
  }

  // --- TAB 2: STOCK INVENTORY ---
  renderStockTable() {
    const tbody = document.getElementById("stock-table-body");
    if (!tbody) return;

    const items = window.hsStore.getItems({
      category: this.stockFilterCategory,
      type: this.stockFilterType,
      search: this.stockSearchQuery
    });

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
            <i class="fa-solid fa-box-open text-4xl mb-3 block opacity-40"></i>
            <span data-i18n="emptyTable">${window.hsI18n.t("emptyTable")}</span>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map((item) => {
      const qty = Number(item.quantity) || 0;
      const threshold = Number(item.threshold) || 0;
      const cost = Number(item.costPrice) || 0;
      const sell = Number(item.sellingPrice) || 0;
      const totalVal = qty * cost;

      let statusBadge = "";
      if (qty === 0) {
        statusBadge = `<span class="px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 flex items-center gap-1.5 w-max"><span class="w-2 h-2 rounded-full bg-red-600"></span> ${window.hsI18n.t("statusOutOfStock")}</span>`;
      } else if (qty <= threshold) {
        statusBadge = `<span class="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1.5 w-max"><span class="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span> ${window.hsI18n.t("statusLowStock")}</span>`;
      } else {
        statusBadge = `<span class="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1.5 w-max"><span class="w-2 h-2 rounded-full bg-emerald-600"></span> ${window.hsI18n.t("statusInStock")}</span>`;
      }

      return `
        <tr class="table-hover-row border-b border-gray-100 dark:border-slate-800 transition-colors">
          <td class="py-4 px-5">
            <div class="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">${item.name}</div>
            <div class="text-xs text-gray-400 mt-0.5">ID: ${item.id}</div>
          </td>
          <td class="py-4 px-5 text-sm font-semibold text-gray-700 dark:text-gray-300">
            ${window.hsI18n.t(item.category) || item.category}
          </td>
          <td class="py-4 px-5 text-sm font-medium text-gray-500">
            ${window.hsI18n.t(item.unit) || item.unit}
          </td>
          <td class="py-4 px-5 text-base font-black ${qty <= threshold ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-gray-100"}">
            ${qty}
          </td>
          <td class="py-4 px-5 text-sm text-gray-500 font-medium">
            ${threshold}
          </td>
          <td class="py-4 px-5 text-sm font-bold text-gray-700 dark:text-gray-300">
            ৳${cost.toLocaleString()}
          </td>
          <td class="py-4 px-5 text-sm font-bold text-gray-700 dark:text-gray-300">
            ${sell > 0 ? `৳${sell.toLocaleString()}` : `<span class="text-gray-300 dark:text-gray-600">-</span>`}
          </td>
          <td class="py-4 px-5 text-base font-black text-brand-800 dark:text-brand-300">
            ৳${totalVal.toLocaleString()}
          </td>
          <td class="py-4 px-5">
            ${statusBadge}
          </td>
          <td class="py-4 px-5 text-right">
            <div class="inline-flex items-center gap-1.5">
              <button 
                onclick="window.hsApp.openQuickStockModal('${item.id}', 1)"
                title="Stock In (+)"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs sm:text-sm transition-colors"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
              <button 
                onclick="window.hsApp.openQuickStockModal('${item.id}', -1)"
                title="Stock Out (-)"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs sm:text-sm transition-colors"
              >
                <i class="fa-solid fa-minus"></i>
              </button>
              <button 
                onclick="window.hsApp.openEditItemModal('${item.id}')"
                title="Edit"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-xs sm:text-sm transition-colors"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button 
                onclick="window.hsApp.deleteItemPrompt('${item.id}')"
                title="Delete"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-xs sm:text-sm transition-colors"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // --- TAB 3: COSTING & EXPENSES ---
  renderExpensesTable() {
    const tbody = document.getElementById("expenses-table-body");
    const totalEl = document.getElementById("expenses-total-amount");
    if (!tbody) return;

    const m = window.hsStore.selectedMonthFilter;
    const y = window.hsStore.selectedYearFilter;
    const expenses = window.hsStore.getExpenses(m, y);

    const total = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    if (totalEl) totalEl.textContent = window.hsI18n.formatCurrency(total);

    if (expenses.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
            <i class="fa-solid fa-receipt text-4xl mb-3 block opacity-40"></i>
            <span data-i18n="emptyTable">${window.hsI18n.t("emptyTable")}</span>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = expenses.map((e) => `
      <tr class="table-hover-row border-b border-gray-100 dark:border-slate-800 transition-colors">
        <td class="py-4 px-5 text-sm font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
          ${e.date}
        </td>
        <td class="py-4 px-5">
          <span class="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
            ${window.hsI18n.t(e.category) || e.category}
          </span>
        </td>
        <td class="py-4 px-5 text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">
          ${e.title}
        </td>
        <td class="py-4 px-5 text-sm text-gray-500 dark:text-gray-400">
          ${e.vendor || "-"}
        </td>
        <td class="py-4 px-5 text-sm font-semibold text-gray-600 dark:text-gray-400">
          ${window.hsI18n.t(e.method) || e.method}
        </td>
        <td class="py-4 px-5 text-base sm:text-lg font-black text-red-600 dark:text-red-400">
          ৳${Number(e.amount).toLocaleString()}
        </td>
        <td class="py-4 px-5 text-right">
          <button 
            onclick="window.hsApp.deleteExpensePrompt('${e.id}')"
            class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-xs sm:text-sm transition-colors ml-auto"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join("");
  }

  // --- TAB 4: SALES & INCOME ---
  renderIncomeTable() {
    const tbody = document.getElementById("sales-table-body");
    const totalEl = document.getElementById("sales-total-amount");
    if (!tbody) return;

    const m = window.hsStore.selectedMonthFilter;
    const y = window.hsStore.selectedYearFilter;
    const sales = window.hsStore.getSales(m, y);

    const total = sales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    if (totalEl) totalEl.textContent = window.hsI18n.formatCurrency(total);

    if (sales.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
            <i class="fa-solid fa-cash-register text-4xl mb-3 block opacity-40"></i>
            <span data-i18n="emptyTable">${window.hsI18n.t("emptyTable")}</span>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = sales.map((s) => {
      const netGain = (Number(s.total) || 0) - (Number(s.cost) || 0);
      return `
        <tr class="table-hover-row border-b border-gray-100 dark:border-slate-800 transition-colors">
          <td class="py-4 px-5 text-sm font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
            ${s.date}
          </td>
          <td class="py-4 px-5 font-bold text-sm sm:text-base text-gray-800 dark:text-gray-200">
            ${s.item}
          </td>
          <td class="py-4 px-5 text-sm font-black text-gray-700 dark:text-gray-300">
            ${s.quantity}
          </td>
          <td class="py-4 px-5 text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
            ৳${Number(s.total).toLocaleString()}
          </td>
          <td class="py-4 px-5 text-sm text-gray-500">
            ${s.cost ? `৳${Number(s.cost).toLocaleString()}` : "-"}
          </td>
          <td class="py-4 px-5 text-base font-black text-brand-700 dark:text-brand-300">
            ৳${netGain.toLocaleString()}
          </td>
          <td class="py-4 px-5 text-right">
            <button 
              onclick="window.hsApp.deleteSalePrompt('${s.id}')"
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-xs sm:text-sm transition-colors ml-auto"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  // --- TAB 5: EMPLOYEES ---
  renderEmployeesTable() {
    const tbody = document.getElementById("employees-table-body");
    const totalPayrollEl = document.getElementById("payroll-total-amount");
    if (!tbody) return;

    const staff = window.hsStore.getEmployees();
    const activeStaff = staff.filter((s) => s.status !== "statusResigned");
    const totalSalary = activeStaff.reduce((sum, s) => sum + (Number(s.salary) || 0), 0);

    if (totalPayrollEl) totalPayrollEl.textContent = window.hsI18n.formatCurrency(totalSalary);

    if (staff.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
            <i class="fa-solid fa-user-group text-4xl mb-3 block opacity-40"></i>
            <span data-i18n="emptyTable">${window.hsI18n.t("emptyTable")}</span>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = staff.map((emp) => {
      let statusColor = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300";
      if (emp.status === "statusLeave") statusColor = "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300";
      if (emp.status === "statusResigned") statusColor = "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400";

      return `
        <tr class="table-hover-row border-b border-gray-100 dark:border-slate-800 transition-colors">
          <td class="py-4 px-5">
            <div class="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100">${emp.name}</div>
          </td>
          <td class="py-4 px-5 text-sm font-bold text-brand-700 dark:text-brand-300">
            ${emp.role}
          </td>
          <td class="py-4 px-5 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="tel:${emp.phone}" class="hover:underline flex items-center gap-1.5">
              <i class="fa-solid fa-phone text-xs text-gray-400"></i> ${emp.phone}
            </a>
          </td>
          <td class="py-4 px-5 text-base sm:text-lg font-black text-gray-900 dark:text-gray-100">
            ৳${Number(emp.salary).toLocaleString()}
          </td>
          <td class="py-4 px-5 text-sm text-gray-500">
            ${emp.joinDate || "-"}
          </td>
          <td class="py-4 px-5">
            <span class="px-3 py-1.5 rounded-full text-xs font-bold ${statusColor}">
              ${window.hsI18n.t(emp.status) || emp.status}
            </span>
          </td>
          <td class="py-4 px-5 text-right">
            <div class="inline-flex items-center gap-2">
              <button 
                onclick="window.hsApp.openEditEmployeeModal('${emp.id}')"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-xs sm:text-sm transition-colors"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button 
                onclick="window.hsApp.deleteEmployeePrompt('${emp.id}')"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-xs sm:text-sm transition-colors"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // --- TAB 6: REPORTS & EXPORT/IMPORT ---
  renderReportsTab() {
    const previewContainer = document.getElementById("report-preview-summary");
    if (!previewContainer) return;

    const m = window.hsStore.selectedMonthFilter;
    const y = window.hsStore.selectedYearFilter;
    const monthName = m === "all" ? window.hsI18n.t("allMonths") : window.hsI18n.getMonthName(Number(m));

    const fin = window.hsStore.getFinancialMetrics(m, y);
    const stock = window.hsStore.getStockMetrics();

    previewContainer.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-800">
          <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">${window.hsI18n.t("kpiIncome")}</p>
          <p class="text-xl font-heading font-extrabold text-emerald-600 mt-1">${window.hsI18n.formatCurrency(fin.totalIncome)}</p>
        </div>
        <div class="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-800">
          <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">${window.hsI18n.t("kpiExpense")}</p>
          <p class="text-xl font-heading font-extrabold text-red-600 mt-1">${window.hsI18n.formatCurrency(fin.totalExpenses)}</p>
        </div>
        <div class="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-800">
          <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">${window.hsI18n.t("kpiNetProfit")}</p>
          <p class="text-xl font-heading font-extrabold ${fin.netProfit >= 0 ? "text-brand-700 dark:text-brand-400" : "text-red-600"} mt-1">
            ${window.hsI18n.formatCurrency(fin.netProfit)}
          </p>
        </div>
        <div class="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-800">
          <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">${window.hsI18n.t("kpiStockValue")}</p>
          <p class="text-xl font-heading font-extrabold text-teal-700 dark:text-teal-400 mt-1">${window.hsI18n.formatCurrency(stock.totalValue)}</p>
        </div>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
        <i class="fa-solid fa-calendar-check mr-1 text-brand-600"></i>
        ${window.hsI18n.t("filterMonth")}: <span class="font-bold text-gray-800 dark:text-gray-200">${monthName} ${y}</span>
      </p>
    `;
  }

  // --- MODAL CONTROLLERS ---
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  }

  // Stock Add / Edit Modal
  openAddItemModal() {
    document.getElementById("modal-stock-title").textContent = window.hsI18n.t("modalAddItemTitle");
    document.getElementById("stock-form").reset();
    document.getElementById("stock-item-id").value = "";
    this.openModal("modal-stock");
  }

  openEditItemModal(id) {
    const item = window.hsStore.getItemById(id);
    if (!item) return;

    document.getElementById("modal-stock-title").textContent = window.hsI18n.t("modalEditItemTitle");
    document.getElementById("stock-item-id").value = item.id;
    document.getElementById("stock-item-name").value = item.name;
    document.getElementById("stock-item-category").value = item.category || "catRaw";
    document.getElementById("stock-item-type").value = item.type || "typeRaw";
    document.getElementById("stock-item-unit").value = item.unit || "unitKg";
    document.getElementById("stock-item-qty").value = item.quantity;
    document.getElementById("stock-item-threshold").value = item.threshold;
    document.getElementById("stock-item-cost").value = item.costPrice;
    document.getElementById("stock-item-sell").value = item.sellingPrice || "";

    this.openModal("modal-stock");
  }

  saveStockForm(e) {
    e.preventDefault();
    const id = document.getElementById("stock-item-id").value;
    const name = document.getElementById("stock-item-name").value.trim();
    const category = document.getElementById("stock-item-category").value;
    const type = document.getElementById("stock-item-type").value;
    const unit = document.getElementById("stock-item-unit").value;
    const quantity = Number(document.getElementById("stock-item-qty").value) || 0;
    const threshold = Number(document.getElementById("stock-item-threshold").value) || 0;
    const costPrice = Number(document.getElementById("stock-item-cost").value) || 0;
    const sellingPrice = Number(document.getElementById("stock-item-sell").value) || 0;

    if (!name) return;

    window.hsStore.saveItem({
      id: id || undefined,
      name,
      category,
      type,
      unit,
      quantity,
      threshold,
      costPrice,
      sellingPrice
    });

    this.closeModal("modal-stock");
    this.showToast(window.hsI18n.t("toastItemSaved"));
  }

  deleteItemPrompt(id) {
    if (confirm(window.hsI18n.t("confirmDelete"))) {
      window.hsStore.deleteItem(id);
      this.showToast(window.hsI18n.t("toastItemDeleted"));
    }
  }

  // Quick Stock In / Out Modal
  openQuickStockModal(id, defaultDirection = 1) {
    const item = window.hsStore.getItemById(id);
    if (!item) return;

    document.getElementById("quick-stock-item-id").value = item.id;
    document.getElementById("quick-stock-item-name").textContent = item.name;
    document.getElementById("quick-stock-current-qty").textContent = `${item.quantity} ${window.hsI18n.t(item.unit)}`;
    document.getElementById("quick-stock-qty").value = "5";
    document.getElementById("quick-stock-reason").value = "";

    const directionSelect = document.getElementById("quick-stock-direction");
    if (directionSelect) directionSelect.value = String(defaultDirection);

    const titleEl = document.getElementById("quick-stock-title");
    if (titleEl) {
      titleEl.textContent = defaultDirection > 0 ? window.hsI18n.t("modalStockInTitle") : window.hsI18n.t("modalStockOutTitle");
    }

    this.openModal("modal-quick-stock");
  }

  saveQuickStockForm(e) {
    e.preventDefault();
    const id = document.getElementById("quick-stock-item-id").value;
    const direction = Number(document.getElementById("quick-stock-direction").value) || 1;
    const qty = Number(document.getElementById("quick-stock-qty").value) || 0;
    const reason = document.getElementById("quick-stock-reason").value.trim();

    if (qty <= 0) return;

    window.hsStore.adjustStock(id, direction * qty, reason);
    this.closeModal("modal-quick-stock");
    this.showToast(window.hsI18n.t("toastStockAdjusted"));
  }

  // Expense Modal
  openAddExpenseModal() {
    document.getElementById("expense-form").reset();
    document.getElementById("expense-date").value = new Date().toISOString().split("T")[0];
    this.openModal("modal-expense");
  }

  saveExpenseForm(e) {
    e.preventDefault();
    const date = document.getElementById("expense-date").value;
    const category = document.getElementById("expense-category").value;
    const title = document.getElementById("expense-title").value.trim();
    const vendor = document.getElementById("expense-vendor").value.trim();
    const method = document.getElementById("expense-method").value;
    const amount = Number(document.getElementById("expense-amount").value) || 0;

    if (!title || amount <= 0) return;

    window.hsStore.saveExpense({ date, category, title, vendor, method, amount });
    this.closeModal("modal-expense");
    this.showToast(window.hsI18n.t("toastExpenseSaved"));
  }

  deleteExpensePrompt(id) {
    if (confirm(window.hsI18n.t("confirmDelete"))) {
      window.hsStore.deleteExpense(id);
    }
  }

  // Sale Modal
  openAddSaleModal() {
    document.getElementById("sale-form").reset();
    document.getElementById("sale-date").value = new Date().toISOString().split("T")[0];

    // Populate dropdown with finished food items
    const foodSelect = document.getElementById("sale-food-select");
    if (foodSelect) {
      const items = window.hsStore.getItems({ type: "typeFinished" });
      foodSelect.innerHTML = items
        .map((i) => `<option value="${i.name}" data-price="${i.sellingPrice}" data-cost="${i.costPrice}">${i.name} (৳${i.sellingPrice})</option>`)
        .join("");
    }

    this.openModal("modal-sale");
  }

  saveSaleForm(e) {
    e.preventDefault();
    const date = document.getElementById("sale-date").value;
    const item = document.getElementById("sale-food-select").value || document.getElementById("sale-item-custom").value.trim();
    const quantity = Number(document.getElementById("sale-qty").value) || 1;
    const total = Number(document.getElementById("sale-total").value) || 0;
    const cost = Number(document.getElementById("sale-cost").value) || 0;
    const method = document.getElementById("sale-method").value;

    if (!item || total <= 0) return;

    window.hsStore.saveSale({ date, item, quantity, total, cost, method });
    this.closeModal("modal-sale");
    this.showToast(window.hsI18n.t("toastSaleSaved"));
  }

  deleteSalePrompt(id) {
    if (confirm(window.hsI18n.t("confirmDelete"))) {
      window.hsStore.deleteSale(id);
    }
  }

  // Employee Modal
  openAddEmployeeModal() {
    document.getElementById("modal-emp-title").textContent = window.hsI18n.t("modalAddEmployeeTitle");
    document.getElementById("employee-form").reset();
    document.getElementById("emp-id").value = "";
    document.getElementById("emp-joindate").value = new Date().toISOString().split("T")[0];
    this.openModal("modal-employee");
  }

  openEditEmployeeModal(id) {
    const emp = window.hsStore.getEmployees().find((e) => e.id === id);
    if (!emp) return;

    document.getElementById("modal-emp-title").textContent = window.hsI18n.t("modalEditEmployeeTitle");
    document.getElementById("emp-id").value = emp.id;
    document.getElementById("emp-name").value = emp.name;
    document.getElementById("emp-role").value = emp.role;
    document.getElementById("emp-phone").value = emp.phone;
    document.getElementById("emp-salary").value = emp.salary;
    document.getElementById("emp-joindate").value = emp.joinDate || "";
    document.getElementById("emp-status").value = emp.status || "statusActive";

    this.openModal("modal-employee");
  }

  saveEmployeeForm(e) {
    e.preventDefault();
    const id = document.getElementById("emp-id").value;
    const name = document.getElementById("emp-name").value.trim();
    const role = document.getElementById("emp-role").value.trim();
    const phone = document.getElementById("emp-phone").value.trim();
    const salary = Number(document.getElementById("emp-salary").value) || 0;
    const joinDate = document.getElementById("emp-joindate").value;
    const status = document.getElementById("emp-status").value;

    if (!name) return;

    window.hsStore.saveEmployee({
      id: id || undefined,
      name,
      role,
      phone,
      salary,
      joinDate,
      status
    });

    this.closeModal("modal-employee");
    this.showToast(window.hsI18n.t("toastStaffSaved"));
  }

  deleteEmployeePrompt(id) {
    if (confirm(window.hsI18n.t("confirmDelete"))) {
      window.hsStore.deleteEmployee(id);
    }
  }

  postPayrollPrompt() {
    const m = window.hsStore.selectedMonthFilter;
    const y = window.hsStore.selectedYearFilter;
    const monthName = m === "all" ? window.hsI18n.t("allMonths") : window.hsI18n.getMonthName(Number(m));

    const totalPosted = window.hsStore.postPayrollToExpenses(monthName, y);
    if (totalPosted > 0) {
      this.showToast(`${window.hsI18n.t("payrollPostedSuccess")} (৳${totalPosted.toLocaleString()})`);
    } else {
      alert("No active employees with valid salary found.");
    }
  }

  // --- IMPORT / RESTORE ---
  openImportModal() {
    this.openModal("modal-import");
  }

  // --- EXPORT REPORT MODAL ---
  openExportModal(defaultType = "stock", defaultFormat = "pdf") {
    const typeSelect = document.getElementById("export-report-type");
    const formatSelect = document.getElementById("export-format");
    const periodSelect = document.getElementById("export-period");
    const monthSelect = document.getElementById("export-month");
    const yearSelect = document.getElementById("export-year");

    if (typeSelect) typeSelect.value = defaultType;
    if (formatSelect) formatSelect.value = defaultFormat;
    if (periodSelect) {
      // Default to "today" if stock is selected, otherwise "month"
      periodSelect.value = defaultType === "stock" ? "today" : "month";
    }
    if (monthSelect) monthSelect.value = String(window.hsStore.selectedMonthFilter || window.hsStore.currentMonth);
    if (yearSelect) yearSelect.value = String(window.hsStore.selectedYearFilter || window.hsStore.currentYear);

    this.updateExportPeriodVisibility();
    this.openModal("modal-export-report");
  }

  updateExportPeriodVisibility() {
    const periodSelect = document.getElementById("export-period");
    const monthRow = document.getElementById("export-month-row");
    if (!periodSelect || !monthRow) return;

    if (periodSelect.value === "month") {
      monthRow.classList.remove("hidden");
    } else {
      monthRow.classList.add("hidden");
    }
  }

  handleExportSubmit(e) {
    e.preventDefault();
    const type = document.getElementById("export-report-type").value;
    const format = document.getElementById("export-format").value;
    const period = document.getElementById("export-period").value;
    const month = document.getElementById("export-month").value;
    const year = document.getElementById("export-year").value;

    window.hsReports.dispatchExport(type, format, period, month, year);
    this.closeModal("modal-export-report");
    this.showToast(format === "pdf" ? "PDF Report downloaded successfully!" : "CSV spreadsheet exported successfully!");
  }

  handleImportFile() {
    const fileInput = document.getElementById("import-file-input");
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a JSON backup file first.");
      return;
    }
    const file = fileInput.files[0];
    if (confirm(window.hsI18n.t("confirmRestore"))) {
      window.hsReports.importJSONFile(
        file,
        () => {
          this.closeModal("modal-import");
          this.showToast(window.hsI18n.t("toastDataRestored"));
        },
        () => {
          alert(window.hsI18n.t("toastInvalidData"));
        }
      );
    }
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `px-4 py-3 rounded-xl shadow-lg text-white font-medium text-xs flex items-center gap-2 transform transition-all duration-300 translate-y-2 opacity-0 ${
      type === "success" ? "bg-emerald-600" : "bg-red-600"
    }`;
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove("translate-y-2", "opacity-0");
    }, 10);

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- BIND ALL UI EVENTS ---
  bindEvents() {
    // Nav Tabs Click
    document.querySelectorAll(".nav-link").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        if (tab) this.switchTab(tab);
      });
    });

    // Theme Switch
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => this.toggleTheme());
    }

    // Language Toggle
    const bnBtn = document.getElementById("lang-btn-bn");
    const enBtn = document.getElementById("lang-btn-en");
    if (bnBtn) bnBtn.addEventListener("click", () => window.hsI18n.setLang("bn"));
    if (enBtn) enBtn.addEventListener("click", () => window.hsI18n.setLang("en"));

    // Global Month / Year Filter Change
    const monthSelect = document.getElementById("filter-month-select");
    const yearSelect = document.getElementById("filter-year-select");

    if (monthSelect) {
      // Set initial value to current month
      monthSelect.value = String(window.hsStore.currentMonth);
      window.hsStore.selectedMonthFilter = monthSelect.value;

      monthSelect.addEventListener("change", (e) => {
        window.hsStore.selectedMonthFilter = e.target.value;
        this.renderAll();
      });
    }

    if (yearSelect) {
      yearSelect.addEventListener("change", (e) => {
        window.hsStore.selectedYearFilter = e.target.value;
        this.renderAll();
      });
    }

    // Stock Tab Filters
    const stockSearch = document.getElementById("stock-search-input");
    if (stockSearch) {
      stockSearch.addEventListener("input", (e) => {
        this.stockSearchQuery = e.target.value;
        this.renderStockTable();
      });
    }

    const stockCatFilter = document.getElementById("stock-category-filter");
    if (stockCatFilter) {
      stockCatFilter.addEventListener("change", (e) => {
        this.stockFilterCategory = e.target.value;
        this.renderStockTable();
      });
    }

    document.querySelectorAll(".stock-type-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".stock-type-pill").forEach((p) => {
          p.classList.remove("bg-brand-700", "text-white");
          p.classList.add("bg-gray-100", "text-gray-700", "dark:bg-slate-800", "dark:text-gray-300");
        });
        pill.classList.add("bg-brand-700", "text-white");
        pill.classList.remove("bg-gray-100", "text-gray-700", "dark:bg-slate-800", "dark:text-gray-300");

        this.stockFilterType = pill.getAttribute("data-type") || "all";
        this.renderStockTable();
      });
    });

    // Mobile Drawer Toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileDrawer = document.getElementById("mobile-drawer");
    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileDrawer.classList.toggle("hidden");
      });
    }

    // Modal Form Submissions
    const stockForm = document.getElementById("stock-form");
    if (stockForm) stockForm.addEventListener("submit", (e) => this.saveStockForm(e));

    const quickStockForm = document.getElementById("quick-stock-form");
    if (quickStockForm) quickStockForm.addEventListener("submit", (e) => this.saveQuickStockForm(e));

    const expenseForm = document.getElementById("expense-form");
    if (expenseForm) expenseForm.addEventListener("submit", (e) => this.saveExpenseForm(e));

    const saleForm = document.getElementById("sale-form");
    if (saleForm) saleForm.addEventListener("submit", (e) => this.saveSaleForm(e));

    const empForm = document.getElementById("employee-form");
    if (empForm) empForm.addEventListener("submit", (e) => this.saveEmployeeForm(e));

    // Dynamic price calculation on sale modal
    const saleFoodSelect = document.getElementById("sale-food-select");
    const saleQtyInput = document.getElementById("sale-qty");
    const saleTotalInput = document.getElementById("sale-total");
    const saleCostInput = document.getElementById("sale-cost");

    const updateSaleTotals = () => {
      const selected = saleFoodSelect ? saleFoodSelect.options[saleFoodSelect.selectedIndex] : null;
      if (selected && selected.dataset.price) {
        const price = Number(selected.dataset.price) || 0;
        const cost = Number(selected.dataset.cost) || 0;
        const qty = Number(saleQtyInput.value) || 1;
        saleTotalInput.value = price * qty;
        saleCostInput.value = cost * qty;
      }
    };

    if (saleFoodSelect) saleFoodSelect.addEventListener("change", updateSaleTotals);
    if (saleQtyInput) saleQtyInput.addEventListener("input", updateSaleTotals);

    // Export Report Form Event Listeners
    const exportForm = document.getElementById("export-report-form");
    if (exportForm) exportForm.addEventListener("submit", (e) => this.handleExportSubmit(e));

    const exportPeriod = document.getElementById("export-period");
    if (exportPeriod) exportPeriod.addEventListener("change", () => this.updateExportPeriodVisibility());
  }
}

window.hsApp = new HealthSharkApp();
document.addEventListener("DOMContentLoaded", () => {
  window.hsApp.init();
});
