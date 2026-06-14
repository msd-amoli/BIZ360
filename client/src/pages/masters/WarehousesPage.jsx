import { useEffect, useState } from "react";

import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  searchWarehouses,
} from "../../services/warehouseService";

import "../../styles/warehouse.css";

function WarehousePage() {
  const [warehouses, setWarehouses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingWarehouse,
    setEditingWarehouse] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
  });

  const loadWarehouses = async () => {
    try {
      const data =
        await getWarehouses();

      setWarehouses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  useEffect(() => {
    const delay =
      setTimeout(async () => {
        try {
          if (!search.trim()) {
            loadWarehouses();
            return;
          }

          const result =
            await searchWarehouses(
              search
            );

          setWarehouses(result);
        } catch (error) {
          console.error(error);
        }
      }, 300);

    return () =>
      clearTimeout(delay);
  }, [search]);

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      if (editingWarehouse) {
        await updateWarehouse(
          editingWarehouse.id,
          form
        );
      } else {
        await createWarehouse(form);
      }

      await loadWarehouses();

      setShowModal(false);

      setEditingWarehouse(null);

      setForm({
        name: "",
        location: "",
      });
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data ||
          "Operation failed"
      );
    }
  };

  const handleAdd = () => {
    setEditingWarehouse(null);

    setForm({
      name: "",
      location: "",
    });

    setShowModal(true);
  };

  const handleEdit = (
    warehouse
  ) => {
    setEditingWarehouse(
      warehouse
    );

    setForm({
      name: warehouse.name,
      location:
        warehouse.location,
    });

    setShowModal(true);
  };

  if (loading) {
    return (
      <h2>
        Loading Warehouses...
      </h2>
    );
  }

  return (
    <>
      <div className="warehouse-page">

        <div className="warehouse-header">
          <div>
            <h1>
              Warehouse Master
            </h1>

            <p>
              Manage storage
              locations used by
              inventory and sales.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={handleAdd}
          >
            + Add Warehouse
          </button>
        </div>

        <div className="warehouse-toolbar">
          <input
            type="text"
            placeholder="Search Warehouse..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        <div className="warehouse-card">

          <table className="warehouse-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th width="120">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {warehouses.length >
              0 ? (
                warehouses.map(
                  (
                    warehouse
                  ) => (
                    <tr
                      key={
                        warehouse.id
                      }
                    >
                      <td>
                        <span className="warehouse-badge">
                          {
                            warehouse.name
                          }
                        </span>
                      </td>

                      <td>
                        {
                          warehouse.location
                        }
                      </td>

                      <td>
                        <button
                          className="btn-secondary"
                          onClick={() =>
                            handleEdit(
                              warehouse
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="empty-state"
                  >
                    No Warehouses
                    Found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">
              <h3>
                {editingWarehouse
                  ? "Edit Warehouse"
                  : "Add Warehouse"}
              </h3>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div className="form-group">
                <label>
                  Name
                </label>

                <input
                  type="text"
                  value={
                    form.name
                  }
                  disabled={
                    editingWarehouse
                  }
                  onChange={(
                    e
                  ) =>
                    setForm({
                      ...form,
                      name:
                        e.target
                          .value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Location
                </label>

                <input
                  type="text"
                  value={
                    form.location
                  }
                  onChange={(
                    e
                  ) =>
                    setForm({
                      ...form,
                      location:
                        e.target
                          .value,
                    })
                  }
                  required
                />
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save
                </button>

              </div>
            </form>

          </div>

        </div>
      )}
    </>
  );
}

export default WarehousePage;