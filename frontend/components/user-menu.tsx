import Link from "next/link";

import { auth, signOut } from "@/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export async function UserMenu() {
  const session = await auth();
  const user = session?.user;

  if (user) {
    const name = user.name || user.email || "User";
    const email = user.email || "OAuth session";
    return (
      <div className="flex items-center gap-sm">
        <div className="hidden min-w-0 text-right sm:block">
          <p className="truncate text-label-md text-primary">{name}</p>
          <p className="truncate text-code-sm text-on-surface-variant">{email}</p>
        </div>
        <Avatar>
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button variant="ghost" size="sm" type="submit">
            Log out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <Link href="/auth/signin" className={buttonVariants({ variant: "ghost", size: "sm" })}>
      Log in
    </Link>
  );
}
