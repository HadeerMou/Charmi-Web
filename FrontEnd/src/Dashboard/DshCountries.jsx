import React, { useEffect, useState } from "react";
import "./dshusers.css";
import DASHHeader from "./DashboardComponents/dashHeader";
import DashSidebar from "./DashboardComponents/dashSidebar";
import { useTranslation } from "../TranslationContext";
import axios from "axios";

function DshCountries() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [showCreateCountry, setShowCreateCountry] = useState(false);
  const [country, setCountry] = useState([]);
  const [editingCountry, setEditingCountry] = useState(null);
  const [newCountry, setNewCountry] = useState({
    name: "",
  });

  const [updatedCountry, setUpdatedCountry] = useState({
    country_id: "",
    name: "",
  });

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const { translations } = useTranslation();
  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch all Countrys
  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/country`);
      setCountry(response.data);
    } catch (error) {
      console.error("Error fetching Countrys:", error);
    }
  };

  // Fetch Country by ID
  const fetchCountryById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/country/${id}`);
      console.log(response.data); // Handle the fetched Country data
    } catch (error) {
      console.error("Error fetching Country by ID:", error);
    }
  };

  // Create a new Country
  const handleCreateCountry = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token if stored in localStorage

      const response = await axios.post(`${API_BASE_URL}/country`, newCountry, {
        headers: {
          Authorization: `Bearer ${token}`, // Include authentication token
          "Content-Type": "application/json",
        },
      });

      setCountry([...country, response.data]);
      setNewCountry({
        name: "",
      });
    } catch (error) {
      console.error("Error creating Country:", error);
    }
  };

  // Delete Country
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`${translations.deleteCountry}`);
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token"); // Get token from storage
      await axios.delete(`${API_BASE_URL}/country/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include authentication token
        },
      });

      setCountry(country.filter((country) => country.id !== id));
    } catch (error) {
      console.error("Error deleting Country:", error);
    }
  };

  // Open edit modal
  const handleEditClick = (country) => {
    setEditingCountry(country);
    setUpdatedCountry({ name: country.name });
  };

  // Update Country
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from storage
      const response = await axios.put(
        `${API_BASE_URL}/country/${editingCountry.id}`,
        updatedCountry,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include authentication token
            "Content-Type": "application/json",
          },
        }
      );

      setCountry(
        country.map((country) =>
          country.id === editingCountry.id ? response.data : country
        )
      );
      setEditingCountry(null);
    } catch (error) {
      console.error("Error updating Country:", error);
    }
  };
  return (
    <>
      <div className="wrap-container">
        <DashSidebar
          OpenSidebar={OpenSidebar}
          openSidebarToggle={openSidebarToggle}
        />

        <div className="middle-container">
          <DASHHeader OpenSidebar={OpenSidebar} />
          <main>
            <div class="customers">
              <h2 className="cutomerstitle">{translations.cutomerstitle}</h2>
              <table>
                <thead>
                  <tr>
                    <th className="select">{translations.select}</th>
                    <th className="adminid">{translations.countryId}</th>
                    <th className="name">{translations.name}</th>
                    <th>{translations.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(country) && country.length > 0 ? (
                    country.map((countryItem) => (
                      <tr key={countryItem.id}>
                        <td>
                          <i className="fa-regular fa-square"></i>
                        </td>
                        <td>{countryItem.id}</td>
                        <td>{countryItem.name}</td>
                        <td>
                          <button
                            className="edit"
                            onClick={() => handleEditClick(countryItem)}
                          >
                            {translations.edit}
                          </button>
                          <button
                            className="delete"
                            onClick={() => handleDelete(countryItem.id)}
                          >
                            {translations.delete}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No Countries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <a href="#" className="showall">
                {translations.showall}
              </a>
            </div>
            <div className="adminsbuttons">
              <button
                className="createadmin"
                onClick={() => setShowCreateCountry(!showCreateCountry)}
              >
                {showCreateCountry
                  ? `${translations.close}`
                  : `${translations.createCountry}`}
              </button>
              <button className="delete">{translations.delete}</button>
            </div>
            {showCreateCountry && (
              <div className="createCountry">
                <input
                  type="text"
                  placeholder="Country Name"
                  value={newCountry.name}
                  onChange={(e) =>
                    setNewCountry({ ...newCountry, name: e.target.value })
                  }
                />
                <button onClick={handleCreateCountry}>Create</button>
              </div>
            )}
            {/* Edit Country Modal */}
            {editingCountry && (
              <div className="edit-user-modal">
                <h3>Edit Country</h3>
                <input
                  type="text"
                  placeholder="Country Name"
                  value={updatedCountry.name}
                  onChange={(e) =>
                    setUpdatedCountry({
                      ...updatedCountry,
                      name: e.target.value,
                    })
                  }
                />
                <button onClick={handleUpdate}>Update</button>
                <button onClick={() => setEditingCountry(null)}>Cancel</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default DshCountries;
