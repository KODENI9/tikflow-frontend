"use client";

import { useEffect, useState } from "react";
import { 
  Settings, 
  ShieldAlert, 
  Plus, 
  Save, 
  Search, 
  Filter, 
  Copy, 
  Activity, 
  Cpu, 
  UserCog,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { Package, ReceivedPayment, Recipient } from "@/types/api";
import { toast } from "react-hot-toast";

export default function SettingsAuditPage() {
  const { getToken, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [logs, setLogs] = useState<ReceivedPayment[]>([]); // Using payments as logs proxy
  
  // Add Package Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPackage, setNewPackage] = useState({ name: "", coins: "", price: "" });
  const [creating, setCreating] = useState(false);

  // Edit Package Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [updating, setUpdating] = useState(false);
  
  // Recipients Management State
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [newRecipient, setNewRecipient] = useState({ operator: "flooz", phone: "", beneficiary_name: "", active: true });
  const [creatingRecipient, setCreatingRecipient] = useState(false);

  const [showEditRecipientModal, setShowEditRecipientModal] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [updatingRecipient, setUpdatingRecipient] = useState(false);

  // Global Settings State
  const [globalSettings, setGlobalSettings] = useState({ support_phone: "" });
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchData = async () => {
    if (!isLoaded) return;
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const [pkgs, payments, recips, settings] = await Promise.all([
        adminApi.getPackages(token),
        adminApi.getReceivedPayments(token),
        adminApi.getRecipients(token),
        adminApi.getSettings(token)
      ]);
      
      setPackages(pkgs || []);
      setLogs(payments || []);
      setRecipients(recips || []);
      setGlobalSettings(settings || { support_phone: "" });
    } catch (error) {
      console.error("Error fetching settings data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGlobalSettings = async () => {
    try {
        setSavingSettings(true);
        const token = await getToken();
        if (!token) return;
        await adminApi.updateSettings(token, globalSettings);
        toast.success("Paramètres mis à jour !");
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setSavingSettings(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoaded, getToken]);

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackage.name || !newPackage.coins || !newPackage.price) return toast.error("Remplissez tous les champs");

    try {
      setCreating(true);
      const token = await getToken();
      if (!token) return;

      await adminApi.createPackage(token, {
        name: newPackage.name,
        coins: Number(newPackage.coins),
        price_cfa: Number(newPackage.price)
      });

      toast.success("Pack ajouté avec succès !");
      setShowAddModal(false);
      setNewPackage({ name: "", coins: "", price: "" });
      fetchData(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    if (!editingPackage.name || !editingPackage.coins || !editingPackage.price_cfa) return toast.error("Remplissez tous les champs");

    try {
      setUpdating(true);
      const token = await getToken();
      if (!token) return;

      await adminApi.updatePackage(token, editingPackage.id, {
        name: editingPackage.name,
        coins: Number(editingPackage.coins),
        price_cfa: Number(editingPackage.price_cfa),
        active: editingPackage.active
      });

      toast.success("Pack mis à jour avec succès !");
      setShowEditModal(false);
      setEditingPackage(null);
      fetchData(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.operator || !newRecipient.phone || !newRecipient.beneficiary_name) return toast.error("Tous les champs sont requis");

    try {
        setCreatingRecipient(true);
        const token = await getToken();
        if (!token) return;

        await adminApi.createRecipient(token, newRecipient as any);
        toast.success("Destinataire ajouté !");
        setShowAddRecipientModal(false);
        setNewRecipient({ operator: "flooz", phone: "", beneficiary_name: "", active: true });
        fetchData();
    } catch (error: any) {
        toast.error(error.message || "Erreur de création");
    } finally {
        setCreatingRecipient(false);
    }
  };

  const handleUpdateRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipient) return;

    try {
        setUpdatingRecipient(true);
        const token = await getToken();
        if (!token) return;

        const { id, created_at, ...updates } = editingRecipient as any;
        await adminApi.updateRecipient(token, id, updates);
        toast.success("Destinataire mis à jour !");
        setShowEditRecipientModal(false);
        fetchData();
    } catch (error: any) {
        toast.error(error.message || "Erreur de mise à jour");
    } finally {
        setUpdatingRecipient(false);
    }
  };

  const handleDeleteRecipient = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce numéro ?")) return;

    try {
        const token = await getToken();
        if (!token) return;
        await adminApi.deleteRecipient(token, id);
        toast.success("Numéro supprimé");
        fetchData();
    } catch (error: any) {
        toast.error(error.message);
    }
  };

  if (loading && packages.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8 relative">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Settings & Audit</h1>
          <p className="text-slate-500 text-sm font-medium">Configurez les tarifs et surveillez la sécurité du système.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1152d4] text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* --- COIN PACK MANAGEMENT --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Coin Pack Management</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Configure pricing for TikTok coin bundles</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black hover:bg-blue-100 transition-all"
          >
            <Plus size={14} /> Add New Pack
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                <th className="px-8 py-4">Pack Name</th>
                <th className="px-4 py-4">Coins</th>
                <th className="px-4 py-4">Price (Local)</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {packages.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-xs text-slate-400">Aucun pack configuré.</td></tr>
              ) : (
                packages.map((pack) => (
                  <tr key={pack.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center text-white font-black text-[10px] ${pack.active ? 'bg-orange-500 shadow-md shadow-orange-100' : 'bg-slate-300'}`}>
                          $
                        </div>
                        <span className="text-sm font-black text-slate-900">{pack.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-sm font-bold text-slate-600">{pack.coins}</td>
                    <td className="px-4 py-5 text-sm font-black text-slate-900">{pack.price_cfa.toLocaleString()} XOF</td>
                    <td className="px-4 py-5">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${pack.active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                          {pack.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => {
                          setEditingPackage(pack);
                          setShowEditModal(true);
                        }}
                        className="text-[10px] font-black text-blue-600 hover:underline"
                      >
                        Edit Pack
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD PACKAGE MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900">Nouveau Pack</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nom du Pack</label>
                <input 
                  autoFocus
                  placeholder="Ex: TikFlow Starter" 
                  value={newPackage.name}
                  onChange={e => setNewPackage({...newPackage, name: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Coins TikTok</label>
                    <input 
                    type="number"
                    placeholder="Ex: 70" 
                    value={newPackage.coins}
                    onChange={e => setNewPackage({...newPackage, coins: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Prix (CFA)</label>
                    <input 
                    type="number"
                    placeholder="Ex: 1500" 
                    value={newPackage.price}
                    onChange={e => setNewPackage({...newPackage, price: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                    />
                </div>
              </div>
              <button 
                disabled={creating}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all mt-4 disabled:opacity-50"
              >
                {creating ? "Création..." : "Créer le Pack"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PACKAGE MODAL --- */}
      {showEditModal && editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900">Modifier le Pack</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdatePackage} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nom du Pack</label>
                <input 
                  autoFocus
                  placeholder="Ex: TikFlow Starter" 
                  value={editingPackage.name}
                  onChange={e => setEditingPackage({...editingPackage, name: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Coins TikTok</label>
                    <input 
                    type="number"
                    placeholder="Ex: 70" 
                    value={editingPackage.coins}
                    onChange={e => setEditingPackage({...editingPackage, coins: Number(e.target.value)})}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Prix (CFA)</label>
                    <input 
                    type="number"
                    placeholder="Ex: 1500" 
                    value={editingPackage.price_cfa}
                    onChange={e => setEditingPackage({...editingPackage, price_cfa: Number(e.target.value)})}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                    />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="active"
                  checked={editingPackage.active}
                  onChange={e => setEditingPackage({...editingPackage, active: e.target.checked})}
                />
                <label htmlFor="active" className="text-xs font-bold text-slate-600 uppercase">Pack Actif</label>
              </div>
              <button 
                disabled={updating}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all mt-4 disabled:opacity-50"
              >
                {updating ? "Mise à jour..." : "Enregistrer les modifications"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- PLATFORM SETTINGS (Support Number, etc.) --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
          <div>
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Configuration de la Plateforme</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Paramètres globaux visibles par tous les utilisateurs.</p>
          </div>
          
          <div className="max-w-md space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Numéro de Support (WhatsApp / Appel)</label>
                <div className="flex gap-2">
                    <input 
                        placeholder="Ex: +228 90 51 32 79"
                        value={globalSettings.support_phone}
                        onChange={e => setGlobalSettings({...globalSettings, support_phone: e.target.value})}
                        className="flex-1 bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                    />
                    <button 
                        onClick={handleUpdateGlobalSettings}
                        disabled={savingSettings}
                        className="px-6 bg-blue-600 text-white rounded-xl font-black text-[10px] hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {savingSettings ? "Enregistrement..." : "Mettre à jour"}
                    </button>
                </div>
                <p className="text-[9px] font-bold text-slate-400 mt-2 italic px-1">Ce numéro sera mis à jour partout sur le site (Sidebar, Aide, Paiement, etc.)</p>
              </div>
          </div>
      </div>

      {/* --- PAYMENT RECIPIENTS MANAGEMENT --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Payment Recipients (Numbers)</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Manage numbers for Flooz, TMoney, Wave, etc.</p>
          </div>
          <button 
            onClick={() => setShowAddRecipientModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black hover:bg-blue-100 transition-all"
          >
            <Plus size={14} /> Add New Number
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                <th className="px-8 py-4">Operator</th>
                <th className="px-4 py-4">Phone Number</th>
                <th className="px-4 py-4">Beneficiary</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recipients.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-xs text-slate-400">Aucun destinataire configuré.</td></tr>
              ) : (
                recipients.map((rec) => (
                  <tr key={rec.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-5">
                      <span className="text-xs font-black uppercase px-3 py-1 bg-slate-100 rounded-lg text-slate-600">
                        {rec.operator}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-sm font-black text-slate-900">{rec.phone}</td>
                    <td className="px-4 py-5 text-sm font-bold text-slate-600">{rec.beneficiary_name}</td>
                    <td className="px-4 py-5">
                      <div className="flex justify-center">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${rec.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                          {rec.active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right space-x-4">
                      <button 
                        onClick={() => {
                          setEditingRecipient(rec);
                          setShowEditRecipientModal(true);
                        }}
                        className="text-[10px] font-black text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteRecipient(rec.id)}
                        className="text-[10px] font-black text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD RECIPIENT MODAL --- */}
      {showAddRecipientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900">Nouveau Numéro</h3>
              <button onClick={() => setShowAddRecipientModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateRecipient} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Opérateur</label>
                <select 
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                  value={newRecipient.operator}
                  onChange={e => setNewRecipient({...newRecipient, operator: e.target.value})}
                >
                  <option value="flooz">Flooz</option>
                  <option value="tmoney">TMoney</option>
                  <option value="wave">Wave</option>
                  <option value="moov">Moov</option>
                  <option value="mtn">MTN</option>
                  <option value="orange">Orange</option>
                  <option value="yas">Yas</option>
                  <option value="skthib">SkThib</option>
                </select>
              </div>
              <div className="space-y-4">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Numéro de Téléphone</label>
                   <input 
                    placeholder="Ex: +228 90..." 
                    value={newRecipient.phone}
                    onChange={e => setNewRecipient({...newRecipient, phone: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nom du bénéficiaire</label>
                   <input 
                    placeholder="Ex: TikFlow Official" 
                    value={newRecipient.beneficiary_name}
                    onChange={e => setNewRecipient({...newRecipient, beneficiary_name: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                   />
                </div>
              </div>
              <button 
                disabled={creatingRecipient}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all mt-4 disabled:opacity-50"
              >
                {creatingRecipient ? "Ajout..." : "Ajouter le Numéro"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT RECIPIENT MODAL --- */}
      {showEditRecipientModal && editingRecipient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900">Modifier le Numéro</h3>
              <button onClick={() => setShowEditRecipientModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateRecipient} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Opérateur</label>
                <select 
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                  value={editingRecipient.operator}
                  onChange={e => setEditingRecipient({...editingRecipient, operator: e.target.value as any})}
                >
                  <option value="flooz">Flooz</option>
                  <option value="tmoney">TMoney</option>
                  <option value="wave">Wave</option>
                  <option value="moov">Moov</option>
                  <option value="mtn">MTN</option>
                  <option value="orange">Orange</option>
                  <option value="yas">Yas</option>
                  <option value="skthib">SkThib</option>
                </select>
              </div>
              <div className="space-y-4">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Numéro de Téléphone</label>
                   <input 
                    value={editingRecipient.phone}
                    onChange={e => setEditingRecipient({...editingRecipient, phone: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nom du bénéficiaire</label>
                   <input 
                    value={editingRecipient.beneficiary_name}
                    onChange={e => setEditingRecipient({...editingRecipient, beneficiary_name: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-blue-500/20"
                   />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="rec-active"
                  checked={editingRecipient.active}
                  onChange={e => setEditingRecipient({...editingRecipient, active: e.target.checked})}
                />
                <label htmlFor="rec-active" className="text-xs font-bold text-slate-600 uppercase">Numéro Actif</label>
              </div>
              <button 
                disabled={updatingRecipient}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all mt-4 disabled:opacity-50"
              >
                {updatingRecipient ? "Mise à jour..." : "Enregistrer"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- SECURITY & AUDIT LOGS --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
        <div className="p-8 border-b border-slate-50 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Payments Audit Log</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Real-time listing of all incoming SMS payments</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600/5" placeholder="Search logs..." />
              </div>
              <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 border border-slate-100">
                <Filter size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                <th className="px-8 py-4">Source</th>
                <th className="px-4 py-4">Received At</th>
                <th className="px-4 py-4">Sender Phone</th>
                <th className="px-4 py-4">Raw Content / Details</th>
                <th className="px-4 py-4 text-center">Ref ID</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.length === 0 ? (
                 <tr><td colSpan={6} className="text-center py-8 text-xs text-slate-400">Aucun log récent.</td></tr>
              ) : (
                logs.map((log) => (
                    <tr key={log.id} className="text-[11px] font-bold text-slate-600 hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg bg-blue-50 text-blue-500`}>
                            <Activity size={14} />
                        </div>
                        <span className={`font-black uppercase tracking-tighter text-blue-500`}>INCOMING PAY</span>
                        </div>
                    </td>
                    <td className="px-4 py-4 text-slate-400 italic">
                        {/* Simple date formatting */}
                        {new Date(log.received_at?._seconds * 1000 || Date.now()).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-slate-900">{log.sender_phone}</td>
                    <td className="px-4 py-4 max-w-xs truncate" title={log.raw_sms}>{log.raw_sms}</td>
                    <td className="px-4 py-4">
                        <div className="flex justify-center">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-[9px] font-mono text-slate-400">
                            {log.ref_id} <Copy size={10} className="cursor-pointer hover:text-slate-600" />
                        </div>
                        </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                            log.status === 'used' ? 'bg-slate-100 text-slate-400' : 'bg-green-100 text-green-600'
                        }`}>
                        {log.status === 'used' ? 'USED' : 'UNUSED'}
                        </span>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
          <p className="text-[10px] font-bold text-slate-400">Showing recent 50 logs</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-400"><ChevronLeft size={14}/></button>
            <button className="p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-400"><ChevronRight size={14}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}