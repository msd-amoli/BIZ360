
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUsers } from "../../services/userService";

import "../../styles/users.css";

function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response =
        await getUsers();

      setUsers(response.content);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers =
    users.filter((user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        user.email
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesRole =
        !roleFilter ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });

  if (loading) {
    return (
      <h2>Loading Users...</h2>
    );
  }

  return (
    <div className="users-page">

      <div className="page-card">
        <div className="page-header">
          <div>
            <h1>Users</h1>
            <p>
              Manage system users and
              permissions
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() =>
              navigate("/users/new")
            }
          >
            + New User
          </button>
        </div>
      </div>

      <div className="page-card">

        <div className="filter-row">

          <input
            className="form-input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

          <select
            className="form-input"
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(
                e.target.value
              )
            }
          >
            <option value="">
              All Roles
            </option>

            <option value="ADMIN">
              ADMIN
            </option>

            <option value="STAFF">
              STAFF
            </option>

          </select>

        </div>

      </div>

      <div className="page-card">

        <div className="table-container">

          <table className="users-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.length >
              0 ? (
                filteredUsers.map(
                  (user) => (
                    <tr
                      key={user.id}
                      className="clickable-row"
                      onClick={() =>
                        navigate(
                          `/users/${user.id}`
                        )
                      }
                    >
                      <td>
                        {user.id}
                      </td>

                      <td>
                        {user.name}
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        <span
                          className={`role-badge ${
                            user.role ===
                            "ADMIN"
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="empty-table-state"
                  >
                    No users found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default UsersPage;