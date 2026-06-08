import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboards/Dashboardpage";
import ProductsPage from "../pages/masters/ProductsPage";
import UomPage from "../pages/masters/UomPage";
import ProductUomPage from "../pages/masters/ProductUomPage";
import WarehousesPage from "../pages/masters/WarehousesPage";
import InventoryPage from "../pages/inventory/InventoryPage";
import InvoicesPage from "../pages/sales/InvoicePage";
import PurchasesPage from "../pages/purchase/PurchasePage";
import LowStockReportPage from "../pages/reports/LowStockReport";
import AiAssistantPage from "../pages/ai-assistant/AiAssistantPage";
import MainLayout from "../components/layout/MainLayout";
function AppRoutes() {
  return (
  <Routes>
  <Route path="/" element={<LoginPage />} />

  <Route element={<MainLayout />}>
    <Route path="/dashboard" element={<DashboardPage />} />

    <Route path="/products" element={<ProductsPage />} />
    <Route path="/uom" element={<UomPage />} />
    <Route path="/product-uom" element={<ProductUomPage />} />
    <Route path="/warehouses" element={<WarehousesPage />} />

    <Route path="/inventory" element={<InventoryPage />} />

    <Route path="/invoices" element={<InvoicesPage />} />

    <Route path="/purchases" element={<PurchasesPage />} />

    <Route
      path="/reports/low-stock"
      element={<LowStockReportPage />}
    />

    <Route
      path="/ai-assistant"
      element={<AiAssistantPage />}
    />
  </Route>
</Routes>
  );
}

export default AppRoutes;