import { useCurrency } from "../CurrencyContext";
import "./cart.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const { translations, language } = useTranslation();
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const calculateTotalPrice = (cart, getProductInfo, selectedCurrency) => {
    const list = Array.isArray(cart) ? cart : []; // ← guard
    return list.reduce((acc, item) => {
      const product = getProductInfo(item.productId);
      const basePrice =
        selectedCurrency === "egp" ? product.priceEgp : product.priceUsd;

      const discountPercentage = product?.discount?.percentage || 0;
      const discountedPrice = basePrice * (1 - discountPercentage / 100);

      const quantity = item.quantity || 0;
      return acc + discountedPrice * quantity;
    }, 0);
  };

  const handleCheckout = () => {
    const totalPrice = calculateTotalPrice(
      cart,
      getProductInfo,
      selectedCurrency
    );

    const cartWithDetails = cart.map((item) => {
      const productInfo = getProductInfo(item.productId); // Fetch product details
      return {
        ...item,
        productInfo,
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

      await axios.put(
        `${API_BASE_URL}/cart-items`,
        { product_id: productId, quantity: newQuantity },

        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUserCart(); // Refresh cart
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
      return {
        name: "Unknown",
        image: "/placeholder.png",
        priceEgp: 0,
        priceUsd: 0,
      };
    // Extract image from productImages array (assuming the first one is default)
    const imagePath =
      product.productImages?.length > 0
        ? product.productImages[0].imagePath
        : "/placeholder.png";

    return { ...product, image: imagePath };
  };
  const totalPrice = calculateTotalPrice(
    cart,
    getProductInfo,
    selectedCurrency
  );

  return (
    <>
      {isCartVisible && (
        <div className="cart-overlay" onClick={toggleCartVisibility}></div>
      )}
      <div
        className={`cart-tab ${isCartVisible ? "show" : ""} ${
          language === "ar" ? "cart-left" : ""
        }`}
      >
        <div className="cart-header">
          <button onClick={toggleCartVisibility}>X</button>
          <div className="cart-total">
            <span>
              {translations.totalItems}: {totalQuantity}
            </span>
            <span>
              {translations.totalPrice}:{" "}
              {selectedCurrency === "egp" ? `${translations.egp}` : "$"}
              {Math.round(totalPrice)} {/* Display with 2 decimals */}
            </span>
          </div>
        </div>
        <div className="cart-items">
          {Array.isArray(cart) && cart.length > 0 ? (
            cart.map((item) => {
              const productInfo = getProductInfo(item.productId); // Get product details
              const convertedPrice =
                selectedCurrency === "egp"
                  ? productInfo?.priceEgp
                  : productInfo?.priceUsd; // Convert price
              const discountAmount = productInfo.discount
                ? selectedCurrency === "egp"
                  ? productInfo.priceEgp *
                    (productInfo.discount.percentage / 100)
                  : productInfo.priceUsd *
                    (productInfo.discount.percentage / 100)
                : 0;

              const discountedPrice = convertedPrice - discountAmount;

              return (
                <div key={item.id} className="cart-item">
                  <img
                    src={`https://${productInfo?.image}`}
                    alt={productInfo?.name || "Product"}
                  />
                  <div className="name">
                    {language === "ar"
                      ? productInfo?.nameAr
                      : productInfo?.nameEn}
                  </div>
                  <div className="total-price">
                    {selectedCurrency === "egp" ? `${translations.egp}` : "$"}{" "}
                    {productInfo.discount
                      ? Math.round(discountedPrice * (item.quantity || 0)) // Total after discount
                      : Math.round(convertedPrice * (item.quantity || 0))}
                    {/* Total without discount */}
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
                      onClick={() =>
                        updateQuantityInCart(item.productId, "plus")
                      }
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
            <p>{translations.emptycart}</p>
          )}
        </div>
        <div className="cart-footer">
          <button
            onClick={() => {
              handleCheckout();
              toggleCartVisibility();
            }}
          >
            {translations.checkout}
          </button>
        </div>
      </div>
    </>
  );
}
