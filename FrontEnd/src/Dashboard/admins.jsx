import React, { useEffect, useState } from "react";
import "./dshusers.css";
import DASHHeader from "./DashboardComponents/dashHeader";
import DashSidebar from "./DashboardComponents/dashSidebar";
import { useTranslation } from "../TranslationContext";
import axios from "axios";

function AdminPage() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
  });

  const [updatedAdmin, setUpdatedAdmin] = useState({
    email: "",
  });

  const { translations } = useTranslation();

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Fetch all admins
  const fetchAdmins = async () => {
    setLoading(true); // Show loading
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Admins API Response:", response.data); // Debugging line

      setAdmins(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]);
    } finally {
      setLoading(false); // Hide loading
    }
  };

  // Fetch user by ID
  const fetchAdminById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admins/${id}`);
      console.log(response.data); // Handle the fetched admin data
    } catch (error) {
      console.error("Error fetching admin by ID:", error);
    }
  };

  // Create a new user
  const handleCreateAdmin = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token if stored in localStorage

      const response = await axios.post(`${API_BASE_URL}/admins`, newAdmin, {
        headers: {
          Authorization: `Bearer ${token}`, // Include authentication token
          "Content-Type": "application/json",
        },
      });

      setAdmins([...admins, response.data.data || response.data]); // Ensure correct response format

      setNewAdmin({
        email: "",
        password: "",
      });

      setShowCreateAdmin(false);
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  // Delete admin
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`${translations.deleteAdmin}`);
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token"); // Get token from storage
      await axios.delete(`${API_BASE_URL}/admins/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include authentication token
        },
      });

      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== id));
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  // Open edit modal
  const handleEditClick = (admin) => {
    setEditingAdmin(admin);
    setUpdatedAdmin({ email: admin.email });
  };

  // Update admin
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from storage
      const response = await axios.put(
        `${API_BASE_URL}/admins/${editingAdmin.id}`,
        updatedAdmin,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include authentication token
            "Content-Type": "application/json",
          },
        }
      );

      setAdmins(
        admins.map((admin) =>
          admin.id === editingAdmin.id ? { ...admin, ...updatedAdmin } : admin
        )
      );

      setEditingAdmin(null);
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  return (
    <div className="wrap-container">
      <DashSidebar
        OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)}
        openSidebarToggle={openSidebarToggle}
      />
      <div className="middle-container">
        <DASHHeader
          OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)}
        />
        <main>
          <div className="customers">
            <h2 className="">{translations.admins}</h2>
            <table>
              <thead>
                <tr>
                  <th>{translations.userid}</th>
                  <th>{translations.email}</th>
                  <th>{translations.action}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5">Loading admins...</td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id}>
                      <td>{admin.id}</td>
                      <td>{admin.email}</td>
                      <td>
                        <button
                          className="edit"
                          onClick={() => handleEditClick(admin)}
                        >
                          {translations.edit}
                        </button>
                        <button
                          className="delete"
                          onClick={() => handleDelete(admin.id)}
                        >
                          {translations.delete}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <button
            className="addprod"
            onClick={() => setShowCreateAdmin(!showCreateAdmin)}
          >
            {showCreateAdmin
              ? `${translations.close}`
              : `${translations.createAdmin}`}
          </button>

          {/* Create Admin Form */}
          {showCreateAdmin && (
            <div className="create-user-form">
              <h3>{translations.createnewadmin}</h3>
              <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
              />
              <button onClick={handleCreateAdmin}>
                {translations.createAdmin}
              </button>
            </div>
          )}

          {/* Edit User Modal */}
          {editingAdmin && (
            <div className="edit-user-modal">
              <h3>{translations.editadmin}</h3>
              <input
                type="email"
                placeholder="Email"
                value={updatedAdmin.email}
                onChange={(e) =>
                  setUpdatedAdmin({ ...updatedAdmin, email: e.target.value })
                }
              />
              <button className="addprod" onClick={handleUpdate}>
                {translations.update}
              </button>
              <button className="addprod" onClick={() => setEditingAdmin(null)}>
                {translations.cancel}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
export default AdminPage;
