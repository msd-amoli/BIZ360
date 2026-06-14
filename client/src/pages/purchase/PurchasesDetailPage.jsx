import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getPurchaseById,
  cancelPurchase,
} from "../../services/purchaseService";

import "../../styles/purchaseDetail.css";

function PurchaseDetailPage() {
  const { id } = useParams();

  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPurchase = async () => {
    try {
      const data = await getPurchaseById(id);
      setPurchase(data);
    } catch (error) {
      console.error("Failed to load purchase:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchase();
  }, [id]);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this purchase?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelPurchase(id);
      await loadPurchase();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel purchase.");
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <h2>Loading Purchase...</h2>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="error-state">
        <h2>Purchase Not Found</h2>
      </div>
    );
  }

  return (
    <div className="purchase-detail-page">
      {/* TOOLBAR */}
      <div className="product-toolbar">
        <div className="breadcrumbs">
          <Link
            to="/purchases"
            className="breadcrumb-link"
          >
            Purchases
          </Link>

          <span className="breadcrumb-separator">
            &gt;
          </span>

          <span className="breadcrumb-current">
            {purchase.purchaseNumber}
          </span>
        </div>

        <div className="toolbar-actions">
          <button
            className="btn-secondary"
            onClick={() => window.print()}
          >
            Print
          </button>

          {purchase.status === "POSTED" && (
            <button
              className="btn-danger"
              onClick={handleCancel}
            >
              Cancel Purchase
            </button>
          )}
        </div>
      </div>

      {/* HEADER CARD */}
      <div className="product-header-card">
        <div className="product-badge-row">
          <span className="product-code-badge">
            {purchase.purchaseNumber}
          </span>

          <span
            className={`status-badge ${
              purchase.status === "POSTED"
                ? "status-active"
                : "status-inactive"
            }`}
          >
            {purchase.status}
          </span>
        </div>

        <h1 className="product-title">
          {purchase.supplierName}
        </h1>

        <p className="product-description">
          Purchase Order
        </p>

        <div className="product-meta-grid">
          <div className="meta-item">
            <label>Supplier</label>

            <div className="meta-value">
              {purchase.supplierName}
            </div>
          </div>

          <div className="meta-item">
            <label>Purchase Number</label>

            <div className="meta-value">
              {purchase.purchaseNumber}
            </div>
          </div>

          <div className="meta-item">
            <label>Created At</label>

            <div className="meta-value">
              {new Date(
                purchase.createdAt
              ).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* ITEMS */}
      <div className="uom-section">
        <div className="section-header">
          <h2>Purchase Items</h2>
        </div>

        <div className="table-container">
          <table className="uom-table">
            <thead>
              <tr>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>UOM</th>
                <th>Warehouse</th>
                <th>Quantity</th>
                <th>Cost Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {purchase.items.length > 0 ? (
                purchase.items.map(
                  (item, index) => (
                    <tr key={index}>
                      <td>
                        {item.productCode}
                      </td>

                      <td>
                        {item.productName}
                      </td>

                      <td>{item.uom}</td>

                      <td>
                        {item.warehouse}
                      </td>

                      <td>
                        {item.quantity}
                      </td>

                      <td>
                        {Number(
                          item.costPrice
                        ).toFixed(2)}
                      </td>

                      <td>
                        {Number(
                          item.total
                        ).toFixed(2)}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="empty-table-state"
                  >
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="summary-card">
        <h2>Order Summary</h2>

        <div className="summary-row">
          <span>Subtotal</span>

          <strong>
            {Number(
              purchase.subTotal
            ).toFixed(2)}
          </strong>
        </div>

        <div className="summary-row">
          <span>Discount %</span>

          <strong>
            {purchase.discount ?? 0}
          </strong>
        </div>

        <div className="summary-row">
          <span>Discount Amount</span>

          <strong>
            {Number(
              purchase.discountAmount ?? 0
            ).toFixed(2)}
          </strong>
        </div>

        <div className="summary-row">
          <span>VAT %</span>

          <strong>
            {purchase.vat ?? 0}
          </strong>
        </div>

        <div className="summary-row">
          <span>VAT Amount</span>

          <strong>
            {Number(
              purchase.vatAmount ?? 0
            ).toFixed(2)}
          </strong>
        </div>

        <hr />

        <div className="summary-row total-row">
          <span>Net Total</span>

          <strong>
            {Number(
              purchase.netTotal
            ).toFixed(2)}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default PurchaseDetailPage;