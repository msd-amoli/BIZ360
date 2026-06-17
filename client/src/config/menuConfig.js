const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },

  {
    label: "Masters",
    children: [
      {
        label: "Products",
        path: "/products",
      },
      {
        label: "UOM",
        path: "/uom",
      },
      
      {
        label: "Warehouses",
        path: "/warehouses",
      },
     
    ],
  },

  {
    label: "Inventory",
    children: [
      {
        label: "Inventory List",
        path: "/inventory",
      },
    ],
  },

  {
    label: "Sales",
    children: [
      {
        label: "Sales Invoices",
        path: "/invoices",
      },
    
    ],
  },

  {
    label: "Purchasing",
    children: [
      {
        label: "Purchase List",
        path: "/purchases",
      },
        {
        label: "Suppliers (Coming Soon)",
        path: null,
      },
     
    ],
  },

  {
    label: "Reports",
    children: [
      {
        label: "Low Stock Report",
        path: "/reports/low-stock",
      },
     
      {
        label: "Stock Ledger",
        path: "/inventory/ledger",
      },
      {
        label: "Profit & Loss (Coming Soon)",
        path: null,
      },
    ],
  },

  {
    label: "AI Assistant",
    children: [
      {
        label: "ERP Help Chat",
        path: "/ai-assistant",
      },
    ],
  },

  {
    label: "CRM",
    children: [
      {
        label: "Customers (Coming Soon)",
        path: null,
      },
    
    ],
  },
  {
    label: "HR",
    children: [
      {
        label: "Employee (Coming Soon)",
        path: null,
      },
      {
        label: "Attendance (Coming Soon)",
        path: null,
      },
      {
        label: "Payslip (Coming Soon)",
        path: null,
      },
    
    ],
  },
];

export default menuItems;