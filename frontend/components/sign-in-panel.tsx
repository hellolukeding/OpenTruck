"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthProviderMeta } from "@/lib/auth-providers";

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
  const oauthProviders = providers.filter((provider) => provider.id !== "credentials");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const title =
    mode === "modal" ? "Sign in to continue" : "Choose a sign-in method";
  const summary =
    mode === "modal"
      ? "Use OAuth or an operator account without leaving the current page."
      : "Use OAuth or a local operator account to enter the OpenTruck control surface.";

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
    <div className="space-y-lg">
      <div className="space-y-xs">
        <p className="text-code-sm uppercase tracking-[0.18em] text-on-surface-variant">
          Authentication
        </p>
        <h2 className="text-title-lg text-primary">{title}</h2>
        <p className="text-body-md text-on-surface-variant">{summary}</p>
      </div>

      {credentialsEnabled ? (
        <div className="space-y-md rounded-xl border border-outline-variant bg-surface p-lg">
          <div className="space-y-xs">
            <p className="text-title-sm text-primary">Account password</p>
            {credentialsHint ? (
              <p className="text-body-sm text-on-surface-variant">{credentialsHint}</p>
            ) : null}
          </div>
          <div className="grid gap-md">
            <div className="space-y-xs">
              <Label htmlFor="auth-identifier">Account</Label>
              <Input
                id="auth-identifier"
                autoComplete="username"
                placeholder="admin"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
              />
            </div>
            <div className="space-y-xs">
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !isPending) {
                    event.preventDefault();
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
              {isPending ? "Signing in..." : "Sign in with password"}
            </Button>
          </div>
        </div>
      ) : null}

      {oauthProviders.length > 0 ? (
        <div className="space-y-md">
          <div className="space-y-xs">
            <p className="text-title-sm text-primary">OAuth providers</p>
            <p className="text-body-sm text-on-surface-variant">
              Registration and sign-in share the same OAuth entry.
            </p>
          </div>
          <div className="space-y-sm">
            {oauthProviders.map((provider) => (
              <Button
                key={provider.id}
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => void handleOAuthSignIn(provider)}
              >
                <span>{provider.name}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {!credentialsEnabled && oauthProviders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant bg-surface p-lg">
          <p className="text-title-sm text-primary">No sign-in method configured yet</p>
          <p className="mt-xs text-body-sm text-on-surface-variant">
            Add OAuth provider env vars, or configure `AUTH_CREDENTIALS_USERNAME` and
            `AUTH_CREDENTIALS_PASSWORD` for operator login.
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-outline-variant bg-surface px-md py-sm text-body-sm text-primary">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-xl border border-outline-variant bg-surface px-md py-sm text-body-sm text-on-surface-variant">
        After sign-in you will be redirected to{" "}
        <span className="font-code-sm text-primary">{callbackUrl}</span>.
      </div>
    </div>
  );
}
