import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";

// Create CurrencyContext
const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const savedCurrency = localStorage.getItem("selectedCurrency") || "egp";
  const [selectedCurrency, setSelectedCurrency] = useState(savedCurrency); // Default currency is EGP

  // Detect user's location and set default currency
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await axios.get("https://ipapi.co/json/");
        console.log("Geolocation API Response:", response.data); // Log the response
        const countryCode = response.data.country_code;

        const detectedCurrency = countryCode === "EG" ? "egp" : "usd";
        setSelectedCurrency(detectedCurrency);
        localStorage.setItem("selectedCurrency", detectedCurrency);
      } catch (error) {
        console.error("Error detecting user location:", error.message);
      }
    };
    // Fetch location only if no currency is saved
    if (!localStorage.getItem("selectedCurrency")) {
      fetchUserLocation();
    }
  }, []);

  /*   const changeCurrency = (newCurrency) => {
    setSelectedCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency); // Save to localStorage
  }; */

  return (
    <CurrencyContext.Provider value={{ selectedCurrency /* changeCurrency */ }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use currency context
export const useCurrency = () => useContext(CurrencyContext);
