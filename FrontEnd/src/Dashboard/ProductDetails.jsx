import React, { useEffect, useState } from "react";
import "./dshorders.css";
import DASHHeader from "./DashboardComponents/dashHeader";
import DashSidebar from "./DashboardComponents/dashSidebar";
import { useTranslation } from "../TranslationContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCurrency } from "../CurrencyContext";

function ProductDetails() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { translations } = useTranslation();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const { productId } = useParams();
  const { selectedCurrency } = useCurrency();
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    priceEgp: "",
    priceUsd: "",
    quantity: "",
    categoryId: "",
    imageFile: null, // New field for image
    modelFile: null,
  });

  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    description: "",
    priceEgp: "",
    priceUsd: "",
    quantity: "",
    imageFile: null, // New field for image
    modelFile: null,
  });

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  // Fetch all products and attach images
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);

      if (response.data) {
        const imagesResponse = await axios.get(
          `${API_BASE_URL}/product-images/product/${productId}`
        );
        const images = imagesResponse.data || [];

        setProducts([{ ...response.data, images }]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddImage = async (event, productId) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! User is not authenticated.");
        return;
      }

      // Create form data
      const imageFile = event.target.files[0]; // Get the selected file
      if (!imageFile) {
        console.error("No image file selected.");
        return;
      }

      const imageFormData = new FormData();
      imageFormData.append("imageFile", imageFile);
      imageFormData.append("isDefault", false); // Mark it as an additional image
      imageFormData.append("productId", productId);

      // Send image upload request
      await axios.post(`${API_BASE_URL}/product-images`, imageFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh product images
      fetchProductDetails();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! User is not authenticated.");
        return;
      }

      await axios.delete(`${API_BASE_URL}/product-images/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh product images
      fetchProductDetails();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleEditImage = async (event, imageId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! User is not authenticated.");
        return;
      }

      const newImageFile = event.target.files[0]; // Get new image
      if (!newImageFile) {
        console.error("No image file selected.");
        return;
      }

      const imageFormData = new FormData();
      imageFormData.append("imageFile", newImageFile);
      imageFormData.append("isDefault", false); // Keep the same status

      await axios.put(
        `${API_BASE_URL}/product-images/${imageId}`,
        imageFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh product images
      fetchProductDetails();
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  return (
    <>
      <div className="wrap-container">
        <DashSidebar
          OpenSidebar={OpenSidebar}
          openSidebarToggle={openSidebarToggle}
        />
        <div className="middle-container">
          <DASHHeader OpenSidebar={OpenSidebar} />
          <main className="orders">
            <div class="orders">
              <div class="ordersColumns">
                {products.map((products) => (
                  <div class="orderCard" key={products.id}>
                    <div class="info">
                      {products.images && products.images.length > 0 && (
                        <div class="img">
                          <img
                            src={"https://" + products.images[0].imagePath}
                            alt="Product Image"
                          />
                        </div>
                      )}

                      <div class="left">
                        <h3>{products.name}</h3>
                        <p class="order">
                          {translations.order} {products.id}
                        </p>
                      </div>
                      <div class="right">
                        <p>Cat Id</p>
                        <h3 className="new">{products.categoryId}</h3>
                      </div>
                    </div>
                    <div class="details">
                      <div class="left">
                        <h3 className="prodname">{products.description}</h3>
                      </div>
                      <div class="right">
                        <h3>{products.quantity}x</h3>
                      </div>
                    </div>
                    <div className="productimages">
                      {products.images && products.images.length > 0 ? (
                        products.images.map((image, index) => (
                          <div key={index} className="image-container">
                            <img
                              src={"https://" + image.imagePath}
                              alt={`Product ${products.id} Image`}
                              style={{ width: "150px", height: "150px" }}
                            />
                            <div className="image-actions">
                              {/* Delete Button */}
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteImage(image.id)}
                              >
                                <i
                                  class="fa-solid fa-xmark"
                                  style={{
                                    fontSize: "12px",
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    padding: "4px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    width: "20px",
                                    height: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                ></i>
                              </button>

                              {/* Edit Button */}
                              <label className="edit-button">
                                <i
                                  class="fa-solid fa-pen"
                                  style={{
                                    fontSize: "12px",
                                    background: "black",
                                    color: "white",
                                    borderRadius: "50%",
                                    width: "20px",
                                    height: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                  }}
                                ></i>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) =>
                                    handleEditImage(event, image.id)
                                  }
                                  style={{ display: "none" }}
                                />
                              </label>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No images available</p>
                      )}
                    </div>

                    <label className="add-image-button">
                      Add Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleAddImage(event, products.id)}
                        style={{ display: "none" }}
                      />
                    </label>

                    <hr />
                    <div class="total">
                      <h3 class="totalpayment">{translations.totalepayment}</h3>
                      <h3>
                        {selectedCurrency === "ar"
                          ? products.priceEgp
                          : products.priceUsd}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
