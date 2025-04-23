import React, { useEffect, useState } from "react";
import "./profile.css";
import Header from "../Components/header";
import Products from "../Components/products";
import Footer from "../Components/footer";
import { useTranslation } from "../TranslationContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useOrders from "../Hooks/useOrders";
import useProducts from "../Hooks/useProducts";
import { useCurrency } from "../CurrencyContext";

function Profile({
  toggleCartVisibility,
  toggleProductsVisibility,
  cart,
  showProducts,
  totalQuantity,
}) {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const { translations, language } = useTranslation();
  const [visibleDiv, setVisibleDiv] = useState("first"); // "first" or "second"
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [userAddress, setUserAddress] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // Store selected order
  const [cancelingOrder, setCancelingOrder] = useState(null);
  const { products, fetchProductDetails } = useProducts();
  const { orders, fetchOrders } = useOrders();
  const { selectedCurrency, convertAmount } = useCurrency();
  const [locationNames, setLocationNames] = useState({
    city: "",
    district: "",
    country: "",
  });

  const calculateTotalPrice = (cart, getProductInfo) => {
    return cart.reduce((acc, item) => {
      const product = getProductInfo(item.productId);
      return acc + selectedCurrency === "Egp"
        ? product?.priceEgp * (item.quantity || 0)
        : product?.priceUsd * (item.quantity || 0);
    }, 0);
  };

  useEffect(() => {
    const fetchLocationNames = async () => {
      if (userAddress) {
        try {
          const { cityId, districtId, countryId } = userAddress;

          const requests = [];

          if (cityId) {
            requests.push(
              axios
                .get(`${API_BASE_URL}/cities/${cityId}`)
                .then((res) => ({ city: res.data.name }))
            );
          }
          if (districtId) {
            requests.push(
              axios
                .get(`${API_BASE_URL}/district/${districtId}`)
                .then((res) => ({ district: res.data.districtName }))
            );
          }
          if (countryId) {
            requests.push(
              axios
                .get(`${API_BASE_URL}/country/${countryId}`)
                .then((res) => ({ country: res.data.name }))
            );
          }
          // Wait for all API calls to resolve
          const results = await Promise.all(requests);
          // Merge results into locationNames state
          setLocationNames((prevState) => ({
            ...prevState,
            ...Object.assign({}, ...results),
          }));
        } catch (error) {
          console.error("Error fetching location names:", error);
        }
      }
    };

    fetchLocationNames();
  }, [userAddress]); // Runs when userAddress changes

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const storedAddress = JSON.parse(
          localStorage.getItem(`userAddress_${userData.id}`)
        );
        if (storedAddress) {
          setUserAddress(storedAddress);
          return; // Avoid unnecessary API call
        }

        const response = await axios.get(
          `${API_BASE_URL}/address/user/${userData.id}/default`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.Addresses) {
          setUserAddress(response.data.Addresses); // Store the correct address object
          localStorage.setItem(
            `userAddress_${userData.id}`,
            JSON.stringify(response.data.Addresses)
          );
        } else {
          console.error("No address found in response.");
        }
      } catch (error) {
        console.error("Error fetching default address:", error);
      }
    };

    fetchDefaultAddress();
  }, [userData?.id]);
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;
    try {
      setCancelingOrder(orderId);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedOrder((prevOrder) =>
        prevOrder ? { ...prevOrder, status: "CANCELLED" } : null
      );

      if (response.status === 201) {
        alert("Order has been cancelled successfully.");
        fetchOrders(); // Refresh order list after cancellation
      }
    } catch (error) {
      alert("Failed to cancel the order. Please try again.");
    }
  };

  // Fetch product details when orders are available
  useEffect(() => {
    if (Array.isArray(orders) && orders.length > 0) {
      fetchProductDetails(orders);
    }
  }, [orders]); // Runs whenever `orders` change

  // Retrieve address from local storage on component mount
  useEffect(() => {
    const storedAddress = JSON.parse(
      localStorage.getItem(`userAddress_${userData?.id}`)
    );
    if (storedAddress) {
      setUserAddress(storedAddress);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token for authentication
          },
        });
        if (isMounted) {
          setUserData(response.data.data);
          fetchOrders();
        }
      } catch (err) {
        if (isMounted) setError("Failed to load profile.");
        console.error("Profile Fetch Error:", err);
      }
    };
    fetchProfile();
    fetchProductDetails();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem(`userAddress_${userData?.id}`);
    setUserData(null);
    setUserAddress(null);
    navigate("/user-login");
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
      <div class="mycontent">
        <h1 className="welcome">{translations.welcome}</h1>
      </div>
      <div className="profile">
        <div class="left">
          <div class="lists">
            <div class="username">
              <h2>{userData?.username}</h2>
              <h3>{userData?.email}</h3>
            </div>
            <div class="options">
              <ul>
                <li
                  onClick={() => setVisibleDiv("first")}
                  className="personalinfo"
                >
                  {translations.personalinfo}
                </li>
                {/* <li className="billing">{translations.billing}</li> */}
                <li
                  onClick={() => setVisibleDiv("second")}
                  className="ordersname"
                >
                  {translations.ordersname}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="persinfo"
          style={{ display: visibleDiv === "first" ? "block" : "none" }}
        >
          <div className="infos">
            <h5 className="username">{translations.username}</h5>
            <p className="profdata">
              {userData?.username}
              <i class="fa-solid fa-pen-to-square"></i>
            </p>
          </div>
          <div className="infos">
            <h5 className="email">{translations.email}</h5>
            <p className="profdata">
              {userData?.email}
              <i class="fa-solid fa-pen-to-square"></i>
            </p>
          </div>
          <div className="infos">
            <h5 className="number">{translations.number}</h5>
            <p className="profdata">
              {userData?.phone}
              <i class="fa-solid fa-pen-to-square"></i>
            </p>
          </div>
          <div className="passinfo">
            <h5 className="password">{translations.password}</h5>
            <button
              className="changpass"
              onClick={() => navigate("/forgot-password")}
            >
              {translations.changpass}
            </button>
          </div>
          <div className="infos">
            <h5 className="address">{translations.address}</h5>
            <p className="addp">
              <i class="fa-solid fa-location-dot"></i>
              {userAddress &&
              locationNames.city &&
              locationNames.district &&
              locationNames.country
                ? `${userAddress.streetName}, ${locationNames.district}, ${locationNames.city}, ${locationNames.country}`
                : "No address found"}
            </p>
            <Link
              to="/profile/addresses"
              state={{ userAddress }}
              className="all"
            >
              {translations.alladdresses}
            </Link>
          </div>
        </div>
        <div
          className="ordersinfo"
          style={{ display: visibleDiv === "second" ? "block" : "none" }}
        >
          <div className="head">
            <h1 className="ordersname">{translations.yourOrder}</h1>
          </div>

          {orders.length === 0 ? (
            <p>{translations.noOrd}</p>
          ) : (
            orders.map((order) => {
              const totalOrderPrice = order.orderItems.reduce((sum, item) => {
                return (
                  sum +
                  (selectedCurrency === "egp"
                    ? item.priceEgp * item.quantity
                    : item.priceUsd * item.quantity)
                );
              }, 0);

              return (
                <div
                  key={order.id}
                  className="ordersContainer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="orderno">
                    <h3 className="text-muted">
                      {translations.orderno} #{order.id}
                    </h3>
                  </div>
                  <div className="orderprice">
                    <p className="text-muted">
                      {translations.totalPrice}:{" "}
                      {selectedCurrency === "egp" ? `${translations.egp}` : "$"}{" "}
                      {Math.round(totalOrderPrice)}
                    </p>
                  </div>
                  <div className="no">
                    <p className="text-muted">
                      {translations.timeword}:{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="status">
                    <p>
                      <span
                        className={
                          order.status === "CANCELLED"
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {order.status || ""}
                      </span>
                    </p>
                  </div>
                  <div className="cancel">
                    {order.status !== "CANCELLED" && (
                      <button
                        className="cancel-order-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent selecting the order
                          handleCancelOrder(order.id);
                        }}
                      >
                        {translations.updateStatus}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {selectedOrder && (
            <div className="orderDetails">
              <h2>
                {translations.orderno} #{selectedOrder.id}{" "}
                {translations.orderdetail}
              </h2>
              <p>
                <strong>{translations.totalPrice}:</strong>{" "}
                {selectedCurrency === "egp" ? `${translations.egp}` : "$"}
                {(
                  selectedOrder?.orderItems?.reduce(
                    (sum, item) =>
                      sum +
                      ((selectedCurrency === "egp"
                        ? item.priceEgp
                        : item.priceUsd) || 0) *
                        (item.quantity || 0),
                    0
                  ) || 0
                ).toFixed(2)}
              </p>
              <p>
                <strong>{translations.orderdate}:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              {selectedOrder.orderItems.map((item) => {
                const product = products[item.productId];
                const imageUrl = product?.productImages?.[0]?.imagePath;
                return (
                  <div key={item.id} className="orderItem">
                    {imageUrl ? (
                      <img
                        src={`https://${imageUrl}`}
                        alt={product?.name}
                        className="product-img"
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                    <div>
                      <p>
                        <strong>{translations.product}:</strong>{" "}
                        {language === "ar"
                          ? product?.nameAr
                          : product?.nameEn || "Unknown"}
                      </p>
                      <p>
                        <strong>{translations.quantity}:</strong>{" "}
                        {item.quantity}
                      </p>
                      <p>
                        <strong>{translations.price}:</strong>{" "}
                        {selectedCurrency === "egp"
                          ? `${translations.egp} ${item.priceEgp}`
                          : `$ ${item.priceUsd}`}
                      </p>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => setSelectedOrder(null)}
                className="close-btn"
              >
                {translations.close}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
