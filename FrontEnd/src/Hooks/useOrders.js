import { useState, useEffect } from "react";
import axios from "axios";
import useProducts from "./useProducts"; // Import useProducts

const useOrders = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [orders, setOrders] = useState([]);
  const { fetchProductDetails } = useProducts(); // Get fetchProductDetails function

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Unauthorized: Please log in again");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/orders/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedOrders = response.data;

      if (!Array.isArray(fetchedOrders)) {
        console.error("Unexpected response format:", fetchedOrders);
        setOrders([]); // Ensure it's always an array
        return;
      }

      setOrders(fetchedOrders);
      console.log("Fetched Orders:", fetchedOrders);

      fetchProductDetails(fetchedOrders); // ✅ Pass orders to fetch product details
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, fetchOrders };
};

export default useOrders;
