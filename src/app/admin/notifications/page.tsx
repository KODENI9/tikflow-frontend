"use client";

import { useState, useEffect } from "react";
import { Send, Bell, Link as LinkIcon, Users, Image as ImageIcon, ChevronDown, Check, Search } from "lucide-react";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

export default function AdminNotificationsPage() {
  const { getToken } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [targetUserId, setTargetUserId] = useState("all");
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(user => 
    (user.fullname || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, [getToken]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      toast.error("Le titre et le message sont obligatoires.");
      return;
    }

    setIsSending(true);
    try {
      const token = await getToken();
      
      const payload = {
        title,
        body,
        url: url || "/",
        targetUserId
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/push/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success(data.message || "Notification envoyée avec succès !");
        setTitle("");
        setBody("");
        setUrl("");
      } else {
        toast.error(data.message || "Erreur lors de l'envoi.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur serveur lors de l'envoi.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase text-foreground flex items-center gap-3">
          <Bell className="text-tikflow-primary" size={32} />
          Notifications Push
        </h1>
        <p className="text-sm font-medium text-tikflow-slate mt-2">
          Envoyez des notifications natives aux téléphones de vos utilisateurs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2">
          <div className="bg-card-bg border border-glass-border rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-foreground">Nouvelle Notification</h2>
            
            <form onSubmit={handleSend} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-tikflow-slate flex items-center gap-2">
                  <Users size={14} /> Destinataires
                </label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between bg-background border border-glass-border rounded-xl p-3 text-sm text-foreground hover:border-tikflow-primary/50 focus:border-tikflow-primary outline-none transition-all shadow-sm"
                  >
                    <span className="truncate font-medium text-left">
                      {targetUserId === "all" 
                        ? "Tous les utilisateurs (Broadcast)" 
                        : (() => {
                            const user = users.find(u => (u.id || u.uid) === targetUserId);
                            return user ? `${user.fullname || 'Utilisateur inconnu'} (${user.email || ''})` : "Utilisateur sélectionné";
                          })()
                      }
                    </span>
                    <ChevronDown size={16} className={`text-tikflow-slate transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-[#0C162D] border border-glass-border rounded-xl shadow-2xl max-h-64 overflow-hidden flex flex-col backdrop-blur-md">
                      <div className="p-2 border-b border-glass-border sticky top-0 bg-[#080F20]/95 z-10 flex items-center gap-2">
                        <Search size={14} className="text-tikflow-slate ml-2 shrink-0" />
                        <input 
                          type="text" 
                          placeholder="Rechercher un utilisateur..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-transparent border-none text-sm text-foreground outline-none p-1.5 placeholder:text-tikflow-slate"
                          autoFocus
                        />
                      </div>
                      <div className="overflow-y-auto p-1.5 flex-1 custom-scrollbar">
                        <button
                          type="button"
                          onClick={() => { setTargetUserId("all"); setIsDropdownOpen(false); setSearchQuery(""); }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between transition-colors ${targetUserId === "all" ? 'bg-tikflow-primary/10 text-tikflow-primary font-bold' : 'text-foreground hover:bg-white/5'}`}
                        >
                          <span className="truncate">Tous les utilisateurs (Broadcast)</span>
                          {targetUserId === "all" && <Check size={14} className="shrink-0" />}
                        </button>
                        
                        <div className="h-px bg-glass-border my-1.5 mx-2"></div>
                        
                        {filteredUsers.length === 0 ? (
                          <div className="p-4 text-center text-sm text-tikflow-slate italic">Aucun utilisateur trouvé</div>
                        ) : (
                          filteredUsers.map(user => {
                            const uid = user.id || user.uid;
                            const isSelected = targetUserId === uid;
                            return (
                              <button
                                key={uid}
                                type="button"
                                onClick={() => { setTargetUserId(uid); setIsDropdownOpen(false); setSearchQuery(""); }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between transition-colors ${isSelected ? 'bg-tikflow-primary/10 text-tikflow-primary font-bold' : 'text-foreground hover:bg-white/5'}`}
                              >
                                <span className="truncate pr-2">
                                  {user.fullname || user.email || 'Utilisateur inconnu'} {user.email ? <span className="opacity-50 text-xs ml-1 font-normal">({user.email})</span> : ''}
                                </span>
                                {isSelected && <Check size={14} className="shrink-0" />}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-tikflow-slate mt-1">
                  Sélectionnez un utilisateur spécifique ou envoyez à tout le monde.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-tikflow-slate flex items-center gap-2">
                  <Bell size={14} /> Titre
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Votre commande est prête 📦"
                  className="w-full bg-background border border-glass-border rounded-xl p-3 text-sm text-foreground focus:border-tikflow-primary outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-tikflow-slate flex items-center gap-2">
                  <Bell size={14} /> Message
                </label>
                <textarea 
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Ex: Votre commande vient d'être préparée et sera bientôt livrée sur votre compte TikTok."
                  className="w-full bg-background border border-glass-border rounded-xl p-3 text-sm text-foreground focus:border-tikflow-primary outline-none transition-all min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-tikflow-slate flex items-center gap-2">
                  <LinkIcon size={14} /> Action au clic (URL)
                </label>
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Ex: /dashboard/orders"
                  className="w-full bg-background border border-glass-border rounded-xl p-3 text-sm text-foreground focus:border-tikflow-primary outline-none transition-all"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSending}
                className="w-full bg-tikflow-primary text-white py-3 rounded-xl font-black uppercase text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 mt-4 shadow-lg shadow-tikflow-primary/20"
              >
                {isSending ? (
                  <span className="animate-pulse">Envoi en cours...</span>
                ) : (
                  <>
                    <Send size={18} />
                    Envoyer la notification
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Aperçu */}
        <div>
          <div className="bg-card-bg border border-glass-border rounded-3xl p-6 shadow-sm sticky top-6">
            <h2 className="text-sm font-bold uppercase text-tikflow-slate mb-6">Aperçu mobile</h2>
            
            <div className="bg-[#0f172a] rounded-2xl p-4 shadow-2xl border border-glass-border relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="size-10 bg-tikflow-primary rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg">
                  <span className="font-bold">TF</span>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{title || "Titre de la notification"}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">À l'instant</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {body || "Ceci est un aperçu du message tel qu'il apparaîtra sur l'écran verrouillé de l'utilisateur."}
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
