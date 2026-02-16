"use client";
import { fetchUserwalletBalance } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const PhoneAlert = () => {
  const { user, isLoaded } = useUser();
  const [hasPhone, setHasPhone] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPhoneStatus = async () => {
      if (!isLoaded || !user) return;
      
      try {
        const result = await fetchUserwalletBalance();
        const dbPhone = result?.success && result?.data?.phone_number;
        const clerkPhone = user?.primaryPhoneNumber?.phoneNumber;
        
        setHasPhone(!!(dbPhone || clerkPhone));
      } catch (error) {
        console.error("Erreur vérification téléphone:", error);
      } finally {
        setLoading(false);
      }
    };

    checkPhoneStatus();
  }, [isLoaded, user]);

  if (!isLoaded || loading) return null;
  if (hasPhone) return null;

  return (
    <div className="mb-6 group relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 p-[1px] rounded-2xl shadow-lg shadow-orange-500/10">
      <div className="bg-card-bg rounded-[15px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-tikflow-accent/10 flex items-center justify-center text-tikflow-accent">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="font-black text-foreground text-sm uppercase tracking-tight">
              Profil incomplet
            </h4>
            <p className="text-xs text-tikflow-slate font-medium">
              Ajoutez votre numéro pour activer les rechargements Mobile Money.
            </p>
          </div>
        </div>
        
        <Link 
          href="/dashboard/settings" 
          className="flex items-center gap-2 bg-tikflow-accent hover:bg-tikflow-accent/90 text-white px-4 py-2 rounded-xl text-xs font-black uppercase transition-all hover:scale-105"
        >
          Compléter <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};