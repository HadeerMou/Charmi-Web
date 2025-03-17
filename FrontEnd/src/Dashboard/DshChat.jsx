/* import React, { useState } from "react";
import "./dshchat.css";
import DASHHeader from "./DashboardComponents/dashHeader";
import DashSidebar from "./DashboardComponents/dashSidebar";
import { useTranslation } from "../TranslationContext";
import { useNavigate } from "react-router-dom";

function DshChat() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const { translations } = useTranslation();
  return (
    <>
      <div className="wrap-container">
        <DashSidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        <div className="middle-container">
          <DASHHeader OpenSidebar={OpenSidebar} />
          <div class="main">
            <div class="head">
              <img src="/logo.png" alt="" />
              <h3>Username</h3>
            </div>
            <div class="content">
              <div class="img">
                <img src="/logo.png" alt="" />
              </div>
              <div class="messageContent">
                <div class="top">
                  <h3>Username</h3>
                  <p>23 min ago</p>
                </div>
                <div class="message">
                  <p>Hello, I am waiting for my order for a long time?</p>
                </div>
              </div>
            </div>
            <div class="content">
              <div class="img">
                <img src="/logo.png" alt="" />
              </div>
              <div class="messageContent">
                <div class="top">
                  <h3>Username</h3>
                  <p>23 min ago</p>
                </div>
                <div class="message">
                  <p>Hello, I am waiting for my order for a long time?</p>
                </div>
              </div>
            </div>
            <div class="content">
              <div class="img">
                <img src="/logo.png" alt="" />
              </div>
              <div class="messageContent">
                <div class="top">
                  <h3>Username</h3>
                  <p>23 min ago</p>
                </div>
                <div class="message">
                  <p>Hello, I am waiting for my order for a long time?</p>
                </div>
              </div>
            </div>
            <div class="sendCont">
              <textarea name="" id=""></textarea>
              <div class="bottom">
                <button className="send">{translations.send}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DshChat;
 */
