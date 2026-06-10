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
          .reduce(
            (sum, invoice) => sum + invoice.netTotal,
            0
          );

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
    return <h2>Loading Dashboard...</h2>;
  }
const role = localStorage.getItem("role");
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>

        <p>
          Welcome back, {localStorage.getItem("name")}
        </p>
      </div>

      <div className="kpi-grid">
        <KpiCard
          title="Total Products"
          value={stats.products}
        />

        <KpiCard
          title="Total Purchases"
          value={stats.purchases}
        />

        <KpiCard
          title="Total Sales"
          value={stats.sales}
          type ="sales"
        />

        <KpiCard
          title="Inventory Records"
          value={stats.inventory}
        />

        <KpiCard
          title="Low Stock Items"
          value={stats.lowStock}
        />
      </div>
{role==="ADMIN" &&(
      <div className="dashboard-section">
        <h2>Low Stock Alerts</h2>

        <p>Rows: {lowStockItems.length}</p>

        <table className="low-stock-table">
          <thead>
            <tr>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Available</th>
              <th>Minimum</th>
              <th>Required</th>
            </tr>
          </thead>

          <tbody>
            {lowStockItems.map((item) => (
              <tr
                key={`${item.productCode}-${item.warehouseName}`}
              >
                <td>{item.productCode}</td>
                <td>{item.productName}</td>
                <td>{item.baseQuantity}</td>
                <td>{item.minStockLevel}</td>
                <td>
                  {item.minStockLevel -
                    item.baseQuantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
    
  );
}

export default DashboardPage;