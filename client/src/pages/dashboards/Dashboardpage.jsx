import { useEffect } from "react";
import {
  getProducts,
  getPurchases,
  getInvoices,
  getInventory,
  getLowStock,
} from "../../services/dashboardService";

function DashboardPage() {
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Products:", await getProducts());
        console.log("Purchases:", await getPurchases());
        console.log("Invoices:", await getInvoices());
        console.log("Inventory:", await getInventory());
        console.log("Low Stock:", await getLowStock());
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}

export default DashboardPage;