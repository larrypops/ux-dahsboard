
# Guide de Connexion Réelle : Lumora Dashboard & PostgreSQL

Ce guide vous permet de débrancher la simulation (`mockDb.ts`) et de connecter votre dashboard à votre base de données réelle sur `109.199.118.183`.

## 1. Serveur Pont API (`index.js`)

Ce serveur Node.js reçoit les demandes du dashboard, interroge votre base Postgres avec les filtres sélectionnés (temps, produit) et renvoie les données fraîches.

```javascript
/**
 * LUMORA BRIDGE API - index.js
 * 
 * Instructions d'installation :
 * 1. mkdir lumora-bridge && cd lumora-bridge
 * 2. npm init -y
 * 3. npm install express pg cors
 */

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  connectionString: "postgresql://postgres:pops2356%23@109.199.118.183:5432/lumora_db",
  ssl: false // Désactivé par défaut pour cette instance
});

// Générateur de filtres SQL dynamiques
const buildSqlFilters = (filter, startDate, endDate, product) => {
  let timeCondition = "1=1";
  
  switch(filter) {
    case 'day': timeCondition = "created_at >= CURRENT_DATE"; break;
    case 'week': timeCondition = "created_at >= CURRENT_DATE - INTERVAL '7 days'"; break;
    case 'month': timeCondition = "created_at >= CURRENT_DATE - INTERVAL '1 month'"; break;
    case 'year': timeCondition = "created_at >= CURRENT_DATE - INTERVAL '1 year'"; break;
    case 'custom': 
      if (startDate && endDate) {
        timeCondition = `created_at BETWEEN '${startDate}' AND '${endDate}'`;
      }
      break;
  }

  let productCondition = "";
  if (product && product !== 'Tous les produits') {
    productCondition = ` AND product_name = '${product.replace(/'/g, "''")}'`;
  }

  return { timeCondition, productCondition };
};

