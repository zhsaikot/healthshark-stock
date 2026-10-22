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

    // Invoice Draft & State
    this.invoiceDraftItems = [];
    this.editingInvoiceId = null;

    // Calculator State
    this.calcCurrentValue = "0";
    this.calcPreviousValue = null;
    this.calcOperator = null;
    this.calcWaitingForSecondOperand = false;
    this.calcHistoryTape = [];
  }

  async init() {
    // 1. Initialize Theme
    this.applyTheme(this.theme);

    // 2. Initialize Sidebar Navigation
    this.initSidebar();

    // 3. Initialize Data Store
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

  // --- SIDEBAR COLLAPSE / EXPAND MANAGEMENT ---
  initSidebar() {
    const isCollapsed = localStorage.getItem("hs_sidebar_collapsed") === "true";
    this.setSidebarCollapsed(isCollapsed, false);

    // Desktop Toggle Button (inside sidebar)
    const toggleBtn = document.getElementById("sidebar-toggle-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => this.toggleSidebar());
    }

    // Topbar Sidebar Toggle Button
    const topbarToggleBtn = document.getElementById("topbar-sidebar-toggle-btn");
    if (topbarToggleBtn) {
      topbarToggleBtn.addEventListener("click", () => this.toggleSidebar());
    }

    // Mobile Open Drawer
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", () => this.toggleMobileSidebar(true));
    }

    // Mobile Close Drawer
    const mobileCloseBtn = document.getElementById("sidebar-close-mobile");
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener("click", () => this.toggleMobileSidebar(false));
    }

    // Backdrop Click
    const backdrop = document.getElementById("sidebar-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", () => this.toggleMobileSidebar(false));
    }

    // Keyboard shortcut (Alt + S or Ctrl + B)
    window.addEventListener("keydown", (e) => {
      if ((e.altKey && e.key.toLowerCase() === "s") || (e.ctrlKey && e.key.toLowerCase() === "b")) {
        e.preventDefault();
        this.toggleSidebar();
      }
    });
  }

  toggleSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    if (!sidebar) return;
    const isCurrentlyCollapsed = sidebar.classList.contains("collapsed");
    this.setSidebarCollapsed(!isCurrentlyCollapsed, true);
  }

  setSidebarCollapsed(collapsed, save = true) {
    const sidebar = document.getElementById("app-sidebar");
    const toggleIcon = document.getElementById("sidebar-toggle-icon");
    if (!sidebar) return;

    if (collapsed) {
      sidebar.classList.add("collapsed");
      if (toggleIcon) {
        toggleIcon.classList.remove("fa-angles-left");
        toggleIcon.classList.add("fa-angles-right");
      }
    } else {
      sidebar.classList.remove("collapsed");
      if (toggleIcon) {
        toggleIcon.classList.remove("fa-angles-right");
        toggleIcon.classList.add("fa-angles-left");
      }
    }

    if (save) {
      localStorage.setItem("hs_sidebar_collapsed", collapsed ? "true" : "false");
    }

    // Trigger Chart.js resize once sidebar animation finishes
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 320);
  }

  toggleMobileSidebar(open) {
    const sidebar = document.getElementById("app-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (!sidebar) return;

    if (open) {
      sidebar.classList.add("mobile-open");
      if (backdrop) backdrop.classList.add("active");
      document.body.classList.add("overflow-hidden", "lg:overflow-auto");
    } else {
      sidebar.classList.remove("mobile-open");
      if (backdrop) backdrop.classList.remove("active");
      document.body.classList.remove("overflow-hidden", "lg:overflow-auto");
    }
  }

  // --- TAB NAVIGATION ---
  switchTab(tabId) {
    this.currentTab = tabId;

    // Update active nav links
    document.querySelectorAll(".nav-link").forEach((btn) => {
      const target = btn.getAttribute("data-tab");
      if (target === tabId) {
        btn.classList.add("active-tab", "bg-brand-700", "text-white", "shadow-md");
        btn.classList.remove("text-gray-600", "hover:bg-gray-100", "dark:text-gray-300", "dark:hover:bg-slate-800/80");
      } else {
        btn.classList.remove("active-tab", "bg-brand-700", "text-white", "shadow-md");
        btn.classList.add("text-gray-600", "hover:bg-gray-100", "dark:text-gray-300", "dark:hover:bg-slate-800/80");
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

    // Close mobile drawer / sidebar if open
    this.toggleMobileSidebar(false);
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
      case "invoice":
        this.renderInvoiceTab();
        break;
      case "calculator":
        this.renderCalculatorTab();
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
      if (fin.netProfit >= 0) {
        elProfitMargin.className = "px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0";
      } else {
        elProfitMargin.className = "px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 shrink-0";
      }
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
          <td colspan="11" class="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
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
      const totalCost = qty * cost;
      const totalSell = qty * sell;

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
            ৳${totalCost.toLocaleString()}
          </td>
          <td class="py-4 px-5 text-base font-black text-emerald-700 dark:text-emerald-400">
            ${sell > 0 ? `৳${totalSell.toLocaleString()}` : `<span class="text-gray-300 dark:text-gray-600">-</span>`}
          </td>
          <td class="py-4 px-5">
            ${statusBadge}
          </td>
          <td class="py-4 px-5 text-right">
            <div class="inline-flex items-center gap-1.5">
              <button 
                onclick="window.hsApp.quickAdjustStock('${item.id}', 1)"
                title="+1 (Add 1)"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 hover:bg-emerald-200 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center text-xs sm:text-sm transition-all active:scale-90 shadow-sm"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
              <button 
                onclick="window.hsApp.quickAdjustStock('${item.id}', -1)"
                title="-1 (Deduct 1)"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 hover:bg-amber-200 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-400 font-black flex items-center justify-center text-xs sm:text-sm transition-all active:scale-90 shadow-sm"
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
          <div class="inline-flex items-center gap-2">
            <button 
              onclick="window.hsApp.openEditExpenseModal('${e.id}')"
              title="${window.hsI18n.t('editExpense')}"
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-xs sm:text-sm transition-colors"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button 
              onclick="window.hsApp.deleteExpensePrompt('${e.id}')"
              title="${window.hsI18n.t('btnDelete')}"
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-xs sm:text-sm transition-colors"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
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
            <div class="inline-flex items-center gap-2">
              <button 
                onclick="window.hsApp.openEditSaleModal('${s.id}')"
                title="${window.hsI18n.t('editSale')}"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-xs sm:text-sm transition-colors"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button 
                onclick="window.hsApp.deleteSalePrompt('${s.id}')"
                title="${window.hsI18n.t('btnDelete')}"
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

  // --- TAB 7: INVOICE GENERATOR ---
  renderInvoiceTab() {
    const invNoInput = document.getElementById("inv-number");
    const invDateInput = document.getElementById("inv-date");
    if (invNoInput && !invNoInput.value) {
      invNoInput.value = window.hsStore.getNextInvoiceNumber();
    }
    if (invDateInput && !invDateInput.value) {
      invDateInput.value = new Date().toISOString().split("T")[0];
    }

    // Populate Item Selector Dropdown
    const itemSelect = document.getElementById("inv-item-select");
    if (itemSelect) {
      const items = window.hsStore.getItems();
      let optHtml = `<option value="">-- ${window.hsI18n.t("invoiceItemSelect")} --</option>`;
      items.forEach((item) => {
        const price = item.sellingPrice || item.costPrice || 0;
        const cost = item.costPrice || 0;
        const unit = window.hsI18n.t(item.unit) || item.unit || "";
        const stockLabel = window.hsI18n.getLang() === "bn" ? "স্টক" : "Stock";
        optHtml += `<option value="${item.id}" data-name="${item.name}" data-price="${price}" data-cost="${cost}" data-unit="${item.unit || ""}" data-stock="${item.quantity}">
          ${item.name} (৳${price}) [${stockLabel}: ${item.quantity} ${unit}]
        </option>`;
      });
      itemSelect.innerHTML = optHtml;
    }

    this.renderInvoiceDraftItems();
    this.calculateInvoiceTotals();
    this.renderInvoicesHistoryTable();
  }

  onInvoiceItemSelectChange() {
    const select = document.getElementById("inv-item-select");
    const priceInput = document.getElementById("inv-item-price");
    const customNameInput = document.getElementById("inv-custom-name");
    if (!select || !priceInput) return;

    const opt = select.selectedOptions[0];
    if (opt && opt.value) {
      const price = opt.getAttribute("data-price") || 0;
      priceInput.value = price;
      if (customNameInput) customNameInput.value = "";
    }
  }

  addInvoiceDraftItem() {
    const select = document.getElementById("inv-item-select");
    const customNameInput = document.getElementById("inv-custom-name");
    const qtyInput = document.getElementById("inv-item-qty");
    const priceInput = document.getElementById("inv-item-price");

    let itemId = null;
    let name = "";
    let unit = "";
    let costPrice = 0;
    const selectedOpt = select ? select.selectedOptions[0] : null;

    if (customNameInput && customNameInput.value.trim()) {
      name = customNameInput.value.trim();
      const clean = name.toLowerCase();
      const allItems = window.hsStore.getItems();
      const matched = allItems.find((i) => (i.name || "").trim().toLowerCase() === clean) ||
                      allItems.find((i) => {
                        const iName = (i.name || "").toLowerCase();
                        return iName.includes(clean) || clean.includes(iName);
                      });
      if (matched) {
        itemId = matched.id;
        unit = unit || matched.unit;
        costPrice = costPrice || matched.costPrice;
      }
    } else if (selectedOpt && selectedOpt.value) {
      itemId = selectedOpt.value;
      name = selectedOpt.getAttribute("data-name");
      unit = selectedOpt.getAttribute("data-unit") || "";
      costPrice = Number(selectedOpt.getAttribute("data-cost")) || 0;
    }

    if (!name) {
      this.showToast(window.hsI18n.currentLang === "bn" ? "আইটেম নির্বাচন করুন অথবা নাম লিখুন" : "Please select an item or enter a custom name", "warning");
      return;
    }

    const qty = Math.max(1, Number(qtyInput ? qtyInput.value : 1) || 1);
    const price = Math.max(0, Number(priceInput ? priceInput.value : 0) || 0);

    this.invoiceDraftItems.push({
      itemId,
      name,
      qty,
      price,
      costPrice,
      unit
    });

    if (customNameInput) customNameInput.value = "";
    if (select) select.value = "";
    if (qtyInput) qtyInput.value = "1";
    if (priceInput) priceInput.value = "";

    this.renderInvoiceDraftItems();
    this.calculateInvoiceTotals();
  }

  removeInvoiceDraftItem(index) {
    if (index >= 0 && index < this.invoiceDraftItems.length) {
      this.invoiceDraftItems.splice(index, 1);
      this.renderInvoiceDraftItems();
      this.calculateInvoiceTotals();
    }
  }

  renderInvoiceDraftItems() {
    const tbody = document.getElementById("inv-draft-items-tbody");
    if (!tbody) return;

    if (this.invoiceDraftItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="py-6 text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
            ${window.hsI18n.t("noItemsAddedYet")}
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.invoiceDraftItems
      .map(
        (item, idx) => `
      <tr class="border-b border-gray-100 dark:border-slate-800/80 text-xs sm:text-sm">
        <td class="py-3 px-3 text-gray-400 font-bold">${idx + 1}</td>
        <td class="py-3 px-3 font-bold text-gray-800 dark:text-gray-100">${item.name}</td>
        <td class="py-3 px-3 text-center font-bold text-gray-700 dark:text-gray-300">${item.qty} ${item.unit || ""}</td>
        <td class="py-3 px-3 text-right font-bold text-gray-700 dark:text-gray-300">৳${Number(item.price).toLocaleString()}</td>
        <td class="py-3 px-3 text-right font-black text-brand-700 dark:text-brand-400">৳${(item.qty * item.price).toLocaleString()}</td>
        <td class="py-3 px-2 text-center">
          <button onclick="window.hsApp.removeInvoiceDraftItem(${idx})" class="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center transition-colors">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </td>
      </tr>
    `
      )
      .join("");
  }

  calculateInvoiceTotals() {
    const subtotal = this.invoiceDraftItems.reduce((sum, item) => sum + item.qty * item.price, 0);
    const discountInput = document.getElementById("inv-discount");
    const deliveryInput = document.getElementById("inv-delivery");
    const paidInput = document.getElementById("inv-paid");

    const discount = Math.max(0, Number(discountInput ? discountInput.value : 0) || 0);
    const delivery = Math.max(0, Number(deliveryInput ? deliveryInput.value : 0) || 0);
    const grandTotal = Math.max(0, subtotal - discount + delivery);
    const paid = Math.max(0, Number(paidInput ? paidInput.value : 0) || 0);
    const due = Math.max(0, grandTotal - paid);

    const subtotalEl = document.getElementById("inv-subtotal-disp");
    const grandTotalEl = document.getElementById("inv-grand-total-disp");
    const dueEl = document.getElementById("inv-due-disp");

    if (subtotalEl) subtotalEl.textContent = `৳${subtotal.toLocaleString()}`;
    if (grandTotalEl) grandTotalEl.textContent = `৳${grandTotal.toLocaleString()}`;
    if (dueEl) {
      dueEl.value = `৳${due.toLocaleString()}`;
      dueEl.textContent = `৳${due.toLocaleString()}`;
      if (due > 0) {
        dueEl.classList.remove("text-emerald-600", "dark:text-emerald-400");
        dueEl.classList.add("text-rose-600", "dark:text-rose-400");
      } else {
        dueEl.classList.remove("text-rose-600", "dark:text-rose-400");
        dueEl.classList.add("text-emerald-600", "dark:text-emerald-400");
      }
    }
  }

  editInvoice(id) {
    const inv = window.hsStore.getInvoiceById(id);
    if (!inv) return;

    this.editingInvoiceId = id;

    // Switch to Invoice tab if not already active
    if (this.currentTab !== "invoice") {
      this.switchTab("invoice");
    }

    // Populate Fields
    document.getElementById("inv-number").value = inv.invoiceNumber;
    document.getElementById("inv-date").value = inv.date;
    document.getElementById("inv-order-type").value = inv.orderType || "Dine-in";
    document.getElementById("inv-customer-name").value = inv.customerName || "";
    document.getElementById("inv-customer-phone").value = inv.customerPhone || "";
    document.getElementById("inv-discount").value = inv.discount || 0;
    document.getElementById("inv-delivery").value = inv.deliveryFee || 0;
    document.getElementById("inv-paid").value = inv.paidAmount || 0;
    document.getElementById("inv-payment-method").value = inv.paymentMethod || "Cash";
    document.getElementById("inv-note").value = inv.note || "";

    // Draft items
    this.invoiceDraftItems = (inv.items || []).map((item) => ({
      itemId: item.itemId || null,
      name: item.name,
      qty: item.qty,
      price: item.price,
      costPrice: item.costPrice || 0,
      unit: item.unit || ""
    }));

    this.renderInvoiceDraftItems();
    this.calculateInvoiceTotals();

    // Show editing banner & update button texts
    const banner = document.getElementById("inv-editing-banner");
    const bannerNumber = document.getElementById("inv-editing-number");
    if (banner) banner.classList.remove("hidden");
    if (bannerNumber) bannerNumber.textContent = inv.invoiceNumber;

    const savePrintSpan = document.getElementById("inv-btn-save-print-span");
    const saveOnlySpan = document.getElementById("inv-btn-save-only-span");
    if (savePrintSpan) savePrintSpan.textContent = window.hsI18n.t("btnUpdateAndPrintInvoice");
    if (saveOnlySpan) saveOnlySpan.textContent = window.hsI18n.t("btnUpdateOnlyInvoice");

    // Scroll up smoothly to invoice form
    const tabInvoice = document.getElementById("tab-invoice");
    if (tabInvoice) {
      tabInvoice.scrollIntoView({ behavior: "smooth" });
    }
  }

  cancelInvoiceEdit() {
    this.editingInvoiceId = null;
    this.clearInvoiceForm();
  }

  handleCreateInvoice(printImmediately = false) {
    // Auto-commit pending item from inputs if user forgot to click the '+' button
    const select = document.getElementById("inv-item-select");
    const customNameInput = document.getElementById("inv-custom-name");
    const hasPendingItem = (select && select.value) || (customNameInput && customNameInput.value.trim());
    if (this.invoiceDraftItems.length === 0 && hasPendingItem) {
      this.addInvoiceDraftItem();
    }

    if (this.invoiceDraftItems.length === 0) {
      this.showToast(window.hsI18n.currentLang === "bn" ? "অনুগ্রহ করে অন্তত একটি আইটেম যোগ করুন" : "Please add at least one item to the invoice", "warning");
      return;
    }

    const invNumber = document.getElementById("inv-number").value.trim() || window.hsStore.getNextInvoiceNumber();
    const customerName = document.getElementById("inv-customer-name").value.trim() || "Walking Customer";
    const customerPhone = document.getElementById("inv-customer-phone").value.trim();
    const orderType = document.getElementById("inv-order-type").value || "Dine-in";
    const date = document.getElementById("inv-date").value || new Date().toISOString().split("T")[0];
    const paymentMethod = document.getElementById("inv-payment-method").value || "Cash";
    const note = document.getElementById("inv-note").value.trim();

    const subtotal = this.invoiceDraftItems.reduce((sum, item) => sum + item.qty * item.price, 0);
    const discount = Math.max(0, Number(document.getElementById("inv-discount").value) || 0);
    const deliveryFee = Math.max(0, Number(document.getElementById("inv-delivery").value) || 0);
    const grandTotal = Math.max(0, subtotal - discount + deliveryFee);
    const paidAmount = Math.max(0, Number(document.getElementById("inv-paid").value) || 0);
    const dueAmount = Math.max(0, grandTotal - paidAmount);

    let targetInvoice = null;

    if (this.editingInvoiceId) {
      targetInvoice = window.hsStore.updateInvoice(this.editingInvoiceId, {
        customerName,
        customerPhone,
        orderType,
        date,
        items: [...this.invoiceDraftItems],
        subtotal,
        discount,
        deliveryFee,
        grandTotal,
        paidAmount,
        dueAmount,
        paymentMethod,
        note
      });
    } else {
      targetInvoice = window.hsStore.addInvoice({
        invoiceNumber: invNumber,
        customerName,
        customerPhone,
        orderType,
        date,
        items: [...this.invoiceDraftItems],
        subtotal,
        discount,
        deliveryFee,
        grandTotal,
        paidAmount,
        dueAmount,
        paymentMethod,
        note
      });
    }

    // Auto-record to Sales if checkbox is checked
    const syncCheckbox = document.getElementById("inv-sync-sales");
    const shouldSyncToSales = syncCheckbox ? syncCheckbox.checked : true;

    if (shouldSyncToSales && targetInvoice) {
      const methodMap = {
        Cash: "payCash",
        bKash: "payBkash",
        Nagad: "payNagad",
        Card: "payBank",
        Other: "payCash"
      };
      const method = methodMap[paymentMethod] || "payCash";
      const totalQty = this.invoiceDraftItems.reduce((sum, i) => sum + (Number(i.qty) || 1), 0);
      const totalCost = this.invoiceDraftItems.reduce((sum, i) => sum + ((Number(i.qty) || 1) * (Number(i.costPrice) || 0)), 0);
      const itemsList = this.invoiceDraftItems.map((i) => `${i.name} (${i.qty})`).join(", ");

      const saleData = {
        date,
        item: `Invoice #${targetInvoice.invoiceNumber} - ${customerName} [${itemsList}]`,
        quantity: totalQty,
        total: grandTotal,
        cost: totalCost,
        method
      };

      if (this.editingInvoiceId) {
        window.hsStore.updateLinkedSale(targetInvoice.id, targetInvoice.invoiceNumber, saleData);
      } else {
        window.hsStore.saveSale({
          ...saleData,
          invoiceId: targetInvoice.id,
          invoiceNumber: targetInvoice.invoiceNumber
        });
      }

      this.showToast(
        this.editingInvoiceId
          ? (window.hsI18n.currentLang === "bn" ? "ইনভয়েস ও সেলস তথ্য সফলভাবে হালনাগাদ হয়েছে!" : "Invoice and sales record updated!")
          : (window.hsI18n.currentLang === "bn" ? "ইনভয়েস সংরক্ষিত এবং স্বয়ংক্রিয়ভাবে সেলসে যুক্ত হয়েছে!" : "Invoice created & recorded into Sales!"),
        "success"
      );
    } else {
      this.showToast(
        this.editingInvoiceId
          ? (window.hsI18n.currentLang === "bn" ? "ইনভয়েস সফলভাবে হালনাগাদ হয়েছে!" : "Invoice updated successfully!")
          : (window.hsI18n.currentLang === "bn" ? "ইনভয়েস সফলভাবে সংরক্ষিত হয়েছে!" : "Invoice created successfully!"),
        "success"
      );
    }

    // Trigger Print Window only if requested
    if (printImmediately && targetInvoice) {
      window.hsReports.printInvoiceReceipt(targetInvoice);
    }

    // Reset Form & Update History
    this.clearInvoiceForm();
    this.renderInvoicesHistoryTable();
    this.renderAll();
  }

  clearInvoiceForm() {
    this.editingInvoiceId = null;
    this.invoiceDraftItems = [];
    document.getElementById("inv-number").value = window.hsStore.getNextInvoiceNumber();
    document.getElementById("inv-customer-name").value = "";
    document.getElementById("inv-customer-phone").value = "";
    document.getElementById("inv-custom-name").value = "";
    document.getElementById("inv-item-qty").value = "1";
    document.getElementById("inv-item-price").value = "";
    document.getElementById("inv-discount").value = "0";
    document.getElementById("inv-delivery").value = "0";
    document.getElementById("inv-paid").value = "0";
    document.getElementById("inv-note").value = "";

    // Reset editing banner & button texts
    const banner = document.getElementById("inv-editing-banner");
    if (banner) banner.classList.add("hidden");

    const savePrintSpan = document.getElementById("inv-btn-save-print-span");
    const saveOnlySpan = document.getElementById("inv-btn-save-only-span");
    if (savePrintSpan) savePrintSpan.textContent = window.hsI18n.t("btnSaveAndPrintInvoice");
    if (saveOnlySpan) saveOnlySpan.textContent = window.hsI18n.t("btnSaveOnlyInvoice");

    this.renderInvoiceDraftItems();
    this.calculateInvoiceTotals();
  }

  renderInvoicesHistoryTable() {
    const tbody = document.getElementById("invoices-history-tbody");
    if (!tbody) return;

    const invoices = window.hsStore.getInvoices();
    if (invoices.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-8 text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-medium">
            ${window.hsI18n.t("noInvoicesYet")}
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = invoices
      .map(
        (inv) => `
      <tr class="border-b border-gray-100 dark:border-slate-800/80 hover:bg-gray-50 dark:hover:bg-slate-800/40 text-xs sm:text-sm transition-colors">
        <td class="py-3 px-3 font-heading font-extrabold text-brand-700 dark:text-brand-400">${inv.invoiceNumber}</td>
        <td class="py-3 px-3 text-gray-500 dark:text-gray-400">${inv.date}</td>
        <td class="py-3 px-3 font-bold text-gray-900 dark:text-gray-100">
          ${inv.customerName}
          ${inv.customerPhone ? `<span class="block text-[11px] font-normal text-gray-400">${inv.customerPhone}</span>` : ""}
        </td>
        <td class="py-3 px-3">
          <span class="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
            ${inv.orderType || "Dine-in"}
          </span>
        </td>
        <td class="py-3 px-3 text-right font-black text-gray-900 dark:text-gray-100">৳${Number(inv.grandTotal).toLocaleString()}</td>
        <td class="py-3 px-3 text-center">
          <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${inv.dueAmount > 0 ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"}">
            ${inv.dueAmount > 0 ? window.hsI18n.t("statusDue") + ": ৳" + Number(inv.dueAmount).toLocaleString() : window.hsI18n.t("statusPaid")}
          </span>
        </td>
        <td class="py-3 px-3 text-right space-x-1">
          ${inv.dueAmount > 0 ? `
            <button 
              onclick="window.hsApp.clearInvoiceDue('${inv.id}')" 
              title="${window.hsI18n.t('clearDueTooltip') || 'বকেয়া পরিশোধ সম্পন্ন করুন'}" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm transition-all"
            >
              <i class="fa-solid fa-money-bill-wave text-xs"></i> <span>${window.hsI18n.t("btnClearDue")}</span>
            </button>
          ` : ""}
          <button onclick="window.hsApp.editInvoice('${inv.id}')" title="${window.hsI18n.t('editInvoice') || 'Edit Invoice'}" class="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 font-bold text-xs transition-colors">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button onclick="window.hsApp.reprintInvoice('${inv.id}')" title="Print Invoice" class="px-2.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 font-bold text-xs transition-colors">
            <i class="fa-solid fa-print"></i>
          </button>
          <button onclick="window.hsApp.deleteInvoiceRecord('${inv.id}')" title="Delete Invoice" class="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950 text-gray-500 hover:text-rose-600 font-bold text-xs transition-colors">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `
      )
      .join("");
  }

  clearInvoiceDue(id) {
    const inv = window.hsStore.getInvoiceById(id);
    if (!inv || (Number(inv.dueAmount) || 0) <= 0) return;

    const clearedAmount = Number(inv.dueAmount) || 0;
    const fullTotal = Number(inv.grandTotal) || 0;

    window.hsStore.updateInvoice(id, {
      paidAmount: fullTotal,
      dueAmount: 0
    });

    // If currently editing this invoice in form, sync active values
    if (this.editingInvoiceId === id) {
      const paidInput = document.getElementById("inv-paid");
      if (paidInput) paidInput.value = fullTotal;
      this.calculateInvoiceTotals();
    }

    this.renderInvoicesHistoryTable();
    this.showToast(
      window.hsI18n.currentLang === "bn"
        ? `বকেয়া (৳${clearedAmount.toLocaleString()}) পরিশোধ সম্পন্ন হয়েছে! ইনভয়েসটি এখন সম্পূর্ণ পরিশোধিত।`
        : `Due payment (Tk. ${clearedAmount.toLocaleString()}) cleared! Invoice is now fully paid.`,
      "success"
    );
  }

  reprintInvoice(id) {
    const invoices = window.hsStore.getInvoices();
    const inv = invoices.find((i) => i.id === id);
    if (inv) {
      window.hsReports.printInvoiceReceipt(inv);
    }
  }

  deleteInvoiceRecord(id) {
    if (confirm(window.hsI18n.t("confirmDelete"))) {
      window.hsStore.deleteInvoice(id);
      if (this.editingInvoiceId === id) {
        this.clearInvoiceForm();
      }
      this.renderInvoicesHistoryTable();
      this.showToast(window.hsI18n.currentLang === "bn" ? "ইনভয়েস মুছে ফেলা হয়েছে" : "Invoice deleted", "info");
    }
  }

  // --- TAB 8: CALCULATOR ---
  renderCalculatorTab() {
    this.calcUpdateDisplay();
    this.renderCalcHistoryTape();
  }

  calcInputDigit(digit) {
    if (this.calcWaitingForSecondOperand) {
      this.calcCurrentValue = String(digit);
      this.calcWaitingForSecondOperand = false;
    } else {
      this.calcCurrentValue = this.calcCurrentValue === "0" ? String(digit) : this.calcCurrentValue + digit;
    }
    this.calcUpdateDisplay();
  }

  calcInputDecimal() {
    if (this.calcWaitingForSecondOperand) {
      this.calcCurrentValue = "0.";
      this.calcWaitingForSecondOperand = false;
    } else if (!this.calcCurrentValue.includes(".")) {
      this.calcCurrentValue += ".";
    }
    this.calcUpdateDisplay();
  }

  calcHandleOperator(nextOp) {
    const inputValue = parseFloat(this.calcCurrentValue);

    if (this.calcOperator && this.calcWaitingForSecondOperand) {
      this.calcOperator = nextOp;
      this.calcUpdateDisplay();
      return;
    }

    if (this.calcPreviousValue === null && !isNaN(inputValue)) {
      this.calcPreviousValue = inputValue;
    } else if (this.calcOperator) {
      const result = this.calcPerformCalculation(this.calcOperator, this.calcPreviousValue, inputValue);
      this.calcCurrentValue = String(result);
      this.calcPreviousValue = result;
    }

    this.calcWaitingForSecondOperand = true;
    this.calcOperator = nextOp;
    this.calcUpdateDisplay();
  }

  calcPerformCalculation(op, first, second) {
    switch (op) {
      case "+": return first + second;
      case "-": return first - second;
      case "*": return first * second;
      case "/": return second !== 0 ? first / second : 0;
      default: return second;
    }
  }

  calcCalculate() {
    if (this.calcOperator === null || this.calcWaitingForSecondOperand) return;

    const first = this.calcPreviousValue;
    const second = parseFloat(this.calcCurrentValue);
    const op = this.calcOperator;
    const result = this.calcPerformCalculation(op, first, second);

    const opSymbol = op === "*" ? "×" : op === "/" ? "÷" : op === "-" ? "−" : "+";
    this.calcHistoryTape.unshift({
      expression: `${first} ${opSymbol} ${second} =`,
      result: Number(result.toFixed(4)).toString()
    });

    this.calcCurrentValue = Number(result.toFixed(4)).toString();
    this.calcPreviousValue = null;
    this.calcOperator = null;
    this.calcWaitingForSecondOperand = false;

    this.calcUpdateDisplay();
    this.renderCalcHistoryTape();
  }

  calcClear() {
    this.calcCurrentValue = "0";
    this.calcPreviousValue = null;
    this.calcOperator = null;
    this.calcWaitingForSecondOperand = false;
    this.calcUpdateDisplay();
  }

  calcClearEntry() {
    this.calcCurrentValue = "0";
    this.calcUpdateDisplay();
  }

  calcBackspace() {
    if (this.calcWaitingForSecondOperand) return;
    if (this.calcCurrentValue.length > 1) {
      this.calcCurrentValue = this.calcCurrentValue.slice(0, -1);
    } else {
      this.calcCurrentValue = "0";
    }
    this.calcUpdateDisplay();
  }

  calcPercentage() {
    const val = parseFloat(this.calcCurrentValue);
    if (!isNaN(val)) {
      this.calcCurrentValue = String(val / 100);
      this.calcUpdateDisplay();
    }
  }

  calcRecallHistory(resultVal) {
    this.calcCurrentValue = String(resultVal);
    this.calcWaitingForSecondOperand = false;
    this.calcUpdateDisplay();
  }

  calcClearHistoryTape() {
    this.calcHistoryTape = [];
    this.renderCalcHistoryTape();
  }

  calcUpdateDisplay() {
    const currentEl = document.getElementById("calc-display-current");
    const expEl = document.getElementById("calc-display-expression");

    if (currentEl) {
      currentEl.textContent = this.calcCurrentValue;
    }

    if (expEl) {
      if (this.calcOperator && this.calcPreviousValue !== null) {
        const opSymbol = this.calcOperator === "*" ? "×" : this.calcOperator === "/" ? "÷" : this.calcOperator === "-" ? "−" : "+";
        expEl.textContent = `${this.calcPreviousValue} ${opSymbol}`;
      } else {
        expEl.textContent = "";
      }
    }
  }

  renderCalcHistoryTape() {
    const tapeContainer = document.getElementById("calc-history-list");
    if (!tapeContainer) return;

    if (this.calcHistoryTape.length === 0) {
      tapeContainer.innerHTML = `
        <div class="py-8 text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
          ${window.hsI18n.t("noCalcHistoryYet")}
        </div>
      `;
      return;
    }

    tapeContainer.innerHTML = this.calcHistoryTape
      .slice(0, 15)
      .map(
        (h) => `
      <div onclick="window.hsApp.calcRecallHistory('${h.result}')" class="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-gray-100 dark:border-slate-800 cursor-pointer transition-colors text-right">
        <div class="text-[11px] font-semibold text-gray-400 dark:text-gray-500">${h.expression}</div>
        <div class="text-base font-black font-heading text-brand-700 dark:text-brand-400">${h.result}</div>
      </div>
    `
      )
      .join("");
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
  populateStockCategorySelect(selectedCategory = null) {
    const select = document.getElementById("stock-item-category");
    if (!select) return;

    const categories = window.hsStore.getCategories();
    const isBn = window.hsI18n.currentLang === "bn";

    let html = categories
      .map(
        (cat) => `
        <option value="${cat.id}">
          ${isBn ? (cat.nameBn || cat.nameEn) : (cat.nameEn || cat.nameBn)}
        </option>
      `
      )
      .join("");

    html += `
      <option value="__new__" class="font-bold text-brand-700 bg-brand-50">
        ${window.hsI18n.t("addNewCategory")}
      </option>
    `;

    select.innerHTML = html;

    if (selectedCategory && selectedCategory !== "__new__") {
      select.value = selectedCategory;
    } else if (categories.length > 0) {
      select.value = categories[0].id;
    }
  }

  promptAddCustomCategory() {
    const name = prompt(window.hsI18n.t("promptNewCategory"));
    if (!name || !name.trim()) return;

    const newCat = window.hsStore.addCustomCategory(name.trim());
    if (newCat) {
      this.populateStockCategorySelect(newCat.id);
      this.showToast(window.hsI18n.t("toastCategoryAdded"), "success");
    }
  }

  onCategorySelectChange(selectEl) {
    if (selectEl && selectEl.value === "__new__") {
      this.promptAddCustomCategory();
    }
  }

  openAddItemModal() {
    document.getElementById("modal-stock-title").textContent = window.hsI18n.t("modalAddItemTitle");
    document.getElementById("stock-form").reset();
    document.getElementById("stock-item-id").value = "";
    this.populateStockCategorySelect("catRaw");
    this.openModal("modal-stock");
  }

  openEditItemModal(id) {
    const item = window.hsStore.getItemById(id);
    if (!item) return;

    document.getElementById("modal-stock-title").textContent = window.hsI18n.t("modalEditItemTitle");
    document.getElementById("stock-item-id").value = item.id;
    document.getElementById("stock-item-name").value = item.name;
    this.populateStockCategorySelect(item.category || "catRaw");
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
    const unit = document.getElementById("stock-item-unit").value;
    const quantity = Number(document.getElementById("stock-item-qty").value) || 0;
    const threshold = Number(document.getElementById("stock-item-threshold").value) || 0;
    const costPrice = Number(document.getElementById("stock-item-cost").value) || 0;
    const sellingPrice = Number(document.getElementById("stock-item-sell").value) || 0;

    if (!name || category === "__new__") return;

    // Automatically map internal type
    let type = "typeFinished";
    if (category === "catRaw") type = "typeRaw";
    else if (category === "catPackaging") type = "typePackaging";
    else if (category === "catFrozen") type = "typeFrozen";

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

  // 1-Click Quick Stock Increment / Decrement (+1 / -1)
  quickAdjustStock(id, delta) {
    const item = window.hsStore.getItemById(id);
    if (!item) return;

    const oldQty = Number(item.quantity) || 0;
    if (delta < 0 && oldQty <= 0) {
      this.showToast(
        window.hsI18n.getLang() === "bn" 
          ? `${item.name}: স্টক ইতিমধ্যে ০ তে রয়েছে!` 
          : `${item.name}: Stock is already at 0!`,
        "alert"
      );
      return;
    }

    const step = Number(delta);
    const reason = step > 0 ? "Quick +1 Step" : "Quick -1 Step";
    window.hsStore.adjustStock(id, step, reason);

    const newQty = Math.max(0, Math.round((oldQty + step) * 100) / 100);
    const unitText = window.hsI18n.t(item.unit) || item.unit || "";
    const isBn = window.hsI18n.getLang() === "bn";
    const msg = isBn
      ? `${item.name}: ${step > 0 ? "+১ যোগ হয়েছে" : "-১ বাদ দেওয়া হয়েছে"} (${oldQty} ➔ ${newQty} ${unitText})`
      : `${item.name}: ${step > 0 ? "+1 Added" : "-1 Deducted"} (${oldQty} ➔ ${newQty} ${unitText})`;

    this.showToast(msg);
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
    const titleEl = document.getElementById("modal-expense-title");
    if (titleEl) titleEl.textContent = window.hsI18n.t("modalAddExpenseTitle");
    document.getElementById("expense-form").reset();
    document.getElementById("expense-id").value = "";
    document.getElementById("expense-date").value = new Date().toISOString().split("T")[0];
    this.openModal("modal-expense");
  }

  openEditExpenseModal(id) {
    const exp = window.hsStore.getExpenseById(id);
    if (!exp) return;

    const titleEl = document.getElementById("modal-expense-title");
    if (titleEl) titleEl.textContent = window.hsI18n.t("modalEditExpenseTitle");

    document.getElementById("expense-id").value = exp.id;
    document.getElementById("expense-date").value = exp.date;
    document.getElementById("expense-category").value = exp.category;
    document.getElementById("expense-title").value = exp.title;
    document.getElementById("expense-vendor").value = exp.vendor || "";
    document.getElementById("expense-method").value = exp.method;
    document.getElementById("expense-amount").value = exp.amount;

    this.openModal("modal-expense");
  }

  saveExpenseForm(e) {
    e.preventDefault();
    const id = document.getElementById("expense-id").value;
    const date = document.getElementById("expense-date").value;
    const category = document.getElementById("expense-category").value;
    const title = document.getElementById("expense-title").value.trim();
    const vendor = document.getElementById("expense-vendor").value.trim();
    const method = document.getElementById("expense-method").value;
    const amount = Number(document.getElementById("expense-amount").value) || 0;

    if (!title || amount <= 0) return;

    window.hsStore.saveExpense({ id: id || undefined, date, category, title, vendor, method, amount });
    this.closeModal("modal-expense");
    this.showToast(id ? window.hsI18n.t("toastExpenseUpdated") : window.hsI18n.t("toastExpenseSaved"));
  }

  deleteExpensePrompt(id) {
    if (confirm(window.hsI18n.t("confirmDelete"))) {
      window.hsStore.deleteExpense(id);
    }
  }

  // Sale Modal
  populateSaleFoodSelect(selectedItemName = "") {
    const foodSelect = document.getElementById("sale-food-select");
    if (foodSelect) {
      const items = window.hsStore.getItems({ type: "typeFinished" });
      foodSelect.innerHTML = items
        .map((i) => `<option value="${i.name}" data-price="${i.sellingPrice}" data-cost="${i.costPrice}" ${i.name === selectedItemName ? "selected" : ""}>${i.name} (৳${i.sellingPrice})</option>`)
        .join("");
    }
  }

  openAddSaleModal() {
    const titleEl = document.getElementById("modal-sale-title");
    if (titleEl) titleEl.textContent = window.hsI18n.t("modalAddSaleTitle");

    document.getElementById("sale-form").reset();
    document.getElementById("sale-id").value = "";
    document.getElementById("sale-date").value = new Date().toISOString().split("T")[0];

    this.populateSaleFoodSelect();
    this.openModal("modal-sale");
  }

  openEditSaleModal(id) {
    const sale = window.hsStore.getSaleById(id);
    if (!sale) return;

    const titleEl = document.getElementById("modal-sale-title");
    if (titleEl) titleEl.textContent = window.hsI18n.t("modalEditSaleTitle");

    document.getElementById("sale-id").value = sale.id;
    document.getElementById("sale-date").value = sale.date;

    this.populateSaleFoodSelect(sale.item);

    const foodSelect = document.getElementById("sale-food-select");
    const customItem = document.getElementById("sale-item-custom");
    if (foodSelect && foodSelect.value === sale.item) {
      if (customItem) customItem.value = "";
    } else {
      if (customItem) customItem.value = sale.item;
    }

    document.getElementById("sale-qty").value = sale.quantity;
    document.getElementById("sale-total").value = sale.total;
    document.getElementById("sale-cost").value = sale.cost || "";
    document.getElementById("sale-method").value = sale.method || "payCash";

    this.openModal("modal-sale");
  }

  saveSaleForm(e) {
    e.preventDefault();
    const id = document.getElementById("sale-id").value;
    const date = document.getElementById("sale-date").value;
    const foodSelect = document.getElementById("sale-food-select");
    const customItem = document.getElementById("sale-item-custom");
    const item = (customItem && customItem.value.trim()) || (foodSelect ? foodSelect.value : "");
    const quantity = Number(document.getElementById("sale-qty").value) || 1;
    const total = Number(document.getElementById("sale-total").value) || 0;
    const cost = Number(document.getElementById("sale-cost").value) || 0;
    const method = document.getElementById("sale-method").value;

    if (!item || total <= 0) return;

    window.hsStore.saveSale({ id: id || undefined, date, item, quantity, total, cost, method });
    this.closeModal("modal-sale");
    this.showToast(id ? window.hsI18n.t("toastSaleUpdated") : window.hsI18n.t("toastSaleSaved"));
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
    const activeStaff = window.hsStore.getEmployees().filter((e) => e.status !== "statusResigned");
    const totalSalary = activeStaff.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);

    if (totalSalary <= 0) {
      alert(window.hsI18n.getLang() === "bn" ? "কোনো সক্রিয় কর্মচারীর বেতন পাওয়া যায়নি।" : "No active employees with valid salary found.");
      return;
    }

    const m = window.hsStore.selectedMonthFilter;
    const y = window.hsStore.selectedYearFilter;
    const monthName = m === "all" ? (window.hsI18n.getLang() === "bn" ? "চলতি" : "Current Month") : window.hsI18n.getMonthName(Number(m));

    const confirmMsg = window.hsI18n.getLang() === "bn"
      ? `${monthName} ${y} মাসের মোট কর্মচারীদের বেতন (৳${totalSalary.toLocaleString()}) কি খরচের তালিকায় যুক্ত করতে চান?`
      : `Do you want to post total payroll expense (৳${totalSalary.toLocaleString()}) for ${monthName} ${y} into Expenses?`;

    if (!confirm(confirmMsg)) return;

    const totalPosted = window.hsStore.postPayrollToExpenses(m, y);
    if (totalPosted > 0) {
      this.showToast(`${window.hsI18n.t("payrollPostedSuccess")} (৳${totalPosted.toLocaleString()})`);
      this.renderAll();
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

    // Invoice Generator Dynamic Listeners
    const invItemSelect = document.getElementById("inv-item-select");
    if (invItemSelect) invItemSelect.addEventListener("change", () => this.onInvoiceItemSelectChange());

    const invDiscountInput = document.getElementById("inv-discount");
    const invDeliveryInput = document.getElementById("inv-delivery");
    const invPaidInput = document.getElementById("inv-paid");

    if (invDiscountInput) invDiscountInput.addEventListener("input", () => this.calculateInvoiceTotals());
    if (invDeliveryInput) invDeliveryInput.addEventListener("input", () => this.calculateInvoiceTotals());
    if (invPaidInput) invPaidInput.addEventListener("input", () => this.calculateInvoiceTotals());

    // Enter key shortcuts to quickly add draft items in Invoice form
    ["inv-item-qty", "inv-item-price", "inv-custom-name"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            this.addInvoiceDraftItem();
          }
        });
      }
    });

    // Physical Keyboard Listener for Interactive Calculator
    window.addEventListener("keydown", (e) => {
      if (this.currentTab !== "calculator") return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

      if (e.key >= "0" && e.key <= "9") {
        this.calcInputDigit(e.key);
      } else if (e.key === ".") {
        this.calcInputDecimal();
      } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        this.calcHandleOperator(e.key);
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        this.calcCalculate();
      } else if (e.key === "Backspace") {
        this.calcBackspace();
      } else if (e.key === "Escape") {
        this.calcClear();
      }
    });
  }
}

window.hsApp = new HealthSharkApp();
document.addEventListener("DOMContentLoaded", () => {
  window.hsApp.init();
});
