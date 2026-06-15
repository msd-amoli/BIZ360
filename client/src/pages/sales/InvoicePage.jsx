import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getInvoices,
} from "../../services/invoiceService";

import "../../styles/invoicePage.css";

function InvoicesPage() {
  const navigate =
    useNavigate();

  const [invoices, setInvoices] =
    useState([]);

  const [filteredInvoices,
    setFilteredInvoices] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [filters,
    setFilters] =
    useState({
      invoiceNumber: "",
      customerName: "",
      status: "",
    });

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, invoices]);

  const loadInvoices =
    async () => {
      try {
        const data =
          await getInvoices();

        setInvoices(data);
        setFilteredInvoices(
          data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const applyFilters =
    () => {
      let data = [...invoices];

      if (
        filters.invoiceNumber
      ) {
        data = data.filter(
          (invoice) =>
            invoice.invoiceNumber
              .toLowerCase()
              .includes(
                filters.invoiceNumber.toLowerCase()
              )
        );
      }

      if (
        filters.customerName
      ) {
        data = data.filter(
          (invoice) =>
            invoice.customerName
              .toLowerCase()
              .includes(
                filters.customerName.toLowerCase()
              )
        );
      }

      if (
        filters.status
      ) {
        data = data.filter(
          (invoice) =>
            invoice.status ===
            filters.status
        );
      }

      setFilteredInvoices(
        data
      );
    };

  if (loading) {
    return (
      <div
        className="loading-state"
      >
        <h2>
          Loading
          Invoices...
        </h2>
      </div>
    );
  }

  return (
    <div className="invoice-page">

      <div className="page-header-card">

        <div>

          <h1>
            Invoices
          </h1>

          <p>
            Manage customer
            sales invoices.
          </p>

        </div>

        <button
          className="btn-primary"
          onClick={() =>
            navigate(
              "/invoices/new"
            )
          }
        >
          + New Invoice
        </button>

      </div>

      <div className="filter-card">

        <input
          type="text"
          placeholder="Invoice Number"
          value={
            filters.invoiceNumber
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              invoiceNumber:
                e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Customer Name"
          value={
            filters.customerName
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              customerName:
                e.target.value,
            })
          }
        />

        <select
          value={
            filters.status
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              status:
                e.target.value,
            })
          }
        >
          <option value="">
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

      <div className="table-card">

        <table className="invoice-table">

          <thead>
            <tr>
              <th>
                Invoice No
              </th>

              <th>
                Customer
              </th>

              <th>
                Status
              </th>

              <th>
                Subtotal
              </th>

              <th>
                Net Total
              </th>

              <th>
                Created
              </th>
            </tr>
          </thead>

          <tbody>

            {filteredInvoices.length >
            0 ? (
              filteredInvoices.map(
                (
                  invoice
                ) => (
                  <tr
                    key={
                      invoice.id
                    }
                    onClick={() =>
                      navigate(
                        `/invoices/${invoice.id}`
                      )
                    }
                  >
                    <td>
                      {
                        invoice.invoiceNumber
                      }
                    </td>

                    <td>
                      {
                        invoice.customerName
                      }
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          invoice.status ===
                          "POSTED"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {
                          invoice.status
                        }
                      </span>
                    </td>

                    <td>
                      {Number(
                        invoice.subTotal
                      ).toFixed(
                        2
                      )}
                    </td>

                    <td>
                      {Number(
                        invoice.netTotal
                      ).toFixed(
                        2
                      )}
                    </td>

                    <td>
                      {new Date(
                        invoice.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="empty-table-state"
                >
                  No invoices
                  found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default InvoicesPage;