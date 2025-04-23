import "./productList.css";
import { useTranslation } from "../TranslationContext";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useCurrency } from "../CurrencyContext";
import axios from "axios";
import { useCountdown } from "../Hooks/useCountdown";
import ProductCard from "./ProductCard";

function ProductList({ addToCart }) {
  const { translations, language } = useTranslation();
  const navigate = useNavigate();
  const { selectedCurrency, convertAmount } = useCurrency();
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [hoveredProduct, setHoveredProduct] = useState(null); // Track hovered product ID
  const [categoryName, setCategoryName] = useState("All Products");
  const discount = product?.discount;
  const timeLeft = useCountdown(discount?.endDate);
  // Retrieve category info from state or localStorage
  const routeCategoryId = location.state?.categoryId;
  const storedCategoryId = localStorage.getItem("categoryId");

  // If location.state is explicitly undefined, don’t override with stored one
  const categoryId =
    routeCategoryId !== undefined ? routeCategoryId : storedCategoryId;

  useEffect(() => {
    if (routeCategoryId !== undefined) {
      // new category came from navigation
      if (routeCategoryId === null) {
        localStorage.removeItem("categoryId");
        setCategoryName(translations.allProducts);
      } else {
        localStorage.setItem("categoryId", routeCategoryId);
        axios
          .get(`${API_BASE_URL}/category/${routeCategoryId}`)
          .then((response) => {
            setCategoryName(
              language === "ar" ? response.data.nameAr : response.data.nameEn
            );
          });
      }
    } else {
      // nothing new passed in, load name from localStorage
      if (categoryId) {
        axios.get(`${API_BASE_URL}/category/${categoryId}`).then((response) => {
          setCategoryName(
            language === "ar" ? response.data.nameAr : response.data.nameEn
          );
        });
      } else {
        setCategoryName(translations.allProducts);
      }
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
  }, [categoryId, language]);

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
        {product.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            language={language}
            translations={translations}
            selectedCurrency={selectedCurrency}
            addToCart={addToCart}
            hoveredProduct={hoveredProduct}
            setHoveredProduct={setHoveredProduct}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
