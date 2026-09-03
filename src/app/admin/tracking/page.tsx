"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { Smartphone, Users, Search, RefreshCcw, CheckCircle2, XCircle, Monitor, Apple, ChevronLeft, ChevronRight, Send, BellRing, BellOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-hot-toast";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

export default function AdminTrackingPage() {
  const { getToken } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "installed" | "not_installed">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const load = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/tracking/pwa-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData(json.data);
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const triggerInstall = async (userId: string, fullname: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/tracking/trigger-install/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success(`Popup d'installation déclenché pour ${fullname}`);
      } else {
        toast.error("Échec du déclenchement");
      }
    } catch (e) {
      toast.error("Erreur réseau");
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filter]);

  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter((u: any) => {
      const matchSearch =
        u.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter =
        filter === "all" ||
        (filter === "installed" && u.pwa_installed) ||
        (filter === "not_installed" && !u.pwa_installed);
      return matchSearch && matchFilter;
    });
  }, [data, searchTerm, filter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginated = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = data?.stats;

  const getPlatformIcon = (platform: string) => {
    if (platform === "ios") return <Apple size={14} />;
    if (platform === "android") return <Smartphone size={14} />;
    return <Monitor size={14} />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase flex items-center gap-2 text-foreground">
            <Smartphone className="text-tikflow-primary" size={28} /> PWA Tracking
          </h1>
          <p className="text-tikflow-slate text-sm font-medium">Suivez les utilisateurs qui ont installé l'application</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tikflow-slate group-focus-within:text-tikflow-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-card-bg border border-glass-border rounded-2xl text-sm font-bold w-full md:w-[280px] shadow-sm focus:ring-4 ring-tikflow-primary/10 focus:border-tikflow-primary transition-all outline-none text-foreground placeholder-tikflow-slate"
            />
          </div>
          <button onClick={load} className="p-3 bg-card-bg border border-glass-border rounded-2xl hover:bg-foreground/5 transition-all shadow-sm text-tikflow-slate">
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card-bg rounded-3xl p-5 border border-glass-border shadow-sm">
          <p className="text-[10px] font-black uppercase text-tikflow-slate tracking-widest">Total Clients</p>
          <p className="text-3xl font-black text-foreground mt-2">{loading ? "—" : stats?.total_users ?? 0}</p>
          <p className="text-xs text-tikflow-slate mt-1 font-medium">utilisateurs enregistrés</p>
        </div>
        <div className="bg-card-bg rounded-3xl p-5 border border-glass-border shadow-sm">
          <p className="text-[10px] font-black uppercase text-tikflow-slate tracking-widest">Installé</p>
          <p className="text-3xl font-black text-tikflow-accent mt-2">{loading ? "—" : stats?.installed_count ?? 0}</p>
          <p className="text-xs text-tikflow-slate mt-1 font-medium flex items-center gap-1"><CheckCircle2 size={12} className="text-tikflow-accent" /> ont la PWA</p>
        </div>
        <div className="bg-card-bg rounded-3xl p-5 border border-glass-border shadow-sm">
          <p className="text-[10px] font-black uppercase text-tikflow-slate tracking-widest">Non Installé</p>
          <p className="text-3xl font-black text-tikflow-primary mt-2">{loading ? "—" : stats?.not_installed_count ?? 0}</p>
          <p className="text-xs text-tikflow-slate mt-1 font-medium flex items-center gap-1"><XCircle size={12} className="text-tikflow-primary" /> n'ont pas la PWA</p>
        </div>
        <div className="bg-gradient-to-br from-tikflow-primary to-orange-500 rounded-3xl p-5 shadow-lg shadow-tikflow-primary/20">
          <p className="text-[10px] font-black uppercase text-white/70 tracking-widest">Taux d'Adoption</p>
          <p className="text-3xl font-black text-white mt-2">{loading ? "—" : `${stats?.install_rate ?? 0}%`}</p>
          <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${stats?.install_rate ?? 0}%` }} />
          </div>
        </div>
        <div className="bg-card-bg rounded-3xl p-5 border border-glass-border shadow-sm">
          <p className="text-[10px] font-black uppercase text-tikflow-slate tracking-widest">Notifications</p>
          <p className="text-3xl font-black text-blue-500 mt-2">{loading ? "—" : stats?.push_enabled_count ?? 0}</p>
          <p className="text-xs text-tikflow-slate mt-1 font-medium flex items-center gap-1"><BellRing size={12} className="text-blue-500" /> abonnés</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: "all", label: "Tous" },
          { key: "installed", label: "✅ PWA installée" },
          { key: "not_installed", label: "❌ Pas installée" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
              filter === f.key
                ? "bg-tikflow-primary text-white shadow-lg shadow-tikflow-primary/20"
                : "bg-card-bg border border-glass-border text-tikflow-slate hover:bg-foreground/5"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card-bg rounded-[2.5rem] border border-glass-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/5 border-b border-glass-border">
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate">Utilisateur</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate">Contact</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate">Statut PWA</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate">Notifications</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate">Plateforme</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate">Dernière ouverture</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate">1ère installation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-5"><div className="h-10 bg-foreground/5 rounded-2xl w-40" /></td>
                    <td className="p-5"><div className="h-6 bg-foreground/5 rounded-xl w-32" /></td>
                    <td className="p-5"><div className="h-6 bg-foreground/5 rounded-xl w-24" /></td>
                    <td className="p-5"><div className="h-6 bg-foreground/5 rounded-xl w-16" /></td>
                    <td className="p-5"><div className="h-6 bg-foreground/5 rounded-xl w-16" /></td>
                    <td className="p-5"><div className="h-6 bg-foreground/5 rounded-xl w-28" /></td>
                    <td className="p-5"><div className="h-6 bg-foreground/5 rounded-xl w-28" /></td>
                  </tr>
                ))
              ) : paginated.map((user: any) => (
                <tr key={user.id} className="hover:bg-foreground/[0.02] transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-tikflow-primary/20 to-tikflow-accent/20 flex items-center justify-center text-tikflow-primary font-black text-base border border-tikflow-primary/10 group-hover:scale-105 transition-transform">
                        {user.fullname?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-black text-foreground text-sm">{user.fullname || "—"}</div>
                        <div className="text-[10px] font-mono text-tikflow-slate opacity-60">{user.id?.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-xs font-bold text-foreground">{user.email}</span>
                  </td>
                  <td className="p-5">
                    {user.pwa_installed ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 rounded-full w-fit bg-tikflow-accent/10 text-tikflow-accent border border-tikflow-accent/20">
                        <CheckCircle2 size={12} /> Installée
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 rounded-full w-fit bg-foreground/5 text-tikflow-slate border border-glass-border">
                          <XCircle size={12} /> Non installée
                        </span>
                        <button
                          onClick={() => triggerInstall(user.id, user.fullname)}
                          className="p-1.5 rounded-full bg-tikflow-primary/10 text-tikflow-primary hover:bg-tikflow-primary hover:text-white transition-all shadow-sm group relative"
                          title="Forcer l'installation sur l'écran de l'utilisateur"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-5">
                    {user.push_enabled ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 rounded-full w-fit bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <BellRing size={12} /> Activées
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 rounded-full w-fit bg-foreground/5 text-tikflow-slate border border-glass-border">
                        <BellOff size={12} /> Désactivées
                      </span>
                    )}
                  </td>
                  <td className="p-5">
                    {user.tracking?.platform ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 rounded-full w-fit bg-foreground/5 text-tikflow-slate border border-glass-border">
                        {getPlatformIcon(user.tracking.platform)} {user.tracking.platform}
                      </span>
                    ) : (
                      <span className="text-tikflow-slate text-xs">—</span>
                    )}
                  </td>
                  <td className="p-5">
                    {user.tracking?.last_open_at ? (
                      <span className="text-xs font-medium text-tikflow-slate">
                        {formatDistanceToNow(new Date(user.tracking.last_open_at), { addSuffix: true, locale: fr })}
                      </span>
                    ) : <span className="text-tikflow-slate text-xs">—</span>}
                  </td>
                  <td className="p-5">
                    {user.tracking?.first_install_at ? (
                      <span className="text-xs font-medium text-tikflow-slate">
                        {formatDistanceToNow(new Date(user.tracking.first_install_at), { addSuffix: true, locale: fr })}
                      </span>
                    ) : <span className="text-tikflow-slate text-xs">Jamais</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredUsers.length === 0 && (
          <div className="p-16 text-center">
            <Users size={40} className="mx-auto text-foreground/20 mb-3" />
            <p className="text-tikflow-slate font-bold">Aucun utilisateur trouvé.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-5 border-t border-glass-border flex items-center justify-between bg-foreground/[0.02]">
            <p className="text-xs font-bold text-tikflow-slate">
              {(currentPage - 1) * itemsPerPage + 1} – {Math.min(currentPage * itemsPerPage, filteredUsers.length)} sur {filteredUsers.length}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl border border-glass-border bg-card-bg text-tikflow-slate hover:bg-foreground/5 disabled:opacity-30 transition-all">
                <ChevronLeft size={18} />
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const n = i + 1;
                if (n === 1 || n === totalPages || (n >= currentPage - 1 && n <= currentPage + 1)) {
                  return <button key={n} onClick={() => setCurrentPage(n)} className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${currentPage === n ? "bg-tikflow-primary text-white shadow-lg shadow-tikflow-primary/20" : "bg-card-bg border border-glass-border text-tikflow-slate hover:bg-foreground/5"}`}>{n}</button>;
                } else if (n === currentPage - 2 || n === currentPage + 2) {
                  return <span key={n} className="text-tikflow-slate px-1">…</span>;
                }
                return null;
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl border border-glass-border bg-card-bg text-tikflow-slate hover:bg-foreground/5 disabled:opacity-30 transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
