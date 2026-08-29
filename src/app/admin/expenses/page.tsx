"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Wallet, ArrowDownRight, ArrowUpRight, Plus, Trash2, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN || "").replace(/\/$/, "");

export default function AdminExpensesPage() {
  const { getToken } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"EXPENSE" | "REVENUE">("EXPENSE");
  const [category, setCategory] = useState("Serveur");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchExpenses = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setExpenses(data.data);
      }
    } catch (error) {
      toast.error("Erreur de chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [getToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          amount,
          type,
          category,
          date: new Date(date).toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Opération enregistrée avec succès.");
        setTitle("");
        setAmount("");
        fetchExpenses();
      } else {
        toast.error("Erreur lors de l'enregistrement.");
      }
    } catch (error) {
      toast.error("Erreur serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette opération ?")) return;
    
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Opération supprimée.");
        setExpenses(expenses.filter(e => e.id !== id));
      }
    } catch (error) {
      toast.error("Erreur de suppression.");
    }
  };

  // Stats calculation
  const totalRevenues = expenses.filter(e => e.type === "REVENUE").reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.filter(e => e.type === "EXPENSE").reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalRevenues - totalExpenses;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-black uppercase text-foreground flex items-center gap-3">
          <Wallet className="text-tikflow-primary" size={32} />
          Trésorerie & Dépenses
        </h1>
        <p className="text-sm font-medium text-tikflow-slate mt-2">
          Suivez les dépenses liées à l'infrastructure et les revenus internes de TikFlow.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 size-24 bg-tikflow-accent/10 rounded-full blur-2xl group-hover:bg-tikflow-accent/20 transition-all"></div>
          <div>
            <p className="text-sm font-bold uppercase text-tikflow-slate flex items-center gap-2">
              <ArrowUpRight size={16} className="text-tikflow-accent" /> Total Revenus
            </p>
            <h3 className="text-3xl font-black text-foreground mt-2">
              {totalRevenues.toLocaleString()} <span className="text-lg text-tikflow-slate">CFA</span>
            </h3>
          </div>
        </div>

        <div className="admin-card p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 size-24 bg-tikflow-danger/10 rounded-full blur-2xl group-hover:bg-tikflow-danger/20 transition-all"></div>
          <div>
            <p className="text-sm font-bold uppercase text-tikflow-slate flex items-center gap-2">
              <ArrowDownRight size={16} className="text-tikflow-danger" /> Total Dépenses
            </p>
            <h3 className="text-3xl font-black text-foreground mt-2">
              {totalExpenses.toLocaleString()} <span className="text-lg text-tikflow-slate">CFA</span>
            </h3>
          </div>
        </div>

        <div className={`admin-card p-6 flex flex-col justify-between relative overflow-hidden group border ${netBalance >= 0 ? 'border-tikflow-accent/30' : 'border-tikflow-danger/30'}`}>
          <div className={`absolute -right-6 -top-6 size-24 rounded-full blur-2xl transition-all ${netBalance >= 0 ? 'bg-tikflow-accent/10 group-hover:bg-tikflow-accent/20' : 'bg-tikflow-danger/10 group-hover:bg-tikflow-danger/20'}`}></div>
          <div>
            <p className="text-sm font-bold uppercase text-tikflow-slate flex items-center gap-2">
              <Wallet size={16} className={netBalance >= 0 ? "text-tikflow-accent" : "text-tikflow-danger"} /> Solde Net
            </p>
            <h3 className={`text-3xl font-black mt-2 ${netBalance >= 0 ? "text-tikflow-accent" : "text-tikflow-danger"}`}>
              {netBalance.toLocaleString()} <span className="text-lg opacity-70">CFA</span>
            </h3>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Formulaire d'ajout */}
        <div className="md:col-span-1">
          <div className="bg-card-bg border border-glass-border rounded-3xl p-6 shadow-sm sticky top-6">
            <h2 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
              <Plus size={20} className="text-tikflow-primary" /> Nouvelle Opération
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-tikflow-slate">Type d'opération</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setType("EXPENSE")}
                    className={`py-2 rounded-xl text-sm font-bold transition-all border ${type === "EXPENSE" ? 'bg-tikflow-danger/10 border-tikflow-danger/50 text-tikflow-danger' : 'bg-background border-glass-border text-tikflow-slate hover:bg-white/5'}`}
                  >
                    Dépense
                  </button>
                  <button 
                    type="button"
                    onClick={() => setType("REVENUE")}
                    className={`py-2 rounded-xl text-sm font-bold transition-all border ${type === "REVENUE" ? 'bg-tikflow-accent/10 border-tikflow-accent/50 text-tikflow-accent' : 'bg-background border-glass-border text-tikflow-slate hover:bg-white/5'}`}
                  >
                    Revenu
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-tikflow-slate">Titre / Libellé</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Serveur Vercel Août"
                  className="w-full bg-background border border-glass-border rounded-xl p-3 text-sm text-foreground focus:border-tikflow-primary outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-tikflow-slate">Montant (FCFA)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 15000"
                  className="w-full bg-background border border-glass-border rounded-xl p-3 text-sm text-foreground focus:border-tikflow-primary outline-none transition-all"
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-tikflow-slate">Catégorie</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-background border border-glass-border rounded-xl p-3 text-sm text-foreground focus:border-tikflow-primary outline-none transition-all"
                >
                  <option value="Serveur">Serveur / Hébergement</option>
                  <option value="Marketing">Marketing / Pub</option>
                  <option value="Bénéfice">Bénéfice (Achat pièces)</option>
                  <option value="Outils">Outils & Logiciels</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-tikflow-slate">Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-background border border-glass-border rounded-xl p-3 text-sm text-foreground focus:border-tikflow-primary outline-none transition-all"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-tikflow-primary text-black py-3 rounded-xl font-black uppercase text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-2 shadow-lg shadow-tikflow-primary/20"
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </button>
            </form>
          </div>
        </div>

        {/* Historique */}
        <div className="md:col-span-2">
          <div className="bg-card-bg border border-glass-border rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-glass-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Historique des Opérations</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-tikflow-slate animate-pulse">Chargement...</div>
            ) : expenses.length === 0 ? (
              <div className="p-8 text-center text-tikflow-slate">Aucune opération enregistrée pour le moment.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-foreground/5 text-xs uppercase tracking-wider text-tikflow-slate font-bold">
                      <th className="p-4 pl-6">Date</th>
                      <th className="p-4">Détails</th>
                      <th className="p-4 text-right">Montant</th>
                      <th className="p-4 pr-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2 text-sm font-medium text-tikflow-slate">
                            <Calendar size={14} />
                            {format(new Date(expense.date), "dd MMM yyyy", { locale: fr })}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-sm text-foreground">{expense.title}</div>
                          <div className="flex items-center gap-1.5 text-xs text-tikflow-slate mt-1">
                            <Tag size={12} /> {expense.category}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-md text-sm ${expense.type === 'REVENUE' ? 'text-tikflow-accent bg-tikflow-accent/10' : 'text-tikflow-danger bg-tikflow-danger/10'}`}>
                            {expense.type === 'REVENUE' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {expense.type === 'REVENUE' ? '+' : '-'}{expense.amount.toLocaleString()} CFA
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-center">
                          <button 
                            onClick={() => handleDelete(expense.id)}
                            className="p-2 text-tikflow-slate hover:text-tikflow-danger hover:bg-tikflow-danger/10 rounded-lg transition-colors mx-auto block"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
