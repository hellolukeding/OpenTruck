import Image from "next/image";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { getEnabledAuthProviderMeta } from "@/lib/auth-providers";

type SignInPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const callbackUrl = resolvedSearchParams?.callbackUrl || "/en";

  if (session) {
    redirect(callbackUrl);
  }

  const providers = getEnabledAuthProviderMeta();

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-md py-2xl">
        <div className="grid w-full overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low shadow-[0_24px_80px_rgba(0,0,0,0.18)] md:grid-cols-[1.15fr_0.85fr]">
          <section className="flex flex-col justify-between gap-xl border-b border-outline-variant p-xl md:border-b-0 md:border-r">
            <div className="space-y-lg">
              <div className="inline-flex items-center gap-sm rounded-full border border-outline-variant bg-surface px-md py-xs text-code-sm text-on-surface-variant">
                <span className="h-2 w-2 rounded-full bg-primary" />
                OAuth Access Layer
              </div>
              <div className="space-y-md">
                <Image
                  src="/logo.png"
                  alt="OpenTruck"
                  width={144}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
                <h1 className="max-w-xl text-balance font-headline-lg text-headline-lg text-primary">
                  Sign in to the OpenTruck control surface
                </h1>
                <p className="max-w-xl text-body-lg text-on-surface-variant">
                  OAuth handles both sign in and first-time registration. Once a provider is configured,
                  your team can enter the admin console without adding a separate password system first.
                </p>
              </div>
            </div>

            <div className="grid gap-md sm:grid-cols-3">
              <div className="rounded-xl border border-outline-variant bg-surface p-md">
                <p className="text-code-sm text-on-surface-variant">Routing</p>
                <p className="mt-xs text-title-sm text-primary">Tenant-scoped</p>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface p-md">
                <p className="text-code-sm text-on-surface-variant">Identity</p>
                <p className="mt-xs text-title-sm text-primary">OAuth first</p>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface p-md">
                <p className="text-code-sm text-on-surface-variant">Target</p>
                <p className="mt-xs text-title-sm text-primary">Console gate</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col justify-center gap-lg p-xl">
            <div className="space-y-xs">
              <p className="text-code-sm uppercase tracking-[0.18em] text-on-surface-variant">
                Authentication
              </p>
              <h2 className="text-title-lg text-primary">Choose a provider</h2>
              <p className="text-body-md text-on-surface-variant">
                We are using Auth.js with OAuth providers so registration and login share the same entry.
              </p>
            </div>

            {providers.length > 0 ? (
              <div className="space-y-md">
                {providers.map((provider) => (
                  <form
                    key={provider.id}
                    action={async () => {
                      "use server";
                      await signIn(provider.id, { redirectTo: callbackUrl });
                    }}
                    className="space-y-xs"
                  >
                    <Button type="submit" className="w-full justify-between px-lg py-md text-left">
                      <span>{provider.name}</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Button>
                    <p className="text-body-sm text-on-surface-variant">{provider.description}</p>
                  </form>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-outline-variant bg-surface p-lg">
                <p className="text-title-sm text-primary">No OAuth provider configured yet</p>
                <p className="mt-xs text-body-sm text-on-surface-variant">
                  Add `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` or `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`
                  in `frontend/.env.local`, then reload the app.
                </p>
              </div>
            )}

            <div className="rounded-xl border border-outline-variant bg-surface px-md py-sm text-body-sm text-on-surface-variant">
              After sign-in you will be redirected to{" "}
              <span className="font-code-sm text-primary">{callbackUrl}</span>.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
