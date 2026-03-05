import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:pops2356%23@109.199.118.183:5432/lumora_db',
  ssl: false,
});

function buildFilters(filter: string, startDate?: string, endDate?: string, product?: string) {
  let where = '1=1';
  const values: any[] = [];

  if (filter === 'custom' && startDate && endDate) {
    where += ` AND o.created_at BETWEEN $${values.length + 1} AND $${values.length + 2}`;
    values.push(startDate, endDate);
  } else if (filter === 'day') {
    where += ` AND o.created_at >= CURRENT_DATE`;
  } else if (filter === 'week') {
    where += ` AND o.created_at >= CURRENT_DATE - INTERVAL '7 days'`;
  } else if (filter === 'month') {
    where += ` AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'`;
  } else if (filter === 'year') {
    where += ` AND o.created_at >= CURRENT_DATE - INTERVAL '365 days'`;
  }

  if (product && product !== 'Tous les produits') {
    where += ` AND o.product_name = $${values.length + 1}`;
    values.push(product);
  }

  return { where, values };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter') || 'month';
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const product = searchParams.get('product') || undefined;

    const { where, values } = buildFilters(filter, startDate, endDate, product);
    const client = await pool.connect();

    try {
      const replaceAlias = (sql: string) => sql.replace(/o\./g, '');

      /* KPIs */
      const stats = await client.query(
        `
        SELECT
          (SELECT COALESCE(SUM(amount),0) FROM orders WHERE status='completed' AND ${replaceAlias(where)}) AS total_revenue,
          (SELECT COUNT(*) FROM orders WHERE ${replaceAlias(where)}) AS total_orders,
          (SELECT COUNT(*) FROM orders WHERE status='failed' AND ${replaceAlias(where)}) AS failed_payments,
          (SELECT COALESCE(AVG(amount),0) FROM orders WHERE status='completed' AND ${replaceAlias(where)}) AS avg_basket,
          (SELECT product_name FROM orders WHERE ${replaceAlias(where)} GROUP BY product_name ORDER BY COUNT(*) DESC LIMIT 1) AS top_product,
          (SELECT COUNT(*) FROM users) AS user_count,
          (SELECT COUNT(*) FROM leads) AS lead_count,
          (SELECT 
            CASE WHEN COUNT(*) = 0 THEN 0 
            ELSE (COUNT(*) FILTER (WHERE status='completed')::float / COUNT(*)::float)*100 
            END
           FROM orders WHERE ${replaceAlias(where)}) AS success_rate
        `,
        values
      );

      /* Revenue Evolution */
      const revenue = await client.query(
        `SELECT TO_CHAR(created_at,'YYYY-MM-DD') AS date, SUM(amount) AS value
         FROM orders WHERE status='completed' AND ${replaceAlias(where)}
         GROUP BY date ORDER BY date LIMIT 30`,
        values
      );

      /* Orders Histogram */
      const orders = await client.query(
        `SELECT TO_CHAR(created_at,'YYYY-MM-DD') AS date, COUNT(*) AS value
         FROM orders WHERE ${replaceAlias(where)}
         GROUP BY date ORDER BY date LIMIT 30`,
        values
      );

      /* Payment Distribution */
      const distribution = await client.query(
        `SELECT status AS name, COUNT(*) AS value
         FROM orders WHERE ${replaceAlias(where)}
         GROUP BY status`,
        values
      );

      /* Top Products */
      const topProducts = await client.query(
        `SELECT product_name AS name, COUNT(*) AS orders
         FROM orders WHERE ${replaceAlias(where)}
         GROUP BY product_name ORDER BY orders DESC LIMIT 5`,
        values
      );

      /* Latest Orders */
      const latest = await client.query(
        `SELECT id, order_reference, customer_name, customer_email, product_name, amount, status, created_at
         FROM orders WHERE ${replaceAlias(where)}
         ORDER BY created_at DESC LIMIT 15`,
        values
      );

      /* CA PAR PAYS */
      const revenueByCountry = await client.query(
        `
        SELECT 
          c.iso2 AS country_code,
          c.name AS country_name,
          c.flag_emoji AS flag,
          COALESCE(SUM(o.amount), 0) AS revenue
        FROM orders o
        LEFT JOIN countries c ON o.customer_country = c.iso2
        WHERE ${where} AND o.status='completed'
        GROUP BY c.iso2, c.name, c.flag_emoji
        HAVING COALESCE(SUM(o.amount), 0) > 0
        ORDER BY revenue DESC
        LIMIT 10
        `,
        values
      );

      /* Distinct Products */
      const distinctProducts = await client.query(
        `SELECT DISTINCT product_name FROM orders 
         WHERE product_name IS NOT NULL AND product_name != ''
         ORDER BY product_name ASC`,
        []
      );

      const colors: Record<string, string> = {
        completed: "#10b981",
        failed: "#ef4444",
        pending: "#f59e0b",
      };

      const response = {
        stats: {
          totalRevenue: Number(stats.rows[0].total_revenue),
          totalOrders: Number(stats.rows[0].total_orders),
          failedPayments: Number(stats.rows[0].failed_payments),
          averageBasket: Number(stats.rows[0].avg_basket),
          paymentSuccessRate: Number(stats.rows[0].success_rate),
          topProduct: stats.rows[0].top_product || "N/A",
          userCount: Number(stats.rows[0].user_count),
          leadCount: Number(stats.rows[0].lead_count),
        },
        charts: {
          revenueEvolution: revenue.rows.map((r: any) => ({ ...r, value: Number(r.value) })),
          ordersHistogram: orders.rows.map((o: any) => ({ ...o, value: Number(o.value) })),
          paymentDistribution: distribution.rows.map((d: any) => ({
            name: d.name,
            value: Number(d.value),
            color: colors[d.name] || "#64748b",
          })),
          topProducts: topProducts.rows.map((p: any) => ({ ...p, orders: Number(p.orders) })),
          ordersByCountry: revenueByCountry.rows.map((c: any) => ({
            countryCode: c.country_code || 'XX',
            countryName: c.country_name || 'Inconnu',
            flag: c.flag || '🏳️',
            revenue: Number(c.revenue),
            displayName: `${c.flag || '🏳️'} ${c.country_name || 'Inconnu'}`,
          })),
        },
        orders: latest.rows,
        availableProducts: distinctProducts.rows.map((p: any) => p.product_name),
      };

      return NextResponse.json(response, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}