"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Star,
  Flame,
  Diamond,
  Rocket,
  Crown,
  Search,
  Info,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { packagesApi } from "@/lib/api";
import { Package } from "@/types/api";
import { toast } from "sonner";

// 1. Helper pour les styles visuels basés sur le nombre de coins
const getPackageStyles = (coins: number) => {
  if (coins <= 100)
    return { icon: Star, color: "from-yellow-300 to-yellow-500" };
  if (coins <= 500)
    return {
      icon: Star,
      color: "from-yellow-300 to-yellow-500",
      badge: "POPULAIRE",
    };
  if (coins <= 1000)
    return {
      icon: Flame,
      color: "from-orange-400 to-yellow-500",
      badge: "MEILLEURE VENTE",
      featured: true,
    };
  if (coins <= 2000)
    return { icon: Diamond, color: "from-blue-400 to-blue-600" };
  if (coins <= 5000)
    return { icon: Rocket, color: "from-purple-500 to-indigo-600" };
  return { icon: Crown, color: "from-slate-800 to-slate-950" };
};

export default function BuyCoinsPage() {
  const { getToken } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const data = await packagesApi.getPackages(token);
        // On ne garde que les packs actifs
        setPackages(data.filter((p) => p.active));
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        toast.error("Impossible de charger les packs de coins");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [getToken]);

  const filteredPackages = packages.filter((pkg) =>
    pkg.coins.toString().includes(search) ||
    pkg.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header de la Marketplace */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-foreground">
            Acheter des Coins
          </h1>
          <p className="text-tikflow-slate text-sm">
            Sélectionnez un pack TikTok pour recharger votre compte.
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-tikflow-slate"
              size={18}
            />
            <input
              className="pl-10 pr-4 py-2.5 bg-card-bg border border-glass-border rounded-xl text-sm w-full focus:ring-2 focus:ring-tikflow-primary/50 text-foreground"
              placeholder="Chercher un montant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-tikflow-primary" size={48} />
          <p className="text-tikflow-slate font-medium">Chargement des packs...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="bg-card-bg rounded-3xl p-12 text-center border-2 border-dashed border-glass-border">
          <p className="text-tikflow-slate">Aucun pack disponible pour le moment.</p>
        </div>
      ) : (
        /* Grille des Packs */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const styles = getPackageStyles(pkg.coins);
            const Icon = styles.icon;
            const unitPrice = (pkg.price_cfa / pkg.coins).toFixed(1);

            return (
              <div
                key={pkg.id}
                className={`group relative bg-card-bg rounded-3xl p-6 border-2 transition-all duration-300 hover:-translate-y-2 ${
                  styles.featured
                    ? "border-tikflow-primary shadow-xl shadow-tikflow-primary/10"
                    : "border-glass-border hover:border-tikflow-primary/30 shadow-sm"
                }`}
              >
                {/* Badges */}
                {styles.badge && (
                  <span
                    className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-[10px] font-black text-white ${
                      styles.featured ? "bg-tikflow-primary" : "bg-tikflow-accent"
                    }`}
                  >
                    {styles.badge}
                  </span>
                )}

                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icône Dynamique */}
                  <div
                    className={`size-20 rounded-full bg-gradient-to-br ${styles.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={36} />
                  </div>

                  <div>
                    <h3 className="text-4xl font-black text-foreground">
                      {pkg.coins.toLocaleString()}
                    </h3>
                    <p className="text-xs font-bold text-tikflow-slate uppercase tracking-widest">
                      {pkg.name || "Coins TikTok"}
                    </p>
                  </div>

                  {/* Détails Prix */}
                  <div className="w-full pt-4 border-t border-glass-border space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-tikflow-slate">Prix unitaire</span>
                      <span className="font-bold text-tikflow-slate">
                        {unitPrice} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-2xl font-black ${
                          styles.featured ? "text-tikflow-primary" : "text-foreground"
                        }`}
                      >
                        {pkg.price_cfa.toLocaleString()} FCFA
                      </span>
                    </div>
                    {/* Bouton d'Achat */}
                    <Link
                      href={`/dashboard/buy/checkout?packId=${pkg.id}`}
                      className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                        styles.featured
                          ? "bg-tikflow-primary text-white shadow-lg shadow-tikflow-primary/20 hover:bg-tikflow-primary/90"
                          : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
                    >
                      <ShoppingCart size={18} />
                      Acheter
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* CARTE CUSTOM */}
          <CustomPackageCard />
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-tikflow-primary/5 border border-tikflow-primary/10 rounded-2xl p-6 flex gap-4 items-center">
        <div className="p-3 bg-card-bg rounded-xl text-tikflow-primary shadow-sm">
          <div className="flex items-center justify-center bg-tikflow-primary text-white p-2 rounded-lg">
            <Info size={24} />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">
            Livraison instantanée
          </h4>
          <p className="text-xs text-tikflow-slate">
            Les coins sont crédités sur votre compte TikTok immédiatement après
            le paiement.
          </p>
        </div>
      </div>
    </div>
  );
}

function CustomPackageCard() {
  const [customCoins, setCustomCoins] = useState<number | "">("");
  const COIN_RATE = 10;
  const MIN_COINS = 30;

  const coins = typeof customCoins === "number" ? customCoins : 0;
  const price = coins * COIN_RATE;
  const isValid = coins >= MIN_COINS;

  return (
    <div className="group relative bg-card-bg rounded-3xl p-6 border-2 border-dashed border-glass-border transition-all duration-300 hover:border-tikflow-primary/50 shadow-sm">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icône Custom */}
        <div className="size-20 rounded-full bg-foreground/5 flex items-center justify-center text-tikflow-slate shadow-inner group-hover:scale-110 transition-transform">
          <Diamond size={36} />
        </div>

        <div>
          <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
            Montant Personnalisé
          </h3>
          <p className="text-[10px] font-bold text-tikflow-slate uppercase tracking-widest">
            À partir de {MIN_COINS} coins
          </p>
        </div>

        <div className="w-full space-y-3 pt-2">
            <div className="relative">
                <input 
                    type="number"
                    placeholder="Ex: 50"
                    className="w-full py-3 px-4 bg-foreground/5 border-2 border-glass-border rounded-2xl text-center font-black text-2xl focus:border-tikflow-primary focus:ring-0 transition-all text-foreground"
                    value={customCoins}
                    onChange={(e) => {
                        const val = e.target.value === "" ? "" : parseInt(e.target.value);
                        setCustomCoins(val);
                    }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-tikflow-slate">COINS</span>
            </div>

            {isValid && (
                <div className="flex justify-between items-center px-2 animate-in fade-in slide-in-from-top-1">
                    <span className="text-xs font-bold text-tikflow-slate italic">Total estimé</span>
                    <span className="text-lg font-black text-tikflow-primary">{price.toLocaleString()} FCFA</span>
                </div>
            )}
        </div>

        {/* Bouton d'Achat */}
        <div className="w-full pt-4 border-t border-glass-border">
            <Link
                href={isValid ? `/dashboard/buy/checkout?amount_coins=${coins}` : "#"}
                onClick={(e) => !isValid && e.preventDefault()}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isValid 
                    ? "bg-foreground text-background hover:bg-foreground/90 shadow-lg" 
                    : "bg-foreground/5 text-tikflow-slate cursor-not-allowed"
                }`}
            >
                <ShoppingCart size={18} />
                Acheter
            </Link>
        </div>
      </div>
    </div>
  );
}
