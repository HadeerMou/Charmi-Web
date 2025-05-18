import React, { useState } from "react";
import { useEffect } from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from "react-icons/bs";
import { useTranslation } from "../../TranslationContext";
import { useCurrency } from "../../CurrencyContext";

function DASHHeader({ OpenSidebar }) {
  const { translations, changeLanguage } = useTranslation(); // Using translation context
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default language is English
  const { selectedCurrency } = useCurrency(); // Using currency context

  /*   const handleCurrencyChange = (event) => {
    const newCurrency = event.target.value;
    changeCurrency(newCurrency); // Update Currency in context
  }; */

  useEffect(() => {
    setSelectedLanguage(localStorage.getItem("language") || "en");
  }, []);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage); // Update language in context
  };
  // State to track if dark mode is enabled
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On mount, check if dark mode is already saved in localStorage (optional)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-theme-variables");
    }
  }, []);

  // Toggle the theme when the user clicks the button
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.body.classList.remove("dark-theme-variables");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark-theme-variables");
      localStorage.setItem("theme", "dark");
    }
    // Dynamically adjust theme toggler position for RTL/LTR
    if (document.documentElement.dir === "rtl") {
      // RTL-specific styles if needed
      document.querySelector(".theme-toggler").style.insetInlineEnd = "20px";
      document.querySelector(".theme-toggler").style.insetInlineStart = "";
    } else {
      // LTR-specific styles if needed
      document.querySelector(".theme-toggler").style.insetInlineStart = "20px";
      document.querySelector(".theme-toggler").style.insetInlineEnd = "";
    }
  };
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
        <div class="admin">
          <p>
            Hey, <b>Admin</b>
          </p>
        </div>
      </div>
      <div className="header-right">
        {/*  <div className="curr">
          <select
            name="curr"
            id="sel"
            value={selectedCurrency}
            onChange={handleCurrencyChange}
          >
            <option value="egp">{translations.egp}</option>
            <option value="dollar">{translations.dollar}</option>
          </select>
        </div> */}
        <div className="lang">
          <select
            name="language"
            id="sel"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <option value="en">{translations.english}</option>
            <option value="ar">{translations.arabic}</option>
          </select>
        </div>
        {/* <div class="theme-toggler" onClick={toggleTheme}>
          <i class="fa-solid fa-sun active"></i>
          <i class="fa-solid fa-moon"></i>
        </div> */}
      </div>
    </header>
  );
}

export default DASHHeader;
