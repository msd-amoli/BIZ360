import { useEffect, useState } from "react";

import {
  getUoms,
  createUom,
  updateUom,
  searchUoms,
} from "../../services/uomService";

import "../../styles/uom.css";

function UomPage() {
  const [uoms, setUoms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingUom, setEditingUom] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const loadUoms = async () => {
    try {
      const data = await getUoms();
      setUoms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUoms();
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        if (!search.trim()) {
          loadUoms();
          return;
        }

        const result = await searchUoms(search);

        setUoms(result);
      } catch (error) {
        console.error(error);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUom) {
        await updateUom(editingUom.id, form);
      } else {
        await createUom(form);
      }

      await loadUoms();

      setShowModal(false);

      setEditingUom(null);

      setForm({
        name: "",
        description: "",
      });
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data ||
          "Operation failed"
      );
    }
  };

  const handleEdit = (uom) => {
    setEditingUom(uom);

    setForm({
      name: uom.name,
      description: uom.description,
    });

    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingUom(null);

    setForm({
      name: "",
      description: "",
    });

    setShowModal(true);
  };

  if (loading) {
    return <h2>Loading UOMs...</h2>;
  }

  return (
    <>
      <div className="uom-page">

        <div className="uom-header">
          <div>
            <h1>UOM Master</h1>
            <p>
              Manage Units of Measure used
              across products and inventory.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={handleAdd}
          >
            + Add UOM
          </button>
        </div>

        <div className="uom-toolbar">
          <input
            type="text"
            placeholder="Search UOM..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="uom-card">

          <table className="uom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th width="120">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {uoms.length > 0 ? (
                uoms.map((uom) => (
                  <tr key={uom.id}>
                    <td>
                      <span className="uom-badge">
                        {uom.name}
                      </span>
                    </td>

                    <td>
                      {uom.description}
                    </td>

                    <td>
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          handleEdit(uom)
                        }
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="empty-state"
                  >
                    No UOM Found
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
                {editingUom
                  ? "Edit UOM"
                  : "Add UOM"}
              </h3>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  value={form.name}
                  disabled={editingUom}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
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
                    setShowModal(false)
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

export default UomPage;