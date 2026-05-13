import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInPanel } from "@/components/sign-in-panel";
import { getAuthUiConfig } from "@/lib/auth-providers";

type SignInPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();
  const requestHeaders = await headers();
  const authUiConfig = getAuthUiConfig(
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host"),
  );
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const callbackUrl = resolvedSearchParams?.callbackUrl || "/en";

  if (session) {
    redirect(callbackUrl);
  }

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-md py-2xl">
        <div className="grid w-full overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low shadow-[0_24px_80px_rgba(0,0,0,0.18)] md:grid-cols-[1fr_1fr]">
          {/* Brand panel */}
          <section className="relative flex flex-col justify-between gap-xl bg-gradient-to-br from-primary/[0.07] to-primary/[0.02] p-xl">
            <div className="space-y-lg">
              <div className="inline-flex items-center gap-sm rounded-full border border-outline-variant bg-surface/80 px-md py-xs text-code-sm text-on-surface-variant backdrop-blur-sm">
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
                <h1 className="text-balance font-headline-lg text-headline-lg text-primary">
                  Sign in to the OpenTruck control surface
                </h1>
                <p className="text-balance text-body-lg text-on-surface-variant">
                  Use OAuth or an operator account. If you opened this route by mistake, you can
                  head back and reopen login from the landing page modal.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-lg gap-y-md">
              <div className="flex items-center gap-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-lg">alt_route</span>
                </span>
                <div>
                  <p className="text-code-sm text-on-surface-variant">Access</p>
                  <p className="text-title-sm text-primary">Tenant-scoped routing</p>
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-lg">fingerprint</span>
                </span>
                <div>
                  <p className="text-code-sm text-on-surface-variant">Identity</p>
                  <p className="text-title-sm text-primary">OAuth + Credentials</p>
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-lg">dashboard</span>
                </span>
                <div>
                  <p className="text-code-sm text-on-surface-variant">Target</p>
                  <p className="text-title-sm text-primary">Console gate</p>
                </div>
              </div>
            </div>
          </section>

          {/* Sign-in panel */}
          <section className="flex flex-col justify-center p-xl">
            <SignInPanel
              callbackUrl={callbackUrl}
              providers={authUiConfig.providers}
              credentialsHint={authUiConfig.credentialsHint}
            />
            <Link
              href="/"
              className="mt-lg inline-flex items-center gap-xs text-body-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to landing page
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
