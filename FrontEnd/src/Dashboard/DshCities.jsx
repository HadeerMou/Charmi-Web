import React, { useEffect, useRef, useState } from "react";
import "./dshusers.css";
import DASHHeader from "./DashboardComponents/dashHeader";
import DashSidebar from "./DashboardComponents/dashSidebar";
import { useTranslation } from "../TranslationContext";
import axios from "axios";

function DshCities() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const editModalRef = useRef(null);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [showCreateCity, setShowCreateCity] = useState(false);
  const [city, setCity] = useState([]);
  const [editingCity, setEditingCity] = useState(null);
  const [newCity, setNewCity] = useState({
    countryId: "",
    name: "",
  });

  const [updatedCity, setUpdatedCity] = useState({
    countryId: "",
    name: "",
  });

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const { translations } = useTranslation();
  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch all citys
  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cities`);
      console.log("Fetched Cities:", response.data); // Debugging
      setCity(response.data);
    } catch (error) {
      console.error("Error fetching citys:", error);
    }
  };

  // Fetch city by ID
  const fetchCityById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cities/${id}`);
      console.log(response.data); // Handle the fetched city data
    } catch (error) {
      console.error("Error fetching city by ID:", error);
    }
  };

  // Create a new city
  const handleCreateCity = async () => {
    try {
      const token = localStorage.getItem("token");

      const formattedCity = {
        ...newCity,
        countryId: parseInt(newCity.countryId) || null, // Convert to integer
      };

      const response = await axios.post(
        `${API_BASE_URL}/cities`,
        formattedCity,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Ensure `city` is an array before updating it
      setCity((prevCities) =>
        Array.isArray(prevCities)
          ? [...prevCities, response.data]
          : [response.data]
      );

      setNewCity({ countryId: "", name: "" });
    } catch (error) {
      console.error("Error creating city:", error);
    }
  };

  // Delete city
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`${translations.deleteCity}`);
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token"); // Get token from storage
      await axios.delete(`${API_BASE_URL}/cities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include authentication token
        },
      });

      setCity(city.filter((city) => city.id !== id));
    } catch (error) {
      console.error("Error deleting city:", error);
    }
  };

  // Open edit modal
  const handleEditClick = (city) => {
    setEditingCity(city);
    setUpdatedCity({ name: city.name, countryId: city.countryId });
    setTimeout(() => {
      editModalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  // Update city
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from storage
      const response = await axios.put(
        `${API_BASE_URL}/cities/${editingCity.id}`,
        updatedCity,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include authentication token
            "Content-Type": "application/json",
          },
        }
      );

      setCity(
        city.map((city) => (city.id === editingCity.id ? response.data : city))
      );
      setEditingCity(null);
    } catch (error) {
      console.error("Error updating city:", error);
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
                    <th className="adminid">{translations.cityId}</th>
                    <th className="name">{translations.name}</th>
                    <th>{translations.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(city) && city.length > 0 ? (
                    city.map((cityItem) => (
                      <tr key={cityItem.id}>
                        <td>
                          <i className="fa-regular fa-square"></i>
                        </td>
                        <td>{cityItem.id}</td>
                        <td>{cityItem.name}</td>
                        <td>
                          <button
                            className="edit"
                            onClick={() => handleEditClick(cityItem)}
                          >
                            {translations.edit}
                          </button>
                          <button
                            className="delete"
                            onClick={() => handleDelete(cityItem.id)}
                          >
                            {translations.delete}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No cities found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <a onClick={fetchCities} className="showall">
                {translations.showall}
              </a>
            </div>
            <div className="adminsbuttons">
              <button
                className="createadmin"
                onClick={() => setShowCreateCity(!showCreateCity)}
              >
                {showCreateCity
                  ? `${translations.close}`
                  : `${translations.createCity}`}
              </button>
            </div>
            {showCreateCity && (
              <div className="createcity">
                <input
                  type="text"
                  placeholder="Country Id"
                  value={newCity.countryId}
                  onChange={(e) =>
                    setNewCity({
                      ...newCity,
                      countryId: parseInt(e.target.value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="City Name"
                  value={newCity.name}
                  onChange={(e) =>
                    setNewCity({ ...newCity, name: e.target.value })
                  }
                />
                <button onClick={handleCreateCity}>Create</button>
              </div>
            )}
            {/* Edit City Modal */}
            {editingCity && (
              <div ref={editModalRef} className="edit-user-modal">
                <h3>Edit City</h3>
                <input
                  type="text"
                  placeholder="Country Id"
                  value={updatedCity.countryId}
                  onChange={(e) =>
                    setUpdatedCity({
                      ...updatedCity,
                      countryId: parseInt(e.target.value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="City Name"
                  value={updatedCity.name}
                  onChange={(e) =>
                    setUpdatedCity({ ...updatedCity, name: e.target.value })
                  }
                />
                <button className="addprod" onClick={handleUpdate}>
                  Update
                </button>
                <button
                  className="addprod"
                  onClick={() => setEditingCity(null)}
                >
                  Cancel
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default DshCities;
