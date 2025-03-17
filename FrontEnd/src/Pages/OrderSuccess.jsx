import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../TranslationContext";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { translations } = useTranslation();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="bg-white p-4 rounded shadow text-center">
        <i className="fa fa-check-circle text-success display-2 fs-2"></i>
        <h2 className="mt-3">{translations.successOrder}</h2>
        <p className="text-muted">{translations.purchase} </p>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/", { state: { cart: [], totalPrice: 0 } })}
        >
          {translations.goHome}
        </button>
      </div>
    </div>
  );
}
