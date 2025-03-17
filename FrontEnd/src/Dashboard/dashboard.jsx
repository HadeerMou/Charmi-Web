import React, { useState } from "react";
import DashHome from "./dashHome";
import DASHHeader from "./DashboardComponents/dashHeader";
import DashSidebar from "./DashboardComponents/dashSidebar";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import DshUsers from "./DshUsers";
import DshOrders from "./DshOrders";
import { TranslationProvider, useTranslation } from "../TranslationContext";

function Dashboard() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  return (
    <TranslationProvider>
      <div className="grid-container">
        <DASHHeader OpenSidebar={OpenSidebar} />
        <DashSidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        <DashHome />
      </div>
    </TranslationProvider>
  );
}

export default Dashboard;
