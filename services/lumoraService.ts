
import { DashboardResponse, FilterType, DateRange } from "../types";
import { mockDb } from "./mockDb";

/**
 * Service de données Lumora
 * Actuellement branché sur mockDb pour simulation locale.
 * Pour connecter votre base réelle, suivez le guide.md
 */
export const fetchLumoraData = async (
  filter: FilterType, 
  range?: DateRange,
  product?: string
): Promise<DashboardResponse> => {
  let start: Date | undefined;
  let end: Date = new Date();

  const now = new Date();
  if (filter === 'day') {
    start = new Date(now.setHours(0, 0, 0, 0));
  } else if (filter === 'week') {
    start = new Date(now.setDate(now.getDate() - 7));
  } else if (filter === 'month') {
    start = new Date(now.setMonth(now.getMonth() - 1));
  } else if (filter === 'year') {
    start = new Date(now.setFullYear(now.getFullYear() - 1));
  } else if (filter === 'all') {
    start = undefined;
  } else if (filter === 'custom' && range?.start && range?.end) {
    start = new Date(range.start);
    end = new Date(range.end);
  }

  // Utilisation de la mockDb locale au lieu de Gemini
  const data = await mockDb.getDashboardData(start, end);

  // Filtrage par produit si spécifié
  if (product && product !== 'Tous les produits') {
    data.orders = data.orders.filter(o => o.product_name === product);
    // On pourrait recalculer les stats ici pour plus de réalisme
  }

  return data;
};

export const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
};
