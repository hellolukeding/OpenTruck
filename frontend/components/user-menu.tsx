import { auth, signOut } from "@/auth";
import { SignInDialogTrigger } from "@/components/sign-in-dialog-trigger";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAuthUiConfig } from "@/lib/auth-providers";
import { headers } from "next/headers";

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
  const requestHeaders = await headers();
  const authUiConfig = getAuthUiConfig(
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host"),
  );
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
    <SignInDialogTrigger callbackUrl="/en" authUiConfig={authUiConfig}>
      <button className={buttonVariants({ variant: "ghost", size: "sm" })} type="button">
        Log in
      </button>
    </SignInDialogTrigger>
  );
}
