
# Guide de Synchronisation : Lumora Dashboard & PostgreSQL Réel

Ce dashboard est actuellement en mode **Simulation (MockDb)**. Pour afficher vos données réelles depuis l'instance `109.199.118.183`, vous devez déployer un pont API.

## 1. Pourquoi un pont (Bridge) ?
Pour des raisons de sécurité, les navigateurs (Chrome, Safari) ne peuvent pas se connecter directement à un port PostgreSQL (5432). Vous avez besoin d'une petite API Node.js qui fera le lien.

## 2. Étape 1 : Création du Serveur API (Node.js)

Créez un dossier `lumora-api` sur votre serveur et installez les outils :

```bash
mkdir lumora-api && cd lumora-api
npm init -y
npm install express pg cors dotenv
```

### Fichier `index.js`
Copiez ce code pour créer vos endpoints de données :

```javascript
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors()); // Autorise votre dashboard à appeler cette API
app.use(express.json());

// Vos identifiants de base de données
const pool = new Pool({
  connectionString: "postgresql://postgres:pops2356%23@109.199.118.183:5432/lumora_db",
  ssl: false 
});

// Endpoint pour les statistiques du dashboard
app.get('/api/stats', async (req, res) => {
  try {
    const revenue = await pool.query("SELECT SUM(amount) FROM payments WHERE status = 'completed'");
    const orders = await pool.query("SELECT COUNT(*) FROM orders");
    const users = await pool.query("SELECT COUNT(*) FROM users");
    
    res.json({
      totalRevenue: parseFloat(revenue.rows[0].sum || 0),
      totalOrders: parseInt(orders.rows[0].count || 0),
      userCount: parseInt(users.rows[0].count || 0),
      // ... ajoutez les autres KPIs selon votre schéma
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint pour les graphiques (Exemple: Revenu par jour)
app.get('/api/charts/revenue', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, SUM(amount) as value 
      FROM payments 
      WHERE status = 'completed' 
      GROUP BY date 
      ORDER BY date ASC 
      LIMIT 30
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('🚀 Lumora API sur le port 3001'));
```

## 3. Étape 2 : Connecter le Frontend

Dans votre projet React, modifiez `services/lumoraService.ts` :

```typescript
export const fetchLumoraData = async (filter: string): Promise<DashboardResponse> => {
  // Remplacez 'localhost' par l'IP de votre serveur API une fois déployé
  const response = await fetch('http://localhost:3001/api/stats');
  const stats = await response.json();
  
  // Mappez les données reçues vers l'interface DashboardResponse
  return {
    orders: [], // à fetcher également
    stats: stats,
    charts: { ... } // à fetcher également
  };
};
```

## 4. Check-list Sécurité
1. **Firewall** : Autorisez le port 3001 sur votre serveur API.
2. **Postgres** : Assurez-vous que l'IP de votre serveur API est autorisée dans le fichier `pg_hba.conf` de PostgreSQL.
3. **SSL** : Si vous déployez en ligne (Vercel, Railway, Render), utilisez HTTPS pour votre API.

---
*Support Lumora Engine v4.2*
