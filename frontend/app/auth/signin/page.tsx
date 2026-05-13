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
                  Use OAuth or an operator account. If you opened this route by mistake, you can
                  head back and reopen login from the landing page modal.
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
                <p className="mt-xs text-title-sm text-primary">OAuth + Credentials</p>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface p-md">
                <p className="text-code-sm text-on-surface-variant">Target</p>
                <p className="mt-xs text-title-sm text-primary">Console gate</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col justify-center gap-lg p-xl">
            <SignInPanel
              callbackUrl={callbackUrl}
              providers={authUiConfig.providers}
              credentialsHint={authUiConfig.credentialsHint}
            />
            <Link
              href="/"
              className="inline-flex items-center gap-xs text-body-sm text-on-surface-variant transition-colors hover:text-primary"
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
