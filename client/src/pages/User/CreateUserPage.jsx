import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createUser } from "../../services/userService";

import "../../styles/createUser.css";

function CreateUserPage() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("STAFF");

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        alert("Name is required.");
        return;
      }

      if (!email.trim()) {
        alert("Email is required.");
        return;
      }

      if (!password.trim()) {
        alert("Password is required.");
        return;
      }

      const payload = {
        name,
        email,
        password,
        role: role.toUpperCase(),
      };

      const user =
        await createUser(payload);

      navigate(
        `/users/${user.id}`
      );
    } catch (error) {
      console.error(error);
      alert(
        "Failed to create user."
      );
    }
  };

  return (
    <div className="create-user-page">

      <div className="page-toolbar">
        <div className="breadcrumbs">
          <Link
            to="/users"
            className="breadcrumb-link"
          >
            Users
          </Link>

          <span>&gt;</span>

          <span>
            New User
          </span>
        </div>
      </div>

      <div className="page-card">
        <h1>Create User</h1>

        <p>
          Create a new system user.
        </p>
      </div>

      <div className="page-card">
        <h2>
          User Information
        </h2>

        <div className="form-grid">

          <div>
            <label>
              Name
            </label>

            <input
              className="form-input"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Enter name"
            />
          </div>

          <div>
            <label>
              Email
            </label>

            <input
              className="form-input"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="Enter email"
            />
          </div>

          <div>
            <label>
              Password
            </label>

            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter password"
            />
          </div>

          <div>
            <label>
              Role
            </label>

            <select
              className="form-input"
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }
            >
              <option value="ADMIN">
                ADMIN
              </option>

              <option value="STAFF">
                STAFF
              </option>
            </select>
          </div>

        </div>
      </div>

      <div className="summary-card">

        <h2>
          User Summary
        </h2>

        <div className="summary-row">
          <span>Name</span>
          <strong>{name || "-"}</strong>
        </div>

        <div className="summary-row">
          <span>Email</span>
          <strong>{email || "-"}</strong>
        </div>

        <div className="summary-row">
          <span>Role</span>
          <strong>{role}</strong>
        </div>

        <button
          className="btn-primary save-btn"
          onClick={handleSave}
        >
          Save User
        </button>

      </div>

    </div>
  );
}

export default CreateUserPage;