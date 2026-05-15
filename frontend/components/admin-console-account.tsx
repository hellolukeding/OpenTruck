import { auth, signOut } from "@/auth";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export async function AdminConsoleAccount() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return null;
  }

  const name = user.name || user.email || "Operator";
  const badge = getInitials(name) || "OT";

  return (
    <div className="flex items-center gap-3 border-l border-outline-variant/40 pl-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-[0.8rem] font-semibold text-on-primary dark:bg-primary dark:text-on-primary">
        {badge}
      </div>
      <div className="hidden min-w-0 sm:block">
        <p className="truncate text-[0.88rem] font-medium text-on-surface">{name}</p>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="rounded-full px-3 py-1.5 text-[0.78rem] text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
