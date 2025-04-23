import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "../TranslationContext";
import DashSidebar from "./DashboardComponents/dashSidebar";
import DASHHeader from "./DashboardComponents/dashHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Discount() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { translations } = useTranslation();
  const [discounts, setDiscounts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const navigate = useNavigate();
  const editModalRef = useRef(null);
  const [newDiscount, setNewDiscount] = useState({
    percentage: "",
    startDate: "",
    endDate: "",
    isActive: false,
    productIds: [],
  });
  const [updatedDiscount, setUpdatedDiscount] = useState({
    percentage: "",
    startDate: "",
    endDate: "",
    isActive: false,
    productIds: [],
  });

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/discounts`)
      .then((res) => {
        console.log("Fetched discounts:", res.data); // Debug: Log fetched discounts
        setDiscounts(res.data);
      })
      .catch((error) => {
        console.error("Error fetching discounts:", error); // Debug: Log error if fetching fails
      });
    console.log(`${API_BASE_URL}/discounts`);
  }, []);

  const handleCreate = () => {
    console.log("Creating discount with data:", newDiscount);
    axios
      .post(`${API_BASE_URL}/discounts`, newDiscount)
      .then((res) => {
        console.log("Discount created:", res.data);
        setDiscounts((prevDiscounts) => [...prevDiscounts, res.data]);
        setShowCreateForm(false);
        setNewDiscount({
          percentage: "",
          startDate: "",
          endDate: "",
          isActive: false,
          productIds: [],
        });
      })
      .catch((error) => {
        console.error("Error creating discount:", error);
      });
  };
  // Open Edit Modal
  const handleEditClick = (discount) => {
    console.log("Editing discount:", discount);
    setEditingDiscount(discount);
    setUpdatedDiscount({
      percentage: discount.percentage,
      startDate: discount.startDate,
      endDate: discount.endDate,
      isActive: discount.isActive,
      productIds: discount.productIds || [],
    });
    setTimeout(() => {
      editModalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const handleUpdate = () => {
    console.log("Updating discount with data:", updatedDiscount);
    axios
      .patch(`${API_BASE_URL}/discounts/${editingDiscount.id}`, updatedDiscount)
      .then((res) => {
        console.log("Discount updated:", res.data);
        setDiscounts((prevDiscounts) =>
          prevDiscounts.map((d) =>
            d.id === res.data.id ? { ...d, ...res.data } : d
          )
        );
        setEditingDiscount(null);
        setUpdatedDiscount({
          percentage: "",
          startDate: "",
          endDate: "",
          isActive: false,
          productIds: [],
        });
      })
      .catch((error) => {
        console.error("Error updating discount:", error);
      });
  };
  const handleDelete = (id) => {
    console.log("Deleting discount with ID:", id);
    axios
      .delete(`${API_BASE_URL}/discounts/${id}`)
      .then(() => {
        console.log("Discount deleted:", id);
        setDiscounts((prevDiscounts) =>
          prevDiscounts.filter((discount) => discount.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting discount:", error);
      });
  };

  return (
    <>
      <div className="wrap-container">
        <DashSidebar
          OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)}
          openSidebarToggle={openSidebarToggle}
        />
        <div className="middle-container">
          <DASHHeader
            OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)}
          />
          <main className="productSection">
            <div className="head">
              <h1>{translations.discounts}</h1>
            </div>
            <div className="productsTable">
              <table>
                <thead>
                  <tr>
                    <th>{translations.id}</th>
                    <th>{translations.percentage}</th>
                    <th>{translations.startDate}</th>
                    <th>{translations.endDate}</th>
                    <th>{translations.active}</th>
                    <th>{translations.productsId}</th>
                    <th>{translations.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.percentage}%</td>
                      <td>
                        {new Date(d.startDate).toLocaleDateString("en-GB")}
                      </td>
                      <td>{new Date(d.endDate).toLocaleDateString("en-GB")}</td>
                      <td>{d.isActive ? "Yes" : "No"}</td>
                      <td>{d.products?.map((p) => p.id).join(", ")}</td>
                      <td>
                        <button
                          className="edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(d);
                          }}
                        >
                          {translations.edit}
                        </button>
                        <button
                          className="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(d.id);
                          }}
                        >
                          {translations.delete}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="toaddproduct">
              <button
                className="addprod"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? translations.close : translations.addDiscount}
              </button>
            </div>

            {showCreateForm && (
              <div className="create-user-form">
                <h3>{translations.createDiscount}</h3>

                <input
                  type="number"
                  placeholder={`${translations.discount} % `}
                  value={newDiscount.percentage}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      percentage: parseFloat(e.target.value),
                    })
                  }
                />
                <label className="d-flex">
                  {translations.startDate}
                  <input
                    className="d-flex"
                    type="date"
                    value={newDiscount.startDate?.slice(0, 10)}
                    onChange={(e) =>
                      setNewDiscount({
                        ...newDiscount,
                        startDate: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="d-flex">
                  {translations.endDate}
                  <input
                    type="date"
                    className="d-flex"
                    value={newDiscount.endDate?.slice(0, 10)}
                    onChange={(e) =>
                      setNewDiscount({
                        ...newDiscount,
                        endDate: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="d-flex gap-2">
                  {translations.active}
                  <input
                    className="d-flex align-items-center"
                    type="checkbox"
                    checked={newDiscount.isActive}
                    onChange={(e) =>
                      setNewDiscount({
                        ...newDiscount,
                        isActive: e.target.checked,
                      })
                    }
                  />
                </label>
                <input
                  type="text"
                  placeholder={translations.productsIds}
                  value={newDiscount.productIds} // This keeps the display as comma-separated values
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Allow typing of commas and numbers
                    setNewDiscount({
                      ...newDiscount,
                      productIds: inputValue
                        .split(",")
                        .map((id) => id.trim()) // Trim spaces around IDs
                        .filter((id) => id === "" || !isNaN(id)) // Allow empty entries or valid numbers
                        .map((id) => (id === "" ? "" : parseInt(id))), // Parse numbers, but keep empty strings if there was a trailing comma
                    });
                  }}
                />
                <button onClick={handleCreate}>
                  {translations.createDiscount}
                </button>
              </div>
            )}

            {editingDiscount && (
              <div className="edit-user-modal ">
                <h3>{translations.updateDiscount}</h3>
                <input
                  className="d-block"
                  type="number"
                  placeholder={`${translations.discount} % `}
                  value={updatedDiscount.percentage}
                  onChange={(e) =>
                    setUpdatedDiscount({
                      ...updatedDiscount,
                      percentage: parseFloat(e.target.value),
                    })
                  }
                />
                <label className="d-flex">
                  {translations.startDate}
                  <input
                    className="d-flex"
                    type="date"
                    value={updatedDiscount.startDate?.slice(0, 10)}
                    onChange={(e) =>
                      setUpdatedDiscount({
                        ...updatedDiscount,
                        startDate: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="d-flex">
                  {translations.endDate}
                  <input
                    type="date"
                    className="d-flex"
                    value={updatedDiscount.endDate?.slice(0, 10)}
                    onChange={(e) =>
                      setUpdatedDiscount({
                        ...updatedDiscount,
                        endDate: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="d-flex gap-2">
                  {translations.active}
                  <input
                    className="d-flex align-items-center"
                    type="checkbox"
                    checked={updatedDiscount.isActive}
                    onChange={(e) =>
                      setUpdatedDiscount({
                        ...updatedDiscount,
                        isActive: e.target.checked,
                      })
                    }
                  />
                </label>
                <input
                  type="text"
                  placeholder={translations.productsIds}
                  value={updatedDiscount.productIds}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setUpdatedDiscount({
                      ...updatedDiscount,
                      productIds: inputValue
                        .split(",")
                        .map((id) => id.trim()) // Trim spaces around IDs
                        .filter((id) => id === "" || !isNaN(id)) // Allow empty entries or valid numbers
                        .map((id) => (id === "" ? "" : parseInt(id))),
                    });
                  }}
                />
                <button
                  className="addprod"
                  onClick={() => setEditingDiscount(null)}
                >
                  {translations.cancel}
                </button>
                <button className="addprod" onClick={handleUpdate}>
                  {translations.updateDiscount}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default Discount;
