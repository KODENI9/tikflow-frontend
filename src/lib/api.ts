// src/lib/api.ts
import { AdminStats, ReceivedPayment, Transaction, TransactionDetail, User, ApiResponse, Package, Notification, Recipient } from "@/types/api";

const API_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, ""); 
const ADMIN_BASE = process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN || `${API_URL}/api/admin`;
const ORDERS_BASE = `${API_URL}/api/orders`;

// Helper générique pour les appels API
async function fetchApi<T>(endpoint: string, token: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(`[API Error] ${endpoint} (${res.status}):`, data);
    throw new Error(data.message || data.error || `Erreur API (${res.status})`);
  }

  // Si l'API renvoie { success: true, data: T }, on extrait data.
  // Sinon, on renvoie directement la réponse (cas des tableaux bruts parfois)
  if (data.success && data.data) {
    return data.data as T;
  }
  
  return data as T;
}

export const adminApi = {
  // 1. STATS GLOBALES
  getStats: (token: string) => 
    fetchApi<AdminStats>(`${ADMIN_BASE}/stats`, token),

  // 2. TRANSACTIONS EN ATTENTE
  getPendingTransactions: (token: string) => 
    fetchApi<Transaction[]>(`${ADMIN_BASE}/pending`, token),

  // 3. TOUTES LES TRANSACTIONS
  getAllTransactions: (token: string) => 
    fetchApi<Transaction[]>(`${ADMIN_BASE}/transactions`, token),

  // 4. DÉTAIL D'UNE TRANSACTION
  getTransactionById: (token: string, id: string) => 
    fetchApi<TransactionDetail>(`${ADMIN_BASE}/transactions/${id}`, token),

  // 5. VÉRIFICATION INTELLIGENTE
  verifySmart: (token: string, id: string) => 
    fetchApi<{ message: string }>(`${ADMIN_BASE}/verify-smart/${id}`, token, { method: 'PATCH' }),

  // 6. MISE À JOUR MANUELLE (Valider/Rejeter)
  updateTransactionStatus: (token: string, id: string, status: string, admin_note: string) => 
    fetchApi<{ message: string }>(`${ADMIN_BASE}/verify/${id}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ status, admin_note }),
    }),

  // 7. SIMULER SMS (WEBHOOK)
  simulateSMS: async (smsData: { sender: string; content: string }) => {
    // Le webhook est souvent hors de /api/admin et sans token Auth Bearer standard (plutôt x-api-key ou rien pour test)
    const res = await fetch(`${API_URL}/api/admin/sms-webhook`, {
      method: 'POST',
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_SMS_WEBHOOK_KEY || "" // Clé d'API dédiée pour le webhook, à configurer dans .env.local
      },
      
      body: JSON.stringify({ 
        from: smsData.sender, 
        message: smsData.content 
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur SMS");
    return data;
  },

  // 8. LOG DES PAIEMENTS REÇUS
  getReceivedPayments: (token: string) => 
    fetchApi<ReceivedPayment[]>(`${ADMIN_BASE}/payments-log`, token),

  // 9. LISTE DES UTILISATEURS
  getUsers: (token: string) => 
    fetchApi<User[]>(`${ADMIN_BASE}/users`, token),

  // 10. AJUSTER SOLDE UTILISATEUR
  adjustBalance: (token: string, uid: string, amount: number) => 
    fetchApi<{ message: string }>(`${ADMIN_BASE}/users/${uid}/adjust-balance`, token, {
      method: 'PATCH',
      body: JSON.stringify({ amount }),
    }),

  // 11. GESTION DES PACKS
  getPackages: (token: string) =>
    fetchApi<Package[]>(`${ADMIN_BASE}/packages`, token), // Requires Package interface import if strict

  createPackage: (token: string, pkg: { name: string; coins: number; price_cfa: number }) =>
    fetchApi<{ id: string; success: boolean }>(`${ADMIN_BASE}/packages`, token, {
      method: 'POST',
      body: JSON.stringify(pkg),
    }),

  updatePackage: (token: string, id: string, updates: Partial<Package>) =>
    fetchApi<{ success: boolean }>(`${ADMIN_BASE}/packages/${id}`, token, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  // 11. DEMANDER LE CODE (GMAIL)
  requestCode: (token: string, id: string) =>
    fetchApi<{ message: string }>(`${ADMIN_BASE}/transactions/${id}/request-code`, token, { method: 'POST' }),

  // 12. GESTION DES DESTINATAIRES
  getRecipients: (token: string) =>
    fetchApi<Recipient[]>(`${ADMIN_BASE}/recipients`, token),

  createRecipient: (token: string, data: Partial<Recipient>) =>
    fetchApi<{ id: string }>(`${ADMIN_BASE}/recipients`, token, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateRecipient: (token: string, id: string, updates: Partial<Recipient>) =>
    fetchApi<{ success: boolean }>(`${ADMIN_BASE}/recipients/${id}`, token, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  deleteRecipient: (token: string, id: string) =>
    fetchApi<{ success: boolean }>(`${ADMIN_BASE}/recipients/${id}`, token, {
      method: 'DELETE',
    }),

  // 13. SETTINGS GLOBAUX
  getSettings: (token: string) =>
    fetchApi<{ success: boolean; data: { support_phone: string } }>(`${ADMIN_BASE}/settings`, token),

  updateSettings: (token: string, data: any) =>
    fetchApi<{ success: boolean }>(`${ADMIN_BASE}/settings`, token, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const packagesApi = {
  getPackages: (token: string) =>
    fetchApi<Package[]>(`${ORDERS_BASE}/packages`, token),
  getPackageById: (token: string, id: string) =>
    fetchApi<Package>(`${ORDERS_BASE}/packages/${id}`, token),
  updatePackage: (token: string, id: string, updates: Partial<Package>) =>
    fetchApi<{ success: boolean }>(`${ADMIN_BASE}/packages/${id}`, token, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),
};

export const recipientsApi = {
  getActiveRecipients: (token: string) =>
    fetchApi<Recipient[]>(`${ORDERS_BASE}/recipients?active=true`, token),
  getGlobalSettings: (token: string) =>
    fetchApi<{ success: boolean; data: { support_phone: string } }>(`${ORDERS_BASE}/app-settings`, token),
};

export const notificationApi = {
  getNotifications: (token: string) =>
    fetchApi<Notification[]>(`${API_URL}/api/notifications`, token),

  getUnreadCount: (token: string) =>
    fetchApi<{ count: number }>(`${API_URL}/api/notifications/unread-count`, token),

  markAsRead: (token: string, id: string) =>
    fetchApi<{ message: string }>(`${API_URL}/api/notifications/${id}/read`, token, { method: 'PATCH' }),

  markAllAsRead: (token: string) =>
    fetchApi<{ message: string }>(`${API_URL}/api/notifications/mark-all-read`, token, { method: 'PATCH' }),

  getAdminNotifications: (token: string) =>
    fetchApi<Notification[]>(`${API_URL}/api/notifications/admin`, token),

  getAdminUnreadCount: (token: string) =>
    fetchApi<{ count: number }>(`${API_URL}/api/notifications/admin/unread-count`, token),
};

const USER_BASE = `${API_URL}/api/users`;

export const userApi = {
  // 1. LIER COMPTE TIKTOK
  linkTiktok: (token: string, username: string, password: string) =>
    fetchApi<{ message: string }>(`${USER_BASE}/link-tiktok`, token, {
      method: 'PATCH',
      body: JSON.stringify({ username, password }),
    }),

  // 2. ENVOYER CODE DE CONFIRMATION (GMAIL)
  submitCode: (token: string, transactionId: string, code: string) =>
    fetchApi<{ message: string }>(`${USER_BASE}/submit-code`, token, {
      method: 'POST',
      body: JSON.stringify({ transactionId, code }),
    }),

  // 3. RECUPERER UNE TRANSACTION
  getTransactionById: (token: string, id: string) =>
    fetchApi<Transaction>(`${USER_BASE}/transactions/${id}`, token),
};
