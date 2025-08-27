// Utility functions for Indian currency formatting

/**
 * Format number to Indian currency (Rupees) with proper locale formatting
 * @param amount - Amount in rupees (number)
 * @param showSymbol - Whether to show ₹ symbol (default: true)
 * @returns Formatted string (e.g., "₹12,34,567" or "12,34,567")
 */
export function formatINR(amount: number, showSymbol: boolean = true): string {
  if (amount === 0) return showSymbol ? '₹0' : '0'
  
  // Use Indian number formatting (lakhs and crores system)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  
  return formatter.format(amount)
}

/**
 * Format range of Indian currency
 * @param min - Minimum amount
 * @param max - Maximum amount (optional)
 * @returns Formatted range string (e.g., "₹5,00,000 - ₹10,00,000" or "₹5,00,000+")
 */
export function formatINRRange(min: number, max?: number): string {
  if (max) {
    return `${formatINR(min)} - ${formatINR(max)}`
  }
  return `${formatINR(min)}+`
}

/**
 * Convert USD to INR (approximate conversion rate)
 * @param usdAmount - Amount in USD
 * @returns Amount in INR
 */
export function usdToINR(usdAmount: number): number {
  const exchangeRate = 83 // Approximate USD to INR rate
  return Math.round(usdAmount * exchangeRate)
}

/**
 * Format compact Indian currency (for large amounts)
 * @param amount - Amount in rupees
 * @returns Compact formatted string (e.g., "₹12.5L", "₹1.2Cr")
 */
export function formatCompactINR(amount: number): string {
  if (amount >= 10000000) { // 1 Crore or more
    const crores = amount / 10000000
    return `₹${crores.toFixed(1)}Cr`
  } else if (amount >= 100000) { // 1 Lakh or more
    const lakhs = amount / 100000
    return `₹${lakhs.toFixed(1)}L`
  } else if (amount >= 1000) { // 1 Thousand or more
    const thousands = amount / 1000
    return `₹${thousands.toFixed(0)}K`
  } else {
    return formatINR(amount)
  }
}

// Common pricing constants for Indian market
export const PRICING_CONSTANTS = {
  // Room base prices in INR
  ROOM_PRICES: {
    LIVING_ROOM: 1200000,    // ₹12,00,000
    BEDROOM: 1000000,        // ₹10,00,000
    KITCHEN: 2000000,        // ₹20,00,000
    BATHROOM: 1500000,       // ₹15,00,000
    DINING: 800000,          // ₹8,00,000
    OFFICE: 600000,          // ₹6,00,000
    WHOLE_HOME: 6500000,     // ₹65,00,000
  },
  
  // Furniture prices in INR
  FURNITURE_PRICES: {
    CUSTOM_SOFAS: 650000,         // ₹6,50,000
    DINING_SET: 500000,           // ₹5,00,000
    BEDROOM_SUITE: 1000000,       // ₹10,00,000
    CUSTOM_STORAGE: 580000,       // ₹5,80,000
    LIGHTING: 320000,             // ₹3,20,000
    WINDOW_TREATMENTS: 250000,    // ₹2,50,000
    ARTWORK: 400000,              // ₹4,00,000
    ACCESSORIES: 200000,          // ₹2,00,000
  },
  
  // Budget ranges in INR
  BUDGET_RANGES: {
    STANDARD: { min: 500000, max: 1500000 },      // ₹5L - ₹15L
    LUXURY: { min: 1500000, max: 4000000 },       // ₹15L - ₹40L  
    ULTRA: { min: 4000000, max: 8000000 },        // ₹40L - ₹80L
    BESPOKE: { min: 8000000 },                    // ₹80L+
  }
}
