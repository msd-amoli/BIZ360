
import "../../styles/purchase.css";
import { useEffect, useState }
  from "react";

import { Link, useNavigate }
  from "react-router-dom";

import {
  getPurchases,
} from "../../services/purchaseService";

function PurchasesPage() {
    const navigate =
  useNavigate();
    const [purchases, setPurchases] =
  useState([]);

const [loading, setLoading] =
  useState(true);

const [searchNumber,
  setSearchNumber] =
  useState("");

const [supplierFilter,
  setSupplierFilter] =
  useState("");

const [statusFilter,
  setStatusFilter] =
  useState("ALL");


const loadPurchases =
  async () => {
    try {
      const data =
        await getPurchases();

      setPurchases(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const filteredPurchases =
  purchases.filter((purchase) => {

    const matchesNumber =
      purchase.purchaseNumber
        .toLowerCase()
        .includes(
          searchNumber.toLowerCase()
        );

    const matchesSupplier =
      purchase.supplierName
        .toLowerCase()
        .includes(
          supplierFilter.toLowerCase()
        );

    const matchesStatus =
      statusFilter === "ALL" ||
      purchase.status ===
        statusFilter;

    return (
      matchesNumber &&
      matchesSupplier &&
      matchesStatus
    );
  });

useEffect(() => {
  loadPurchases();
}, []);
if (loading) {
  return (
    <h2>
      Loading Purchases...
    </h2>
  );
}
  return (
    <div className="purchase-page">

      {/* Toolbar */}
      <div className="purchase-toolbar">

        <div>
          <h1>Purchases</h1>

          <p>
            Manage supplier purchases and
            inventory receipts.
          </p>
        </div>

        <Link
          to="/purchases/new"
          className="btn-primary"
        >
          + New Purchase
        </Link>

      </div>

      {/* Filters */}
      <div className="purchase-filters">

      <input
  type="text"
  placeholder="Search Purchase Number..."
  value={searchNumber}
  onChange={(e) =>
    setSearchNumber(
      e.target.value
    )
  }
/>

      <input
  type="text"
  placeholder="Supplier..."
  value={supplierFilter}
  onChange={(e) =>
    setSupplierFilter(
      e.target.value
    )
  }
/>

      <select
  value={statusFilter}
  onChange={(e) =>
    setStatusFilter(
      e.target.value
    )
  }
>
  <option value="ALL">
    All Status
  </option>

  <option value="POSTED">
    POSTED
  </option>

  <option value="CANCELLED">
    CANCELLED
  </option>
</select>

      </div>

      {/* Table Card */}
      <div className="purchase-card">

        <table className="purchase-table">

          <thead>
            <tr>
              <th>
                Purchase No.
              </th>

              <th>
                Supplier
              </th>

              <th>
                Date
              </th>

              <th>
                Status
              </th>

              <th>
                Net Total
              </th>

              <th>
                Items
              </th>
            </tr>
          </thead>

          <tbody>

  {filteredPurchases.length >
  0 ? (
    filteredPurchases.map(
      (purchase) => (
        <tr
          key={purchase.id}
          className="clickable-row"
          onClick={() =>
            navigate(
              `/purchases/${purchase.id}`
            )
          }
        >
          <td>
            {purchase.purchaseNumber}
          </td>

          <td>
            {purchase.supplierName}
          </td>

          <td>
            {new Date(
              purchase.createdAt
            ).toLocaleDateString()}
          </td>

          <td>

            <span
              className={`status-badge ${
                purchase.status ===
                "POSTED"
                  ? "status-active"
                  : "status-inactive"
              }`}
            >
              {purchase.status}
            </span>

          </td>

          <td>
            {Number(
              purchase.netTotal
            ).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
              }
            )}
          </td>

          <td>
            {
              purchase.items
                ?.length
            }{" "}
            Item(s)
          </td>

        </tr>
      )
    )
  ) : (
    <tr>
      <td
        colSpan="6"
        className="empty-state"
      >
        No Purchases Found
      </td>
    </tr>
  )}

</tbody>

        </table>

      </div>

    </div>
  );
}

export default PurchasesPage;