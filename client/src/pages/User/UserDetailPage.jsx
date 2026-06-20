import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getUserById,
  updateUser,
  deleteUser,
} from "../../services/userService";

import "../../styles/userDetail.css";
import "../../styles/productDetail.css";

function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [editing, setEditing] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      role: "",
    });

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const data =
        await getUserById(id);

      setUser(data);

      setFormData({
        name: data.name,
        role: data.role,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updated =
        await updateUser(id, {
          name: formData.name,
          role:
            formData.role.toUpperCase(),
        });

      setUser(updated);
      setEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update user.");
    }
  };

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Delete this user?"
      );

    if (!confirmed) return;

    try {
      await deleteUser(id);

      navigate("/users");
    } catch (error) {
      console.error(error);
      alert("Failed to delete user.");
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <h2>Loading User...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-state">
        <h2>User Not Found</h2>
      </div>
    );
  }

  return (
    <div className="user-detail-page">

      <div className="product-toolbar">

        <div className="breadcrumbs">
          <Link
            to="/users"
            className="breadcrumb-link"
          >
            Users
          </Link>

          <span className="breadcrumb-separator">
            &gt;
          </span>

          <span className="breadcrumb-current">
            {user.name}
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

          {!editing ? (
            <button
              className="btn-secondary"
              onClick={() =>
                setEditing(true)
              }
            >
              Edit
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleSave}
            >
              Save
            </button>
          )}

          <button
            className="btn-danger"
            onClick={handleDelete}
          >
            Delete
          </button>

        </div>

      </div>

      <div className="product-header-card">

        <div className="product-badge-row">

          <span className="product-code-badge">
            USER #{user.id}
          </span>

          <span
            className={`status-badge ${
              user.role === "ADMIN"
                ? "status-active"
                : "status-inactive"
            }`}
          >
            {user.role}
          </span>

        </div>

        <h1 className="product-title">
          {user.name}
        </h1>

        <p className="product-description">
          {user.email}
        </p>

        <div className="product-meta-grid">

          <div className="meta-item">
            <label>User ID</label>
            <div className="meta-value">
              {user.id}
            </div>
          </div>

          <div className="meta-item">
            <label>Email</label>
            <div className="meta-value">
              {user.email}
            </div>
          </div>

          <div className="meta-item">
            <label>Role</label>
            <div className="meta-value">
              {user.role}
            </div>
          </div>

        </div>

      </div>

      <div className="uom-section">

        <div className="section-header">
          <h2>
            User Information
          </h2>
        </div>

        <div className="table-container">

          <table className="uom-table">

            <tbody>

              <tr>
                <th>Name</th>

                <td>
                  {editing ? (
                    <input
                      className="form-input"
                      value={
                        formData.name
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name:
                            e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>
              </tr>

              <tr>
                <th>Email</th>
                <td>{user.email}</td>
              </tr>

              <tr>
                <th>Role</th>

                <td>
                  {editing ? (
                    <select
                      className="form-input"
                      value={
                        formData.role
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role:
                            e.target.value,
                        })
                      }
                    >
                      <option value="ADMIN">
                        ADMIN
                      </option>

                      <option value="STAFF">
                        STAFF
                      </option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default UserDetailPage;