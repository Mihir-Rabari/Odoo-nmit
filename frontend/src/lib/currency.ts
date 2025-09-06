// Currency utility functions for Indian Rupees
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPrice = (price: number): string => {
  return formatCurrency(price);
};

// Convert USD to INR (approximate rate for development)
export const convertUsdToInr = (usdAmount: number): number => {
  const exchangeRate = 83; // Approximate USD to INR rate
  return Math.round(usdAmount * exchangeRate);
};
