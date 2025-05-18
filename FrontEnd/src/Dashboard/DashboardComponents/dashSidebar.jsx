import React from "react";
import logo from "../../logo.png";
import { useTranslation } from "../../TranslationContext";
import { useNavigate } from "react-router-dom";

function DashSidebar({ openSidebarToggle, OpenSidebar }) {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const { translations } = useTranslation();
  const navigate = useNavigate();
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-top justify-content-between">
        <div className="sidebar-brand">
          <img
            onClick={() => navigate("/")}
            className="logo"
            src={logo}
            alt=""
          />
        </div>
        <div className="sidebar-title">
          <h2>
            CHAR<span class="warning">MI</span>
          </h2>
        </div>
        <div className="span">
          <span className="icon close_icon" onClick={OpenSidebar}>
            X
          </span>
        </div>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <a class="option" id="op1" onClick={() => navigate("/dashboard")}>
            <span>
              <i class="fa-solid fa-border-all"></i>
            </span>
            <h3 className="dashboardname">{translations.dashboardname}</h3>
          </a>
        </li>
        <li className="sidebar-list-item">
          <a
            class="option"
            id="op1"
            onClick={() => navigate("/dashboard/users")}
          >
            <span>
              <i class="fa-regular fa-user"></i>
            </span>
            <h3 className="customersname">{translations.customersname}</h3>
          </a>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => navigate("/dashboard/orders")}
        >
          <a class="option" id="op1">
            <span>
              <i class="fa-solid fa-money-check-dollar"></i>
            </span>
            <h3 className="ordersname">{translations.ordersname}</h3>
          </a>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => navigate("/dashboard/countries")}
        >
          <a class="option" id="op1">
            <span>
              <i class="fa-solid fa-globe"></i>
            </span>
            <h3 className="">{translations.countries}</h3>
          </a>
        </li>

        <li
          className="sidebar-list-item"
          onClick={() => navigate("/dashboard/cities")}
        >
          <a class="option" id="op1">
            <span>
              <i class="fa-solid fa-city"></i>
            </span>
            <h3 className="">{translations.cities}</h3>
          </a>
        </li>
        <li className="sidebar-list-item">
          <a
            class="option"
            id="op1"
            onClick={() => navigate("/dashboard/categories")}
          >
            <span>
              <i class="fa-solid fa-store"></i>
            </span>
            <h3 className="productsname">{translations.categories}</h3>
          </a>
        </li>
        <li className="sidebar-list-item">
          <a
            class="option"
            id="op1"
            onClick={() => navigate("/dashboard/products")}
          >
            <span>
              <i class="fa-solid fa-bag-shopping"></i>
            </span>
            <h3 className="productsname">{translations.productsname}</h3>
          </a>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => navigate("/dashboard/discount")}
        >
          <a className="option" id="op1">
            <span>
              <i className="fa-solid fa-percent"></i>
            </span>
            <h3 className="discountname">
              {translations.discount || "Discounts"}
            </h3>
          </a>
        </li>

        <li
          className="sidebar-list-item"
          onClick={() => navigate("/dashboard/shippingfees")}
        >
          <a class="option" id="op1">
            <span>
              <i class="fa-solid fa-dollar-sign"></i>
            </span>
            <h3 className="">{translations.shippingfees}</h3>
          </a>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => navigate("/dashboard/admins")}
        >
          <a class="option" id="op1">
            <span>
              <i class="fa-solid fa-lock"></i>
            </span>
            <h3 className="adminname">{translations.adminname}</h3>
          </a>
        </li>
        <li className="sidebar-list-item">
          <a
            class="option"
            onClick={() => {
              localStorage.removeItem("token"); // Remove the authentication token
              localStorage.removeItem("userType"); // Remove user type
              localStorage.removeItem("userId"); // Remove user ID if stored
              navigate("/admin-login"); // Redirect to sign-in page
            }}
          >
            <span>
              <i class="fa-solid fa-right-from-bracket"></i>
            </span>
            <h3 className="logoutname">{translations.logoutname}</h3>
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default DashSidebar;
