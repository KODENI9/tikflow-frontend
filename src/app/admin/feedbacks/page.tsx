"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { adminApi } from '@/lib/api';
import { Feedback } from '@/types/api';
import { 
    MessageSquare, 
    Star, 
    TrendingUp, 
    TrendingDown, 
    User, 
    Calendar,
    Search,
    Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminFeedbacksPage() {
    const { getToken } = useAuth();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const token = await getToken();
                if (token) {
                    const data = await adminApi.getAllFeedbacks(token);
                    setFeedbacks(data);
                }
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, [getToken]);

    const filteredFeedbacks = feedbacks.filter(f => 
        f.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.user?.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.user?.phone_number.includes(searchTerm)
    );

    const stats = {
        total: feedbacks.length,
        average: feedbacks.length > 0 ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1) : 0,
        promoters: feedbacks.filter(f => f.nps_score === 'promoter').length,
        detractors: feedbacks.filter(f => f.nps_score === 'detractor').length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin size-8 border-4 border-tikflow-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">Retours Utilisateurs</h1>
                    <p className="text-tikflow-slate font-bold italic">Analysez la satisfaction de vos clients en temps réel.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card-bg border border-glass-border p-6 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-tikflow-primary/10 text-tikflow-primary rounded-2xl flex items-center justify-center">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-tikflow-slate uppercase tracking-widest">Total Avis</p>
                            <p className="text-2xl font-black text-foreground">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card-bg border border-glass-border p-6 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center">
                            <Star size={24} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-tikflow-slate uppercase tracking-widest">Note Moyenne</p>
                            <p className="text-2xl font-black text-foreground">{stats.average} <span className="text-sm text-tikflow-slate">/ 5</span></p>
                        </div>
                    </div>
                </div>
                <div className="bg-card-bg border border-glass-border p-6 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-tikflow-slate uppercase tracking-widest">Promoteurs</p>
                            <p className="text-2xl font-black text-emerald-500">{stats.promoters}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card-bg border border-glass-border p-6 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center">
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-tikflow-slate uppercase tracking-widest">Détracteurs</p>
                            <p className="text-2xl font-black text-rose-500">{stats.detractors}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card-bg border border-glass-border rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-glass-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tikflow-slate" size={18} />
                        <input 
                            type="text" 
                            placeholder="Rechercher un commentaire ou un utilisateur..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-foreground/[0.03] dark:bg-white/[0.03] border border-glass-border rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:border-tikflow-primary/30 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-foreground/[0.02] dark:bg-white/[0.02]">
                                <th className="px-8 py-4 text-[10px] font-black text-tikflow-slate uppercase tracking-widest">Utilisateur</th>
                                <th className="px-8 py-4 text-[10px] font-black text-tikflow-slate uppercase tracking-widest text-center">Note</th>
                                <th className="px-8 py-4 text-[10px] font-black text-tikflow-slate uppercase tracking-widest">Commentaire</th>
                                <th className="px-8 py-4 text-[10px] font-black text-tikflow-slate uppercase tracking-widest">Score NPS</th>
                                <th className="px-8 py-4 text-[10px] font-black text-tikflow-slate uppercase tracking-widest">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-glass-border">
                            {filteredFeedbacks.map((f) => (
                                <tr key={f.id} className="hover:bg-foreground/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-tikflow-primary/5 text-tikflow-primary rounded-xl flex items-center justify-center">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-foreground">{f.user?.fullname}</p>
                                                <p className="text-xs font-bold text-tikflow-slate">{f.user?.phone_number}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-1">
                                            {[1,2,3,4,5].map(s => (
                                                <Star key={s} size={14} className={s <= f.rating ? "text-yellow-500 fill-yellow-500" : "text-tikflow-slate/20"} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="max-w-xs xl:max-w-md">
                                            <p className="text-sm font-bold text-tikflow-slate italic leading-relaxed">
                                                {f.comment || <span className="opacity-30">Aucun commentaire</span>}
                                            </p>
                                            <p className="text-[10px] font-black text-tikflow-primary/50 uppercase tracking-widest mt-2">{f.context}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            f.nps_score === 'promoter' ? 'bg-emerald-500/10 text-emerald-500' :
                                            f.nps_score === 'neutral' ? 'bg-tikflow-slate/10 text-tikflow-slate' :
                                            'bg-rose-500/10 text-rose-500'
                                        }`}>
                                            {f.nps_score}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-tikflow-slate">
                                            <Calendar size={14} />
                                            <span className="text-xs font-bold">
                                                {format(new Date(f.created_at._seconds ? f.created_at._seconds * 1000 : f.created_at), 'dd MMM yyyy', { locale: fr })}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredFeedbacks.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <div className="size-20 bg-tikflow-primary/5 text-tikflow-primary rounded-[2rem] flex items-center justify-center mx-auto">
                            <MessageSquare size={32} />
                        </div>
                        <div>
                            <p className="text-lg font-black text-foreground">Aucun avis trouvé</p>
                            <p className="text-sm text-tikflow-slate font-bold italic">Les retours des utilisateurs apparaîtront ici.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
