"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { AtSign, CheckCircle2, Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner"; // Ou ton système de notification
import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@clerk/nextjs";
import { packagesApi } from "@/lib/api";
import { Package } from "@/types/api";
import { purchaseCoins, getUserProfileAction, fetchUserwalletBalance, payWithWalletAction } from "@/lib/actions/user.actions";

function CheckoutContent() {
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const packId = searchParams.get("packId");
  const amountCoinsParam = searchParams.get("amount_coins");

  const [pack, setPack] = useState<Package | null>(null);
  const [customAmount, setCustomAmount] = useState<{ coins: number, price: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'moneyfusion' | 'wallet'>('moneyfusion');
  const [formData, setFormData] = useState({
    tiktok_username: "",
    tiktok_password: "",
    phone: "",
    nomclient: "",
  });

  const [linkedAccount, setLinkedAccount] = useState<{ username: string } | null>(null);
  const [useLinked, setUseLinked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!packId && !amountCoinsParam) {
        toast.error("Veuillez sélectionner un montant");
        router.push("/dashboard/buy");
        return;
      }

      try {
        const token = await getToken();
        if (!token) return;
        
        // Parallel fetch for profile and pack (if needed)
        const profilePromise = getUserProfileAction();
        const balancePromise = fetchUserwalletBalance();
        let packPromise: Promise<any> = Promise.resolve(null);
        
        if (packId) {
            packPromise = packagesApi.getPackageById(token, packId);
        }

        const [packData, profileData, balanceData] = await Promise.all([
          packPromise,
          profilePromise,
          balancePromise
        ]);

        if (balanceData) {
            setWalletBalance(balanceData.balance || 0);
        }

        if (packId && packData) {
            setPack(packData);
        } else if (amountCoinsParam) {
            const coins = parseInt(amountCoinsParam);
            const COIN_RATE = 11.2;
            setCustomAmount({
                coins,
                price: coins * COIN_RATE
            });
        }
        
        if (profileData.success && profileData.data?.tiktok_username) {
          setLinkedAccount({
            username: profileData.data.tiktok_username
          });
        }
      } catch (error) {
        console.error("Failed to fetch checkout data:", error);
        toast.error("Impossible de charger les données");
        router.push("/dashboard/buy");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [packId, amountCoinsParam, getToken, router]);

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!useLinked && (!formData.tiktok_username || !formData.tiktok_password)) {
      return toast.error("Veuillez remplir l'adresse e-mail et le mot de passe TikTok");
    }

    setLoading(true);

    if (paymentMethod === 'wallet') {
      const result = await payWithWalletAction({
        packageId: packId || undefined,
        amount_coins: customAmount?.coins,
        tiktok_username: useLinked ? (linkedAccount?.username || "") : formData.tiktok_username,
        tiktok_password: useLinked ? "" : formData.tiktok_password,
      });

      if (result.success) {
        toast.success("Paiement réussi avec votre solde !");
        router.push("/dashboard/history");
      } else {
        toast.error(result.message || "Erreur lors du paiement avec le solde");
        setLoading(false);
      }
    } else {
      if (!formData.phone || !formData.nomclient) {
        setLoading(false);
        return toast.error("Veuillez remplir le numéro Mobile Money et votre nom");
      }

      const result = await purchaseCoins({
        amount: orderPrice,
        phone: formData.phone,
        nomclient: formData.nomclient,
        packageId: packId || undefined,
        amount_coins: customAmount?.coins,
        tiktok_username: useLinked ? (linkedAccount?.username || "") : formData.tiktok_username,
        tiktok_password: useLinked ? "" : formData.tiktok_password,
        useLinkedAccount: useLinked
      });

      if (result.success && result.data?.paymentUrl) {
        toast.success("Redirection vers MoneyFusion...");
        window.location.href = result.data.paymentUrl;
      } else {
        toast.error(result.message || "Erreur lors de l'achat");
        setLoading(false);
      }
    }
  };

  if (fetchingData) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#1152d4]" size={48} />
        <p className="text-gray-500 font-medium">Récupération des détails...</p>
      </div>
    );
  }

  const orderCoins = pack?.coins || customAmount?.coins || 0;
  const orderPrice = pack?.price_cfa || customAmount?.price || 0;
  const orderName = pack?.name || "Achat Personnalisé";

  if (!pack && !customAmount) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLONNE GAUCHE: Résumé Dynamique */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Résumé de la commande</h3>
            <div className="flex gap-5 mb-8">
              <div className="size-20 shrink-0 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl">🪙</div>
              <div className="flex flex-col justify-center">
                <p className="text-2xl font-black text-slate-900">{orderCoins.toLocaleString()} Coins</p>
                <p className="text-sm text-slate-400 font-medium">{orderName}</p>
              </div>
            </div>
            <div className="space-y-3 border-t pt-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-900 font-black text-lg">Total à payer</span>
                <span className="text-[#1152d4] font-black text-3xl">{orderPrice.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE: Formulaire */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-10">
            <form className="space-y-8" onSubmit={handlePayment}>
              {/* Option Compte Lié */}
              {linkedAccount && (
                <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <AtSign size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Utiliser mon compte @{linkedAccount.username}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Recharge plus rapide via votre compte lié.</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setUseLinked(!useLinked)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${useLinked ? 'bg-[#1152d4]' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useLinked ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              )}

              {/* Méthodes de Paiement */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Mode de paiement</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option Wallet */}
                  <div 
                    onClick={() => {
                      if (walletBalance >= orderPrice) setPaymentMethod('wallet');
                    }}
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      walletBalance < orderPrice 
                        ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50' 
                        : paymentMethod === 'wallet' 
                          ? 'border-[#1152d4] bg-blue-50/30' 
                          : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-900">Solde TikFlow</span>
                      <div className={`size-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-[#1152d4]' : 'border-slate-300'}`}>
                        {paymentMethod === 'wallet' && <div className="size-2.5 rounded-full bg-[#1152d4]" />}
                      </div>
                    </div>
                    <p className="text-xl font-black text-[#1152d4]">{walletBalance.toLocaleString()} CFA</p>
                    {walletBalance < orderPrice && (
                      <p className="text-[10px] text-red-500 font-bold mt-2 bg-red-50 px-2 py-1 rounded-md inline-block">Solde insuffisant</p>
                    )}
                  </div>

                  {/* Option MoneyFusion */}
                  <div 
                    onClick={() => setPaymentMethod('moneyfusion')}
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'moneyfusion' 
                        ? 'border-[#1152d4] bg-blue-50/30' 
                        : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-900">Mobile Money</span>
                      <div className={`size-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'moneyfusion' ? 'border-[#1152d4]' : 'border-slate-300'}`}>
                        {paymentMethod === 'moneyfusion' && <div className="size-2.5 rounded-full bg-[#1152d4]" />}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 mt-1">Wave, Orange, MTN, Moov...</p>
                  </div>
                </div>
              </div>

              {/* Champs de facturation MoneyFusion (Affichés uniquement si Mobile Money choisi) */}
              {paymentMethod === 'moneyfusion' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Numéro WhatsApp</label>
                    <p className="text-[10px] text-slate-400 font-bold ml-1 mb-2">Numéro WhatsApp sur lequel vous êtes en ligne (avec indicatif)</p>
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: +228 90000000"
                      className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Jean Dupont"
                      className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400"
                      value={formData.nomclient}
                      onChange={(e) => setFormData({...formData, nomclient: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* Adresse e-mail TikTok */}
              <div className={`space-y-5 transition-all duration-300 ${useLinked ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Adresse e-mail du compte TikTok</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      required={!useLinked}
                      disabled={useLinked}
                      type="email" 
                      placeholder="exemple@gmail.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400"
                      value={formData.tiktok_username}
                      onChange={(e) => setFormData({...formData, tiktok_username: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe du compte TikTok</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      required={!useLinked}
                      disabled={useLinked}
                      type="password" 
                      placeholder="Votre mot de passe TikTok"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400"
                      value={formData.tiktok_password}
                      onChange={(e) => setFormData({...formData, tiktok_password: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full py-5 bg-[#1152d4] text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 text-lg uppercase disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                {loading ? "Traitement..." : "Confirmer le paiement"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}