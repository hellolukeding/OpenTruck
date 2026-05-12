"use client";

import Link from "next/link";

import type { Tenant } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UpstreamAccountFiltersProps = {
  locale: "en" | "zh-CN";
  path: string;
  search?: string;
  status?: string;
  tenantId?: string;
  accountType?: string;
  platform?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  tenants: Tenant[];
};

export function UpstreamAccountFilters({
  locale,
  path,
  search,
  status,
  tenantId,
  accountType,
  platform,
  sortBy,
  sortOrder,
  tenants,
}: UpstreamAccountFiltersProps) {
  const copy =
    locale === "zh-CN"
      ? {
          searchLabel: "搜索",
          searchPlaceholder: "按账号名、邮箱或错误码搜索",
          statusLabel: "状态",
          tenantLabel: "租户",
          accountTypeLabel: "账号类型",
          platformLabel: "平台",
          sortByLabel: "排序字段",
          sortOrderLabel: "排序方向",
          allStatuses: "全部状态",
          allTenants: "全部租户",
          allTypes: "全部类型",
          allPlatforms: "全部平台",
          oauth: "OAuth",
          openai: "OpenAI / Codex",
          priority: "优先级",
          lastUsedAt: "最近使用",
          cooldownUntil: "冷却结束",
          lastErrorAt: "最近错误时间",
          tokenExpiresAt: "Token 过期时间",
          createdAt: "创建时间",
          ascending: "升序",
          descending: "降序",
          apply: "应用筛选",
          clear: "清空",
        }
      : {
          searchLabel: "Search",
          searchPlaceholder: "Search by account, email, or error code",
          statusLabel: "Status",
          tenantLabel: "Tenant",
          accountTypeLabel: "Account type",
          platformLabel: "Platform",
          sortByLabel: "Sort by",
          sortOrderLabel: "Order",
          allStatuses: "All statuses",
          allTenants: "All tenants",
          allTypes: "All types",
          allPlatforms: "All platforms",
          oauth: "OAuth",
          openai: "OpenAI / Codex",
          priority: "Priority",
          lastUsedAt: "Last used",
          cooldownUntil: "Cooldown until",
          lastErrorAt: "Last error time",
          tokenExpiresAt: "Token expiry",
          createdAt: "Created at",
          ascending: "Ascending",
          descending: "Descending",
          apply: "Apply filters",
          clear: "Clear",
        };

  return (
    <form
      action={path}
      className="grid gap-sm rounded-2xl border border-outline-variant bg-surface p-md md:grid-cols-2 xl:grid-cols-4"
    >
      <div className="grid gap-2 xl:col-span-2">
        <label className="font-code-sm text-code-sm uppercase tracking-wide text-on-surface-variant">
          {copy.searchLabel}
        </label>
        <Input name="search" defaultValue={search ?? ""} placeholder={copy.searchPlaceholder} />
      </div>
      <div className="grid gap-2">
        <label className="font-code-sm text-code-sm uppercase tracking-wide text-on-surface-variant">
          {copy.statusLabel}
        </label>
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
        >
          <option value="">{copy.allStatuses}</option>
          <option value="active">{locale === "zh-CN" ? "活跃" : "Active"}</option>
          <option value="disabled">{locale === "zh-CN" ? "禁用" : "Disabled"}</option>
        </select>
      </div>
      <div className="grid gap-2">
        <label className="font-code-sm text-code-sm uppercase tracking-wide text-on-surface-variant">
          {copy.tenantLabel}
        </label>
        <select
          name="tenant_id"
          defaultValue={tenantId ?? ""}
          className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
        >
          <option value="">{copy.allTenants}</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <label className="font-code-sm text-code-sm uppercase tracking-wide text-on-surface-variant">
          {copy.accountTypeLabel}
        </label>
        <select
          name="account_type"
          defaultValue={accountType ?? ""}
          className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
        >
          <option value="">{copy.allTypes}</option>
          <option value="oauth">{copy.oauth}</option>
        </select>
      </div>
      <div className="grid gap-2">
        <label className="font-code-sm text-code-sm uppercase tracking-wide text-on-surface-variant">
          {copy.platformLabel}
        </label>
        <select
          name="platform"
          defaultValue={platform ?? ""}
          className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
        >
          <option value="">{copy.allPlatforms}</option>
          <option value="openai">{copy.openai}</option>
        </select>
      </div>
      <div className="grid gap-2">
        <label className="font-code-sm text-code-sm uppercase tracking-wide text-on-surface-variant">
          {copy.sortByLabel}
        </label>
        <select
          name="sort_by"
          defaultValue={sortBy ?? "priority"}
          className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
        >
          <option value="priority">{copy.priority}</option>
          <option value="last_used_at">{copy.lastUsedAt}</option>
          <option value="cooldown_until">{copy.cooldownUntil}</option>
          <option value="last_error_at">{copy.lastErrorAt}</option>
          <option value="token_expires_at">{copy.tokenExpiresAt}</option>
          <option value="created_at">{copy.createdAt}</option>
        </select>
      </div>
      <div className="grid gap-2">
        <label className="font-code-sm text-code-sm uppercase tracking-wide text-on-surface-variant">
          {copy.sortOrderLabel}
        </label>
        <select
          name="sort_order"
          defaultValue={sortOrder ?? "asc"}
          className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
        >
          <option value="asc">{copy.ascending}</option>
          <option value="desc">{copy.descending}</option>
        </select>
      </div>
      <div className="flex items-end gap-sm xl:col-span-4">
        <Button type="submit">{copy.apply}</Button>
        <Link
          href={path}
          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent px-md py-sm text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
        >
          {copy.clear}
        </Link>
      </div>
    </form>
  );
}
