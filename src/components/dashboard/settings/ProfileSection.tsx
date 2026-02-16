"use client";
import { useState, useEffect } from "react";
import { User, Phone,  Camera, Loader2, CheckCircle2 } from "lucide-react";
import { updatePhoneNumberAction, getUserProfileAction } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";

export default function ProfileSection() {
  const { user } = useUser();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setPhone(user.primaryPhoneNumber?.phoneNumber || "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    const result = await updatePhoneNumberAction(phone);

    if (result.success) {
      setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
      await user?.update({ unsafeMetadata: { phone_number: phone } });
    } else {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour." });
    }
    setLoading(false);
  };

  return (
    <section className="bg-card-bg rounded-3xl border border-glass-border shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-tikflow-primary to-indigo-500"></div>
        <div className="px-6 pb-6 -mt-12">
            <div className="relative flex justify-center mb-4">
            <div 
                className="size-24 rounded-3xl border-4 border-card-bg bg-foreground/5 bg-cover bg-center shadow-xl"
                style={{ backgroundImage: `url(${user?.imageUrl})` }}
            >
                <button className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-tikflow-primary text-white border-4 border-card-bg hover:scale-110 transition-transform shadow-lg">
                <Camera size={16} />
                </button>
            </div>
            </div>
            
            <div className="text-center mb-8">
            <h3 className="text-xl font-black text-foreground">{user?.fullName}</h3>
            <p className="text-xs font-bold text-tikflow-slate uppercase tracking-widest">Membre depuis {new Date(user?.createdAt!).toLocaleDateString('fr-FR', {month: 'short', year: 'numeric'})}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase">
                <CheckCircle2 size={12} /> Compte Vérifié
            </div>
            </div>

            <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-[10px] font-black text-tikflow-slate uppercase ml-1">Nom Complet</label>
                <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-tikflow-slate/50" size={18} />
                <input 
                    type="text" 
                    readOnly 
                    defaultValue={user?.fullName || ""} 
                    className="w-full pl-10 pr-4 py-3 bg-foreground/5 border-none rounded-2xl text-sm font-bold text-tikflow-slate/70 cursor-not-allowed" 
                />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black text-tikflow-slate uppercase ml-1">Numéro de Téléphone</label>
                <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-tikflow-slate/50" size={18} />
                <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+221..."
                    className="w-full pl-10 pr-4 py-3 bg-foreground/5 border-none rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-tikflow-primary/20" 
                />
                </div>
            </div>

            {message.text && (
                <p className={`text-center text-[10px] font-black uppercase ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {message.text}
                </p>
            )}

            <button 
                onClick={handleUpdateProfile}
                disabled={loading}
                className="w-full py-4 bg-foreground hover:bg-foreground/90 text-background text-sm font-black rounded-2xl transition-all shadow-lg shadow-tikflow-primary/5 uppercase tracking-tight flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Mettre à jour le profil"}
            </button>
            </div>
        </div>
    </section>
  );
}
