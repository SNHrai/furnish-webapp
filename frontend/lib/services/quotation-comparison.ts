import { SavedQuotation, QuotationComparison } from '@/lib/types/quotation'

/**
 * Service for comparing multiple quotations
 */
export class QuotationComparisonService {
  
  /**
   * Compare multiple quotations and generate insights
   */
  static compareQuotations(quotations: SavedQuotation[]): QuotationComparison {
    if (quotations.length < 2) {
      throw new Error('At least 2 quotations are required for comparison')
    }

    // Find lowest and highest priced quotations
    const lowestPrice = quotations.reduce((prev, current) => 
      prev.calculation.totalPrice < current.calculation.totalPrice ? prev : current
    )
    
    const highestPrice = quotations.reduce((prev, current) => 
      prev.calculation.totalPrice > current.calculation.totalPrice ? prev : current
    )

    // Calculate average price
    const totalPrice = quotations.reduce((sum, q) => sum + q.calculation.totalPrice, 0)
    const averagePrice = totalPrice / quotations.length

    // Determine recommended option based on various factors
    const recommendedOption = this.determineRecommendedOption(quotations)

    // Calculate price difference between highest and lowest
    const priceDifference = highestPrice.calculation.totalPrice - lowestPrice.calculation.totalPrice

    return {
      quotations,
      insights: {
        lowestPrice,
        highestPrice,
        averagePrice,
        recommendedOption,
        priceDifference
      }
    }
  }

  /**
   * Determine the recommended option based on multiple factors
   */
  private static determineRecommendedOption(quotations: SavedQuotation[]): SavedQuotation {
    // Score each quotation based on various factors
    const scoredQuotations = quotations.map(quotation => {
      let score = 0

      // Price factor (lower price = higher score)
      const prices = quotations.map(q => q.calculation.totalPrice)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const priceRange = maxPrice - minPrice
      
      if (priceRange > 0) {
        // Normalize price score (0-30 points)
        const priceScore = 30 * (1 - (quotation.calculation.totalPrice - minPrice) / priceRange)
        score += priceScore
      }

      // Style preference factor (modern and luxury get higher scores)
      const styleScores: { [key: string]: number } = {
        'luxury': 25,
        'modern': 20,
        'contemporary': 15,
        'traditional': 10,
        'transitional': 10,
        'minimalist': 5
      }
      score += styleScores[quotation.formData.style] || 0

      // Budget category factor
      const budgetScores: { [key: string]: number } = {
        'luxury': 20,
        'ultra': 15,
        'bespoke': 10,
        'standard': 5
      }
      score += budgetScores[quotation.formData.budget] || 0

      // Material quality factor
      const materialScores: { [key: string]: number } = {
        'premium': 15,
        'luxury': 10,
        'standard': 5
      }
      score += materialScores[quotation.formData.materials] || 0

      // Furniture selection factor (more furniture = higher score up to a limit)
      const furnitureCount = quotation.formData.furniture.length
      score += Math.min(furnitureCount * 2, 10) // Max 10 points for furniture

      return {
        quotation,
        score
      }
    })

    // Return the quotation with the highest score
    const bestOption = scoredQuotations.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    )

