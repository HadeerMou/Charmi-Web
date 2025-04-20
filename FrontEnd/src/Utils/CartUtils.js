/* 
export const calculateTotalPrice = (cart, getProductInfo) => {
  return cart.reduce((acc, item) => {
    const product = getProductInfo(item.productId);
    return acc + selectedCurrency === "Egp"
      ? product?.priceEgp * (item.quantity || 0)
      : product?.priceUsd * (item.quantity || 0);
  }, 0);
};
 */