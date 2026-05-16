"use client";

import type { UpstreamAccount } from "@/lib/admin-api";
import { formatDateTime, formatExtraValue } from "@/lib/date-formatters";
import { getUpstreamAccountsPageCopy } from "@/lib/upstream-accounts-page-copy";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UpstreamAccountDetailsDialogProps {
  locale: "en" | "zh-CN";
  account: UpstreamAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpstreamAccountDetailsDialog({
  locale,
  account,
  open,
  onOpenChange,
}: UpstreamAccountDetailsDialogProps) {
  const copy = getUpstreamAccountsPageCopy(locale).dialogs;

  const detailItems = [
    { label: copy.fields.id, value: account.id },
    { label: copy.fields.name, value: account.name },
    { label: copy.fields.tenantId, value: account.tenant_id },
    { label: copy.fields.accountType, value: account.account_type },
    { label: copy.fields.platform, value: account.platform },
    { label: copy.fields.status, value: account.status },
    { label: copy.fields.priority, value: account.priority },
    { label: copy.fields.consecutiveFailures, value: account.consecutive_failures },
    { label: copy.fields.lastUsedAt, value: formatDateTime(account.last_used_at, locale, "-") },
    { label: copy.fields.cooldownUntil, value: formatDateTime(account.cooldown_until, locale, "-") },
    { label: copy.fields.createdAt, value: formatDateTime(account.created_at, locale, "-") },
    { label: copy.fields.updatedAt, value: formatDateTime(account.updated_at, locale, "-") },
    { label: copy.fields.extra, value: formatExtraValue(account.extra, "-") },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" type="button">
          {copy.details}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{copy.detailsTitle}</DialogTitle>
          <DialogDescription>{copy.detailsDescription(account.name)}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 text-sm">
          {detailItems.map((item) => (
            <div key={item.label} className="grid grid-cols-[140px_1fr] gap-2">
              <span className="font-medium text-muted-foreground">{item.label}:</span>
              <span className="break-all">{item.value}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
