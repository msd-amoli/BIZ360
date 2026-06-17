import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/lowStockReport.css";

function LowStockReportPage() {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Frontend Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("ALL");
  const [warehouseList, setWarehouseList] = useState([]);
  const [urgencyFilter, setUrgencyFilter] = useState("ALL");

  useEffect(() => {
    const fetchLowStockReport = async () => {
      try {
        const response = await api.get("/inventory/low-stock");
        setReportData(response.data);
        setFilteredData(response.data);

        // Dynamically parse unique storage locations for the filters row
        const warehouses = [
          "ALL",
          ...new Set(response.data.map((item) => item.warehouseName).filter(Boolean)),
        ];
        setWarehouseList(warehouses);
      } catch (error) {
        console.error("Failed to extract low stock analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockReport();
  }, []);

  // Multi-tier combination filter logic executed on the frontend
  useEffect(() => {
    let output = reportData;

    // Filter by Warehouse Hub
    if (selectedWarehouse !== "ALL") {
      output = output.filter((item) => item.warehouseName === selectedWarehouse);
    }

    // Filter by Text Search (Code or Name)
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      output = output.filter(
        (item) =>
          item.productName.toLowerCase().includes(query) ||
          item.productCode.toLowerCase().includes(query)
      );
    }

    // Filter by Dynamic Risk Level Classification
    if (urgencyFilter !== "ALL") {
      output = output.filter((item) => {
        const qty = item.baseQuantity || 0;
        if (urgencyFilter === "CRITICAL") return qty === 0;
        if (urgencyFilter === "WARNING") return qty > 0;
        return true;
      });
    }

    setFilteredData(output);
  }, [searchTerm, selectedWarehouse, urgencyFilter, reportData]);

  // Quick total calculations for the metric indicators panel
  const totalDeficitItems = filteredData.length;
  const outOfStockCount = filteredData.filter((i) => (i.baseQuantity || 0) === 0).length;

  if (loading) {
    return (
      <div className="report-loading-screen">
        <div className="report-spinner"></div>
        <h2>Compiling Procurement Deficit Records...</h2>
      </div>
    );
  }

  return (
    <div className="low-stock-report-container">
      {/* Top Banner Branding Block */}
      <div className="report-header-card">
        <div>
          <h1>Shortage & Low Stock Analytics</h1>
          <p>Automated replenishment sheets detailing item shortages against minimum safety thresholds.</p>
        </div>
        <button onClick={() => window.print()} className="print-report-btn">
          🖨️ Export Report Sheet
        </button>
      </div>

      {/* Analytics Summary Scoreboard widgets */}
      <div className="report-summary-grid">
        <div className="report-stat-card total-alerts">
          <span className="stat-label">Total Shortage SKUs</span>
          <h2 className="stat-value">{totalDeficitItems}</h2>
          <span className="stat-desc">Active parts below baseline buffer</span>
        </div>
        <div className="report-stat-card critical-alerts">
          <span className="stat-label">Absolute Zero (Out of Stock)</span>
          <h2 className="stat-value">{outOfStockCount}</h2>
          <span className="stat-desc">Requires immediate purchase order</span>
        </div>
      </div>

      {/* Interactive Control Console Filters */}
      <div className="report-filter-toolbar">
        <div className="search-element">
          <label>Product Search</label>
          <input
            type="text"
            placeholder="Search by SKU code or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="select-element">
          <label>Warehouse Hub</label>
          <select value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)}>
            {warehouseList.map((wh) => (
              <option key={wh} value={wh}>
                {wh === "ALL" ? "All Locations" : wh}
              </option>
            ))}
          </select>
        </div>

        <div className="select-element">
          <label>Urgency Group</label>
          <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)}>
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Out of Stock (Zero Balance)</option>
            <option value="WARNING">Low Stock Warning (Under Safety Limit)</option>
          </select>
        </div>
      </div>

      {/* Main Document Procurement Table Container */}
      <div className="report-table-wrapper">
        <table className="report-data-table">
          <thead>
            <tr>
              <th>SKU / Product Context</th>
              <th>Warehouse Hub</th>
              <th className="text-right">Safety Minimum</th>
              <th className="text-right">Available Physical Balance</th>
              <th>Multi-UOM Alternate Allocation</th>
              <th className="text-right">Required Reorder Qty</th>
              <th>Risk Severity State</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="report-empty-state">
                  No stock deficits detected matching your targeted filter constraints.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => {
                const currentQty = item.baseQuantity || 0;
                const minThreshold = item.minStockLevel || 0;
                const reorderDeficit = minThreshold - currentQty;
                const isAbsoluteZero = currentQty === 0;

                return (
                  <tr key={`${item.productCode}-${item.warehouseName}`}>
                    {/* Column 1: Context Meta */}
                    <td>
                      <div className="product-meta-cell">
                        <span className="sku-mono">{item.productCode}</span>
                        <span className="sku-name">{item.productName}</span>
                      </div>
                    </td>

                    {/* Column 2: Storage Warehouse */}
                    <td className="warehouse-text-cell">📍 {item.warehouseName}</td>

                    {/* Column 3: Threshold Base */}
                    <td className="text-right font-mono font-medium">{minThreshold}</td>

                    {/* Column 4: Present On Hand */}
                    <td className={`text-right font-mono font-bold ${isAbsoluteZero ? "qty-zero" : "qty-warn"}`}>
                      {currentQty}
                    </td>

                    {/* Column 5: Complex Multi-UOM Sub pill allocations */}
                    <td>
                      <div className="report-uom-flex">
                        {item.uomBreakdown && item.uomBreakdown.length > 0 ? (
                          item.uomBreakdown.map((b, idx) => (
                            <div key={idx} className="report-uom-pill">
                              <span className="lbl">{b.uom}</span>
                              <span className="val">{b.quantity}</span>
                            </div>
                          ))
                        ) : (
                          <span className="fallback-dash">—</span>
                        )}
                      </div>
                    </td>

                    {/* Column 6: Direct calculated required buy volume deficit */}
                    <td className="text-right font-mono deficit-highlight-cell">
                      {reorderDeficit > 0 ? `+${reorderDeficit}` : 0}
                    </td>

                    {/* Column 7: Operational Danger Badges */}
                    <td>
                      {isAbsoluteZero ? (
                        <span className="severity-pill critical-pill">🚫 Out Of Stock</span>
                      ) : (
                        <span className="severity-pill warning-pill">⚠️ Low Stock Buffer</span>
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

export default LowStockReportPage;