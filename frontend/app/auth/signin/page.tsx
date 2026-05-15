import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
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
    <main className="h-dvh overflow-hidden bg-background text-on-background">
      <div className="relative flex h-dvh items-center justify-center overflow-hidden px-4 py-4 sm:px-6">
        <div className="absolute inset-0 grid-bg opacity-60 dark:opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-[18%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary-container/10 blur-[110px] dark:bg-primary/10" />
        <section className="relative z-10 w-full max-w-[940px] rounded-[28px]  border-surface-variant  backdrop-blur-xl dark:bg-[color:rgba(18,19,24,0.88)] dark:shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
          <div className="grid items-center gap-8 px-6 py-6 sm:px-8 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:gap-10 md:px-10 md:py-8 lg:px-12">
            <div className="hidden md:block">
              <div className="max-w-[24rem]">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary dark:text-primary-fixed-dim">
                  Community Gateway
                </p>
                <div className="mt-4">
                  <Image
                    src="/logo.png"
                    alt="OpenTruck logo"
                    width={520}
                    height={132}
                    priority
                    className="h-16 w-auto lg:h-[4.5rem]"
                  />
                </div>
                <p className="mt-4 max-w-[22rem] text-[0.98rem] leading-7 text-on-surface-variant">
                  Sign in to manage routing, model access, and upstream capacity from a
                  single operator console.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  "Tenant-aware routing and quota controls",
                  "OAuth upstream accounts with health scheduling",
                  "Unified console for models, merchants, and docs",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-surface-variant/80 bg-surface-container-lowest/80 px-4 py-3 dark:bg-surface-container-low/60"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-container shadow-[0_0_0_6px_rgba(16,185,129,0.12)] dark:bg-primary" />
                    <span className="text-[0.88rem] text-on-surface">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-[0.84rem] text-on-surface-variant">
                <span>Don&apos;t have an account? </span>
                <Link href="/" className="font-medium text-primary transition-colors hover:text-primary-container hover:underline">
                  Sign Up
                </Link>
              </div>
            </div>

            <div className="rounded-[24px] ml-10 border border-surface-variant/80 bg-surface-bright/90 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.05)] dark:bg-surface-container-low/85 dark:shadow-[0_16px_36px_rgba(0,0,0,0.28)] sm:p-6">
              <div className="mb-5 text-center md:hidden">
                <Image
                  src="/logo.png"
                  alt="OpenTruck logo"
                  width={520}
                  height={132}
                  priority
                  className="mx-auto h-10 w-auto"
                />
                <p className="mt-2 text-[0.92rem] text-on-surface-variant">
                  Sign in to manage your infrastructure.
                </p>
              </div>

              <div className="mb-5 hidden md:block">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary dark:text-primary-fixed-dim">
                  Operator Sign In
                </p>
                <h2 className="mt-2 text-[1.4rem] font-semibold tracking-[-0.04em] text-on-surface">
                  Welcome back
                </h2>
                <p className="mt-1 text-[0.88rem] text-on-surface-variant">
                  Continue to the OpenTruck control surface.
                </p>
              </div>

              <SignInPanel
                callbackUrl={callbackUrl}
                providers={authUiConfig.providers}
                credentialsHint={authUiConfig.credentialsHint}
              />

              <div className="mt-5 text-center text-[0.82rem] text-on-surface-variant md:hidden">
                <span>Don&apos;t have an account? </span>
                <Link href="/" className="font-medium text-primary transition-colors hover:text-primary-container hover:underline">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
