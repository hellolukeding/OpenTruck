"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
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
  if (id === "github") return <GitHubIcon />;
  if (id === "google") return <GoogleIcon />;
  return null;
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
  const credentialsEnabled = providers.some((p) => p.id === "credentials");
  const oauthProviders = providers.filter((p) => p.id !== "credentials");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(mode !== "modal");

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

  return (
    <div className="flex">
      {/* ========== LEFT PANEL ========== */}
      <div className="min-w-0">
        {/* Branding in modal mode */}
        {mode === "modal" ? (
          <div className="mb-5">
            <img src="/logo.png" alt="OpenTruck" className="h-7 w-auto" />
            <p className="mt-1.5 text-body-sm text-on-surface-variant">
              Multi-tenant AI API relay station
            </p>
          </div>
        ) : (
          <div className="mb-5">
            <p className="text-code-sm uppercase tracking-[0.18em] text-on-surface-variant">
              Sign in
            </p>
            <h2 className="mt-1 text-title-lg text-primary">
              Choose a sign-in method
            </h2>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Use OAuth or a local operator account to enter the OpenTruck
              control surface.
            </p>
          </div>
        )}

        {/* OAuth provider buttons */}
        {oauthProviders.length > 0 ? (
          <div className="flex flex-col gap-2">
            {oauthProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => void handleOAuthSignIn(provider)}
                className="group flex w-full items-center gap-3 rounded-xl border border-outline-variant bg-surface px-4 py-3 text-left transition-all hover:border-primary hover:bg-primary/[0.03] hover:shadow-sm active:scale-[0.98]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant group-hover:text-primary">
                  <ProviderIcon id={provider.id} />
                </span>
                <span className="flex-1 text-body-md font-body-md text-on-surface group-hover:text-primary">
                  Continue with {provider.name}
                </span>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-all group-hover:translate-x-0.5 group-hover:text-primary">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {/* Password toggle divider */}
        {credentialsEnabled ? (
          <div className="mt-5">
            {!showPassword ? (
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-outline-variant" />
                <button
                  type="button"
                  onClick={() => setShowPassword(true)}
                  className="group flex items-center gap-1.5 whitespace-nowrap text-code-sm text-on-surface-variant transition-colors hover:text-primary"
                >
                  Sign in with password
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5">
                    arrow_forward
                  </span>
                </button>
                <div className="h-px flex-1 bg-outline-variant" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowPassword(false);
                  setErrorMessage(null);
                }}
                className="flex items-center gap-1.5 text-code-sm text-on-surface-variant transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                Back to OAuth
              </button>
            )}
          </div>
        ) : null}

        {/* Empty state */}
        {!credentialsEnabled && oauthProviders.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-outline-variant bg-surface p-4">
            <p className="text-title-sm text-primary">
              No sign-in method configured yet
            </p>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Add OAuth provider env vars, or set `AUTH_CREDENTIALS_USERNAME`
              and `AUTH_CREDENTIALS_PASSWORD` for operator login.
            </p>
          </div>
        ) : null}

        {/* Redirect hint (page only) */}
        {mode === "page" ? (
          <div className="mt-5 rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-body-sm text-on-surface-variant">
            After sign-in you will be redirected to{" "}
            <span className="font-code-sm text-primary">{callbackUrl}</span>.
          </div>
        ) : null}
      </div>

      {/* ========== RIGHT PANEL — slides in ========== */}
      <div
        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: showPassword ? 340 : 0,
          opacity: showPassword ? 1 : 0,
        }}
      >
        <div className="flex w-[340px]">
          <div className="ml-5 w-full border-l border-outline-variant pl-5">
            {showPassword ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-title-sm text-primary">
                    Account password
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(false);
                      setErrorMessage(null);
                    }}
                    className="text-code-sm text-on-surface-variant transition-colors hover:text-primary"
                  >
                    Cancel
                  </button>
                </div>

                {credentialsHint ? (
                  <p className="text-body-xs text-on-surface-variant">
                    {credentialsHint}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="auth-identifier">Account</Label>
                    <Input
                      id="auth-identifier"
                      autoComplete="username"
                      placeholder="Username or email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="auth-password">Password</Label>
                    <Input
                      id="auth-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isPending) {
                          e.preventDefault();
                          void handleCredentialsSignIn();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => void handleCredentialsSignIn()}
                    disabled={isPending || !identifier.trim() || !password}
                    className="w-full"
                  >
                    {isPending ? "Signing in…" : "Sign in"}
                  </Button>
                </div>

                {errorMessage ? (
                  <div className="rounded-xl border border-error/20 bg-error/5 px-4 py-2.5 text-body-sm text-error">
                    {errorMessage}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
