import React, { createContext, useState, useContext } from "react";

// Create CurrencyContext
const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const savedCurrency = localStorage.getItem("selectedCurrency") || "egp";

  const [selectedCurrency, setSelectedCurrency] = useState(savedCurrency); // Default currency is EGP

  const changeCurrency = (newCurrency) => {
    setSelectedCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency); // Save to localStorage
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use currency context
export const useCurrency = () => useContext(CurrencyContext);
