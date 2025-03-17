
export const calculateTotalPrice = (cart, getProductInfo, convertAmount) => {
  return cart.reduce((acc, item) => {
    const product = getProductInfo(item.productId);
    return acc + convertAmount(product?.price || 0) * (item.quantity || 0);
  }, 0);
};
