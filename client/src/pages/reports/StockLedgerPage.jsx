import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/ledger.css";

function StockLedgerPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [loading, setLoading] = useState(true);

  // Date Range Constraints (Defaulting to the last 30 days)
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  // Compiled Ledger Report Outputs
  const [ledgerTimeline, setLedgerTimeline] = useState([]);
  const [summary, setSummary] = useState({
    opening: 0,
    totalInward: 0,
    totalOutward: 0,
    closing: 0,
  });

  // Initial load to populate the product selection dropdown
  useEffect(() => {
    const loadCoreProducts = async () => {
      try {
        const res = await api.get("/inventory").catch(() => api.get("/products"));
        setProducts(res.data);
        if (res.data && res.data.length > 0) {
          setSelectedProduct(res.data[0].productCode);
        }
      } catch (err) {
        console.error("Failed to load base products configuration:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCoreProducts();
  }, []);

  // Compile Ledger records when selected product or dates shift
  useEffect(() => {
    if (!selectedProduct) return;

    const compileLedgerReport = async () => {
      try {
        setLoading(true);

        const [purchaseRes, invoiceRes] = await Promise.all([
          api.get("/purchases").catch(() => ({ data: [] })),
          api.get("/invoices").catch(() => ({ data: [] })),
        ]);

        const targetItem = products.find((p) => p.productCode === selectedProduct);
        const currentLiveStock = targetItem ? targetItem.baseQuantity || 0 : 0;

        let chronologicalActivities = [];

        // Map Purchase Logs (Stock Additions)
        purchaseRes.data.forEach((purchase) => {
          const itemsList = purchase.items || [purchase];
          itemsList.forEach((item) => {
            if (item.productCode === selectedProduct) {
              chronologicalActivities.push({
                date: new Date(purchase.date || purchase.createdAt),
                type: "PURCHASE",
                referenceNo: purchase.purchaseNumber || purchase.id || "PO-REF",
                party: purchase.supplierName || "External Supplier",
                inwardQty: Number(item.quantity),
                outwardQty: 0,
              });
            }
          });
        });

        // Map Invoice Logs (Stock Reductions)
        invoiceRes.data.forEach((invoice) => {
          const itemsList = invoice.items || [invoice];
          itemsList.forEach((item) => {
            if (item.productCode === selectedProduct) {
              chronologicalActivities.push({
                date: new Date(invoice.date || invoice.createdAt),
                type: "SALE",
                referenceNo: invoice.invoiceNumber || invoice.id || "INV-REF",
                party: invoice.customerName || "Walk-in Customer",
                inwardQty: 0,
                outwardQty: Number(item.quantity),
              });
            }
          });
        });

        // Sort chronological movements oldest-to-newest
        chronologicalActivities.sort((a, b) => a.date - b.date);

        // Reverse-Engineering Core Balance Engine
        let runningBalance = currentLiveStock;
        
        for (let i = chronologicalActivities.length - 1; i >= 0; i--) {
          chronologicalActivities[i].balanceAfter = runningBalance;
          runningBalance = runningBalance - chronologicalActivities[i].inwardQty + chronologicalActivities[i].outwardQty;
        }

        const filterStart = new Date(`${startDate}T00:00:00`);
        const filterEnd = new Date(`${endDate}T23:59:59`);

        const filteredActivities = chronologicalActivities.filter(
          (act) => act.date >= filterStart && act.date <= filterEnd
        );

        const activitiesBeforeRange = chronologicalActivities.filter((act) => act.date < filterStart);
        const rangeOpeningBalance =
          activitiesBeforeRange.length > 0
            ? activitiesBeforeRange[activitiesBeforeRange.length - 1].balanceAfter
            : runningBalance;

        let totalIn = 0;
        let totalOut = 0;
        filteredActivities.forEach((act) => {
          totalIn += act.inwardQty;
          totalOut += act.outwardQty;
        });

        setLedgerTimeline(filteredActivities);
        setSummary({
          opening: rangeOpeningBalance,
          totalInward: totalIn,
          totalOutward: totalOut,
          closing: rangeOpeningBalance + totalIn - totalOut,
        });
      } catch (err) {
        console.error("Failed to build consolidated ledger matrix:", err);
      } finally {
        setLoading(false);
      }
    };

    compileLedgerReport();
  }, [selectedProduct, startDate, endDate, products]);

  if (loading && products.length === 0) {
    return (
      <div className="ledger-loading-screen">
        <div className="ledger-spinner"></div>
        <p>Reconciling entries and tracking records...</p>
      </div>
    );
  }

  return (
    <div className="stock-ledger-container">
      {/* Upper Filter Console Panel */}
      <div className="ledger-header-card">
        <div className="title-block">
            <div>
          <h1>Stock Transaction Cardex</h1>
          <p>Audit item-wise balances, trace incoming replenishment, and log transaction operations.</p>
          </div>
          <button onClick={() => window.print()} className="print-report-btn">
          🖨️ Export Report Sheet
        </button>
        </div>

        <div className="control-filters-row">
          <div className="filter-input-element">
            <label>Target Product</label>
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
              {products.map((p) => (
                <option key={p.productCode} value={p.productCode}>
                  [{p.productCode}] {p.productName}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-input-element">
            <label>From Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="filter-input-element">
            <label>To Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Balance Summary Board */}
      <div className="ledger-summary-grid">
        <div className="summary-metric-card opening-card">
          <span className="card-label">Opening Balance</span>
          <h2 className="card-val">{summary.opening.toLocaleString()}</h2>
          <span className="card-sub text-muted">Stock at start of window</span>
        </div>
        <div className="summary-metric-card inward-card">
          <span className="card-label">Total Inward (+)</span>
          <h2 className="card-val text-success">+{summary.totalInward.toLocaleString()}</h2>
          <span className="card-sub">Procurements & Inflows</span>
        </div>
        <div className="summary-metric-card outward-card">
          <span className="card-label">Total Outward (-)</span>
          <h2 className="card-val text-danger">-{summary.totalOutward.toLocaleString()}</h2>
          <span className="card-sub">Invoiced Shipments</span>
        </div>
        <div className="summary-metric-card closing-card">
          <span className="card-label">Closing Balance</span>
          <h2 className="card-val">{summary.closing.toLocaleString()}</h2>
          <span className="card-sub text-muted">Stock at end of window</span>
        </div>
      </div>

      {/* Main Ledger Book Data Table */}
      <div className="ledger-table-wrapper">
        <table className="ledger-data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Doc Type</th>
              <th>Document Number</th>
              <th>Counterparty/Entity</th>
              <th className="text-right">Inward (Qty)</th>
              <th className="text-right">Outward (Qty)</th>
              <th className="text-right">Running Balance</th>
            </tr>
          </thead>
          <tbody>
            {ledgerTimeline.length === 0 ? (
              <tr>
                <td colSpan="7" className="ledger-empty-state">
                  No purchase orders or sales invoices logged inside this date range.
                </td>
              </tr>
            ) : (
              ledgerTimeline.map((row, index) => (
                <tr key={index}>
                  {/* Column 1: Timestamp */}
                  <td className="time-cell">
                    {row.date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </td>
                  
                  {/* Column 2: Isolated Doc Type Tag */}
                  <td>
                    <span className={`tx-type-tag ${row.type === "PURCHASE" ? "tag-pur" : "tag-sale"}`}>
                      {row.type}
                    </span>
                  </td>

                  {/* Column 3: Isolated Document String Code */}
                  <td className="doc-number-cell">
                    {row.referenceNo}
                  </td>

                  {/* Column 4: Counterparty */}
                  <td className="party-cell">{row.party}</td>

                  {/* Column 5: Inflows */}
                  <td className="text-right text-success font-mono">
                    {row.inwardQty > 0 ? `+${row.inwardQty}` : "—"}
                  </td>

                  {/* Column 6: Outflows */}
                  <td className="text-right text-danger font-mono">
                    {row.outwardQty > 0 ? `-${row.outwardQty}` : "—"}
                  </td>

                  {/* Column 7: Cumulative Balance */}
                  <td className="text-right font-bold font-mono text-dark">
                    {row.balanceAfter}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockLedgerPage;