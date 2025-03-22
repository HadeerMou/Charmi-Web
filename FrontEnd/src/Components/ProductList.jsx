import "./productList.css";
import { useTranslation } from "../TranslationContext";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useCurrency } from "../CurrencyContext";
import axios from "axios";

function ProductList({ addToCart }) {
  const { translations } = useTranslation();
  const navigate = useNavigate();
  const { selectedCurrency, convertAmount } = useCurrency();
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [hoveredProduct, setHoveredProduct] = useState(null); // Track hovered product ID

  // Retrieve category info from state or localStorage
  const categoryId =
    location.state?.categoryId || localStorage.getItem("categoryId") || null;
  const categoryName =
    location.state?.categoryName ||
    localStorage.getItem("categoryName") ||
    "All Products";

  useEffect(() => {
    if (categoryId) {
      localStorage.setItem("categoryId", categoryId);
      localStorage.setItem("categoryName", categoryName);
    } else {
      localStorage.removeItem("categoryId");
      localStorage.removeItem("categoryName");
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`, {});
        if (response.data && response.data.length > 0) {
          const filteredProducts = categoryId
            ? response.data.filter(
                (product) => String(product.categoryId) === String(categoryId)
              )
            : response.data;

          // Fetch product images
          const productsWithImages = await Promise.all(
            filteredProducts.map(async (product) => {
              const imageResponse = await axios.get(
                `${API_BASE_URL}/product-images/product/${product.id}`
              );

              const images =
                imageResponse.data && imageResponse.data.length > 0
                  ? imageResponse.data.map((img) => `https://${img.imagePath}`)
                  : ["/path/to/default/image.jpg"]; // Fallback image if none exists

              return {
                ...product,
                images,
              };
            })
          );

          console.log("Products with Images:", productsWithImages);
          setProduct(productsWithImages);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (isLoading) {
    return <p>Loading products...</p>;
  }
  console.log("addToCart in ProductList:", addToCart);

  return (
    <div className="product-list">
      <div className="sc1">
        <h1 className="DesignTitle">{categoryName}</h1>
      </div>
      <div className="webs">
        {product.map((product) => {
          return (
            <div key={product.id} className="product">
              <div className="img">
                <img
                  src={
                    hoveredProduct === product.id && product.images.length > 1
                      ? product.images[1]
                      : product.images[0]
                  }
                  alt={product.name}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() =>
                    navigate(`/product/${product.id}`, { state: { product } })
                  }
                />
              </div>
              <div className="content">
                <h3>{product.name}</h3>
                <p>
                  {selectedCurrency === "egp" ? `${translations.egp}` : "$"}
                  {product.price && !isNaN(product.price)
                    ? convertAmount(Number(product.price)).toFixed(2)
                    : "N/A"}
                </p>
                <h4 className="text-success">{translations.prodOndm}</h4>
                <div className="bottom">
                  <button
                    className="addtocart"
                    onClick={() => {
                      addToCart(product);
                    }}
                  >
                    {translations.addtocart}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductList;
