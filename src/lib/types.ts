export interface Category {
  id: string
  name: string
  order: number
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  description: string
  consumerPrice: number
  financialPrice: number
  order: number
  isAvailable: boolean
}

export interface MenuSettings {
  showFinancialPrice: boolean
}
