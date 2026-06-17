'use client';

export function DeleteButton({
  action,
  title,
}: { action: () => void | Promise<void>; title: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="rounded-md border border-border px-2.5 py-1 text-[12px] text-muted transition-colors hover:border-down hover:text-down"
      >
        Delete
      </button>
    </form>
  );
}
