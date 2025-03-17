import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Components/header";
import Footer from "../Components/footer";
import { Modal, Button, Form } from "react-bootstrap";
import Products from "../Components/products";
import { useTranslation } from "../TranslationContext";

function UserAddresses({
  toggleCartVisibility,
  toggleProductsVisibility,
  cart,
  totalQuantity,
  showProducts,
}) {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [userAddresses, setUserAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" or "edit"
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [districts, setDistricts] = useState([]);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { translations } = useTranslation();

  useEffect(() => {
    fetchUserAddresses();
    fetchLocations();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cities`);
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchDistricts = async (cityId) => {
    try {
      if (!cityId) return;

      const response = await axios.get(
        `${API_BASE_URL}/district/by-city/${cityId}`
      );
      setDistricts(response.data); // Ensure districts are set correctly
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchUserAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;

      // Fetch cities before fetching addresses
      const cityResponse = await axios.get(`${API_BASE_URL}/cities`);
      const citiesData = cityResponse.data;
      setCities(citiesData); // Ensure cities are set before mapping

      // Fetch cities before fetching addresses
      const countryResponse = await axios.get(`${API_BASE_URL}/country`);
      const countryData = countryResponse.data;
      setCountries(countryData); // Ensure cities are set before mapping

      // Fetch user addresses
      const response = await axios.get(
        `${API_BASE_URL}/address/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const districtMap = {};
      for (const address of response.data) {
        if (
          address.Addresses.cityId &&
          !districtMap[address.Addresses.cityId]
        ) {
          try {
            const districtResponse = await axios.get(
              `${API_BASE_URL}/district/by-city/${address.Addresses.cityId}`
            );
            districtMap[address.Addresses.cityId] = districtResponse.data;
          } catch (error) {
            console.error(
              "Error fetching districts for city:",
              address.Addresses.cityId,
              error
            );
            districtMap[address.Addresses.cityId] = [];
          }
        }
      }

      // Map addresses with city names
      const mappedAddresses = response.data.map((address) => {
        const city = citiesData.find(
          (c) => c.id === Number(address.Addresses.cityId)
        );
        const country = countryData.find(
          (cn) => cn.id === Number(address.Addresses.countryId)
        );
        const districtList = districtMap[address.Addresses.cityId] || [];
        const district = districtList.find(
          (d) => d.district_id === address.Addresses.districtId
        );

        return {
          ...address,
          locationNames: {
            city: city ? city.name : "N/A",
            country: country ? country.name : "N/A",
            district: district ? district.districtName : "N/A",
          },
        };
      });

      setUserAddresses(mappedAddresses);
    } catch (error) {
      console.error("Error fetching user addresses:", error);
    }
  };

  const fetchLocations = async (cityId = null) => {
    try {
      const [cityRes, countryRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/cities`),
        axios.get(`${API_BASE_URL}/country`),
      ]);

      setCities(cityRes.data);
      setCountries(countryRes.data);

      if (cityId) {
        const districtRes = await axios.get(
          `${API_BASE_URL}/district/by-city/${cityId}`
        );
        setDistricts(districtRes.data);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`${translations.deleteAdd}`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleShowModal = (type, address = null) => {
    setModalType(type);
    setSelectedAddress(address);
    setShowModal(true);

    if (address && address.Addresses?.cityId) {
      fetchDistricts(address.Addresses.cityId); // Fetch districts for the city
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const addressData = {
      streetName: formData.get("streetName"),
      isDefault: formData.get("isDefault") === "on",
      apartmentNumber: formData.get("apartmentNumber"),
      buildingNumber: formData.get("buildingNumber"),
      countryId: parseInt(formData.get("countryId"), 10) || null,
      cityId: parseInt(formData.get("cityId"), 10) || null,
      districtId: formData.get("districtId") || null,
    };
    const isDefault = formData.get("isDefault") === "on";

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please log in and try again.");
      return;
    }
    let addressId;

    try {
      if (modalType === "edit" && selectedAddress) {
        await axios.put(
          `${API_BASE_URL}/address/${selectedAddress.addressId}`,
          addressData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(`${API_BASE_URL}/address`, addressData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (isDefault) {
        const userId = localStorage.getItem("userId"); // Assuming you store userId locally
        if (!userId) {
          alert("User ID not found.");
          return;
        }

        // Remove current default address (if any)
        await axios.delete(`${API_BASE_URL}/address/user/${userId}/default`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set the new address as default
        await axios.post(
          `${API_BASE_URL}/address/user/${userId}/default/${addressId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setShowModal(false);
      fetchUserAddresses();
    } catch (error) {
      console.error("Error saving address:", error.response?.data || error);
    }
  };
  return (
    <>
      <Header
        toggleProductsVisibility={toggleProductsVisibility}
        toggleCartVisibility={toggleCartVisibility}
        cart={cart}
        totalQuantity={totalQuantity}
      />
      <Products showProducts={showProducts} />

      <div className="container mt-4">
        <h1 className="mb-4">{translations.alladdresses}</h1>

        <Button className="bg-dark" onClick={() => handleShowModal("add")}>
          {translations.addaddress}
        </Button>

        <div className="row mt-3">
          {userAddresses.length > 0 ? (
            userAddresses.map((item, index) => (
              <div key={index} className="col-md-4">
                <div className="card p-3 mb-3 shadow-sm">
                  <p>
                    <strong>{translations.street}:</strong>{" "}
                    {item.Addresses?.streetName || "N/A"}
                  </p>
                  <div className="d-flex justify-content-between me-4">
                    <p>
                      <strong>{translations.apartmentNo}:</strong>{" "}
                      {item.Addresses?.apartmentNumber || "N/A"}
                    </p>
                    <p>
                      <strong>{translations.buildingNo}:</strong>{" "}
                      {item.Addresses?.buildingNumber || "N/A"}
                    </p>
                  </div>
                  <p>
                    <strong>{translations.district}:</strong>{" "}
                    {item.locationNames.district || "N/A"}
                  </p>
                  <div className="d-flex justify-content-between me-4">
                    <p>
                      <strong>{translations.city}:</strong>{" "}
                      {item.locationNames.city}
                    </p>
                    <p>
                      <strong>{translations.country}:</strong>{" "}
                      {item.locationNames.country || "N/A"}
                    </p>
                  </div>

                  {item.isDefault && <p className="text-success">✅ Default</p>}

                  <div className="d-flex justify-content-between">
                    <Button
                      variant="warning"
                      onClick={() => handleShowModal("edit", item)}
                    >
                      {translations.edit}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item.addressId)}
                    >
                      {translations.delete}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="mt-3">No addresses found.</p>
          )}
        </div>

        <Button variant="secondary" onClick={() => navigate("/profile")}>
          🔙{translations.backtoprof}
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "edit"
              ? `${translations.updateAdd}`
              : `${translations.addaddress}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>{translations.street}</Form.Label>
              <Form.Control
                name="streetName"
                defaultValue={selectedAddress?.Addresses?.streetName || ""}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>{translations.apartmentNo}</Form.Label>
              <Form.Control
                name="apartmentNumber"
                defaultValue={selectedAddress?.Addresses?.apartmentNumber || ""}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>{translations.buildingNo}</Form.Label>
              <Form.Control
                name="buildingNumber"
                defaultValue={selectedAddress?.Addresses?.buildingNumber || ""}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>{translations.country}</Form.Label>
              <Form.Control
                as="select"
                name="countryId"
                defaultValue={selectedAddress?.Addresses?.countryId || ""}
                onChange={(e) => fetchCities(parseInt(e.target.value, 10))}
                required
              >
                <option>{translations.selectCountry}</option>
                {countries.map((cn) => (
                  <option key={cn.id} value={cn.id}>
                    {cn.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>{translations.city}</Form.Label>
              <Form.Control
                as="select"
                name="cityId"
                defaultValue={selectedAddress?.Addresses?.cityId || ""}
                onChange={(e) => fetchDistricts(parseInt(e.target.value, 10))}
                required
              >
                <option>{translations.selectCity}</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>{translations.district}</Form.Label>
              <Form.Control as="select" name="districtId" required>
                <option value="">{translations.selectDistrict}</option>
                {districts.map((d) => (
                  <option key={d.district_id} value={d.district_id}>
                    {d.districtName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label={translations.defaultadd}
                name="isDefault"
                defaultChecked={selectedAddress?.isDefault}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {modalType === "edit"
                ? `${translations.updateAdd}`
                : `${translations.createAdd}`}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
}

export default UserAddresses;
