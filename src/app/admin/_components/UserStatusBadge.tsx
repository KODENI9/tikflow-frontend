// Badges de statut utilisateur — couleur jaune pour les clients
type UserStatus = "Active" | "Suspended" | "Pending";
type UserRole   = "admin" | "client" | "user";

/* ── Status Badge ── */
export function UserStatusBadge({ status }: { status: UserStatus }) {
  const config: Record<UserStatus, { bg: string; text: string; dot: string; label: string }> = {
    Active: {
      bg:    "bg-tikflow-accent/10 ring-1 ring-tikflow-accent/20",
      text:  "text-tikflow-accent",
      dot:   "bg-tikflow-accent",
      label: "Actif",
    },
    Suspended: {
      bg:    "bg-tikflow-danger/10 ring-1 ring-tikflow-danger/20",
      text:  "text-tikflow-danger",
      dot:   "bg-tikflow-danger",
      label: "Suspendu",
    },
    Pending: {
      bg:    "bg-tikflow-warning/10 ring-1 ring-tikflow-warning/20",
      text:  "text-tikflow-warning",
      dot:   "bg-tikflow-warning animate-pulse",
      label: "En Attente",
    },
  };

  const c = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${c.bg} ${c.text}`}
    >
      <span className={`size-1.5 ${c.dot} rounded-full`} />
      {c.label}
    </span>
  );
}

/* ── Role Badge (JAUNE pour client) ── */
export function UserRoleBadge({ role }: { role: UserRole | string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    admin: {
      bg:    "bg-blue-500/10 ring-1 ring-blue-500/20",
      text:  "text-blue-400",
      label: "Admin",
    },
    client: {
      bg:    "bg-tikflow-primary/10 ring-1 ring-tikflow-primary/30",
      text:  "text-tikflow-primary",
      label: "Client",
    },
    user: {
      bg:    "bg-tikflow-primary/10 ring-1 ring-tikflow-primary/30",
      text:  "text-tikflow-primary",
      label: "Client",
    },
  };

  const c = config[role] ?? {
    bg: "bg-white/5 ring-1 ring-white/10",
    text: "text-tikflow-slate",
    label: role,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}