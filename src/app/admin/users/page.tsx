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
  Mail
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminUsers() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filtrage dynamique
  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone_number?.includes(searchTerm)
    );
  }, [searchTerm, users]);

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

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase flex items-center gap-2 text-slate-900">
            <Users className="text-blue-600" size={28} /> Gestion de la Clientèle
          </h1>
          <p className="text-slate-500 text-sm font-medium">Contrôlez les comptes et les balances wallets</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold w-full md:w-[300px] shadow-sm focus:ring-4 ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <button 
            onClick={loadUsers}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-[10px] font-black uppercase text-slate-400">Utilisateur</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400">Contact</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400">Rôle & Statut</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400">Solde Wallet</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        {user.fullname?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm">{user.fullname}</div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">ID: {user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Mail size={12} className="text-slate-400" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Phone size={12} className="text-slate-400" /> {user.phone_number || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-2">
                      {user.role === 'admin' ? (
                        <span className="flex items-center gap-1 text-[9px] font-black uppercase bg-purple-50 text-purple-600 px-2 py-1 rounded-md w-fit border border-purple-100">
                          <ShieldCheck size={10} /> Administrateur
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] font-black uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded-md w-fit border border-blue-100">
                          <UserIcon size={10} /> Client
                        </span>
                      )}
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md w-fit border ${
                        user.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl w-fit shadow-lg shadow-slate-200">
                      <Wallet size={14} className="text-blue-400" />
                      <span className="font-black text-sm">{(user.balance || 0).toLocaleString()} F</span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => handleAdjustBalance(user.id, user.fullname)}
                      className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all active:scale-90"
                      title="Ajuster le solde"
                    >
                      <PlusCircle size={20} />
                    </button>
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
      </div>
    </div>
  );
}