const TAX_RATE = 0.13;

function cartTotal(items) {
  // [BUG – ESLint no-unused-vars] Leftover from an old promo; never read.
  const legacyDiscountRate = 0.15;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return Math.round(subtotal * (1 + TAX_RATE) * 100) / 100;
}

module.exports = { cartTotal };