    return bestOption.quotation
  }

  /**
   * Get comparison matrix for displaying differences
   */
  static getComparisonMatrix(quotations: SavedQuotation[]) {
    const attributes = [
      {
        key: 'totalPrice',
        label: 'Total Price',
        getValue: (q: SavedQuotation) => q.calculation.totalPrice,
        format: 'currency'
      },
      {
        key: 'roomType',
        label: 'Room Type',
        getValue: (q: SavedQuotation) => q.formData.roomType,
        format: 'roomType'
      },
      {
        key: 'roomSize',
        label: 'Room Size',
        getValue: (q: SavedQuotation) => q.formData.roomSize,
        format: 'roomSize'
      },
      {
        key: 'style',
        label: 'Design Style',
        getValue: (q: SavedQuotation) => q.formData.style,
        format: 'style'
      },
      {
        key: 'budget',
        label: 'Budget Category',
        getValue: (q: SavedQuotation) => q.formData.budget,
        format: 'budget'
      },
      {
        key: 'materials',
        label: 'Materials',
        getValue: (q: SavedQuotation) => q.formData.materials,
        format: 'materials'
      },
      {
        key: 'furnitureCount',
        label: 'Furniture Items',
        getValue: (q: SavedQuotation) => q.formData.furniture.length,
        format: 'number'
      },
      {
        key: 'timestamp',
        label: 'Created On',
        getValue: (q: SavedQuotation) => q.timestamp,
        format: 'date'
      }
    ]

    return attributes.map(attribute => {
      const values = quotations.map(q => ({
        quotation: q,
        value: attribute.getValue(q)
      }))

      // Determine if there are differences in this attribute
      const uniqueValues = Array.from(new Set(values.map(v => JSON.stringify(v.value))))
      const hasDifferences = uniqueValues.length > 1

      return {
        ...attribute,
        values,
        hasDifferences
      }
    })
  }

  /**
   * Get percentage difference between two prices
   */
  static getPriceDifferencePercentage(price1: number, price2: number): number {
    const difference = Math.abs(price1 - price2)
    const average = (price1 + price2) / 2
    return average > 0 ? (difference / average) * 100 : 0
  }

  /**
   * Get savings amount and percentage if user chooses the cheaper option
   */
  static getSavingsAnalysis(quotations: SavedQuotation[]) {
    if (quotations.length < 2) return null

    const prices = quotations.map(q => q.calculation.totalPrice)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    const savings = maxPrice - minPrice
    const savingsPercentage = (savings / maxPrice) * 100

    const cheapestQuotation = quotations.find(q => q.calculation.totalPrice === minPrice)
    const expensiveQuotation = quotations.find(q => q.calculation.totalPrice === maxPrice)

    return {
      savings,
      savingsPercentage,
      cheapestQuotation,
      expensiveQuotation
    }
  }

  /**
   * Generate comparison summary text
   */
  static generateComparisonSummary(comparison: QuotationComparison): string {
    const { quotations, insights } = comparison
    const count = quotations.length
    
    const savingsAnalysis = this.getSavingsAnalysis(quotations)
    
    let summary = `Comparing ${count} quotations with prices ranging from ${insights.lowestPrice.calculation.totalPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} to ${insights.highestPrice.calculation.totalPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}. `
    
    if (savingsAnalysis) {
      summary += `You could save ${savingsAnalysis.savings.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} (${savingsAnalysis.savingsPercentage.toFixed(1)}%) by choosing the most affordable option. `
    }
    
    summary += `Based on our analysis considering price, style, materials, and other factors, we recommend "${insights.recommendedOption.name}" as the best option for your project.`
    
    return summary
  }

  /**
   * Format attribute values for display
   */
  static formatAttributeValue(value: any, format: string): string {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', { 
          style: 'currency', 
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value)
      
      case 'roomType':
        const roomLabels: { [key: string]: string } = {
          'living-room': 'Living Room',
          'bedroom': 'Master Bedroom',
          'kitchen': 'Kitchen',
          'bathroom': 'Bathroom',
          'dining': 'Dining Room',
          'office': 'Home Office',
          'whole-home': 'Whole Home'
        }
        return roomLabels[value] || value
      
      case 'roomSize':
        const sizeLabels: { [key: string]: string } = {
          'small': 'Small (< 200 sq ft)',
          'medium': 'Medium (200-400 sq ft)',
          'large': 'Large (400-600 sq ft)',
          'xl': 'Extra Large (> 600 sq ft)'
        }
        return sizeLabels[value] || value
      
      case 'style':
        const styleLabels: { [key: string]: string } = {
          'modern': 'Modern Luxury',
          'traditional': 'Classic Traditional',
          'contemporary': 'Contemporary Chic',
          'minimalist': 'Minimalist Zen',
          'luxury': 'Ultra Luxury',
          'transitional': 'Transitional Blend'
        }
        return styleLabels[value] || value
      
      case 'budget':
        const budgetLabels: { [key: string]: string } = {
          'standard': 'Standard Premium',
          'luxury': 'Luxury Collection',
          'ultra': 'Ultra Luxury',
          'bespoke': 'Bespoke Excellence'
        }
        return budgetLabels[value] || value
      
      case 'materials':
        const materialLabels: { [key: string]: string } = {
          'premium': 'Premium Materials',
          'luxury': 'Luxury Materials',
          'standard': 'Standard Premium'
        }
        return materialLabels[value] || value
      
      case 'number':
        return value.toString()
      
      case 'date':
        return new Intl.DateTimeFormat('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).format(new Date(value))
      
      default:
        return String(value)
    }
  }
}
