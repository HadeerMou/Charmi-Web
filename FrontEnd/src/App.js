// import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import ProductList from "./Components/ProductList";
import Cart from "./Components/cart";
import "./App.css";
import { TranslationProvider } from "./TranslationContext";
import About from "./Pages/About";
import {
  Routes,
  Route,
  useNavigation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home";
import Contact from "./Pages/contact";
import Checkout from "./Pages/checkout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductView from "./Pages/productView";
import Dshproducts from "./Dashboard/dshproducts";
import DshUsers from "./Dashboard/DshUsers";
import DshOrders from "./Dashboard/DshOrders";
import "./Dashboard/dash.css";
import Dashboard from "./Dashboard/dashboard";
import NoAccount from "./Pages/noAccount";
import Profile from "./Pages/profile";
import Signin from "./Pages/signin";
import Signup from "./Pages/signup";
import { CurrencyProvider } from "./CurrencyContext";
import OtpPage from "./Pages/OtpPage";
import EmailInput from "./Pages/emailinput";
import ResetPass from "./Pages/ResetPass";
import DshCities from "./Dashboard/DshCities";
import DshCountries from "./Dashboard/DshCountries";
import DshCategories from "./Dashboard/DshCategories";
import axios from "axios";
import AdminPage from "./Dashboard/admins";
import ShippingFees from "./Dashboard/ShippingFees";
import ProductDetails from "./Dashboard/ProductDetails";
import CategoryPage from "./Pages/categoryPage";
import OrderSuccess from "./Pages/OrderSuccess";
import UserAddresses from "./Pages/userAddresses";
import Discount from "./Dashboard/Discount";
import AdminRoute from "./AdminRoute";

function App() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // State for cart items
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const navigate = useNavigate();
  const totalQuantity = cart?.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  // Toggle cart visibility
  const toggleCartVisibility = () => {
    setIsCartVisible((prev) => !prev);
  };

  // Fetch user cart when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      fetchUserCart();
      fetchProducts();
    };

    fetchData();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setIsLoading(false);
    }
  };

  const fetchUserCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.cartItems);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to sign in to add items to your cart.");
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/cart-items`,
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        fetchUserCart(); // Fetch updated cart from backend
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const [showProducts, setShowProducts] = useState(true); // State to control product visibility
  const toggleProductsVisibility = () => {
    setShowProducts((prevState) => !prevState); // Toggle visibility
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setCart([]); // Clear cart state in React
    navigate("/user-login"); // Redirect to login
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserCart();
    } else {
      setCart([]); // Ensure cart is empty if no user is logged in
    }
  }, []);

  return (
    <CurrencyProvider>
      <TranslationProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                showProducts={showProducts}
                toggleCartVisibility={toggleCartVisibility}
                toggleProductsVisibility={toggleProductsVisibility}
                cart={cart}
                products={products}
                addToCart={addToCart}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route
            path="/about"
            element={
              <About
                showProducts={showProducts}
                toggleCartVisibility={toggleCartVisibility}
                toggleProductsVisibility={toggleProductsVisibility}
                cart={cart}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route
            path="/contact"
            element={
              <Contact
                showProducts={showProducts}
                toggleCartVisibility={toggleCartVisibility}
                toggleProductsVisibility={toggleProductsVisibility}
                cart={cart}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/categorypage"
            element={
              <CategoryPage
                showProducts={showProducts}
                products={products}
                cart={cart}
                toggleCartVisibility={toggleCartVisibility}
                toggleProductsVisibility={toggleProductsVisibility}
                addToCart={addToCart}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProductView
                cart={cart}
                toggleCartVisibility={toggleCartVisibility}
                toggleProductsVisibility={toggleProductsVisibility}
                showProducts={showProducts}
                addToCart={addToCart}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                showProducts={showProducts}
                toggleCartVisibility={toggleCartVisibility}
                toggleProductsVisibility={toggleProductsVisibility}
                cart={cart}
                products={products}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route path="/admin-login" element={<Signin userType="ADMIN" />} />

          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/products" element={<Dshproducts />} />
            <Route path="/dashboard/users" element={<DshUsers />} />
            <Route
              path="/dashboard/orders"
              element={<DshOrders cart={cart} />}
            />
            <Route path="/dashboard/discount" element={<Discount />} />
            <Route path="/dashboard/cities" element={<DshCities />} />
            <Route path="/dashboard/countries" element={<DshCountries />} />
            <Route path="/dashboard/categories" element={<DshCategories />} />
            <Route path="/dashboard/admins" element={<AdminPage />} />
            <Route path="/dashboard/shippingfees" element={<ShippingFees />} />
            <Route
              path="/dashboard/products/productdetails/:productId"
              element={<ProductDetails />}
            />
          </Route>

          <Route path="/register" element={<NoAccount />} />
          <Route path="/user-login" element={<Signin userType="USER" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/email-verification" element={<EmailInput />} />
          <Route path="/forgot-password" element={<EmailInput />} />
          <Route path="/reset-password" element={<ResetPass />} />
          <Route
            path="/profile/addresses"
            element={
              <UserAddresses
                showProducts={showProducts}
                toggleCartVisibility={toggleCartVisibility}
                toggleProductsVisibility={toggleProductsVisibility}
                cart={cart}
                products={products}
                totalQuantity={totalQuantity}
              />
            }
          />

          <Route path="/order-success" element={<OrderSuccess />} />
          <Route
            path="/productlist"
            element={
              <ProductList
                products={products}
                cart={cart}
                addToCart={addToCart} // Ensure addToCart is passed correctly
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Conditionally render Cart only when products are loaded */}
        {!isLoading && (
          <Cart
            cart={cart}
            toggleCartVisibility={toggleCartVisibility}
            isCartVisible={isCartVisible}
            products={products}
            fetchUserCart={fetchUserCart}
            totalQuantity={totalQuantity}
          />
        )}
        <productList addToCart={addToCart} fetchUserCart={fetchUserCart} />
      </TranslationProvider>
    </CurrencyProvider>
  );
}
export default App;
