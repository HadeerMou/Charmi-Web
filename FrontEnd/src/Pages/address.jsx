import React, { useState, useEffect } from "react";
import axios from "axios";
import "./checkout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "../TranslationContext";
import logo from "../logo.png";

export default function Address({ addressId }) {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default language is English
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    streetName: "",
    cityId: "",
    countryId: "",
    districtId: "",
    apartmentNumber: "",
    buildingNumber: "",
    isDefault: false,
  });
  const navigate = useNavigate();
  const { translations, changeLanguage } = useTranslation();
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchCities();
    fetchCountries();

    if (addressId) {
      setIsEditing(true);
      fetchAddresses(addressId);
    }
  }, [addressId]);

  // Fetch districts when city changes
  useEffect(() => {
    if (newAddress.cityId) {
      fetchDistricts(newAddress.cityId);
    }
  }, [newAddress.cityId]);

  useEffect(() => {
    if (isEditing && newAddress.cityId) {
      fetchDistricts(newAddress.cityId);
    }
  }, [isEditing, newAddress.cityId]);

  const fetchAddresses = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const userId = parseInt(localStorage.getItem("userId")); // Ensure user ID is stored
      console.log("User ID Type:", typeof userId, "Value:", userId);

      const response = await axios.get(
        `${API_BASE_URL}/address/user/${userId}/default`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetched Address:", response.data);
      setNewAddress(response.data);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const addAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // Get userId from storage

      if (!token || !userId) {
        alert(translations.unauthorized);
        return;
      }

      const numericUserId = parseInt(userId, 10); // Ensure userId is a number

      if (isNaN(numericUserId)) {
        alert("Invalid user ID. Please log in again.");
        return;
      }

      // Create the address
      const response = await axios.post(`${API_BASE_URL}/address`, newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdAddress = response.data;
      setAddresses([...addresses, createdAddress]);

      // Fetch user addresses to check if it's the first one
      const userAddressesResponse = await axios.get(
        `${API_BASE_URL}/address/user/${numericUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (userAddressesResponse.data.length === 1) {
        // If this is the first address, set it as default
        await axios.post(
          `${API_BASE_URL}/address/user/${numericUserId}/default/${createdAddress.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setNewAddress((prev) => ({ ...prev, isDefault: true }));
      }

      console.log("Address created successfully!");
      localStorage.setItem("userAddress", JSON.stringify(createdAddress));
      navigate("/profile");
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const updateAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert(translations.unauthorized);
        return;
      }

      await axios.put(`${API_BASE_URL}/address/${addressId}`, newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Address updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        alert(translations.unauthorized);
        return;
      }

      await axios.post(
        `${API_BASE_URL}/address/user/${userId}/default/${addressId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Default address set successfully!");
      fetchAddresses(userId);
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert(translations.unauthorized);
        return;
      }

      await axios.delete(`${API_BASE_URL}/address/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted address from state
      setAddresses(addresses.filter((address) => address.id !== addressId));
      console.log("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cities`);
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/country`);
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchDistricts = async (cityId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/district/by-city/${cityId}`
      );
      setDistricts(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue =
      type === "checkbox"
        ? checked
        : ["cityId", "countryId"].includes(name)
        ? Number(value) || ""
        : value;
    const updatedAddress = {
      ...newAddress,
      [name]: updatedValue,
    };

    setNewAddress(updatedAddress);

    if (name === "isDefault" && checked) {
      await setDefaultAddress(newAddress.id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      await updateAddress();
    } else {
      await addAddress();
    }
  };

  useEffect(() => {
    setSelectedLanguage(localStorage.getItem("language") || "en");
  }, []);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  return (
    <>
      <div className="nav d-flex align-items-center gap-4 p-2">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo img-fluid" />
          </Link>
        </div>
        <div className="lang">
          <select
            name="language"
            id="langsel"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <option value="en">{translations.english}</option>
            <option value="ar">{translations.arabic}</option>
          </select>
        </div>
      </div>
      <div className="checkout-container">
        <h2 className="title">{translations.address}</h2>
        <div className="checkrow">
          <div className="col-75">
            <div className="checkcontainer">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-50">
                    <label>{translations.street}</label>
                    <input
                      type="text"
                      name="streetName"
                      value={newAddress.streetName}
                      onChange={handleChange}
                      placeholder="542 W. 15th Street"
                      required
                    />
                    <div className="row">
                      <div className="col-25">
                        <label>{translations.city}</label>
                        <select
                          className="m-3 p-1"
                          name="cityId"
                          value={newAddress.cityId}
                          onChange={handleChange}
                          required
                        >
                          <option value="">{translations.selectCity}</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-25">
                        <label>{translations.country}</label>
                        <select
                          className="m-3 p-1"
                          name="countryId"
                          value={newAddress.countryId}
                          onChange={handleChange}
                          required
                        >
                          <option value="">{translations.selectCountry}</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-25">
                        <label>{translations.district}</label>
                        <select
                          className="m-3 p-1"
                          name="districtId"
                          value={newAddress.districtId}
                          onChange={handleChange}
                          required
                        >
                          <option value="">
                            {translations.selectDistrict}
                          </option>
                          {districts.map((district) => (
                            <option
                              key={district.district_id}
                              value={district.district_id}
                            >
                              {district.districtName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="row">
                        <div className="col-50">
                          <label>{translations.apartmentNo}</label>
                          <input
                            type="text"
                            name="apartmentNumber"
                            value={newAddress.apartmentNumber}
                            onChange={handleChange}
                            placeholder="5"
                            required
                          />
                        </div>
                        <div className="col-50">
                          <label>{translations.buildingNo}</label>
                          <input
                            type="text"
                            name="buildingNumber"
                            value={newAddress.buildingNumber}
                            onChange={handleChange}
                            placeholder="20"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="addressB" type="submit">
                    {isEditing ? "Update Address" : `${translations.createAdd}`}
                  </button>
                </div>
                <label>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={newAddress.isDefault}
                    onChange={handleChange}
                  />{" "}
                  {translations.defaultadd}
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
