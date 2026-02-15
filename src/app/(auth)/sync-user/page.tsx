// app/(auth)/sync-user/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { getDbUser, syncUserWithBackend } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function SyncUserPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) redirect("/sign-in");

  // On vérifie si l'utilisateur existe dans ton backend Firebase
  let result = await getDbUser();

  // Si l'utilisateur n'existe pas en DB, on le crée (Synchronisation explicite)
  if (!result.success || !result.user) {
    const userData = {
        email: user.emailAddresses[0]?.emailAddress || "",
        fullname: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        phoneNumber: user.phoneNumbers[0]?.phoneNumber || "",
    };

    console.log("⚡ SyncUserPage: Tentative de création user...", userData);
    const syncResult = await syncUserWithBackend(userData);
    
    if (syncResult && syncResult.success) {
        // On re-vérifie (ou on utilise le résultat du sync s'il renvoie le user complet)
        result = await getDbUser();
    } else {
        console.error("❌ Echec sync Server-Side:", syncResult);
        // On redirige vers l'accueil ou une page d'erreur si la création échoue
        redirect("/"); 
    }
  }

  if (result.success && result.user) {
    // Redirection basée sur le rôle
    if (result.user.role === 'admin') {
      redirect("/admin/dashboard");
    } else {
      redirect("/dashboard");
    }
  } else {
    redirect("/"); 
  }
}