import { useEffect, useState } from "react";
import api from "../../services/api"; 
import "../../styles/inventory.css";

function InventoryPage() {
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("ALL");
  const [warehouseList, setWarehouseList] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await api.get("/inventory");
        setInventoryData(response.data);
        setFilteredData(response.data);

        // Dynamically extract unique warehouse names for the top dropdown filter
        const warehouses = [
          "ALL",
          ...new Set(response.data.map((item) => item.warehouseName)),
        ];
        setWarehouseList(warehouses);
      } catch (error) {
        console.error("Failed to load inventory data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Filter logic whenever search keywords or warehouse choices change
  useEffect(() => {
    let output = inventoryData;

    if (selectedWarehouse !== "ALL") {
      output = output.filter((item) => item.warehouseName === selectedWarehouse);
    }

    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      output = output.filter(
        (item) =>
          item.productName.toLowerCase().includes(query) ||
          item.productCode.toLowerCase().includes(query)
      );
    }

    setFilteredData(output);
  }, [searchTerm, selectedWarehouse, inventoryData]);

  if (loading) {
    return (
      <div className="inventory-loading">
        <div className="inventory-spinner"></div>
        <h2>Syncing Global Stock Ledgers...</h2>
      </div>
    );
  }

  return (
    <div className="inventory-page">
      {/* Top Banner Control Section */}
      <div className="inventory-header">
        <div>
          <h1>Inventory Stock Ledger</h1>
          <p>Real-time physical inventory levels and multi-UOM unit allocations across distributed storage hubs.</p>
        </div>
      </div>

      {/* Practical Operational Sub-Toolbar */}
      <div className="inventory-toolbar">
        <div className="search-box">
          <span className="box-icon">🔍</span>
          <input
            type="text"
            placeholder="Filter by product name or item code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <label htmlFor="warehouse-select">Warehouse Base: </label>
          <select
            id="warehouse-select"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            {warehouseList.map((wh) => (
              <option key={wh} value={wh}>
                {wh === "ALL" ? "All Warehouses 🏢" : wh}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="inventory-table-card">
        <table className="inventory-data-table">
          <thead>
            <tr>
              <th>Product Details</th>
              <th>Warehouse Hub</th>
              <th>Min Safety Stock</th>
              <th>Current Balance Base</th>
              <th>Multi-UOM Alternate Breakdowns</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="inventory-empty-state">
                  No active stock records matched your filter constraints.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => {
                const isLowStock = item.baseQuantity <= item.minStockLevel;

                return (
                  <tr key={`${item.productCode}-${item.warehouseName}`}>
                    {/* Column 1: Code & Name stacked together neatly */}
                    <td>
                      <div className="item-meta-cell">
                        <span className="mono-code">{item.productCode}</span>
                        <span className="bold-name">{item.productName}</span>
                      </div>
                    </td>

                    {/* Column 2: Warehouse Location */}
                    <td>
                      <div className="warehouse-badge-cell">
                        📍 {item.warehouseName}
                      </div>
                    </td>

                    {/* Column 3: Minimum Safety Threshold */}
                    <td>{item.minStockLevel} units</td>

                    {/* Column 4: Base Quantity */}
                    <td>
                      <span className={`base-qty-text ${isLowStock ? "text-danger" : "text-success"}`}>
                        {item.baseQuantity}
                      </span>
                    </td>

                    {/* Column 5: Complex nested Multi-UOM rendering */}
                    <td>
                      <div className="uom-flex-wrapper">
                        {item.uomBreakdown && item.uomBreakdown.length > 0 ? (
                          item.uomBreakdown.map((breakdown, idx) => (
                            <div key={idx} className="uom-split-pill">
                              <span className="uom-label">{breakdown.uom}</span>
                              <span className="uom-value">{breakdown.quantity}</span>
                            </div>
                          ))
                        ) : (
                          <span className="no-breakdown-text">—</span>
                        )}
                      </div>
                    </td>

                    {/* Column 6: System Critical Alert Badges */}
                    <td>
                      {isLowStock ? (
                        <span className="status-pill-alert danger-alert">⚠️ Low Stock</span>
                      ) : (
                        <span className="status-pill-alert safe-alert">✓ In Stock</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryPage;