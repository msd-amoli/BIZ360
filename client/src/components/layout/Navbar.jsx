import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchErpData } from "../../services/searchService";
import logo from "../../assets/logog.png";

function Navbar() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  
  const email = localStorage.getItem("email") ;
  const role = localStorage.getItem("role") ;
  const userInitials = email.charAt(0).toUpperCase();

  const [searchQuery, setSearchQuery] = useState("");
  const [apiResults, setApiResults] = useState({ purchases: [], invoices: [], products: [] });
  const [matchedModules, setMatchedModules] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 1. Core Front-End Module Matrix Map
  const erpModules = [
    { label: "Products Management", path: "/products", keywords: ["product", "prod", "item", "stock", "master"] },
    { label: "Create New Product", path: "/products/new", keywords: ["create product", "new product", "add item"] },
    { label: "Invoices & Sales", path: "/invoices", keywords: ["invoice", "inv", "sales", "billing"] },
    { label: "Create New Invoice", path: "/invoices/new", keywords: ["create invoice", "new invoice", "billing"] },
    { label: "Purchase Orders", path: "/purchases", keywords: ["purchase", "pur", "po", "orders", "procurement"] },
    { label: "Create Purchase Order", path: "/purchases/new", keywords: ["create purchase", "new purchase", "add po"] },
    { label: "Inventory Dashboard", path: "/inventory", keywords: ["inventory", "stock level", "warehouse"] },
    { label: "Warehouses", path: "/warehouses", keywords: ["warehouse", "godown", "storage"] },
    { label: "Unit of Measures (UOM)", path: "/uom", keywords: ["uom", "unit", "measure"] },
    { label: "Low Stock Report", path: "/reports/low-stock", keywords: ["report", "low stock", "alert"] },
    { label: "BIZº AI Assistant", path: "/ai-assistant", keywords: ["ai", "assistant", "chat", "bot"] },
    { label: "Dashboard Overview", path: "/dashboard", keywords: ["dashboard", "home", "analytics"] }
  ];

  // 2. Handle click outside search component to close dropdown natively
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Debounced Listener for live processing
  useEffect(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();

    if (cleanQuery.length < 2) {
      setMatchedModules([]);
      setApiResults({ purchases: [], invoices: [], products: [] });
      setShowDropdown(false);
      return;
    }

    // A. Match local routing paths immediately
    const modulesFiltered = erpModules.filter(mod =>
      mod.label.toLowerCase().includes(cleanQuery) ||
      mod.keywords.some(keyword => keyword.includes(cleanQuery))
    );
    setMatchedModules(modulesFiltered);
    setShowDropdown(true);

    // B. Call API endpoints for matching exact codes (Debounced by 300ms)
    const delayDebounceFn = setTimeout(async () => {
      const data = await searchErpData(cleanQuery);
      setApiResults(data);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectResult = (path) => {
    navigate(path);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Compute safely if any results exist
  const hasResults = matchedModules.length > 0 || 
                     apiResults.purchases?.length > 0 || 
                     apiResults.invoices?.length > 0 || 
                     apiResults.products?.length > 0;

  return (
    <header className="navbar">
      {/* Left: Branding */}
      <div className="logodiv">
        <img src={logo} alt="BIZº Logo" className="navbar-logo" />
        <h2>BIZ<sup>o</sup> <span className="erp-text">ERP</span></h2>
      </div>

      {/* Center: Global Functional Command Palette & Search */}
      <div className="search-container" ref={searchRef}>
        <div className="search-form">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search modules, PO#, Invoices, Products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
            className="navbar-search-input"
          />
        </div>

        {/* Dropdown Floating Results Panel */}
        {showDropdown && hasResults && (
          <div className="search-results-dropdown">
            
            {/* Group 1: Navigation App Modules */}
            {matchedModules.length > 0 && (
              <div className="search-group">
                <div className="search-group-title">App Modules</div>
                {matchedModules.map((mod) => (
                  <div key={mod.path} className="search-item" onClick={() => handleSelectResult(mod.path)}>
                    <span className="item-icon">🎛️</span>
                    <span className="item-text">{mod.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Group 2: Purchase Orders from Backend API */}
            {apiResults.purchases?.length > 0 && (
              <div className="search-group">
                <div className="search-group-title">Purchase Orders</div>
                {apiResults.purchases.map((po) => (
                  <div key={po.id} className="search-item" onClick={() => handleSelectResult(`/purchases/${po.id}`)}>
                    <span className="item-icon">📄</span>
                    <span className="item-text">ID: {po.id} <span className="item-meta">{po.supplier}</span></span>
                  </div>
                ))}
              </div>
            )}

            {/* Group 3: Invoices from Backend API */}
            {apiResults.invoices?.length > 0 && (
              <div className="search-group">
                <div className="search-group-title">Invoices</div>
                {apiResults.invoices.map((inv) => (
                  <div key={inv.id} className="search-item" onClick={() => handleSelectResult(`/invoices/${inv.id}`)}>
                    <span className="item-icon">💰</span>
                    <span className="item-text">INV: {inv.id} <span className="item-meta">{inv.client}</span></span>
                  </div>
                ))}
              </div>
            )}

            {/* Group 4: Products from Backend API */}
            {apiResults.products?.length > 0 && (
              <div className="search-group">
                <div className="search-group-title">Products</div>
                {apiResults.products.map((prod) => (
                  <div key={prod.productCode} className="search-item" onClick={() => handleSelectResult(`/products/${prod.productCode}`)}>
                    <span className="item-icon">📦</span>
                    <span className="item-text">{prod.name} <span className="item-meta">({prod.productCode})</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Clean User Context */}
      <div className="user-profile-section">
        <div className="avatar">{userInitials}</div>
        <div className="user-info">
          <span className="user-email">{email}</span>
          <span className="user-role">{role}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Logout">
          <span className="logout-icon">🚪</span> Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;