
import { User, Order, Payment, Lead, Product, AdminStats, DashboardResponse, ChartDataPoint, StatusDistribution, ProductPerformance } from '../types';

export const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
};

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Lumora Premium', description: 'Accès analytique illimité', price: '45 000 FCFA', price_numeric: 45000, created_at: new Date(), updated_at: new Date() },
  { id: 'p2', name: 'Sync Engine v2', description: 'Synchronisation Postgres temps réel', price: '80 000 FCFA', price_numeric: 80000, created_at: new Date(), updated_at: new Date() },
  { id: 'p3', name: 'Gemini AI Bridge', description: 'Insights par intelligence artificielle', price: '25 000 FCFA', price_numeric: 25000, created_at: new Date(), updated_at: new Date() },
  { id: 'p4', name: 'Audit de Base', description: 'Optimisation de requêtes SQL', price: '120 000 FCFA', price_numeric: 120000, created_at: new Date(), updated_at: new Date() },
  { id: 'p5', name: 'API Key Pro', description: 'Accès endpoints externes', price: '15 000 FCFA', price_numeric: 15000, created_at: new Date(), updated_at: new Date() },
];

const MOCK_USERS: User[] = Array.from({ length: 150 }).map((_, i) => ({
  id: `u${i}`,
  email: `client_${i}@lumora.com`,
  name: `Utilisateur Lumora ${i}`,
  role: i === 0 ? 'admin' : 'user',
  is_verified: true,
  email_status: 'verified',
  created_at: new Date(Date.now() - Math.random() * 10000000000),
  updated_at: new Date(),
}));

const MOCK_LEADS: Lead[] = Array.from({ length: 450 }).map((_, i) => ({
  id: `l${i}`,
  name: `Prospect ${i}`,
  email: `contact_${i}@gmail.com`,
  source: ['Postgres Connect', 'AI Suggestion', 'Direct App', 'Referral'][Math.floor(Math.random() * 4)],
  created_at: new Date(Date.now() - Math.random() * 5000000000),
}));

const generateOrdersAndPayments = () => {
  const orders: Order[] = [];
  const payments: Payment[] = [];
  for (let i = 0; i < 800; i++) {
    const product = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
    const status: any = Math.random() > 0.1 ? 'completed' : Math.random() > 0.5 ? 'pending' : 'failed';
    const date = new Date(Date.now() - Math.random() * 31536000000);
    
    const order: Order = {
      id: `ord_${i}`,
      order_reference: `LMR-${2024000 + i}`,
      customer_name: `Client Lumora ${i}`,
      customer_email: `customer${i}@example.com`,
      product_id: product.id,
      product_name: product.name,
      amount: product.price_numeric,
      currency: 'XAF',
      status,
      created_at: date,
      updated_at: date,
    };
    
    const payment: Payment = {
      id: `pay_${i}`,
      order_id: order.id,
      payment_id: `LMR_TX_${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
      order_reference: order.order_reference,
      customer_email: order.customer_email,
      product_id: order.product_id,
      amount: order.amount,
      currency: 'XAF',
      status,
      provider: 'Lumora Gateway',
      raw_payload: {},
      created_at: date,
      updated_at: date,
    };
    
    orders.push(order);
    payments.push(payment);
  }
  return { orders, payments };
};

const { orders: MOCK_ORDERS, payments: MOCK_PAYMENTS } = generateOrdersAndPayments();

export const mockDb = {
  getRawContext: () => ({
    database: "lumora_db",
    host: "109.199.118.183",
    users: MOCK_USERS,
    orders: MOCK_ORDERS,
    payments: MOCK_PAYMENTS,
    leads: MOCK_LEADS,
    products: MOCK_PRODUCTS
  }),
  getDashboardData: async (startDate?: Date, endDate?: Date): Promise<DashboardResponse> => {
    // Simulate real database latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const filterByDate = (date: Date) => {
      if (!startDate) return true;
      const d = new Date(date);
      const e = endDate || new Date();
      return d >= startDate && d <= e;
    };

    const filteredOrders = MOCK_ORDERS.filter(o => filterByDate(o.created_at));
    const filteredPayments = MOCK_PAYMENTS.filter(p => filterByDate(p.created_at));
    const filteredLeads = MOCK_LEADS.filter(l => filterByDate(l.created_at));
    const filteredUsers = MOCK_USERS.filter(u => filterByDate(u.created_at));

    const totalRevenue = filteredPayments
      .filter(p => p.status === 'completed')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const totalOrders = filteredOrders.length;
    const paymentSuccessRate = filteredPayments.length > 0 ? (filteredPayments.filter(p => p.status === 'completed').length / filteredPayments.length) * 100 : 0;
    const failedPaymentsCount = filteredPayments.filter(p => p.status === 'failed').length;
    
    const completedOrdersInPeriod = filteredOrders.filter(o => o.status === 'completed');
    const averageBasket = completedOrdersInPeriod.length > 0 ? totalRevenue / completedOrdersInPeriod.length : 0;

    const productCounts: Record<string, number> = {};
    filteredOrders.forEach(o => { productCounts[o.product_name] = (productCounts[o.product_name] || 0) + 1; });
    const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    const stats: AdminStats = {
      totalRevenue, 
      totalOrders, 
      paymentSuccessRate, 
      failedPayments: failedPaymentsCount, 
      averageBasket, 
      topProduct, 
      userCount: filteredUsers.length || MOCK_USERS.length, 
      leadCount: filteredLeads.length,
    };

    const revMap: Record<string, number> = {};
    filteredPayments.filter(p => p.status === 'completed').forEach(p => {
      const key = p.created_at.toISOString().split('T')[0];
      revMap[key] = (revMap[key] || 0) + p.amount;
    });
    const revenueEvolution = Object.entries(revMap)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); 

    const ordMap: Record<string, number> = {};
    filteredOrders.forEach(o => {
      const key = o.created_at.toISOString().split('T')[0];
      ordMap[key] = (ordMap[key] || 0) + 1;
    });
    const ordersHistogram = Object.entries(ordMap)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);

    const paymentDistribution: StatusDistribution[] = [
      { name: 'Réussis', value: filteredPayments.filter(p => p.status === 'completed').length, color: '#10b981' },
      { name: 'Échoués', value: filteredPayments.filter(p => p.status === 'failed').length, color: '#f43f5e' },
      { name: 'Attente', value: filteredPayments.filter(p => p.status === 'pending').length, color: '#f59e0b' },
    ];

    const topProducts: ProductPerformance[] = Object.entries(productCounts)
      .map(([name, orders]) => ({ name, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    return {
      orders: [...filteredOrders].sort((a, b) => b.created_at.getTime() - a.created_at.getTime()).slice(0, 15),
      stats,
      charts: {
        revenueEvolution,
        ordersHistogram,
        paymentDistribution,
        topProducts
      }
    };
  }
};
