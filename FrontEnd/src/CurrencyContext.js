import React, { createContext, useState, useContext } from "react";

// Define conversion rates (example values)
const conversionRates = {
  egp: 1, // Base currency
  dollar: 1 / 30, // 1 EGP = 0.032 USD (example rate)
};

// Create CurrencyContext
const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const savedCurrency = localStorage.getItem("selectedCurrency") || "egp";

  const [selectedCurrency, setSelectedCurrency] = useState(savedCurrency); // Default currency is EGP

  const changeCurrency = (newCurrency) => {
    setSelectedCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency); // Save to localStorage
  };

  // Function to convert amount based on selected currency
  const convertAmount = (amount) => {
    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      console.error("Invalid amount received:", amount);
      return 0; // Default fallback to prevent NaN
    }

    if (!conversionRates[selectedCurrency]) {
      console.error("Invalid currency selected:", selectedCurrency);
      return numericAmount; // Return original amount if conversion fails
    }

    return numericAmount * conversionRates[selectedCurrency];
  };

  return (
    <CurrencyContext.Provider
      value={{ selectedCurrency, changeCurrency, convertAmount }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use currency context
export const useCurrency = () => useContext(CurrencyContext);
