import React, { useEffect, useRef, useState } from "react";
import "./dshproducts.css";
import DASHHeader from "./DashboardComponents/dashHeader";
import DashSidebar from "./DashboardComponents/dashSidebar";
import { useTranslation } from "../TranslationContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dshproducts() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { translations } = useTranslation();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const navigate = useNavigate();
  const editModalRef = useRef(null);
  const [discounts, setDiscounts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    priceEgp: "",
    priceUsd: "",
    quantity: "",
    categoryId: "",
    discountId: "",
    imageFile: null, // New field for image
  });

  const [updatedProduct, setUpdatedProduct] = useState({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    priceEgp: "",
    priceUsd: "",
    quantity: "",
    discountId: "",
  });

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products and attach images
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);

      if (response.data && Array.isArray(response.data)) {
        const productsWithMedia = response.data.map((product) => {
          // Extract the image from productImages
          const productImages = product.productImages || [];
          const productModel = product.productModel || [];
          const defaultImage = productImages.find((image) => image.isDefault);
          const imageUrl = defaultImage
            ? `https://${defaultImage.imagePath}`
            : "/path/to/default/image.jpg";
          const modelUrl =
            productModel.length > 0 ? productModel.modelPath : null;
          console.log("Product img:", imageUrl);

          return {
            ...product,
            imageUrl: imageUrl,
            modelUrl: modelUrl,
          };
        });

        console.log("Final Products with media:", productsWithMedia);
        setProducts(productsWithMedia); // Assuming you're using state management like setState or context
      } else {
        console.error(
          "No products found or incorrect data format:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Create Product + Image
  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found! User is not authenticated.");
        return;
      }

      // Step 1: Create the Product First (send as JSON, map imageFile to image)
      const productResponse = await axios.post(
        `${API_BASE_URL}/products`,
        {
          nameEn: newProduct.nameEn,
          nameAr: newProduct.nameAr,
          descriptionEn: newProduct.descriptionEn,
          descriptionAr: newProduct.descriptionAr,
          priceEgp: newProduct.priceEgp,
          priceUsd: newProduct.priceUsd,
          quantity: newProduct.quantity,
          categoryId: newProduct.categoryId,
          discountId: newProduct.discountId
            ? parseInt(newProduct.discountId)
            : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const createdProduct = productResponse.data;

      // Step 2: Upload Image if present (send as multipart/form-data)
      if (newProduct.imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("imageFile", newProduct.imageFile); // The image file itself
        imageFormData.append("isDefault", true); // Set the isDefault flag
        imageFormData.append("productId", createdProduct.id); // Pass the product ID

        // Send the image data to the product-images endpoint
        await axios.post(
          `${API_BASE_URL}/product-images`, // Make sure this is the correct endpoint for image upload
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data", // Correct content type for file upload
            },
          }
        );
      }

      if (newProduct.modelFile) {
        const modelFormData = new FormData();
        modelFormData.append("modelFile", newProduct.modelFile);
        modelFormData.append("productId", createdProduct.id);
        console.log(`${API_BASE_URL}/product-model`);

        await axios.post(`${API_BASE_URL}/product-model`, modelFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Refresh Products
      fetchProducts();

      // Reset Form
      setNewProduct({
        nameEn: "",
        nameAr: "",
        descriptionEn: "",
        descriptionAr: "",
        priceEgp: "",
        priceUsd: "",
        quantity: "",
        categoryId: "",
        imageFile: null,
        modelFile: null,
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Delete Product
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(`${translations.deleteProd}`);
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Open Edit Modal
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setUpdatedProduct({
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      descriptionEn: product.descriptionEn,
      descriptionAr: product.descriptionAr,
      priceEgp: product.priceEgp,
      priceUsd: product.priceUsd,
      quantity: product.quantity,
      categoryId: product.categoryId || null,
    });
    setTimeout(() => {
      editModalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };
  // Update Product and Image
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      // Ensure categoryId is a number or null
      const formattedUpdatedProduct = {
        nameEn: updatedProduct.nameEn,
        nameAr: updatedProduct.nameAr,
        descriptionEn: updatedProduct.descriptionEn,
        descriptionAr: updatedProduct.descriptionAr,
        priceEgp: updatedProduct.priceEgp,
        priceUsd: updatedProduct.priceUsd,
        quantity: updatedProduct.quantity,
        categoryId: updatedProduct.categoryId
          ? parseInt(updatedProduct.categoryId)
          : null,
        discountId: updatedProduct.discountId
          ? parseInt(updatedProduct.discountId)
          : null,
      };

      // Step 1: Update Product (map imageFile to image)
      await axios.put(
        `${API_BASE_URL}/products/${editingProduct.id}`,
        formattedUpdatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Fetch all discounts
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/discounts`);
        setDiscounts(response.data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    fetchDiscounts();
  }, []);

  return (
    <>
      <div className="wrap-container">
        <DashSidebar
          OpenSidebar={OpenSidebar}
          openSidebarToggle={openSidebarToggle}
        />
        <div className="middle-container">
          <DASHHeader OpenSidebar={OpenSidebar} />
          <main className="productSection">
            <div class="head">
              <h1 className="products">{translations.products}</h1>
            </div>
            <div class="productsTable">
              <table>
                <thead>
                  <tr>
                    <th className="select">{translations.select}</th>
                    <th className="P.Id">{translations.pn}</th>
                    <th className="">{translations.productImage}</th>
                    <th className="prodname">{translations.prodname}</th>
                    <th className="prodname">{translations.prodname}</th>
                    <th className="desc">{translations.description}</th>
                    <th className="desc">{translations.description}</th>
                    <th className="price">{translations.priceEgp}</th>
                    <th className="price">{translations.priceUsd}</th>
                    <th className="">{translations.quantity}</th>
                    <th className="categoryid">{translations.categoryId}</th>
                    <th>{translations.discount}</th>
                    <th>{translations.productmodel}</th>
                    <th>{translations.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((products) => (
                    <tr
                      key={products.id}
                      onClick={() =>
                        navigate(
                          `/dashboard/products/productdetails/${products.id}`
                        )
                      }
                    >
                      <td>
                        <i class="fa-regular fa-square"></i>
                      </td>
                      <td>{products.id}</td>
                      <td>
                        <img
                          src={products.imageUrl}
                          style={{ width: "50px", height: "50px" }}
                          alt={products.name}
                        />
                      </td>
                      <td>{products.nameEn}</td>
                      <td>{products.nameAr}</td>
                      <td>{products.descriptionEn.slice(0, 50)}</td>
                      <td>{products.descriptionAr.slice(0, 50)}</td>
                      <td>{products.priceEgp}</td>
                      <td>{products.priceUsd}</td>
                      <td>{products.quantity}</td>
                      <td>{products.categoryId}</td>
                      <td>
                        {products.discountId
                          ? discounts.find(
                              (discount) => discount.id === products.discountId
                            )?.percentage + "%"
                          : "No Discount"}
                      </td>

                      <td>
                        {products.modelUrl ? (
                          <model-viewer
                            src={products.modelUrl}
                            alt="3D Model"
                            auto-rotate
                            camera-controls
                            style={{ width: "100px", height: "100px" }}
                          />
                        ) : (
                          "No 3D Model"
                        )}
                      </td>
                      <td>
                        <button
                          className="edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(products);
                          }}
                        >
                          {translations.edit}
                        </button>
                        <button
                          className="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(products.id);
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
                onClick={() => setShowCreateProduct(!showCreateProduct)}
              >
                {showCreateProduct
                  ? `${translations.close}`
                  : `${translations.addprod}`}
              </button>
            </div>

            {/* Create Product Form */}
            {showCreateProduct && (
              <div className="create-user-form">
                <h3>{translations.creatNewProd}</h3>
                <input
                  type="file"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      imageFile: e.target.files[0],
                    })
                  }
                />
                <input
                  type="file"
                  accept=".glb,.gltf"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      modelFile: e.target.files[0],
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Name in English"
                  value={newProduct.nameEn}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, nameEn: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Name in Arabic"
                  value={newProduct.nameAr}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, nameAr: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Description in English"
                  value={newProduct.descriptionEn}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      descriptionEn: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Description in Arabic"
                  value={newProduct.descriptionAr}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      descriptionAr: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder={translations.priceEgp}
                  value={newProduct.priceEgp}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, priceEgp: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder={translations.priceUsd}
                  value={newProduct.priceUsd}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, priceUsd: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Category ID"
                  value={newProduct.categoryId}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                />
                <select
                  value={newProduct.discountId}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, discountId: e.target.value })
                  }
                >
                  <option value="">Select Discount</option>
                  {discounts.map((discount) => (
                    <option key={discount.id} value={discount.id}>
                      {discount.percentage}% - {discount.name}
                    </option>
                  ))}
                </select>

                <button onClick={handleCreateProduct}>
                  {translations.creatProd}
                </button>
              </div>
            )}
            {/* Edit User Modal */}
            {editingProduct && (
              <div ref={editModalRef} className="edit-user-modal">
                <h3>{translations.editProd}</h3>
                <input
                  type="file"
                  placeholder="product Image"
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      imageFile: e.target.files[0],
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Name in English"
                  value={updatedProduct.nameEn}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      nameEn: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Name in Arabic"
                  value={updatedProduct.nameAr}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      nameAr: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Description in English"
                  value={updatedProduct.descriptionEn}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      descriptionEn: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Description in Arabic"
                  value={updatedProduct.descriptionAr}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      descriptionAr: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder={translations.priceEgp}
                  value={updatedProduct.priceEgp}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      priceEgp: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder={translations.priceUsd}
                  value={updatedProduct.priceUsd}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      priceUsd: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Quantity"
                  value={updatedProduct.quantity}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Category Id"
                  value={updatedProduct.categoryId}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                />
                <select
                  value={updatedProduct.discountId}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      discountId: e.target.value,
                    })
                  }
                >
                  <option value="">Select Discount</option>
                  {discounts.map((discount) => (
                    <option key={discount.id} value={discount.id}>
                      {discount.percentage}% - {discount.name}
                    </option>
                  ))}
                </select>

                <button className="addprod" onClick={handleUpdate}>
                  {translations.update}
                </button>
                <button
                  className="addprod"
                  onClick={() => setEditingProduct(null)}
                >
                  {translations.cancel}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default Dshproducts;
