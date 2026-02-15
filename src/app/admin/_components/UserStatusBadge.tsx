// app/(admin)/admin/users/components/UserStatusBadge.tsx
export function UserStatusBadge({ status }: { status: 'Active' | 'Suspended' | 'Pending' }) {
  const styles = {
    Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Pending: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
  };

  const dotStyles = {
    Active: "bg-green-500",
    Suspended: "bg-red-500",
    Pending: "bg-orange-500"
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      <span className={`size-1 ${dotStyles[status]} rounded-full`}></span>
      {status}
    </span>
  );
}