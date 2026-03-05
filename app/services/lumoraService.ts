import { DashboardResponse, FilterType, DateRange } from "@/types";

/**
 * Service de données Lumora (PRODUCTION READY)
 */
export const fetchLumoraData = async (
  filter: FilterType,
  range?: DateRange,
  product?: string
): Promise<DashboardResponse> => {

  const params = new URLSearchParams();
  params.append("filter", filter);

  if (filter === "custom" && range?.start && range?.end) {
    params.append("startDate", range.start);
    params.append("endDate", range.end);
  }

  if (product && product !== "Tous les produits") {
    params.append("product", product);
  }

  // Utiliser l'API interne Next.js (même origine)
  const API_URL = `/api/dashboard?${params.toString()}`;

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Important pour dashboard temps réel
    });

    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur service Lumora :", error);
    throw error;
  }
};

/**
 * Format FCFA
 */
export const formatFCFA = (amount: number): string => {
  return (
    new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 0,
    }).format(amount) + " FCFA"
  );
};
