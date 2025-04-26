// ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCountdown } from "../Hooks/useCountdown";

function ProductCard({
  product,
  language,
  translations,
  selectedCurrency,
  addToCart,
  hoveredProduct,
  setHoveredProduct,
}) {
  const navigate = useNavigate();
  const discount = product.discount;
  const timeLeft = useCountdown(discount?.endDate);

  const formatPrice = (selectedCurrency, priceEgp, priceUsd) => {
    return selectedCurrency === "egp"
      ? `${translations.egp} ${priceEgp}`
      : `$ ${priceUsd}`;
  };

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
        <h3>{language === "ar" ? product.nameAr : product.nameEn}</h3>
        <p className="text-base">
          {discount ? (
            <>
              <span className="text-muted text-decoration-line-through d-block mr-2">
                {formatPrice(
                  selectedCurrency,
                  product.priceEgp,
                  product.priceUsd
                )}
              </span>
              <span className="text-danger font-weight-bold">
                {formatPrice(
                  selectedCurrency,
                  Math.round(
                    product.priceEgp * (1 - discount.percentage / 100)
                  ),
                  Math.round(product.priceUsd * (1 - discount.percentage / 100))
                )}
              </span>
              <small className="text-danger d-block">
                {translations.discountends} {timeLeft}
              </small>
            </>
          ) : (
            formatPrice(selectedCurrency, product.priceEgp, product.priceUsd)
          )}
        </p>
        <h4 className="text-success">{translations.prodOndm}</h4>
        <div className="bottom">
          <button className="addtocart" onClick={() => addToCart(product)}>
            {translations.addtocart}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
