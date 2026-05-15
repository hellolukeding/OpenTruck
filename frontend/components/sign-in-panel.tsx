"use client";

import { useMemo, useState, useTransition } from "react";
import { signIn } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthProviderMeta } from "@/lib/auth-providers";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function ProviderIcon({ id }: { id: string }) {
  if (id === "google") return <GoogleIcon />;
  if (id === "github") return <GitHubIcon />;
  return <span className="material-symbols-outlined text-[18px]">login</span>;
}

type SignInPanelProps = {
  callbackUrl: string;
  providers: AuthProviderMeta[];
  credentialsHint: string | null;
  mode?: "page" | "modal";
};

export function SignInPanel({
  callbackUrl,
  providers,
  credentialsHint,
  mode = "page",
}: SignInPanelProps) {
  const credentialsEnabled = providers.some((provider) => provider.id === "credentials");
  const oauthProviders = useMemo(
    () =>
      providers
        .filter((provider) => provider.id !== "credentials")
        .sort((a, b) => {
          const order = ["google", "github"];
          return order.indexOf(a.id) - order.indexOf(b.id);
        }),
    [providers],
  );

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleCredentialsSignIn() {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
        redirectTo: callbackUrl,
      });
      if (!result || result.error) {
        setErrorMessage("The account or password is incorrect.");
        return;
      }
      window.location.href = result.url || callbackUrl;
    });
  }

  async function handleOAuthSignIn(provider: AuthProviderMeta) {
    setErrorMessage(null);
    await signIn(provider.id, { redirectTo: callbackUrl });
  }

  const compact = mode === "modal";

  return (
    <div className={`w-full ${compact ? "space-y-4" : "space-y-5"}`}>
      {oauthProviders.length > 0 ? (
        <div className="space-y-2.5">
          {oauthProviders.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => void handleOAuthSignIn(provider)}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-surface-variant bg-surface-container-lowest px-4 py-3 text-[0.78rem] font-medium uppercase tracking-[0.02em] text-on-surface transition-colors hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary-container/20 dark:bg-surface-container dark:hover:bg-surface-container-high"
            >
              <span className="flex h-6 w-6 items-center justify-center text-current">
                <ProviderIcon id={provider.id} />
              </span>
              <span>Continue with {provider.name}</span>
            </button>
          ))}
        </div>
      ) : null}

      {credentialsEnabled && oauthProviders.length > 0 ? (
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-surface-variant" />
          <span className="text-[0.74rem] uppercase tracking-[0.08em] text-on-surface-variant">
            or
          </span>
          <div className="h-px flex-1 bg-surface-variant" />
        </div>
      ) : null}

      {credentialsEnabled ? (
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <Label
              htmlFor="auth-identifier"
              className="text-[0.74rem] font-medium uppercase tracking-[0.04em] text-on-surface-variant"
            >
              Email address
            </Label>
            <Input
              id="auth-identifier"
              autoComplete="username"
              placeholder="name@company.com"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="h-11 rounded-xl border-outline-variant bg-surface-container-lowest px-4 text-[0.92rem] shadow-sm placeholder:text-secondary-fixed-dim focus:border-primary-container focus:ring-1 focus:ring-primary-container dark:bg-surface-container"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <Label
                htmlFor="auth-password"
                className="text-[0.74rem] font-medium uppercase tracking-[0.04em] text-on-surface-variant"
              >
                Password
              </Label>
              <button
                type="button"
                className="text-[0.74rem] font-medium uppercase tracking-[0.04em] text-primary transition-colors hover:text-primary-container hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="auth-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !isPending) {
                  event.preventDefault();
                  void handleCredentialsSignIn();
                }
              }}
              className="h-11 rounded-xl border-outline-variant bg-surface-container-lowest px-4 text-[0.92rem] shadow-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container dark:bg-surface-container"
            />
          </div>

          {credentialsHint ? (
            <div className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-4 py-2.5 text-[0.74rem] leading-6 text-on-surface-variant">
              {credentialsHint}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-[0.82rem] text-error">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => void handleCredentialsSignIn()}
            disabled={isPending || !identifier.trim() || !password}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-5 py-3.5 text-[0.78rem] font-medium uppercase tracking-[0.04em] text-on-primary transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary dark:text-on-primary"
          >
            <span>{isPending ? "Signing in..." : "Sign In"}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      ) : null}

      {!credentialsEnabled && oauthProviders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant bg-surface p-4 text-[0.82rem] text-on-surface-variant">
          No sign-in method configured yet.
        </div>
      ) : null}

      {!compact ? (
        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest px-4 py-2.5 text-[0.74rem] text-on-surface-variant dark:bg-surface-container">
          After sign-in you will be redirected to{" "}
          <span className="break-all font-code-sm text-primary">{callbackUrl}</span>.
        </div>
      ) : null}
    </div>
  );
}
