// app/(auth)/sync-user/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { getDbUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function SyncUserPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  // On vérifie si l'utilisateur existe dans ton backend Firebase
  const result = await getDbUser();

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