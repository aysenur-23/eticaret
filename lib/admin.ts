import { formatDate } from './utils'

// Types
export interface AdminOrder {
  id: string
  orderId: string
  customer: {
    name: string
    email: string
    phone: string
    addressLine: string
    city: string
    district: string
    postalCode: string
    country: string
    billingType: 'individual' | 'company'
    idNumber?: string
    companyName?: string
    taxId?: string
    taxOffice?: string
  }
  config: any
  choices: any
  pricing: any
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  stripeSessionId?: string
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface AdminStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  averageOrderValue: number
  topProducts: Array<{
    name: string
    count: number
    revenue: number
  }>
}

// Mock data for development
const mockOrders: AdminOrder[] = [
  {
    id: '1',
    orderId: 'ORD-001',
    customer: {
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 555 123 4567',
      addressLine: 'Atatürk Caddesi No: 123',
      city: 'İstanbul',
      district: 'Kadıköy',
      postalCode: '34710',
      country: 'Türkiye',
      billingType: 'individual'
    },
    config: {},
    choices: {},
    pricing: {
      total: 550,
      subtotal: 458,
      tax: 92,
      shipping: 50
    },
    status: 'pending',
    paymentStatus: 'paid',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '2',
    orderId: 'ORD-002',
    customer: {
      name: 'Mehmet Demir',
      email: 'mehmet@example.com',
      phone: '+90 555 987 6543',
      addressLine: 'Cumhuriyet Caddesi No: 456',
      city: 'Ankara',
      district: 'Çankaya',
      postalCode: '06420',
      country: 'Türkiye',
      billingType: 'company',
      companyName: 'Demir Teknoloji A.Ş.',
      taxId: '1234567890',
      taxOffice: 'Çankaya'
    },
    config: {},
    choices: {},
    pricing: {
      total: 1050,
      subtotal: 875,
      tax: 175,
      shipping: 0
    },
    status: 'shipped',
    paymentStatus: 'paid',
    trackingNumber: 'TRK123456789',
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-16')
  }
]

// Orders
export async function getOrders(limitCount: number = 100): Promise<AdminOrder[]> {
  try {
    // Return mock data for now
    return mockOrders.slice(0, limitCount)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

export async function getOrderById(orderId: string): Promise<AdminOrder | null> {
  try {
    return mockOrders.find(order => order.id === orderId) || null
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

export async function updateOrderStatus(orderId: string, status: AdminOrder['status'], notes?: string): Promise<boolean> {
  try {
    // Mock implementation - in real app, update Firestore
    console.log(`Updating order ${orderId} to status ${status}`, notes)
    return true
  } catch (error) {
    console.error('Error updating order status:', error)
    return false
  }
}

export async function updateOrderTracking(orderId: string, trackingNumber: string): Promise<boolean> {
  try {
    // Mock implementation - in real app, update Firestore
    console.log(`Updating order ${orderId} tracking to ${trackingNumber}`)
    return true
  } catch (error) {
    console.error('Error updating order tracking:', error)
    return false
  }
}

// Statistics
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const orders = mockOrders

    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0)
    const pendingOrders = orders.filter(order => order.status === 'pending').length
    const completedOrders = orders.filter(order => order.status === 'delivered').length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Top products analysis
    const topProducts = [
      { name: 'Batarya Bakım Seti (500ml)', count: 1, revenue: 550 },
      { name: 'Batarya Bakım Seti (1kg)', count: 1, revenue: 1050 }
    ]

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      averageOrderValue,
      topProducts,
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
      averageOrderValue: 0,
      topProducts: [],
    }
  }
}

// Products Management
export async function getProducts(category: string): Promise<any[]> {
  try {
    // Mock implementation
    return []
  } catch (error) {
    console.error(`Error fetching ${category}:`, error)
    return []
  }
}

export async function addProduct(category: string, productData: any): Promise<string | null> {
  try {
    // Mock implementation
    return 'mock-id'
  } catch (error) {
    console.error(`Error adding ${category}:`, error)
    return null
  }
}

export async function updateProduct(category: string, productId: string, productData: any): Promise<boolean> {
  try {
    // Mock implementation
    return true
  } catch (error) {
    console.error(`Error updating ${category}:`, error)
    return false
  }
}

export async function deleteProduct(category: string, productId: string): Promise<boolean> {
  try {
    // Mock implementation
    return true
  } catch (error) {
    console.error(`Error deleting ${category}:`, error)
    return false
  }
}

// Export functions
export async function exportOrdersToCSV(): Promise<string> {
  try {
    const orders = await getOrders(1000)

    const headers = [
      'Sipariş No',
      'Müşteri Adı',
      'E-posta',
      'Telefon',
      'Adres',
      'Şehir',
      'İlçe',
      'Posta Kodu',
      'Fatura Tipi',
      'Şirket Adı',
      'Vergi No',
      'Vergi Dairesi',
      'Detaylar',
      'Durum',
      'Ödeme Durumu',
      'Toplam Tutar',
      'Kargo Takip No',
      'Notlar',
      'Oluşturulma Tarihi',
      'Güncellenme Tarihi'
    ]

    const rows = orders.map(order => [
      order.orderId,
      order.customer.name,
      order.customer.email,
      order.customer.phone,
      order.customer.addressLine,
      order.customer.city,
      order.customer.district,
      order.customer.postalCode,
      order.customer.billingType === 'company' ? 'Kurumsal' : 'Bireysel',
      order.customer.companyName || '',
      order.customer.taxId || '',
      order.customer.taxOffice || '',
      order.notes || '',
      order.status,
      order.paymentStatus,
      order.pricing?.total || 0,
      order.trackingNumber || '',
      order.notes || '',
      formatDate(order.createdAt),
      formatDate(order.updatedAt)
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    return csvContent
  } catch (error) {
    console.error('Error exporting orders:', error)
    return ''
  }
}