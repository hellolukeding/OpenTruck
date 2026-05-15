"use client";

import type { UpstreamAccount } from "@/lib/admin-api";
import { formatDateTime, formatExtraValue } from "@/lib/date-formatters";
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
  const copy =
    locale === "zh-CN"
      ? {
          details: "详情",
          detailsTitle: "上游账号详情",
          detailsDescription: `查看 ${account.name} 的完整元数据和调度状态。`,
          close: "关闭",
        }
      : {
          details: "Details",
          detailsTitle: "Upstream Account Details",
          detailsDescription: `View full metadata and scheduling state for ${account.name}.`,
          close: "Close",
        };

  const detailItems = [
    { label: "ID", value: account.id },
    { label: "Name", value: account.name },
    { label: "Tenant ID", value: account.tenant_id },
    { label: "Account Type", value: account.account_type },
    { label: "Platform", value: account.platform },
    { label: "Status", value: account.status },
    { label: "Priority", value: account.priority },
    { label: "Consecutive Failures", value: account.consecutive_failures },
    { label: "Last Used At", value: formatDateTime(account.last_used_at, locale, "-") },
    { label: "Cooldown Until", value: formatDateTime(account.cooldown_until, locale, "-") },
    { label: "Created At", value: formatDateTime(account.created_at, locale, "-") },
    { label: "Updated At", value: formatDateTime(account.updated_at, locale, "-") },
    { label: "Extra", value: formatExtraValue(account.extra, "-") },
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
          <DialogDescription>{copy.detailsDescription}</DialogDescription>
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
