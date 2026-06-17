import { useEffect, useState } from "react";
import "../../styles/dashboard.css";
import KpiCard from "../../components/dashboard/KpiCard";
import {
  getProducts,
  getPurchases,
  getInvoices,
  getInventory,
  getLowStockItems,
} from "../../services/dashboardService";

function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    purchases: 0,
    sales: 0,
    inventory: 0,
    lowStock: 0,
  });

  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          products,
          purchases,
          invoices,
          inventory,
          lowStock,
        ] = await Promise.all([
          getProducts(),
          getPurchases(),
          getInvoices(),
          getInventory(),
          getLowStockItems(),
        ]);

        const totalSales = invoices
          .filter((invoice) => invoice.status === "POSTED")
          .reduce((sum, invoice) => sum + invoice.netTotal, 0);

        setStats({
          products: products.length,
          purchases: purchases.length,
          sales: totalSales,
          inventory: inventory.length,
          lowStock: lowStock.length,
        });

        setLowStockItems(lowStock);
      } catch (error) {
        console.error("Dashboard Load Failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-spinner"></div>
        <h2>Loading ERP Dashboard Data...</h2>
      </div>
    );
  }

  const role = localStorage.getItem("role");
  
  // Format the numerical sales safely into standard professional currency representation
  const formattedSales = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(stats.sales);

  return (
    <div className="dashboard-page">
      {/* Top Welcome Title Section */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>System metrics and live inventory telemetry for {localStorage.getItem("name") || "User"}</p>
        </div>
        <div className="dashboard-date-badge">
          Live System Status
        </div>
      </div>

      {/* Modern Horizontal KPI Bar Grid */}
      <div className="kpi-grid">
        <div className="kpi-card-wrapper metric-products">
          <KpiCard title="Total Products" value={stats.products} />
        </div>

        <div className="kpi-card-wrapper metric-purchases">
          <KpiCard title="Total Purchases" value={stats.purchases} />
        </div>

        <div className="kpi-card-wrapper metric-sales">
          <KpiCard title="Total Sales" value={formattedSales} type="sales" />
        </div>

        <div className="kpi-card-wrapper metric-inventory">
          <KpiCard title="Inventory Records" value={stats.inventory} />
        </div>

        <div className="kpi-card-wrapper metric-lowstock">
          <KpiCard title="Low Stock Alerts" value={stats.lowStock} />
        </div>
      </div>

      {/* Admin Operations Console Control Grid */}
      {role === "ADMIN" && (
        <div className="dashboard-section">
          <div className="section-header-row">
            <div>
              <h2>Critical Stock Deficits</h2>
              <p className="section-subtitle">Products dipping below minimum safety stock buffers</p>
            </div>
            <span className="alert-count-badge">{lowStockItems.length} Items Alerting</span>
          </div>

          <div className="table-scroll-wrapper">
            <table className="low-stock-table">
              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Available Units</th>
                  <th>Safety Threshold</th>
                  <th style={{ textAlign: 'right' }}>Shortage Deficit</th>
                </tr>
              </thead>

              <tbody>
                {lowStockItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-table-state">
                      ✅ All inventory thresholds are operating normally. No stock deficits detected.
                    </td>
                  </tr>
                ) : (
                  lowStockItems.map((item) => {
                    const deficitValue = item.minStockLevel - item.baseQuantity;
                    return (
                      <tr key={`${item.productCode}-${item.warehouseName || 'default'}`}>
                        <td className="code-column-text">{item.productCode}</td>
                        <td className="name-column-text">{item.productName}</td>
                        <td>
                          <span className="stock-pill stock-pill-current">
                            {item.baseQuantity}
                          </span>
                        </td>
                        <td>
                          <span className="stock-pill stock-pill-min">
                            {item.minStockLevel}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="deficit-indicator-badge">
                            -{deficitValue} units
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;