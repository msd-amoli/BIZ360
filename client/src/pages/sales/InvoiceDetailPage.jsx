import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getInvoiceById,
  cancelInvoice,
} from "../../services/invoiceService";

import "../../styles/purchaseDetail.css";

function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const data =
        await getInvoiceById(id);

      setInvoice(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel =
    async () => {
      const confirmed =
        window.confirm(
          "Cancel this invoice?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await cancelInvoice(id);

        loadInvoice();
      } catch (error) {
        console.error(error);

        alert(
          "Failed to cancel invoice."
        );
      }
    };

  if (loading) {
    return (
      <div className="loading-state">
        <h2>
          Loading Invoice...
        </h2>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="error-state">
        <h2>
          Invoice Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="product-detail-page">

      <div className="product-toolbar">

        <div className="breadcrumbs">
          <Link
            to="/invoices"
            className="breadcrumb-link"
          >
            Invoices
          </Link>

          <span className="breadcrumb-separator">
            &gt;
          </span>

          <span className="breadcrumb-current">
            {invoice.invoiceNumber}
          </span>
        </div>

        <div className="toolbar-actions">

          <button
            className="btn-secondary"
            onClick={() =>
              window.print()
            }
          >
            Print
          </button>

          {invoice.status ===
            "POSTED" && (
            <button
              className="btn-secondary"
              onClick={
                handleCancel
              }
            >
              Cancel Invoice
            </button>
          )}
        </div>

      </div>

      <div className="product-header-card">

        <div className="product-badge-row">

          <span className="product-code-badge">
            {
              invoice.invoiceNumber
            }
          </span>

          <span
            className={`status-badge ${
              invoice.status ===
              "POSTED"
                ? "status-active"
                : "status-inactive"
            }`}
          >
            {invoice.status}
          </span>

        </div>

        <h1 className="product-title">
          {invoice.customerName}
        </h1>

        <div className="product-meta-grid">

          <div className="meta-item">
            <label>
              Customer
            </label>

            <div className="meta-value">
              {
                invoice.customerName
              }
            </div>
          </div>

          <div className="meta-item">
            <label>
              Total
            </label>

            <div className="meta-value">
              {Number(
                invoice.netTotal
              ).toFixed(2)}
            </div>
          </div>

          <div className="meta-item">
            <label>
              Created At
            </label>

            <div className="meta-value">
              {new Date(
                invoice.createdAt
              ).toLocaleString()}
            </div>
          </div>

        </div>

      </div>

      <div className="uom-section">

        <div className="section-header">
          <h2>
            Invoice Items
          </h2>
        </div>

        <div className="table-container">

          <table className="uom-table">

            <thead>
              <tr>
                <th>
                  Product
                </th>
                <th>UOM</th>
                <th>
                  Warehouse
                </th>
                <th>
                  Quantity
                </th>
                <th>
                  Price
                </th>
                <th>
                  Total
                </th>
              </tr>
            </thead>

            <tbody>

              {invoice.items.map(
                (item, index) => (
                  <tr
                    key={index}
                  >
                    <td>
                      {
                        item.productName
                      }
                    </td>

                    <td>
                      {item.uom}
                    </td>

                    <td>
                      {
                        item.warehouse
                      }
                    </td>

                    <td>
                      {
                        item.quantity
                      }
                    </td>

                    <td>
                      {Number(
                        item.price
                      ).toFixed(
                        2
                      )}
                    </td>

                    <td>
                      {Number(
                        item.total
                      ).toFixed(
                        2
                      )}
                    </td>
                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      <div className="uom-section">

        <div className="section-header">
          <h2>
            Invoice Summary
          </h2>
        </div>

        <div className="product-meta-grid">

          <div className="meta-item">
            <label>
              Subtotal
            </label>

            <div className="meta-value">
              {Number(
                invoice.subTotal
              ).toFixed(2)}
            </div>
          </div>

          <div className="meta-item">
            <label>
              Discount
            </label>

            <div className="meta-value">
              {Number(
                invoice.discount
              ).toFixed(2)}
              %
            </div>
          </div>

          <div className="meta-item">
            <label>
              Discount Amount
            </label>

            <div className="meta-value">
              {Number(
                invoice.discountAmount ||
                  0
              ).toFixed(2)}
            </div>
          </div>

          <div className="meta-item">
            <label>
              VAT
            </label>

            <div className="meta-value">
              {Number(
                invoice.vat
              ).toFixed(2)}
              %
            </div>
          </div>

          <div className="meta-item">
            <label>
              VAT Amount
            </label>

            <div className="meta-value">
              {Number(
                invoice.vatAmount ||
                  0
              ).toFixed(2)}
            </div>
          </div>

          <div className="meta-item">
            <label>
              Net Total
            </label>

            <div className="meta-value">
              {Number(
                invoice.netTotal
              ).toFixed(2)}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default InvoiceDetailPage;