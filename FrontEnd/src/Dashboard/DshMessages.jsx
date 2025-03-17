/* import React, { useState } from "react";
import "./dshmessages.css";
import DASHHeader from "./DashboardComponents/dashHeader";
import DashSidebar from "./DashboardComponents/dashSidebar";
import { useTranslation } from "../TranslationContext";
import { useNavigate } from "react-router-dom";

function DshMessages() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const { translations } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <div className="wrap-container">
        <DashSidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        <div className="middle-container">
          <DASHHeader OpenSidebar={OpenSidebar} />
          <main>
            <div class="head">
              <h1 className="allmessages">{translations.allmessages}</h1>
            </div>
            <a onClick={() => navigate("/dashboard/messages/chat")}>
              <div class="messageContainer">
                <div class="img">
                  <img src="/assets/bedside.png" alt="" />
                </div>
                <div class="name">
                  <h3>Ahmed Mohamed</h3>
                </div>
                <div class="message">
                  <p>Hello, I am waiting for my order for a long time?</p>
                </div>
                <div class="no">
                  <p>11:40PM</p>
                  <span>2</span>
                </div>
              </div>
            </a>
            <a onClick={() => navigate("/dashboard/messages/chat")}>
              <div class="messageContainer">
                <div class="img">
                  <img src="/assets/bedside.png" alt="" />
                </div>
                <div class="name">
                  <h3>Ahmed Mohamed</h3>
                </div>
                <div class="message">
                  <p>Hello, I am waiting for my order for a long time?</p>
                </div>
                <div class="no">
                  <p>11:40PM</p>
                  <span>2</span>
                </div>
              </div>
            </a>
            <a onClick={() => navigate("/dashboard/messages/chat")}>
              <div class="messageContainer">
                <div class="img">
                  <img src="/assets/bedside.png" alt="" />
                </div>
                <div class="name">
                  <h3>Ahmed Mohamed</h3>
                </div>
                <div class="message">
                  <p>Hello, I am waiting for my order for a long time?</p>
                </div>
                <div class="no">
                  <p>11:40PM</p>
                  <span>2</span>
                </div>
              </div>
            </a>
            <a onClick={() => navigate("/dashboard/messages/chat")}>
              <div class="messageContainer">
                <div class="img">
                  <img src="/assets/bedside.png" alt="" />
                </div>
                <div class="name">
                  <h3>Ahmed Mohamed</h3>
                </div>
                <div class="message">
                  <p>Hello, I am waiting for my order for a long time?</p>
                </div>
                <div class="no">
                  <p>11:40PM</p>
                  <span>2</span>
                </div>
              </div>
            </a>
          </main>
        </div>
      </div>
    </>
  );
}

export default DshMessages;
 */
