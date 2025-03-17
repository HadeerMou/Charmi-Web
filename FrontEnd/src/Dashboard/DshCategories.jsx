import React, { useEffect, useRef, useState } from "react";
import "./dshmessages.css";
import DASHHeader from "./DashboardComponents/dashHeader";
import DashSidebar from "./DashboardComponents/dashSidebar";
import { useTranslation } from "../TranslationContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DshCategories() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [category, setCategory] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCreateCity, setShowCreateCity] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    imageFile: null,
  });

  const [updatedCategory, setUpdatedCategory] = useState({
    name: "",
  });
  const editModalRef = useRef(null);
  const { translations } = useTranslation();

  useEffect(() => {
    fetchCategorys();
  }, []);

  // Fetch all categorys
  const fetchCategorys = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category`);
      setCategory(response.data);
      console.log("catt", response);
    } catch (error) {
      console.error("Error fetching categorys:", error);
    }
  };

  // Fetch category by ID
  const fetchCategoryById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category/${id}`);
      console.log("Fetched Categories:", response.data); // Debugging

      console.log(response.data); // Handle the fetched category data
    } catch (error) {
      console.error("Error fetching category by ID:", error);
    }
  };

  // Create a new category
  const handleCreateCategory = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token if stored in localStorage
      const formData = new FormData();
      formData.append("name", newCategory.name);
      if (newCategory.imageFile) {
        formData.append("imageFile", newCategory.imageFile);
      }
      const response = await axios.post(`${API_BASE_URL}/category`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include authentication token
        },
      });
      setCategory([...category, response.data]);

      setNewCategory({
        name: "",
        imageFile: null,
      });

      fetchCategorys(); // Fetch all categorys after creating a new category
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`${translations.deleteCat}`);
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token"); // Get token from storage
      await axios.delete(`${API_BASE_URL}/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include authentication token
        },
      });

      setCategory(category.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Open edit modal
  const handleEditClick = (category) => {
    setEditingCategory(category);
    setUpdatedCategory({ name: category.name });
    setTimeout(() => {
      editModalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  // Update category
  const handleUpdate = async () => {
    if (!editingCategory) return;
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_BASE_URL}/category/${editingCategory.id}`,
        { name: updatedCategory.name }, // Send only the name as JSON
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategory(
        category.map((cat) =>
          cat.id === editingCategory.id ? response.data : cat
        )
      );
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error.response?.data || error);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setNewCategory({ ...newCategory, imageFile: file });
  };

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
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
              <h1 className="allmessages">Categories</h1>
            </div>
            {category.map((cat) => (
              <div className="messageContainer" key={cat.id}>
                <div className="name">
                  <h3>{cat.id}</h3>
                  <h3>{cat.name}</h3>
                  {cat.imagePath ? (
                    <img
                      src={"https://" + cat.imagePath}
                      alt={cat.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    <p>No image</p>
                  )}
                </div>
                <div className="no">
                  <p onClick={() => handleEditClick(cat)}>
                    <i className="fa-solid fa-pen"></i> Edit
                  </p>
                  <span onClick={() => handleDelete(cat.id)}>
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </div>
              </div>
            ))}
            <button
              className="addprod"
              onClick={() => setShowCreateCity(!showCreateCity)}
            >
              {showCreateCity ? "Close" : "Create Category"}
            </button>
            {/* Create category Form */}
            {showCreateCity && (
              <div className="create-category-form">
                <h3>Create New category</h3>
                <input
                  type="text"
                  placeholder="Category name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  className="file"
                  type="file"
                  onChange={(e) => handleFileChange(e, "new")}
                />
                <button className="addprod" onClick={handleCreateCategory}>
                  Create Category
                </button>
              </div>
            )}

            {/* Edit category Modal */}
            {editingCategory && (
              <div ref={editModalRef} className="edit-category-modal">
                <h3>Edit category</h3>
                <input
                  type="text"
                  placeholder="Category name"
                  value={updatedCategory.name}
                  onChange={(e) =>
                    setUpdatedCategory({
                      ...updatedCategory,
                      name: e.target.value,
                    })
                  }
                />
                <button className="addprod" onClick={handleUpdate}>
                  Update
                </button>
                <button
                  className="addprod"
                  onClick={() => setEditingCategory(null)}
                >
                  Cancel
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default DshCategories;
