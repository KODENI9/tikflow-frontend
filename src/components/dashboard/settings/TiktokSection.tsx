"use client";
import { useState, useEffect } from "react";
import { AtSign, Trash2, PlusCircle, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { linkTiktokAccountAction, getUserProfileAction } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function TiktokSection() {
  const { user } = useUser();
  const [tiktokAccount, setTiktokAccount] = useState<{username: string, password: string} | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [tiktokForm, setTiktokForm] = useState({ username: "", password: "" });
  const [linking, setLinking] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        const res = await getUserProfileAction();
        if (res.success && res.data) {
          if (res.data.tiktok_username) {
            setTiktokAccount({
              username: res.data.tiktok_username,
              password: res.data.tiktok_password || ""
            });
          }
        }
      };
      loadProfile();
    }
  }, [user]);

  const handleLinkTiktok = async () => {
    if (!tiktokForm.username || !tiktokForm.password) {
      return toast.error("Veuillez remplir tous les champs");
    }

    setLinking(true);
    const result = await linkTiktokAccountAction(tiktokForm.username, tiktokForm.password);

    if (result.success) {
      setTiktokAccount({ ...tiktokForm });
      setShowLinkModal(false);
      setTiktokForm({ username: "", password: "" });
      toast.success("Compte TikTok lié avec succès !");
    } else {
      toast.error(result.error || "Erreur lors de la liaison");
    }
    setLinking(false);
  };

  return (
    <section className="bg-card-bg rounded-3xl border border-glass-border shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-foreground uppercase text-xs tracking-widest">Compte TikTok</h3>
        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${tiktokAccount ? 'bg-green-500/10 text-green-500' : 'bg-foreground/5 text-tikflow-slate'}`}>
        {tiktokAccount ? 'LIÉ' : 'NON LIÉ'}
        </span>
    </div>
    
    <div className="space-y-3">
        {tiktokAccount ? (
        <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl border border-glass-border">
            <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-foreground text-background flex items-center justify-center">
                <AtSign size={20} />
            </div>
            <div>
                <p className="text-sm font-black text-foreground">@{tiktokAccount.username}</p>
                <p className="text-[10px] text-tikflow-slate font-bold uppercase">Compte Par Défaut</p>
            </div>
            </div>
            <button 
            onClick={() => setTiktokAccount(null)}
            className="p-2 text-tikflow-slate/50 hover:text-tikflow-accent transition-colors"
            >
            <Trash2 size={18} />
            </button>
        </div>
        ) : (
        <button 
            onClick={() => setShowLinkModal(true)}
            className="w-full py-4 border-2 border-dashed border-glass-border rounded-2xl text-tikflow-slate hover:border-tikflow-primary hover:text-tikflow-primary transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-tighter"
        >
            <PlusCircle size={18} /> Lier un compte
        </button>
        )}
    </div>

    {/* Modal de liaison TikTok */}
    {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="bg-card-bg rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl border border-glass-border animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-foreground mb-2">Lier mon TikTok</h3>
            <p className="text-sm text-tikflow-slate mb-6">Enregistrez vos accès pour commander plus vite.</p>
            
            <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-[10px] font-black text-tikflow-slate uppercase ml-1">Username TikTok</label>
                <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-tikflow-slate/50" size={18} />
                <input 
                    type="text" 
                    placeholder="@votre_nom"
                    className="w-full pl-11 pr-4 py-3 bg-foreground/5 border border-glass-border rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-tikflow-primary/20"
                    value={tiktokForm.username}
                    onChange={(e) => setTiktokForm({...tiktokForm, username: e.target.value})}
                />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-tikflow-slate uppercase ml-1">Mot de passe TikTok</label>
                <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-tikflow-slate/50" size={18} />
                <input 
                    type={showPass ? "text" : "password"} 
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-foreground/5 border border-glass-border rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-tikflow-primary/20"
                    value={tiktokForm.password}
                    onChange={(e) => setTiktokForm({...tiktokForm, password: e.target.value})}
                />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-tikflow-slate/50 hover:text-foreground">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button 
                onClick={() => setShowLinkModal(false)}
                className="flex-1 py-4 bg-foreground/5 text-tikflow-slate rounded-2xl text-sm font-black uppercase hover:bg-foreground/10 transition-colors"
                >
                Annuler
                </button>
                <button 
                onClick={handleLinkTiktok}
                disabled={linking}
                className="flex-1 py-4 bg-tikflow-primary text-white rounded-2xl text-sm font-black uppercase flex items-center justify-center hover:bg-tikflow-primary/90 transition-colors"
                >
                {linking ? <Loader2 className="animate-spin" size={18} /> : "Lier le compte"}
                </button>
            </div>
            </div>
        </div>
        </div>
    )}
    </section>
  );
}
