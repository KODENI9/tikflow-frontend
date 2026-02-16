"use client";

import { useEffect, useState, useMemo } from "react";
import { adminApi } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { 
  Users, 
  Wallet, 
  PlusCircle, 
  Search, 
  ShieldCheck, 
  User as UserIcon,
  RefreshCcw,
  Phone,
  Mail,
  Send,
  BellRing,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminUsers() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [notifForm, setNotifForm] = useState({ title: "", message: "" });
  const [sending, setSending] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = await adminApi.getUsers(token!);
      // On s'assure de stocker un tableau
      setUsers(data || []);
    } catch (e: any) {
      toast.error("Erreur de chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filtrage dynamique
  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone_number?.includes(searchTerm)
    );
  }, [searchTerm, users]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleAdjustBalance = async (uid: string, name: string) => {
    const amountStr = prompt(`Ajouter ou retirer un montant pour ${name} (ex: 500 ou -500) :`);
    if (!amountStr || isNaN(Number(amountStr))) return;

    const reason = prompt("Raison de l'ajustement (optionnel) :") || "Ajustement Admin";

    try {
      const token = await getToken();
      await adminApi.adjustBalance(token!, uid, Number(amountStr));
      toast.success(`Le solde de ${name} a été mis à jour.`);
      loadUsers(); // Rafraîchir la liste
    } catch (e: any) {
      toast.error("Échec de l'ajustement");
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !notifForm.title || !notifForm.message) return;

    try {
      setSending(true);
      const token = await getToken();
      await adminApi.sendNotification(token!, selectedUser.id, notifForm.title, notifForm.message);
      toast.success(`Notification envoyée à ${selectedUser.fullname}`);
      setShowNotifyModal(false);
      setNotifForm({ title: "", message: "" });
    } catch (error) {
      toast.error("Échec de l'envoi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase flex items-center gap-2 text-foreground">
            <Users className="text-tikflow-primary" size={28} /> Gestion de la Clientèle
          </h1>
          <p className="text-tikflow-slate text-sm font-medium">Contrôlez les comptes et les balances wallets</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tikflow-slate group-focus-within:text-tikflow-primary transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-card-bg border border-glass-border rounded-2xl text-sm font-bold w-full md:w-[300px] shadow-sm focus:ring-4 ring-tikflow-primary/10 focus:border-tikflow-primary transition-all outline-none text-foreground placeholder-tikflow-slate"
            />
          </div>
          <button 
            onClick={loadUsers}
            className="p-3 bg-card-bg border border-glass-border rounded-2xl hover:bg-foreground/5 transition-all shadow-sm text-tikflow-slate"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card-bg rounded-[2.5rem] border border-glass-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/5 border-b border-glass-border">
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate">Utilisateur</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate">Contact</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate">Rôle & Statut</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate">Solde Wallet</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-foreground/[0.02] transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-tikflow-primary/20 to-tikflow-accent/20 flex items-center justify-center text-tikflow-primary font-black text-lg shadow-inner border border-tikflow-primary/10 group-hover:scale-105 transition-transform duration-300">
                          {user.fullname?.charAt(0) || "U"}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card-bg ${
                          user.status === 'active' ? 'bg-green-500' : 'bg-tikflow-accent'
                        }`} />
                      </div>
                      <div>
                        <div className="font-black text-foreground text-sm tracking-tight">{user.fullname}</div>
                        <div className="text-[10px] font-mono text-tikflow-slate uppercase tracking-widest opacity-60">ID: {user.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 text-xs text-foreground font-bold bg-foreground/[0.03] px-3 py-1.5 rounded-xl w-fit border border-glass-border">
                        <Mail size={13} className="text-tikflow-primary" /> {user.email}
                      </div>
                      {user.phone_number && (
                        <div className="flex items-center gap-2.5 text-[11px] text-tikflow-slate font-bold px-3">
                          <Phone size={11} /> {user.phone_number}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-2">
                      {user.role === 'admin' ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase bg-tikflow-primary/10 text-tikflow-primary px-3 py-1.5 rounded-full w-fit border border-tikflow-primary/20">
                          <ShieldCheck size={11} /> Administrateur
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase bg-foreground/5 text-tikflow-slate px-3 py-1.5 rounded-full w-fit border border-glass-border">
                          <UserIcon size={11} /> Client
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2.5 bg-foreground text-background px-5 py-2.5 rounded-2xl w-fit shadow-lg shadow-black/10 border border-white/10">
                      <Wallet size={16} className="text-tikflow-primary" />
                      <span className="font-black text-base tabular-nums">{(user.balance || 0).toLocaleString()} F</span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowNotifyModal(true);
                        }}
                        className="p-3 bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all active:scale-90 shadow-sm border border-blue-500/10"
                        title="Envoyer une notification"
                      >
                        <BellRing size={20} />
                      </button>
                      <button 
                        onClick={() => handleAdjustBalance(user.id, user.fullname)}
                        className="p-3 bg-foreground/5 text-tikflow-slate hover:bg-tikflow-primary hover:text-white rounded-2xl transition-all active:scale-90 shadow-sm border border-glass-border"
                        title="Ajuster le solde"
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="p-20 text-center">
            <p className="text-slate-400 font-bold">Aucun utilisateur trouvé.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-6 bg-foreground/[0.02] border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-tikflow-slate">
              Affichage de <span className="text-foreground">{startIndex + 1}</span> à <span className="text-foreground">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> sur <span className="text-foreground">{filteredUsers.length}</span> utilisateurs
            </p>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-glass-border bg-card-bg text-tikflow-slate hover:bg-foreground/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1 mx-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Affichage intelligent des pages (max 5)
                  if (
                    pageNumber === 1 || 
                    pageNumber === totalPages || 
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                          currentPage === pageNumber 
                          ? 'bg-tikflow-primary text-white shadow-lg shadow-tikflow-primary/20 scale-110' 
                          : 'bg-card-bg border border-glass-border text-tikflow-slate hover:bg-foreground/5'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 || 
                    pageNumber === currentPage + 2
                  ) {
                    return <span key={pageNumber} className="text-tikflow-slate px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-glass-border bg-card-bg text-tikflow-slate hover:bg-foreground/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE NOTIFICATION */}
      {showNotifyModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-card-bg rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-glass-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 pb-4 flex justify-between items-center bg-foreground/5">
              <div>
                <h3 className="text-xl font-black text-foreground tracking-tight">Envoyer un Message</h3>
                <p className="text-xs font-bold text-tikflow-slate mt-1">Destinataire: <span className="text-tikflow-primary">{selectedUser.fullname}</span></p>
              </div>
              <button 
                onClick={() => setShowNotifyModal(false)}
                className="p-2 hover:bg-foreground/10 text-tikflow-slate rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest ml-1">Titre de la notification</label>
                <input 
                  required
                  placeholder="Ex: Mise à jour de votre compte"
                  value={notifForm.title}
                  onChange={(e) => setNotifForm({...notifForm, title: e.target.value})}
                  className="w-full bg-foreground/5 border border-glass-border rounded-2xl p-4 text-sm font-bold focus:ring-4 ring-tikflow-primary/10 transition-all outline-none text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest ml-1">Message principal</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Écrivez votre message ici..."
                  value={notifForm.message}
                  onChange={(e) => setNotifForm({...notifForm, message: e.target.value})}
                  className="w-full bg-foreground/5 border border-glass-border rounded-2xl p-4 text-sm font-medium focus:ring-4 ring-tikflow-primary/10 transition-all outline-none text-foreground resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowNotifyModal(false)}
                  className="flex-1 py-4 border-2 border-glass-border text-foreground rounded-2xl font-black text-sm hover:bg-foreground/5 transition-all uppercase tracking-wider"
                >
                  Annuler
                </button>
                <button 
                  disabled={sending}
                  className="flex-[2] py-4 bg-tikflow-primary text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-tikflow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider disabled:opacity-50"
                >
                  {sending ? (
                    <RefreshCcw className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Send size={18} />
                      Envoyer le message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}