import { useEffect, useState } from "react";
import axios from "axios";

const useProducts = (orders) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [products, setProducts] = useState({});

  const fetchProductDetails = async (orders) => {
    if (!Array.isArray(orders)) {
      console.error("Error: Orders is not an array", orders);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const productData = {};

      for (const order of orders) {
        if (!Array.isArray(order.orderItems)) continue; // ✅ Ensure orderItems exists

        for (const item of order.orderItems) {
          if (!productData[item.productId]) {
            const response = await axios.get(
              `${API_BASE_URL}/products/${item.productId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            productData[item.productId] = response.data;
          }
        }
      }

      setProducts(productData);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails(orders); // Pass orders from props
  }, [orders]); // ✅ Run effect when orders update

  const getProductInfo = (productId) => {
    if (!products || Object.keys(products).length === 0) return {}; // Ensure products exist

    const product = products[productId];
    if (!product)
      return { name: "Unknown", image: "/placeholder.png", price: 0 };

    // Extract image from productImages array (assuming the first one is default)
    const imagePath =
      product.productImages?.length > 0
        ? product.productImages[0].imagePath
        : "/placeholder.png";

    return { ...product, image: imagePath };
  };
  return { products, fetchProductDetails, getProductInfo };
};

export default useProducts;
