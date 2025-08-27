// Types and interfaces for the quotation system

export interface QuotationFormData {
  roomType: string
  roomSize: string
  style: string
  budget: string
  materials: string
  furniture: string[]
  timeline: string
  special: string
}

export interface QuotationCalculation {
  basePrice: number
  sizeMultiplier: number
  styleMultiplier: number
  budgetMultiplier: number
  materialMultiplier: number
  subtotal: number
  selectedFurniture: Array<{ id: string, name: string, price: number }>
  furnitureCost: number
  totalPrice: number
}

export interface SavedQuotation {
  id: string
  name: string
  timestamp: Date
  formData: QuotationFormData
  calculation: QuotationCalculation
  clientInfo?: {
    name: string
    email: string
    phone: string
    address: string
  }
  status: 'draft' | 'sent' | 'approved' | 'archived'
  notes?: string
}

export interface QuotationComparison {
  quotations: SavedQuotation[]
  insights: {
    lowestPrice: SavedQuotation
    highestPrice: SavedQuotation
    averagePrice: number
    recommendedOption: SavedQuotation
    priceDifference: number
  }
}

export interface EmailQuotationData {
  recipientEmail: string
  recipientName: string
  senderName: string
  subject: string
  message: string
  quotation: SavedQuotation
  includeAttachment: boolean
}
