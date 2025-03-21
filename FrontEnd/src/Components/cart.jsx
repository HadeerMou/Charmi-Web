import { useCurrency } from "../CurrencyContext";
import "./cart.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { calculateTotalPrice } from "../Utils/CartUtils";
import { useTranslation } from "../TranslationContext";

export default function Cart({
  toggleCartVisibility,
  isCartVisible,
  products,
  cart,
  fetchUserCart,
  totalQuantity,
}) {
  const navigate = useNavigate();
  const { selectedCurrency, convertAmount } = useCurrency();
  const { translations } = useTranslation();
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleCheckout = () => {
    const cartWithDetails = cart.map((item) => {
      const productInfo = getProductInfo(item.productId); // Fetch product details
      return {
        ...item,
        name: productInfo.name,
        image: `https://${productInfo.image}`, // Ensure full image URL
        price: productInfo.price,
      };
    });

    navigate("/checkout", { state: { cart: cartWithDetails, totalPrice } });
  };

  // Update item quantity in the cart
  const updateQuantityInCart = async (productId, action) => {
    try {
      const token = localStorage.getItem("token");
      // Find the current item in the cart
      const item = cart.find((cartItem) => cartItem.productId === productId);
      if (!item) {
        console.error("Item not found in cart");
        return;
      }
      // Calculate the new quantity
      let newQuantity =
        action === "plus" ? item.quantity + 1 : item.quantity - 1;
      if (newQuantity < 1) newQuantity = 1; // Prevent negative or zero quantity

      const response = await axios.put(
        `${API_BASE_URL}/cart-items`,
        { product_id: productId, quantity: newQuantity },

        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserCart(); // Refresh cart
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/cart-items/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const getProductInfo = (productId) => {
    if (!products || products.length === 0) return {}; // Ensure products exist

    const product = products.find((product) => product.id === productId);
    if (!product)
      return { name: "Unknown", image: "/placeholder.png", price: 0 };
    // Extract image from productImages array (assuming the first one is default)
    const imagePath =
      product.productImages?.length > 0
        ? product.productImages[0].imagePath
        : "/placeholder.png";

    return { ...product, image: imagePath };
  };
  const totalPrice = parseInt(
    calculateTotalPrice(cart, getProductInfo, convertAmount)
  );

  return (
    <div className={`cart-tab ${isCartVisible ? "show" : ""}`}>
      <div className="cart-header">
        <button onClick={toggleCartVisibility}>X</button>
        <div className="cart-total">
          <span>
            {translations.totalItems}:{totalQuantity}
          </span>
          <span>
            {translations.totalPrice}:{`${totalPrice}`}
          </span>
        </div>
      </div>
      <div className="cart-items">
        {cart && cart.length > 0 ? (
          cart.map((item) => {
            const productInfo = getProductInfo(item.productId); // Get product details
            const convertedPrice = convertAmount(productInfo?.price || 0); // Convert price

            return (
              <div key={item.id} className="cart-item">
                <img
                  src={`https://${productInfo?.image}`}
                  alt={productInfo?.name || "Product"}
                />
                <div className="name">{productInfo?.name}</div>
                <div className="total-price">
                  {selectedCurrency === "egp" ? "£" : "$"}
                  {(convertedPrice * (item.quantity || 0)).toFixed(2)}
                </div>
                <div className="quantity">
                  <button
                    onClick={() =>
                      updateQuantityInCart(item.productId, "minus")
                    }
                  >
                    -
                  </button>
                  <span className="m-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantityInCart(item.productId, "plus")}
                  >
                    +
                  </button>
                </div>
                <button
                  className="delete"
                  onClick={() => removeFromCart(item.productId)}
                >
                  {translations.remove}
                </button>
              </div>
            );
          })
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
      <div className="cart-footer">
        <button onClick={(handleCheckout, toggleCartVisibility)}>
          {translations.checkout}
        </button>
      </div>
    </div>
  );
}
