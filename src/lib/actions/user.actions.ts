"use server";

import { auth } from "@clerk/nextjs/server";

export async function syncUserWithBackend(userData: { email: string; fullname: string; phoneNumber?: string }) {
  try {
    const session = await auth();
    const { getToken, userId } = session;
    const token = await getToken();

    if (!userId || !token) {
      throw new Error("Utilisateur non authentifié via Clerk");
    }

    // Appel à ton backend Node.js Express
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Ton middleware Express va vérifier ce token
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la synchronisation");
    }

    return data;
  } catch (error) {
    console.error("[SYNC_USER_ERROR]:", error);
    return { success: false, error: "Impossible de synchroniser l'utilisateur" };
  }
}

export async function updatePhoneNumberAction(phoneNumber: string) {
  try {
    const session = await auth();
    const { getToken } = session;
    const token = await getToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update-phone`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ phoneNumber }),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur réseau" };
  }
}

export async function linkTiktokAccountAction(username: string, password: string) {
  try {
    const session = await auth();
    const { getToken } = session;
    const token = await getToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/link-tiktok`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ username, password }),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur réseau" };
  }
}

export async function fetchUserwalletBalance() {
  try {
    const session = await auth();
    const token = await session.getToken(); // Correct : auth() retourne directement l'objet avec getToken

    if (!token) {
      return { success: false, error: "Non autorisé" };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      // Optionnel : ajouter un cache si c'est du Next.js 14+
      next: { revalidate: 0 } 
    });

    if (!response.ok) {
      return { success: false, error: "Erreur lors de la récupération du solde" };
    }

    // ERREUR CORRIGÉE ICI : Il faut attendre (await) le JSON
    const data = await response.json(); 
    return data;

  } catch (error) {
    console.error("Erreur Fetch Wallet:", error);
    return { success: false, error: "Erreur réseau ou serveur" };
  }
}


export async function createDepositAction(
  payment_method: string,
  ref_id: string,
  amount_cfa: number,
) {
  try {
    const session = await auth();
    const { getToken } = session;
    const token = await getToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/ch_wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(
        { payment_method, ref_id, amount_cfa }
      ),
    });

    const data = await response.json();
    console.log("Response Data:", data);

    if (!response.ok) {
      throw new Error(data.message  || "Erreur lors de la déclaration du dépôt");
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("[DEPOSIT_ERROR]:", error);
    return { success: false, error: error.message };
  }
}

export async function getTransactionHistory() {
  try {
    const session = await auth();
    const token = await session.getToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: 'no-store',   // Pour toujours avoir les données fraîches
    });

    const result = await response.json();

    // Si le backend a renvoyé success: true, on renvoie DIRECTEMENT le tableau
    if (response.ok && result.success) {
      return { success: true, transactions: result.data || [] };
    }
    
    return { success: false, transactions: [], error: result.message };
  } catch (error: any) {
    return { success: false, transactions: [], error: error.message };
  }
}


// Action pour l'achat de coins TikTok
export async function purchaseCoins(formData: { 
  packageId: string, 
  tiktok_username: string, 
  tiktok_password: string,
  useLinkedAccount?: boolean 
}) {
  try {
    const session = await auth(); // Clerk ou ton système d'auth
    const token = await session.getToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/buy-coins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getDbUser() {
  try {
    const session = await auth();
    const { getToken } = session;
    const token = await getToken(); 
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la récupération de l'utilisateur");
    } 
    return { success: true, user: data.data };
  } catch (error) {
    console.error("[GET_DB_USER_ERROR]:", error);
    return { success: false, error: "Impossible de récupérer l'utilisateur" };
  }
}

export async function getUserProfileAction() {
  try {
    const session = await auth();
    const { getToken } = session;
    const token = await getToken(); 

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la récupération du profil");
    } 

    return { success: true, data: data.data };
  } catch (error) {
    console.error("[GET_USER_PROFILE_ERROR]:", error);
    return { success: false, error: "Impossible de récupérer le profil" };
  }
}
