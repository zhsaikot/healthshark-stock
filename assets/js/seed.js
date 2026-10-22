/**
 * Health Shark Stock & Management System
 * Initial Seed Data tailored to Health Shark Food Business (Mirpur, Dhaka)
 */

const SEED_DATA = {
  items: [
    // --- RAW INGREDIENTS ---
    {
      id: "raw-001",
      name: "Chinigura Polao Rice (পোলাও চাল)",
      category: "catRaw",
      type: "typeRaw",
      unit: "unitKg",
      quantity: 45,
      threshold: 15,
      costPrice: 135,
      sellingPrice: 0,
      updatedAt: "2026-10-20"
    },
    {
      id: "raw-002",
      name: "Farm Fresh Broiler Chicken (মুরগির মাংস)",
      category: "catRaw",
      type: "typeRaw",
      unit: "unitKg",
      quantity: 18,
      threshold: 20, // Low stock trigger
      costPrice: 195,
      sellingPrice: 0,
      updatedAt: "2026-10-21"
    },
    {
      id: "raw-003",
      name: "Desi Premium Beef Cuts (গরুর মাংস)",
      category: "catRaw",
      type: "typeRaw",
      unit: "unitKg",
      quantity: 8,
      threshold: 12, // Low stock trigger
      costPrice: 780,
      sellingPrice: 0,
      updatedAt: "2026-10-21"
    },
    {
      id: "raw-004",
      name: "Pure Mustard Oil (ঘানি ভাঙা সরিষার তেল)",
      category: "catRaw",
      type: "typeRaw",
      unit: "unitLitre",
      quantity: 24,
      threshold: 10,
      costPrice: 280,
      sellingPrice: 0,
      updatedAt: "2026-10-18"
    },
    {
      id: "raw-005",
      name: "Organic Date Powder (খেজুর গুঁড়া - Khejur Gura)",
      category: "catRaw",
      type: "typeRaw",
      unit: "unitKg",
      quantity: 35,
      threshold: 10,
      costPrice: 420,
      sellingPrice: 650,
      updatedAt: "2026-10-19"
    },
    {
      id: "raw-006",
      name: "Ginger & Garlic Paste (আদা ও রসুন বাটা)",
      category: "catRaw",
      type: "typeRaw",
      unit: "unitKg",
      quantity: 6,
      threshold: 8, // Low stock trigger
      costPrice: 160,
      sellingPrice: 0,
      updatedAt: "2026-10-21"
    },
    {
      id: "raw-007",
      name: "Pure Cow Ghee (খাঁটি গাওয়া ঘি)",
      category: "catRaw",
      type: "typeRaw",
      unit: "unitKg",
      quantity: 5,
      threshold: 3,
      costPrice: 1450,
      sellingPrice: 0,
      updatedAt: "2026-10-15"
    },
    {
      id: "raw-008",
      name: "All-Purpose Flour (ফ্রেশ আটা/ময়দা)",
      category: "catRaw",
      type: "typeRaw",
      unit: "unitKg",
      quantity: 50,
      threshold: 20,
      costPrice: 65,
      sellingPrice: 0,
      updatedAt: "2026-10-16"
    },

    // --- PACKAGING & BOXES ---
    {
      id: "pkg-001",
      name: "Health Shark Eco Food Box (ফুড বক্স)",
      category: "catPackaging",
      type: "typePackaging",
      unit: "unitPcs",
      quantity: 350,
      threshold: 100,
      costPrice: 12,
      sellingPrice: 0,
      updatedAt: "2026-10-15"
    },
    {
      id: "pkg-002",
      name: "Branded Paper Carry Bag (পেপার ব্যাগ)",
      category: "catPackaging",
      type: "typePackaging",
      unit: "unitPcs",
      quantity: 180,
      threshold: 200, // Low stock trigger
      costPrice: 8,
      sellingPrice: 0,
      updatedAt: "2026-10-17"
    },

    // --- FINISHED FOOD ITEMS ---
    {
      id: "food-001",
      name: "Health Shark Special Chicken Biriani",
      category: "catMeals",
      type: "typeFinished",
      unit: "unitBox",
      quantity: 22,
      threshold: 10,
      costPrice: 170,
      sellingPrice: 280,
      updatedAt: "2026-10-22"
    },
    {
      id: "food-002",
      name: "Grilled Chicken Breast Burger (Mini/Regular)",
      category: "catBurgers",
      type: "typeFinished",
      unit: "unitPcs",
      quantity: 15,
      threshold: 8,
      costPrice: 95,
      sellingPrice: 170,
      updatedAt: "2026-10-22"
    },
    {
      id: "food-003",
      name: "Steamed Chicken Momos (8 Pcs Platter)",
      category: "catSnacks",
      type: "typeFinished",
      unit: "unitBox",
      quantity: 30,
      threshold: 12,
      costPrice: 80,
      sellingPrice: 150,
      updatedAt: "2026-10-22"
    },
    {
      id: "food-004",
      name: "Fudgy Dark Chocolate Brownie (Healthy)",
      category: "catDesserts",
      type: "typeFinished",
      unit: "unitPcs",
      quantity: 40,
      threshold: 15,
      costPrice: 55,
      sellingPrice: 120,
      updatedAt: "2026-10-21"
    },
    {
      id: "food-005",
      name: "Creamy Arab Kunafa with Nuts",
      category: "catDesserts",
      type: "typeFinished",
      unit: "unitBox",
      quantity: 12,
      threshold: 6,
      costPrice: 110,
      sellingPrice: 220,
      updatedAt: "2026-10-22"
    }
  ],

  expenses: [
    {
      id: "exp-001",
      date: "2026-10-01",
      category: "expRent",
      title: "Mirpur Cloud Kitchen Rent (মাসিক কিচেন ভাড়া)",
      vendor: "Landlord (মিরপুর শাখা)",
      method: "payBank",
      amount: 25000
    },
    {
      id: "exp-002",
      date: "2026-10-05",
      category: "expPackaging",
      title: "500 Pcs Branded Food Boxes & Carry Bags Order",
      vendor: "Print Hub Mirpur",
      method: "payBkash",
      amount: 6000
    },
    {
      id: "exp-003",
      date: "2026-10-08",
      category: "expUtility",
      title: "Kitchen LP Gas 2 Cylinder Refill (এলপি গ্যাস রিফিল)",
      vendor: "Jamuna Gas Dealer",
      method: "payCash",
      amount: 3100
    },
    {
      id: "exp-004",
      date: "2026-10-12",
      category: "expRawBazaar",
      title: "Weekly Fresh Chicken & Beef Wholesale Bazaar",
      vendor: "Kaptan Bazar Meat Vendor",
      method: "payCash",
      amount: 14500
    },
    {
      id: "exp-005",
      date: "2026-10-16",
      category: "expDelivery",
      title: "Mirpur & Dhanmondi Delivery Rider Fuel & Allowance",
      vendor: "Delivery Team",
      method: "payCash",
      amount: 3400
    },
    {
      id: "exp-006",
      date: "2026-10-19",
      category: "expUtility",
      title: "Cloud Kitchen Electricity & Water Bill",
      vendor: "DESCO / WASA",
      method: "payBkash",
      amount: 4200
    }
  ],

  sales: [
    {
      id: "sale-001",
      date: "2026-10-18",
      item: "Health Shark Special Chicken Biriani",
      quantity: 35,
      cost: 5950,
      total: 9800,
      method: "payCash"
    },
    {
      id: "sale-002",
      date: "2026-10-19",
      item: "Grilled Chicken Breast Burger & Momos Combo",
      quantity: 28,
      cost: 3920,
      total: 7560,
      method: "payBkash"
    },
    {
      id: "sale-003",
      date: "2026-10-20",
      item: "Fudgy Dark Chocolate Brownie & Kunafa Platter",
      quantity: 45,
      cost: 3375,
      total: 7200,
      method: "payCash"
    },
    {
      id: "sale-004",
      date: "2026-10-21",
      item: "Corporate Lunch Box Pre-Order (Biriani + Brownie)",
      quantity: 60,
      cost: 13500,
      total: 22800,
      method: "payBank"
    },
    {
      id: "sale-005",
      date: "2026-10-22",
      item: "Organic Date Powder & Snacks Retail Pack",
      quantity: 15,
      cost: 6300,
      total: 9750,
      method: "payNagad"
    }
  ],

  employees: [
    {
      id: "emp-001",
      name: "Saikot",
      role: "Operations & Manager (অপারেশনস হেড)",
      phone: "01789-474381",
      salary: 30000,
      joinDate: "2025-01-10",
      status: "statusActive"
    },
    {
      id: "emp-002",
      name: "Chef Rafiqul Islam",
      role: "Head Chef (প্রধান রন্ধনশিল্পী)",
      phone: "01712-334455",
      salary: 22000,
      joinDate: "2025-03-01",
      status: "statusActive"
    },
    {
      id: "emp-003",
      name: "Mehedi Hasan",
      role: "Assistant Chef & Prep (সহকারী শেফ)",
      phone: "01988-776655",
      salary: 15000,
      joinDate: "2025-06-15",
      status: "statusActive"
    },
    {
      id: "emp-004",
      name: "Tanvir Ahmed",
      role: "Packaging & Quality Lead (প্যাকেজিং ও কোয়ালিটি)",
      phone: "01855-998877",
      salary: 14000,
      joinDate: "2025-08-01",
      status: "statusActive"
    },
    {
      id: "emp-005",
      name: "Sumon Mia",
      role: "Fast Delivery Rider (ডেলিভারি রাইডার)",
      phone: "01622-114433",
      salary: 13000,
      joinDate: "2025-09-10",
      status: "statusActive"
    }
  ],

  activityLog: [
    {
      id: "log-1",
      time: "2026-10-22 11:30 AM",
      action: "New sale recorded: 15x Organic Date Powder",
      type: "sale"
    },
    {
      id: "log-2",
      time: "2026-10-21 04:15 PM",
      action: "Low stock alert: Broiler Chicken below 20kg",
      type: "alert"
    },
    {
      id: "log-3",
      time: "2026-10-20 02:00 PM",
      action: "Restocked 45kg Chinigura Polao Rice",
      type: "stock"
    }
  ]
};
