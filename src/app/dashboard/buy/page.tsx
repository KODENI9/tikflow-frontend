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
  return { icon: Crown, color: "from-slate-800 to-black" };
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
          <h1 className="text-2xl font-black text-gray-900">
            Acheter des Coins
          </h1>
          <p className="text-gray-500 text-sm">
            Sélectionnez un pack TikTok pour recharger votre compte.
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm w-full focus:ring-2 focus:ring-[#1152d4]/50"
              placeholder="Chercher un montant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-[#1152d4]" size={48} />
          <p className="text-gray-500 font-medium">Chargement des packs...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
          <p className="text-gray-400">Aucun pack disponible pour le moment.</p>
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
                className={`group relative bg-white rounded-3xl p-6 border-2 transition-all duration-300 hover:-translate-y-2 ${
                  styles.featured
                    ? "border-[#1152d4] shadow-xl shadow-blue-100"
                    : "border-gray-100 hover:border-[#1152d4]/30 shadow-sm"
                }`}
              >
                {/* Badges */}
                {styles.badge && (
                  <span
                    className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-[10px] font-black text-white ${
                      styles.featured ? "bg-[#1152d4]" : "bg-red-500"
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
                    <h3 className="text-4xl font-black text-gray-900">
                      {pkg.coins.toLocaleString()}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {pkg.name || "Coins TikTok"}
                    </p>
                  </div>

                  {/* Détails Prix */}
                  <div className="w-full pt-4 border-t border-gray-50 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Prix unitaire</span>
                      <span className="font-bold text-gray-600">
                        {unitPrice} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-2xl font-black ${
                          styles.featured ? "text-[#1152d4]" : "text-gray-900"
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
                          ? "bg-[#1152d4] text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                          : "bg-gray-900 text-white hover:bg-gray-800"
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
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 items-center">
        <div className="p-3 bg-white rounded-xl text-[#1152d4] shadow-sm">
          <Info size={24} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm">
            Livraison instantanée
          </h4>
          <p className="text-xs text-gray-600">
            Les coins sont crédités sur votre compte TikTok immédiatement après
            le paiement.
          </p>
        </div>
      </div>
    </div>
  );
}
