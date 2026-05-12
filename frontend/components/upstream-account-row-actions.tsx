"use client";

import { useActionState, useEffect, useState } from "react";

import type { UpstreamAccount } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import {
  deleteUpstreamAccountAction,
  refreshUpstreamAccountAction,
  updateUpstreamAccountAction,
} from "@/lib/admin-actions";
import { FormStatus } from "@/components/form-status";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const idleState: AdminActionState = { status: "idle" };

function toDateTimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const pad = (input: number) => String(input).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateTime(value: string | null, locale: "en" | "zh-CN", fallback: string): string {
  if (!value) return fallback;

  return new Intl.DateTimeFormat(locale === "zh-CN" ? "zh-CN" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatExtraValue(value: unknown, fallback: string): string {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

export function UpstreamAccountRowActions({
  locale,
  account,
}: {
  locale: "en" | "zh-CN";
  account: UpstreamAccount;
}) {
  const copy =
    locale === "zh-CN"
      ? {
          details: "详情",
          edit: "编辑",
          refresh: "刷新",
          remove: "删除",
          save: "保存修改",
          cancel: "取消",
          confirmDelete: "确认删除",
          runRefresh: "立即刷新 Token",
          editTitle: "编辑上游账号",
          editDescription: "调整调度优先级、状态和时间窗口，方便运营处理账号池。",
          refreshTitle: "刷新上游账号",
          refreshDescription: `尝试为 ${account.name} 拉取新的 access token。`,
          deleteTitle: "删除上游账号",
          deleteDescription: `删除后将把 ${account.name} 从租户账号池中移除。`,
          detailsTitle: "上游账号详情",
          detailsDescription: "查看调度、身份与 Token 生命周期字段，便于排查网关选路和账号池故障。",
          name: "名称",
          tenantId: "租户 ID",
          platform: "平台",
          accountType: "账号类型",
          priority: "优先级",
          status: "状态",
          email: "邮箱",
          providerAccountId: "Provider Account ID",
          providerUserId: "Provider User ID",
          organizationId: "组织 ID",
          planType: "套餐",
          clientId: "Client ID",
          tokenExpiresAt: "Token 过期时间",
          lastRefreshedAt: "最近刷新",
          lastUsed: "最近使用",
          lastErrorAt: "最近错误时间",
          lastErrorCode: "最近错误码",
          failures: "连续失败次数",
          refreshToken: "Refresh Token",
          maxParallelRequests: "并发上限",
          rawExtra: "额外元数据",
          cooldownUntil: "冷却结束时间",
          active: "活跃",
          disabled: "禁用",
          available: "可用",
          unavailable: "不可用",
          none: "无",
          close: "关闭",
        }
      : {
          details: "Details",
          edit: "Edit",
          refresh: "Refresh",
          remove: "Delete",
          save: "Save changes",
          cancel: "Cancel",
          confirmDelete: "Confirm delete",
          runRefresh: "Refresh token now",
          editTitle: "Edit upstream account",
          editDescription: "Adjust scheduler priority, status, and time windows for the tenant account pool.",
          refreshTitle: "Refresh upstream account",
          refreshDescription: `Attempt to fetch a fresh access token for ${account.name}.`,
          deleteTitle: "Delete upstream account",
          deleteDescription: `This removes ${account.name} from the tenant pool.`,
          detailsTitle: "Upstream account details",
          detailsDescription: "Inspect scheduler, identity, and token lifecycle fields to debug routing and pool health.",
          name: "Name",
          tenantId: "Tenant ID",
          platform: "Platform",
          accountType: "Account type",
          priority: "Priority",
          status: "Status",
          email: "Email",
          providerAccountId: "Provider Account ID",
          providerUserId: "Provider User ID",
          organizationId: "Organization ID",
          planType: "Plan",
          clientId: "Client ID",
          tokenExpiresAt: "Token expiry",
          lastRefreshedAt: "Last refreshed",
          lastUsed: "Last used",
          lastErrorAt: "Last error time",
          lastErrorCode: "Last error code",
          failures: "Consecutive failures",
          refreshToken: "Refresh token",
          maxParallelRequests: "Max parallel requests",
          rawExtra: "Extra metadata",
          cooldownUntil: "Cooldown until",
          active: "Active",
          disabled: "Disabled",
          available: "Available",
          unavailable: "Unavailable",
          none: "None",
          close: "Close",
        };

  const detailItems = [
    { label: copy.name, value: account.name },
    { label: copy.tenantId, value: account.tenant_id },
    { label: copy.platform, value: account.platform },
    { label: copy.accountType, value: account.account_type },
    { label: copy.status, value: account.status },
    { label: copy.priority, value: String(account.priority) },
    { label: copy.email, value: account.email ?? copy.none },
    { label: copy.providerAccountId, value: account.provider_account_id ?? copy.none },
    { label: copy.providerUserId, value: account.provider_user_id ?? copy.none },
    { label: copy.organizationId, value: account.organization_id ?? copy.none },
    { label: copy.planType, value: account.plan_type ?? copy.none },
    { label: copy.clientId, value: account.client_id ?? copy.none },
    { label: copy.tokenExpiresAt, value: formatDateTime(account.token_expires_at, locale, copy.none) },
    { label: copy.lastRefreshedAt, value: formatDateTime(account.last_refreshed_at, locale, copy.none) },
    { label: copy.lastUsed, value: formatDateTime(account.last_used_at, locale, copy.none) },
    { label: copy.cooldownUntil, value: formatDateTime(account.cooldown_until, locale, copy.none) },
    { label: copy.lastErrorAt, value: formatDateTime(account.last_error_at, locale, copy.none) },
    { label: copy.lastErrorCode, value: account.last_error_code ?? copy.none },
    { label: copy.failures, value: String(account.consecutive_failures) },
    { label: copy.refreshToken, value: account.has_refresh_token ? copy.available : copy.unavailable },
    {
      label: copy.maxParallelRequests,
      value: formatExtraValue(account.extra["max_parallel_requests"], copy.none),
    },
    { label: copy.rawExtra, value: formatExtraValue(account.extra, copy.none) },
  ];

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [refreshOpen, setRefreshOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [status, setStatus] = useState(account.status);
  const [editState, editAction, editPending] = useActionState(updateUpstreamAccountAction, idleState);
  const [refreshState, refreshAction, refreshPending] = useActionState(refreshUpstreamAccountAction, idleState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteUpstreamAccountAction, idleState);

  useEffect(() => {
    if (editState.status === "success") {
      setEditOpen(false);
    }
  }, [editState.status]);

  useEffect(() => {
    if (refreshState.status === "success") {
      setRefreshOpen(false);
    }
  }, [refreshState.status]);

  useEffect(() => {
    if (deleteState.status === "success") {
      setDeleteOpen(false);
    }
  }, [deleteState.status]);

  return (
    <div className="flex items-center justify-end gap-xs">
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" type="button">
            {copy.details}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{copy.detailsTitle}</DialogTitle>
            <DialogDescription>{copy.detailsDescription}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2">
            {detailItems.map((item) => (
              <div
                key={item.label}
                className="grid gap-1 rounded-xl border border-outline-variant bg-surface-container-low p-md"
              >
                <span className="font-code-sm text-code-sm uppercase tracking-wide text-on-surface-variant">
                  {item.label}
                </span>
                <span className="break-all font-body-md text-body-md text-primary">{item.value}</span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setDetailsOpen(false)}>
              {copy.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" type="button">
            {copy.edit}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.editTitle}</DialogTitle>
            <DialogDescription>{copy.editDescription}</DialogDescription>
          </DialogHeader>
          <form action={editAction} className="grid gap-4">
            <input type="hidden" name="account_id" value={account.id} />
            <div className="grid gap-2">
              <Label htmlFor={`upstream-name-${account.id}`}>{copy.name}</Label>
              <Input id={`upstream-name-${account.id}`} name="name" defaultValue={account.name} required />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`upstream-priority-${account.id}`}>{copy.priority}</Label>
                <Input id={`upstream-priority-${account.id}`} name="priority" type="number" defaultValue={account.priority} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`upstream-status-${account.id}`}>{copy.status}</Label>
                <select
                  id={`upstream-status-${account.id}`}
                  name="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
                >
                  <option value="active">{copy.active}</option>
                  <option value="disabled">{copy.disabled}</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`upstream-expiry-${account.id}`}>{copy.tokenExpiresAt}</Label>
                <Input
                  id={`upstream-expiry-${account.id}`}
                  name="token_expires_at"
                  type="datetime-local"
                  defaultValue={toDateTimeLocal(account.token_expires_at)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`upstream-cooldown-${account.id}`}>{copy.cooldownUntil}</Label>
                <Input
                  id={`upstream-cooldown-${account.id}`}
                  name="cooldown_until"
                  type="datetime-local"
                  defaultValue={toDateTimeLocal(account.cooldown_until)}
                />
              </div>
            </div>
            <FormStatus status={editState.status} message={editState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                {copy.cancel}
              </Button>
              <Button type="submit" disabled={editPending}>
                {copy.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={refreshOpen} onOpenChange={setRefreshOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" type="button">
            {copy.refresh}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.refreshTitle}</DialogTitle>
            <DialogDescription>{copy.refreshDescription}</DialogDescription>
          </DialogHeader>
          <form action={refreshAction} className="grid gap-4">
            <input type="hidden" name="account_id" value={account.id} />
            <FormStatus status={refreshState.status} message={refreshState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setRefreshOpen(false)}>
                {copy.cancel}
              </Button>
              <Button type="submit" disabled={refreshPending || !account.has_refresh_token}>
                {copy.runRefresh}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" type="button" className="text-error hover:text-error">
            {copy.remove}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.deleteTitle}</DialogTitle>
            <DialogDescription>{copy.deleteDescription}</DialogDescription>
          </DialogHeader>
          <form action={deleteAction} className="grid gap-4">
            <input type="hidden" name="account_id" value={account.id} />
            <FormStatus status={deleteState.status} message={deleteState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)}>
                {copy.cancel}
              </Button>
              <Button type="submit" disabled={deletePending}>
                {copy.confirmDelete}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
