"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Wallet,
  ShoppingBag,
  AtSign,
  History,
  Play,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageCircle,
  Phone,
  ChevronRight,
  Info,
  HelpCircle,
  Video
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { recipientsApi } from "@/lib/api";
import Link from "next/link";

export default function HelpPage() {
    const { getToken, isLoaded } = useAuth();
    const [supportPhone, setSupportPhone] = useState("+228 90 51 32 79");

    useEffect(() => {
        const fetchSettings = async () => {
            if (!isLoaded) return;
            try {
                const token = await getToken();
                if (!token) return;
                const resp = await recipientsApi.getGlobalSettings(token);
                if (resp?.support_phone) {
                    setSupportPhone(resp.support_phone);
                }
            } catch (error) {
                console.error("Error fetching settings in HelpPage:", error);
            }
        };
        fetchSettings();
    }, [isLoaded, getToken]);

  const tutorials = [
    {
      title: "Recharger votre portefeuille",
      description: "Apprenez comment ajouter des fonds à votre compte TikFlow via Mobile Money.",
      icon: Wallet,
      color: "bg-blue-100 text-blue-600",
      steps: [
        "Choisissez votre opérateur mobile (Flooz, TMoney, etc.).",
        "Suivez les instructions pour effectuer le transfert.",
        "Copiez l'ID de référence du SMS reçu.",
        "Déclarez le paiement dans l'application pour validation."
      ],
      link: "/dashboard/wallet"
    },
    {
      title: "Acheter des Coins TikTok",
      description: "Choisissez un pack ou personnalisez votre commande de coins.",
      icon: ShoppingBag,
      color: "bg-green-100 text-green-600",
      steps: [
        "Allez dans la section 'Acheter des coins'.",
        "Sélectionnez un pack ou entrez un montant personnalisé (min. 30 coins).",
        "Entrez vos identifiants TikTok ou utilisez votre compte lié.",
        "Validez avec votre solde TikFlow."
      ],
      link: "/dashboard/buy"
    },
    {
      title: "Lier votre compte TikTok",
      description: "Pour des commandes plus rapides et sécurisées, liez votre profil.",
      icon: AtSign,
      color: "bg-purple-100 text-purple-600",
      steps: [
        "Rendez-vous dans les 'Paramètres'.",
        "Entrez votre nom d'utilisateur et mot de passe TikTok.",
        "Une fois lié, vos futures commandes ne nécessiteront plus de saisie manuelle."
      ],
      link: "/dashboard/settings"
    },
    {
      title: "Suivre vos commandes",
      description: "Consultez l'état de vos recharges et achats de coins en temps réel.",
      icon: History,
      color: "bg-orange-100 text-orange-600",
      steps: [
        "Accédez à l'Historique des transactions.",
        "Vérifiez le statut : En attente, Complété ou Rejeté.",
        "Si l'admin demande un code Gmail, vous recevrez une notification."
      ],
      link: "/dashboard/history"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center size-16 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-200 mb-2">
          <BookOpen size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Centre d'Aide & Tutoriels</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
          Tout ce que vous devez savoir pour maîtriser TikFlow et booster votre présence TikTok.
        </p>
      </div>

      <section className="space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
          <Zap className="text-yellow-500 fill-yellow-500" size={24} />
          Démonstrations Vidéo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-video bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group cursor-not-allowed overflow-hidden">
            <div className="size-16 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
              <Play size={24} fill="currentColor" />
            </div>
            <p className="mt-4 text-sm font-black text-slate-400 uppercase tracking-widest">Vidéo en préparation...</p>
            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="relative aspect-video bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group cursor-not-allowed overflow-hidden">
             <div className="size-16 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
              <Play size={24} fill="currentColor" />
            </div>
            <p className="mt-4 text-sm font-black text-slate-400 uppercase tracking-widest">Guide mobile en approche...</p>
            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tutorials.map((tut, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50 border border-slate-50 hover:border-blue-100 transition-all flex flex-col">
            <div className="flex items-start gap-4 mb-6">
              <div className={`p-4 rounded-2xl ${tut.color} shrink-0`}>
                <tut.icon size={28} />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 leading-tight">{tut.title}</h4>
                <p className="text-sm text-slate-400 font-medium mt-1">{tut.description}</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {tut.steps.map((step, sIdx) => (
                <li key={sIdx} className="flex gap-3 text-sm font-medium text-slate-600 leading-relaxed">
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  {step}
                </li>
              ))}
            </ul>

            <Link 
              href={tut.link}
              className="mt-auto inline-flex items-center justify-center gap-2 py-4 bg-slate-50 hover:bg-blue-50 text-slate-900 hover:text-blue-600 rounded-2xl font-black transition-all group"
            >
              Aller à la page 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-[#1152d4] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        <div className="absolute right-0 bottom-0 size-64 bg-white/10 rounded-full blur-3xl -mb-32 -mr-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="size-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0">
             <ShieldCheck size={40} />
          </div>
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-2xl font-black">Besoin de plus d'assistance ?</h3>
            <p className="text-blue-100 font-medium">Notre équipe est disponible 24/7 pour vous accompagner par WhatsApp ou par téléphone.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={`https://wa.me/${supportPhone.replace(/\s+/g, '')}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
              <a 
                href={`tel:${supportPhone.replace(/\s+/g, '')}`} 
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Phone size={20} />
                Appeler
              </a>
          </div>
        </div>
      </div>
    </div>
  );
}
