"use client";

import React, { useState, useEffect } from 'react';
import { Star, Send, X, MessageSquare, CheckCircle2 } from 'lucide-react';
import { feedbackApi } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';

interface FeedbackCardProps {
    userId: string;
    lastFeedbackAt?: string;
    onClose: () => void;
}

export default function FeedbackCard({ userId, lastFeedbackAt, onClose }: FeedbackCardProps) {
    const { getToken } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showComment, setShowComment] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Veuillez sélectionner une note.");
            return;
        }

        setIsSending(true);
        try {
            const token = await getToken();
            if (!token) throw new Error("Non authentifié");

            await feedbackApi.createFeedback(token, {
                rating,
                comment,
                context: "dashboard"
            });
            setIsSubmitted(true);
            toast.success("Merci pour votre avis !");
            
            // Auto close after 3 seconds
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (error: any) {
            console.error("Error submitting feedback:", error);
            toast.error(error.response?.data?.message || "Erreur lors de l'envoi du feedback.");
        } finally {
            setIsSending(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="fixed bottom-6 right-6 w-80 bg-tikflow-primary text-white p-6 rounded-[2rem] shadow-2xl border border-white/10 animate-slide-up z-50">
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 size={28} />
                    </div>
                    <h3 className="font-black uppercase tracking-tight">Merci !</h3>
                    <p className="text-blue-100 text-sm font-bold italic">Votre avis nous aide à améliorer TikFlow pour toute la communauté.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 bg-card-bg border border-glass-border p-6 rounded-[2.5rem] shadow-2xl animate-slide-up z-50 overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute -top-10 -right-10 size-32 bg-tikflow-primary/5 rounded-full blur-2xl group-hover:bg-tikflow-primary/10 transition-colors"></div>

            <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="size-8 bg-tikflow-primary/10 text-tikflow-primary rounded-xl flex items-center justify-center">
                            <Star size={18} fill={rating > 0 ? "currentColor" : "none"} />
                        </div>
                        <h4 className="font-black text-foreground uppercase text-xs tracking-wider">Votre avis compte</h4>
                    </div>
                    <button onClick={onClose} className="text-tikflow-slate hover:text-foreground transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-4">
                    <p className="text-sm font-bold text-tikflow-slate italic leading-relaxed">
                        Comment évaluez-vous votre expérience sur TikFlow ?
                    </p>

                    <div className="flex items-center justify-between px-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => {
                                    setRating(star);
                                    setShowComment(true);
                                }}
                                className="transition-transform hover:scale-125 focus:outline-none"
                            >
                                <Star
                                    size={28}
                                    className={`transition-colors ${
                                        star <= (hoverRating || rating)
                                            ? "text-tikflow-secondary fill-tikflow-secondary"
                                            : "text-tikflow-slate/20"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    {showComment && (
                        <div className="space-y-3 animate-fade-in">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Un commentaire ? (Optionnel)"
                                maxLength={1000}
                                className="w-full bg-foreground/[0.03] dark:bg-white/[0.03] border border-glass-border rounded-2xl p-4 text-sm font-medium text-foreground placeholder:text-tikflow-slate/50 focus:outline-none focus:border-tikflow-primary/30 transition-all resize-none h-24"
                            ></textarea>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 rounded-xl border border-glass-border text-tikflow-slate font-black text-[10px] uppercase tracking-widest hover:bg-foreground/[0.03] transition-all"
                                >
                                    Plus tard
                                </button>
                                <button
                                    disabled={isSending}
                                    onClick={handleSubmit}
                                    className="flex-[2] py-3 px-4 bg-tikflow-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-tikflow-primary-dark shadow-lg shadow-tikflow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSending ? "Envoi..." : (
                                        <>
                                            <Send size={14} />
                                            Envoyer
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {!showComment && (
                        <button 
                            onClick={onClose}
                            className="w-full py-2 text-[10px] font-black text-tikflow-slate uppercase tracking-[0.2em] hover:text-foreground transition-colors"
                        >
                            Pas maintenant
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
