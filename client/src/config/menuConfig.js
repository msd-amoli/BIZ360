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
        label: "Product UOM",
        path: "/product-uom",
      },
      {
        label: "Warehouses",
        path: "/warehouses",
      },
      {
        label: "Customers (Coming Soon)",
        path: null,
      },
      {
        label: "Suppliers (Coming Soon)",
        path: null,
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
        label: "Sales Report (Coming Soon)",
        path: null,
      },
      {
        label: "Purchase Report (Coming Soon)",
        path: null,
      },
      {
        label: "Product Report (Coming Soon)",
        path: null,
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
        label: "Coming Soon",
        path: null,
      },
    ],
  },
];

export default menuItems;