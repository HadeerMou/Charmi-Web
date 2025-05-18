import "./productList.css";
import { useTranslation } from "../TranslationContext";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useCurrency } from "../CurrencyContext";
import axios from "axios";
import ProductCard from "./ProductCard";

function Categories({ addToCart }) {
  const { translations, language } = useTranslation();
  const navigate = useNavigate();
  const { selectedCurrency, convertAmount } = useCurrency();
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [hoveredProduct, setHoveredProduct] = useState(null); // Track hovered product ID

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const categoryResponse = await axios.get(`${API_BASE_URL}/category`);
        const productResponse = await axios.get(`${API_BASE_URL}/products`);

        if (categoryResponse.data && productResponse.data) {
          setCategories(categoryResponse.data);

          let categoryProducts = {};
          for (const category of categoryResponse.data) {
            // Get first 4 products for each category
            const products = Array.isArray(productResponse.data) // old Railway style
              ? productResponse.data
              : Array.isArray(productResponse.data.data) // new Nest style  ✨
              ? productResponse.data.data
              : Array.isArray(productResponse.data.items) // if you used “items”
              ? productResponse.data.items
              : [];

            const filteredProducts = products
              .filter((p) => p.categoryId === category.id)
              .slice(0, 4);

            // Fetch images for each product
            const productsWithImages = await Promise.all(
              filteredProducts.map(async (product) => {
                const imageResponse = await axios.get(
                  `${API_BASE_URL}/product-images/product/${product.id}`
                );

                const images =
                  imageResponse.data && imageResponse.data.length > 0
                    ? imageResponse.data.map(
                        (img) => `https://${img.imagePath}`
                      )
                    : ["/path/to/default/image.jpg"];

                return { ...product, images };
              })
            );

            categoryProducts[category.id] = productsWithImages;
          }

          setProductsByCategory(categoryProducts);
        }
      } catch (error) {
        console.error("Error loading categories and products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, [language]);

  if (isLoading) {
    return <p>Loading categories and products...</p>;
  }

  return (
    <>
      <div className="home-page">
        {Array.isArray(categories)
          ? categories.map((category) => (
              <div key={category.id} className="category-section">
                <div className="sc1">
                  <h1 className="DesignTitle">
                    {language === "ar" ? category.nameAr : category.nameEn}
                  </h1>
                </div>
                <div className="scroll-container">
                  <div className="webs">
                    {Array.isArray(productsByCategory[category.id]) &&
                      productsByCategory[category.id].map((product) => (
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

                <div className="more">
                  <a
                    onClick={() =>
                      navigate("/categorypage", {
                        state: {
                          categoryId: category.id,
                          categoryName: category.name,
                        },
                      })
                    }
                  >
                    <h3 className="showmore">{translations.showmore}</h3>
                    <i className="bi bi-arrow-right-circle-fill arrow ms-2"></i>
                  </a>
                </div>
              </div>
            ))
          : null}
      </div>
    </>
  );
}

export default Categories;
