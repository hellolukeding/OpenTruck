"use client";

import Link from "next/link";
import type { DeveloperPageCopy } from "@/lib/console-page-copy";

type DeveloperKeyItem = {
  id: string;
  name: string;
  fingerprint: string;
  lastUsed: string;
  status: string;
};

type DeveloperModelItem = {
  name: string;
  usage: string;
  fill: number;
  color: string;
  href?: string;
};

export function DeveloperApiKeys({
  keys,
  locale,
  copy,
}: {
  keys: DeveloperKeyItem[];
  locale: string;
  copy: DeveloperPageCopy["apiKeys"];
}) {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-xl airy-shadow flex flex-col">
      <div className="px-lg py-md border-b border-outline-variant/30 flex items-center justify-between">
        <h3 className="font-headline-md text-body-lg font-bold">{copy.title}</h3>
        <Link className="font-label-md text-label-md text-primary hover:underline" href={`/${locale}/api-keys`}>
          {copy.viewAll}
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-sm">
          <thead className="bg-surface-container-low text-on-surface-variant/70 border-b border-outline-variant/10 uppercase tracking-tighter text-[11px]">
            <tr>
              <th className="px-lg py-3 font-bold">{copy.name}</th>
              <th className="px-lg py-3 font-bold">{copy.lastUsed}</th>
              <th className="px-lg py-3 font-bold text-right">{copy.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {keys.length > 0 ? keys.map((key) => (
              <tr key={key.name} className="hover:bg-surface-container transition-colors">
                <td className="px-lg py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">{key.name}</span>
                    <span className="text-secondary font-code-md">{key.fingerprint}</span>
                  </div>
                </td>
                <td className="px-lg py-4 text-on-surface-variant">{key.lastUsed}</td>
                <td className="px-lg py-4 text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                    key.status === "active"
                      ? "bg-primary-container/10 text-primary"
                      : "bg-surface-container-highest text-secondary"
                  }`}>
                    {key.status === "active" ? copy.active : key.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="px-lg py-8 text-center text-on-surface-variant" colSpan={3}>
                  {copy.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DeveloperTopModels({
  models,
  locale,
  copy,
}: {
  models: DeveloperModelItem[];
  locale: string;
  copy: DeveloperPageCopy["models"];
}) {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-xl airy-shadow p-lg">
      <div className="flex items-center justify-between mb-lg">
        <h3 className="font-headline-md text-body-lg font-bold">{copy.title}</h3>
        <Link className="material-symbols-outlined text-secondary hover:text-on-surface" href={`/${locale}/logs`}>
          more_vert
        </Link>
      </div>
      <div className="space-y-md">
        {models.length > 0 ? models.map((m) => (
          <div key={m.name} className="space-y-sm">
            <div className="flex justify-between font-label-md text-label-md">
              {m.href ? (
                <Link className="font-bold text-on-surface hover:text-primary" href={m.href}>
                  {m.name}
                </Link>
              ) : (
                <span className="font-bold text-on-surface">{m.name}</span>
              )}
              <span className="text-secondary">{m.usage}</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div className={`${m.color} h-full`} style={{ width: `${m.fill}%` }} />
            </div>
          </div>
        )) : (
          <div className="rounded-lg bg-surface-container-low px-md py-lg text-body-sm text-on-surface-variant">
            {copy.empty}
          </div>
        )}
      </div>
      <div className="mt-lg p-md bg-surface-container-low rounded-lg flex items-center gap-md">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
        <p className="font-body-sm text-body-sm text-on-secondary-container">
          {copy.footer}
        </p>
      </div>
    </div>
  );
}
