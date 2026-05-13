"use client";

import { isValidElement, useEffect, useState, type MouseEvent, type ReactNode } from "react";

import { SignInPanel } from "@/components/sign-in-panel";
import type { AuthUiConfig } from "@/lib/auth-providers";

type SignInDialogTriggerProps = {
  callbackUrl: string;
  authUiConfig: AuthUiConfig;
  children: ReactNode;
};

export function SignInDialogTrigger({
  callbackUrl,
  authUiConfig,
  children,
}: SignInDialogTriggerProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!isValidElement(children)) {
    return null;
  }

  return (
    <>
      <span
        className="contents"
        onClick={(event: MouseEvent<HTMLSpanElement>) => {
          if (!event.defaultPrevented) {
            setOpen(true);
          }
        }}
      >
        {children}
      </span>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-md py-xl"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="OpenTruck sign in"
            className="relative w-full max-w-xl rounded-2xl border border-outline-variant bg-surface-container p-lg shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close sign in dialog"
              className="absolute right-4 top-4 text-on-surface-variant transition-colors hover:text-primary"
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="mb-md pr-xl">
              <p className="text-code-sm uppercase tracking-[0.18em] text-on-surface-variant">
                OpenTruck access
              </p>
              <h2 className="mt-xs text-title-lg text-primary">Sign in without leaving the page</h2>
              <p className="mt-xs text-body-sm text-on-surface-variant">
                Use OAuth or an operator account. You can close this dialog at any time.
              </p>
            </div>

            <SignInPanel
              callbackUrl={callbackUrl}
              providers={authUiConfig.providers}
              credentialsHint={authUiConfig.credentialsHint}
              mode="modal"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
