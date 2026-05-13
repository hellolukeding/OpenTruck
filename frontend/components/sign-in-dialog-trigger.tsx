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
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!isValidElement(children)) return null;

  return (
    <>
      <span
        className="contents"
        onClick={(event: MouseEvent<HTMLSpanElement>) => {
          if (!event.defaultPrevented) setOpen(true);
        }}
      >
        {children}
      </span>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="OpenTruck sign in"
            className="relative w-auto min-w-[360px] max-w-[680px] rounded-2xl border border-outline-variant bg-surface-container p-6 shadow-[0_32px_80px_rgba(0,0,0,0.35)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close sign in dialog"
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

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
