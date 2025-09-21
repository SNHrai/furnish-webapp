import { SavedQuotation, QuotationFormData, QuotationCalculation } from '@/lib/types/quotation'

const STORAGE_KEY = 'fw-user-quotations'

/**
 * LocalStorage service for managing saved quotations
 * This is a mock implementation that will be replaced with real database operations after Phase 2 authentication
 */
export class QuotationStorageService {
  
  /**
   * Get all saved quotations from localStorage
   */
  static getSaved(): SavedQuotation[] {
    try {
      if (typeof window === 'undefined') return []
      
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      
      const quotations = JSON.parse(stored) as SavedQuotation[]
      
      // Convert timestamp strings back to Date objects
      return quotations.map(q => ({
        ...q,
        timestamp: new Date(q.timestamp)
      }))
    } catch (error) {
      console.error('Error loading saved quotations:', error)
      return []
    }
  }

  /**
   * Create and save a quotation from form data and calculation
   */
  static save(formData: QuotationFormData, calculation: QuotationCalculation, name: string, notes?: string): SavedQuotation {
    const quotation: SavedQuotation = {
      id: generateQuotationId(),
      name,
      timestamp: new Date(),
      formData,
      calculation,
      clientInfo: createDefaultClientInfo(),
      status: 'draft',
      notes
    }
    
    this.saveQuotation(quotation)
    return quotation
  }

  /**
   * Save a quotation object to localStorage
   */
  static saveQuotation(quotation: SavedQuotation): boolean {
    try {
      if (typeof window === 'undefined') return false
      
      const existingQuotations = this.getSaved()
      
      // Check if quotation with same ID already exists
      const existingIndex = existingQuotations.findIndex(q => q.id === quotation.id)
      
      if (existingIndex >= 0) {
        // Update existing quotation
        existingQuotations[existingIndex] = quotation
      } else {
        // Add new quotation
        existingQuotations.push(quotation)
      }
      
      // Sort by timestamp (newest first)
      existingQuotations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingQuotations))
      return true
    } catch (error) {
      console.error('Error saving quotation:', error)
      return false
    }
  }

  /**
   * Remove a quotation by ID
   */
  static remove(id: string): boolean {
    try {
      if (typeof window === 'undefined') return false
      
      const existingQuotations = this.getSaved()
      const filteredQuotations = existingQuotations.filter(q => q.id !== id)
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredQuotations))
      return true
    } catch (error) {
      console.error('Error removing quotation:', error)
      return false
    }
  }

  /**
   * Get a single quotation by ID
   */
  static getById(id: string): SavedQuotation | null {
    try {
      const quotations = this.getSaved()
      return quotations.find(q => q.id === id) || null
    } catch (error) {
      console.error('Error getting quotation by ID:', error)
      return null
    }
  }

  /**
   * Update quotation status
   */
  static updateStatus(id: string, status: SavedQuotation['status']): boolean {
    try {
      const quotation = this.getById(id)
      if (!quotation) return false
      
      quotation.status = status
      return this.saveQuotation(quotation)
    } catch (error) {
      console.error('Error updating quotation status:', error)
      return false
    }
  }

  /**
   * Clear all saved quotations (for testing or reset purposes)
   */
  static clearAll(): boolean {
    try {
      if (typeof window === 'undefined') return false
      
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Error clearing quotations:', error)
      return false
    }
  }

  /**
   * Get quotations count
   */
  static getCount(): number {
    return this.getSaved().length
  }

  /**
   * Export quotations as JSON (for backup purposes)
   */
  static exportAsJson(): string {
    const quotations = this.getSaved()
    return JSON.stringify(quotations, null, 2)
  }

  /**
   * Import quotations from JSON (for restore purposes)
   */
  static importFromJson(jsonData: string): boolean {
    try {
      const quotations = JSON.parse(jsonData) as SavedQuotation[]
      
      // Validate structure
      if (!Array.isArray(quotations)) {
        throw new Error('Invalid data format')
      }
      
      // Save each quotation
      quotations.forEach(quotation => {
        this.saveQuotation(quotation)
      })
      
      return true
    } catch (error) {
      console.error('Error importing quotations:', error)
      return false
    }
  }
}

// Generate a unique ID for new quotations
export function generateQuotationId(): string {
  return `quotation-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Helper function to create a default client info object
export function createDefaultClientInfo() {
  return {
    name: 'Guest User', // This will be replaced with real user data in Phase 2
    email: 'guest@example.com',
    phone: '+91 98765 43210',
    address: 'Sample Address, City, State - PIN'
  }
}
