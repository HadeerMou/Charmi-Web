import "../App.css";
import Categories from "../Components/categories";
import Footer from "../Components/footer";
import Header from "../Components/header";
import HomeGrid from "../Components/HomeGrid";
import Products from "../Components/products";

function Home({
  toggleProductsVisibility,
  toggleCartVisibility,
  cart,
  showProducts,
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
      <HomeGrid />
      <Categories addToCart={addToCart} />
      <Footer />
    </>
  );
}

export default Home;