app.get('/api/dashboard', async (req, res) => {
  // Désactiver le cache pour garantir l'actualisation réelle
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  const { filter, startDate, endDate, product } = req.query;
  const { timeCondition, productCondition } = buildSqlFilters(filter, startDate, endDate, product);

  console.log(`[${new Date().toISOString()}] Sync demandée : Filter=${filter}, Product=${product}`);

  try {
    // 1. KPIs - Statistiques en temps réel
    const statsQuery = `
      SELECT 
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed' AND ${timeCondition}${productCondition}) as total_revenue,
        (SELECT COUNT(*) FROM orders WHERE ${timeCondition}${productCondition}) as total_orders,
        (SELECT COUNT(*) FROM payments WHERE status = 'failed' AND ${timeCondition}${productCondition}) as failed_payments,
        (SELECT COALESCE(AVG(amount), 0) FROM orders WHERE status = 'completed' AND ${timeCondition}${productCondition}) as avg_basket,
        (SELECT product_name FROM orders WHERE ${timeCondition} GROUP BY product_name ORDER BY COUNT(*) DESC LIMIT 1) as top_product,
        (SELECT COUNT(*) FROM users WHERE ${timeCondition}) as user_count,
        (SELECT COUNT(*) FROM leads WHERE ${timeCondition}) as lead_count,
        (SELECT 
            CASE 
              WHEN COUNT(*) = 0 THEN 0 
              ELSE (COUNT(*) FILTER (WHERE status = 'completed')::float / COUNT(*)::float) * 100 
            END 
         FROM payments WHERE ${timeCondition}${productCondition}) as success_rate
    `;
    const statsRes = await pool.query(statsQuery);
    const s = statsRes.rows[0];

    // 2. Graphique : Évolution Revenu
    const revenueQuery = `
      SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, SUM(amount) as value 
      FROM payments 
      WHERE status = 'completed' AND ${timeCondition}${productCondition}
      GROUP BY date ORDER BY date ASC LIMIT 30
    `;
    const revenueRes = await pool.query(revenueQuery);

    // 3. Graphique : Histogramme Commandes
    const ordersQuery = `
      SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as value 
      FROM orders 
      WHERE ${timeCondition}${productCondition}
      GROUP BY date ORDER BY date ASC LIMIT 30
    `;
    const ordersRes = await pool.query(ordersQuery);

    // 4. Graphique : Distribution Paiements
    const distQuery = `
      SELECT status as name, COUNT(*) as value 
      FROM payments 
      WHERE ${timeCondition}${productCondition}
      GROUP BY status
    `;
    const distRes = await pool.query(distQuery);
    const colors = { 'completed': '#10b981', 'failed': '#f43f5e', 'pending': '#f59e0b' };
    const paymentDistribution = distRes.rows.map(r => ({
      name: r.name === 'completed' ? 'Réussis' : r.name === 'pending' ? 'Attente' : 'Échoués',
      value: parseInt(r.value),
      color: colors[r.name] || '#64748b'
    }));

    // 5. Graphique : Top Produits
    const topProdQuery = `
      SELECT product_name as name, COUNT(*) as orders 
      FROM orders 
      WHERE ${timeCondition}
      GROUP BY product_name ORDER BY orders DESC LIMIT 5
    `;
    const topProdRes = await pool.query(topProdQuery);

    // 6. Liste : Dernières Transactions (Table)
    const latestQuery = `
      SELECT * FROM orders 
      WHERE ${timeCondition}${productCondition}
      ORDER BY created_at DESC LIMIT 15
    `;
    const latestRes = await pool.query(latestQuery);

    // Réponse au format attendu par le dashboard
    res.json({
      stats: {
        totalRevenue: parseFloat(s.total_revenue),
        totalOrders: parseInt(s.total_orders),
        paymentSuccessRate: parseFloat(s.success_rate),
        failedPayments: parseInt(s.failed_payments),
        averageBasket: parseFloat(s.avg_basket),
        topProduct: s.top_product || 'N/A',
        userCount: parseInt(s.user_count),
        leadCount: parseInt(s.lead_count)
      },
      charts: {
        revenueEvolution: revenueRes.rows.map(r => ({ ...r, value: parseFloat(r.value) })),
        ordersHistogram: ordersRes.rows.map(r => ({ ...r, value: parseInt(r.value) })),
        paymentDistribution,
        topProducts: topProdRes.rows.map(r => ({ ...r, orders: parseInt(r.orders) }))
      },
      orders: latestRes.rows
    });

  } catch (err) {
    console.error("Erreur Bridge :", err);
    res.status(500).json({ error: "Erreur de synchronisation avec PostgreSQL." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
  🚀 LUMORA ENGINE v4.2 - BRIDGE ACTIF
  ------------------------------------
  Local : http://localhost:${PORT}/api/dashboard
  DB    : 109.199.118.183:5432 (lumora_db)
  ------------------------------------
  Prêt pour l'actualisation en temps réel.
  `);
});
```

## 2. Mise à jour du Service Dashboard (`services/lumoraService.ts`)

Pour que le bouton "Actualiser" du dashboard appelle réellement votre API, remplacez le contenu de `services/lumoraService.ts` par celui-ci :

```typescript
import { DashboardResponse, FilterType, DateRange } from "../types";

/**
 * Service de données Lumora (Mode Production)
 * Envoie les filtres à l'API Bridge pour récupération SQL réelle.
 */
export const fetchLumoraData = async (
  filter: FilterType, 
  range?: DateRange,
  product?: string
): Promise<DashboardResponse> => {
  const params = new URLSearchParams({
    filter,
    startDate: range?.start || '',
    endDate: range?.end || '',
    product: product || 'Tous les produits'
  });

  // Remplacez par l'URL de votre serveur API déployé
  const API_URL = `http://localhost:3001/api/dashboard?${params}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erreur de synchronisation');
    
    return await response.json();
  } catch (error) {
    console.error("Erreur service :", error);
    throw error;
  }
};

export const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
};
```

---
*Lumora Technical Architecture • Refresh-Ready v4.2*
