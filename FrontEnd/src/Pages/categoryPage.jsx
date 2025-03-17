import React from "react";
import Header from "../Components/header";
import Footer from "../Components/footer";
import Products from "../Components/products";
import ProductList from "../Components/ProductList";
import Categories from "../Components/categories";

function CategoryPage({
  toggleCartVisibility,
  toggleProductsVisibility,
  cart,
  showProducts,
  products,
  addToCart,
  totalQuantity,
}) {
  return (
    <>
      <Header
        toggleProductsVisibility={toggleProductsVisibility}
        toggleCartVisibility={toggleCartVisibility}
        cart={cart}
        totalQuantity={totalQuantity}
      />
      <Products showProducts={showProducts} />

      <ProductList addToCart={addToCart} />
      <Footer />
    </>
  );
}

export default CategoryPage;
