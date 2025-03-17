import React, { useEffect, useState } from "react";
import "./dshusers.css";
import DASHHeader from "./DashboardComponents/dashHeader";
import DashSidebar from "./DashboardComponents/dashSidebar";
import { useTranslation } from "../TranslationContext";
import axios from "axios";

function ShippingFees() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [updatedFees, setUpdatedFees] = useState({});
  const [newFee, setNewFee] = useState({ cityId: "", fee: "" });
  const [city, setCity] = useState([]);
  const [showCreateFee, setShowCreateFee] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [updatedCity, setUpdatedCity] = useState({ countryId: "", name: "" });

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const { translations } = useTranslation();
  useEffect(() => {
    fetchCities();
  }, []);

  const handleFeeChange = (cityId, newFee) => {
    setUpdatedFees((prev) => ({
      ...prev,
      [cityId]: newFee === "" ? 0 : newFee, // Store changes per city
    }));
  };

  const handleUpdateFee = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const fee = parseFloat(updatedFees[id] || 0);

      await axios.put(
        `${API_BASE_URL}/shipping-fees/${id}`,
        { cityId: id, fee },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCity((prevCities) =>
        prevCities.map((city) =>
          city.id === id ? { ...city, shippingFee: fee } : city
        )
      );
    } catch (error) {
      console.error("Error updating shipping fee:", error);
    }
  };
  const handleCreateFee = async () => {
    try {
      const token = localStorage.getItem("token");

      // Ensure `cityId` and `fee` are numbers
      const cityId = parseInt(newFee.cityId);
      const fee = parseInt(newFee.fee);

      if (isNaN(cityId) || isNaN(fee)) {
        alert("Please enter valid numbers for city ID and fee.");
        return;
      }
      const shippingResponse = await axios.get(`${API_BASE_URL}/shipping-fees`);
      const shippingFees = shippingResponse.data.data;
      console.log("Shipping Fees API Response:", shippingResponse.data);
      // Ensure response data is an array
      if (!Array.isArray(shippingFees)) {
        console.error(
          "Error: shippingResponse.data.data is not an array",
          shippingFees
        );
        return;
      }
      const existingFee = shippingFees.find(
        (fee) => fee.cityId === parseInt(newFee.cityId)
      );

      if (existingFee) {
        alert(
          "This city already has a shipping fee. Please update it instead."
        );
        return;
      }

      await axios.post(
        `${API_BASE_URL}/shipping-fees`,
        { cityId: parseInt(newFee.cityId), fee: parseInt(newFee.fee) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCities(); // Refresh data after adding
      setNewFee({ cityId: "", fee: "" });
    } catch (error) {
      console.error("Error creating shipping fee:", error);
    }
  };

  const handleDeleteFee = async (id) => {
    const confirmDelete = window.confirm(`${translations.deleteFee}`);
    if (!confirmDelete) return;
    try {
      console.log("Attempting to delete shipping fee with ID:", id);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/shipping-fees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCity((prevCities) =>
        prevCities.map((city) =>
          city.id === id ? { ...city, shippingFee: 0 } : city
        )
      );
    } catch (error) {
      console.error("Error deleting shipping fee:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const citiesResponse = await axios.get(`${API_BASE_URL}/cities`);
      const shippingResponse = await axios.get(`${API_BASE_URL}/shipping-fees`);

      console.log("Cities API response:", citiesResponse.data);
      console.log("Shipping Fees API response:", shippingResponse.data);

      const shippingFees = shippingResponse.data.data;

      if (!Array.isArray(shippingFees)) {
        console.error(
          "Error: shippingResponse.data is not an array",
          shippingFees
        );
        return;
      }

      // Merge cities with their shipping fees
      const citiesWithFees = citiesResponse.data.map((city) => {
        const feeData = shippingFees.find((fee) => fee.cityId === city.id);
        return { ...city, shippingFee: feeData ? feeData.fee : 0 }; // Default to 0 if no fee
      });

      setCity(citiesWithFees);
    } catch (error) {
      console.error("Error fetching cities or shipping fees:", error);
    }
  };

  const handleEditClick = (cityItem) => {
    setEditingCity(cityItem);
    setUpdatedCity({ countryId: cityItem.countryId, name: cityItem.name });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/cities/${editingCity.id}`,
        { countryId: updatedCity.countryId, name: updatedCity.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCities(); // Refresh the list
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
              <h2 className="">Shipping Fees</h2>
              <table>
                <thead>
                  <tr>
                    <th className="select">{translations.select}</th>
                    <th className="adminid">City Id</th>
                    <th className="name">Name</th>
                    <th>Shipping-fees</th>
                    <th>Actions</th>
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
                          <input
                            type="number"
                            value={
                              updatedFees[cityItem.id] !== undefined
                                ? updatedFees[cityItem.id]
                                : cityItem.shippingFee || 0
                            }
                            onChange={(e) =>
                              handleFeeChange(cityItem.id, e.target.value)
                            }
                            onBlur={(e) =>
                              handleFeeChange(
                                cityItem.id,
                                Number(e.target.value)
                              )
                            }
                          />
                          <button onClick={() => handleUpdateFee(cityItem.id)}>
                            Update
                          </button>
                        </td>

                        <td>
                          <button
                            className="edit"
                            onClick={() => handleEditClick(cityItem)}
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDeleteFee(cityItem.id)}>
                            Delete Fee
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No Shipping fees found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="toaddproduct">
              <button
                className="addprod"
                onClick={() => setShowCreateFee(!showCreateFee)}
              >
                {showCreateFee ? "Close" : "Create Shipping fee"}
              </button>
            </div>
            {showCreateFee && (
              <div className="createFee mb-5">
                <input
                  type="number"
                  placeholder="City ID"
                  value={newFee.cityId}
                  onChange={(e) =>
                    setNewFee({ ...newFee, cityId: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Shipping Fee"
                  value={newFee.fee}
                  onChange={(e) =>
                    setNewFee({ ...newFee, fee: e.target.value })
                  }
                />
                <button className="addprod" onClick={handleCreateFee}>
                  Add Fee
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default ShippingFees;
