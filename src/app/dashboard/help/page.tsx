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
    const [supportPhone, setSupportPhone] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const resp = await recipientsApi.getGlobalSettings();
                if (resp?.support_phone) {
                    setSupportPhone(resp.support_phone);
                }
            } catch (error) {
                console.error("Error fetching settings in HelpPage:", error);
            }
        };
        fetchSettings();
    }, []);

  const tutorials = [
    {
      title: "Recharger votre portefeuille",
      description: "Apprenez comment ajouter des fonds à votre compte TikFlow via Mobile Money.",
      icon: Wallet,
      color: "bg-blue-500/10 text-tikflow-primary",
      videoId: "71RhzQ0XtFI",
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
      color: "bg-orange-500/10 text-tikflow-secondary",
      videoId: "vlopukYCJaA",
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
      color: "bg-purple-500/10 text-purple-600",
      videoId: "Mdx4JMHsbPg",
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
      color: "bg-emerald-500/10 text-emerald-600",
      videoId: "TA_BeXfTxmw",
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
        <div className="inline-flex items-center justify-center size-16 rounded-3xl bg-tikflow-primary text-white shadow-xl shadow-tikflow-primary/20 mb-2">
          <BookOpen size={32} />
        </div>
        <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">Centre d'Aide & Tutoriels</h1>
        <p className="text-tikflow-slate text-lg max-w-2xl mx-auto font-bold italic">
          Tout ce que vous devez savoir pour maîtriser TikFlow et booster votre présence TikTok.
        </p>
      </div>

      {/* Hero Video Section */}
      <section className="bg-card-bg border border-glass-border rounded-[3rem] p-8 md:p-12 overflow-hidden shadow-sm relative group">
          <div className="absolute top-0 right-0 p-8 text-tikflow-primary/10 group-hover:text-tikflow-primary/20 transition-colors">
              <Zap size={120} strokeWidth={3} />
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 space-y-6 text-center lg:text-left">
                  <span className="px-4 py-2 rounded-full bg-tikflow-secondary/10 text-tikflow-secondary text-[11px] font-black uppercase tracking-widest">Nouveau contenu</span>
                  <h2 className="text-3xl md:text-4xl font-black text-foreground uppercase leading-tight">
                      Découvrez <span className="text-tikflow-primary">TikFlow</span> en 2 minutes.
                  </h2>
                  <p className="text-tikflow-slate font-bold leading-relaxed italic">
                      Visionnez notre vidéo d'introduction pour comprendre comment TikFlow révolutionne l'achat de coins TikTok en Afrique. Simple, rapide et 100% sécurisé.
                  </p>
              </div>
              <div className="w-full lg:w-[480px] aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/5 bg-tikflow-black">
                  <iframe 
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/YKjhoQclNHI" 
                      title="Intro de TikFlow"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                  ></iframe>
              </div>
          </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {tutorials.map((tut, idx) => (
          <div key={idx} className="bg-card-bg rounded-[2.5rem] overflow-hidden shadow-sm border border-glass-border hover:border-tikflow-primary/30 transition-all flex flex-col group/card">
            {/* Video Player on Card */}
            <div className="aspect-video bg-tikflow-black w-full relative">
                <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${tut.videoId}`} 
                    title={tut.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            </div>

            <div className="p-8 flex flex-col flex-1">
                <div className="flex items-start gap-4 mb-6">
                    <div className={`p-4 rounded-2xl ${tut.color} shrink-0`}>
                        <tut.icon size={28} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-foreground leading-tight uppercase tracking-tight">{tut.title}</h4>
                        <p className="text-sm text-tikflow-slate font-bold italic mt-1">{tut.description}</p>
                    </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                    {tut.steps.map((step, sIdx) => (
                        <li key={sIdx} className="flex gap-3 text-sm font-bold text-tikflow-slate leading-relaxed">
                            <CheckCircle2 size={18} className="text-tikflow-primary shrink-0 mt-0.5" />
                            {step}
                        </li>
                    ))}
                </ul>

                <Link 
                    href={tut.link}
                    className="mt-auto inline-flex items-center justify-center gap-2 py-4 bg-foreground/[0.03] dark:bg-white/[0.03] hover:bg-tikflow-primary text-foreground hover:text-white rounded-2xl font-black transition-all group"
                >
                    Aller à la page 
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-tikflow-primary rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-tikflow-primary/20">
        <div className="absolute right-0 bottom-0 size-64 bg-white/10 rounded-full blur-3xl -mb-32 -mr-32"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
          <div className="size-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0">
             <ShieldCheck size={40} />
          </div>
          <div className="text-center lg:text-left space-y-2 flex-1">
            <h3 className="text-2xl font-black uppercase tracking-tight">Besoin de plus d'assistance ?</h3>
            <p className="text-blue-100 font-bold italic">Notre équipe est disponible 24/7 pour vous accompagner par WhatsApp ou par téléphone.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a 
                href={`https://wa.me/${supportPhone.replace(/\s+/g, '')}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-600 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
              <a 
                href={`tel:${supportPhone.replace(/\s+/g, '')}`} 
                className="px-8 py-4 bg-white text-tikflow-primary rounded-2xl font-black shadow-lg hover:bg-blue-50 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
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
