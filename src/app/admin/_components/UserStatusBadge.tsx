// app/(admin)/admin/users/components/UserStatusBadge.tsx
export function UserStatusBadge({ status }: { status: 'Active' | 'Suspended' | 'Pending' }) {
  const styles = {
    Active: "bg-green-500/10 text-green-600 ring-1 ring-green-600/20",
    Suspended: "bg-red-500/10 text-red-600 ring-1 ring-red-600/20",
    Pending: "bg-orange-500/10 text-orange-600 ring-1 ring-orange-600/20"
  };

  const dotStyles = {
    Active: "bg-green-500",
    Suspended: "bg-red-500",
    Pending: "bg-orange-500 animate-pulse"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${styles[status]}`}>
      <span className={`size-1.5 ${dotStyles[status]} rounded-full shadow-sm`}></span>
      {status === 'Active' ? 'Actif' : status === 'Suspended' ? 'Suspendu' : 'En Attente'}
    </span>
  );
}