"use client";

import { useUser } from "@clerk/nextjs";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const PhoneAlert = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  // On vérifie si le numéro existe chez Clerk 
  // (ou tu peux vérifier une donnée venant de ta DB si tu as un hook useProfile)
  const hasPhone = user?.primaryPhoneNumber || user?.unsafeMetadata?.phone_number;

  if (hasPhone) return null;

  return (
    <div className="mb-6 group relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 p-[1px] rounded-2xl shadow-lg shadow-orange-200/50">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">
              Profil incomplet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Ajoutez votre numéro pour activer les rechargements Mobile Money.
            </p>
          </div>
        </div>
        
        <Link 
          href="/dashboard/settings" 
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase transition-all hover:scale-105"
        >
          Compléter <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};