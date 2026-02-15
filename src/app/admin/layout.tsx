import { auth } from "@clerk/nextjs/server";
import { getDbUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Sidebar from "./_components/Sidebar";
import AdminHeader from "./_components/AdminHeader";

export default async function AdminGlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/(auth)/sign-in");

  const result = await getDbUser();
  if (!result.success || result.user.role !== "admin") {
    redirect("/dashboard"); // Redirige les clients vers leur espace
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar fixe à gauche */}
      <Sidebar user={result.user} /> 

      {/* Contenu dynamique à droite */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader user={result.user} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}