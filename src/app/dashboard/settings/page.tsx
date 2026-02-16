"use client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import ProfileSection from "@/components/dashboard/settings/ProfileSection";
import TiktokSection from "@/components/dashboard/settings/TiktokSection";
import SecuritySection from "@/components/dashboard/settings/SecuritySection";
import PreferencesSection from "@/components/dashboard/settings/PreferencesSection";
import SupportSection from "@/components/dashboard/settings/SupportSection";

export default function SettingsPage() {
  const { isLoaded } = useUser();

  if (!isLoaded) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Paramètres</h1>
        <p className="text-tikflow-slate font-medium">Gérez votre profil, votre sécurité et vos préférences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
            <ProfileSection />
            <TiktokSection />
        </div>

        {/* COLONNE DROITE (Sécurité & Préférences) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Sécurité */}
          <div>
            {/* <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sécurité & Préférences</h2> */}
            <p className="text-slate-500 font-medium">Cette section est en maintenance pour le moment </p>
          </div>
          
          <SecuritySection />
          <PreferencesSection />
          <SupportSection />

        </div>
      </div>
    </div>
  );
}