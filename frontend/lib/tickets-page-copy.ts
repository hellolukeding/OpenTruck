import type { Locale } from "@/lib/i18n";

export type TicketsPageCopy = {
  overview: {
    title: string;
    subtitle: string;
    create: string;
    submit: string;
  };
  categories: {
    open: string;
    processing: string;
    resolved: string;
  };
  support: {
    title: string;
    responseTitle: string;
    responseBody: string;
    escalationTitle: string;
    escalationBody: string;
    detailsTitle: string;
    detailsBody: string;
  };
  list: {
    title: string;
    viewThread: string;
    emptyTitle: string;
    emptyBody: string;
  };
  filters: {
    searchPlaceholder: string;
    priorityPlaceholder: string;
    allStatuses: string;
    submit: string;
    reset: string;
  };
  form: {
    subjectLabel: string;
    subjectPlaceholder: string;
    categoryLabel: string;
    categoryPlaceholder: string;
    priorityLabel: string;
    priorityPlaceholder: string;
    contactLabel: string;
    contactPlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    submitting: string;
    submit: string;
  };
  detail: {
    threadTitle: string;
    threadEmpty: string;
    updating: string;
    update: string;
    noMessages: string;
    authorNamePlaceholder: string;
    internalLabel: string;
    replyPlaceholder: string;
    sending: string;
    send: string;
    internalSuffix: string;
    dateLocale: string;
  };
  enums: {
    status: Record<string, string>;
    priority: Record<string, string>;
    authorType: Record<string, string>;
  };
};

const copy: Record<Locale, TicketsPageCopy> = {
  en: {
    overview: {
      title: "Support Center",
      subtitle: "Submit issues, track progress, and review the full reply history.",
      create: "New Ticket",
      submit: "Submit Request",
    },
    categories: {
      open: "Open",
      processing: "Processing",
      resolved: "Resolved",
    },
    support: {
      title: "Support Notes",
      responseTitle: "Response Times",
      responseBody: "Normal tickets usually receive a first response within 12 hours on business days, while urgent tickets are prioritized.",
      escalationTitle: "Escalation Policy",
      escalationBody: "Payment issues, key leaks, and billing mismatches are automatically escalated to a higher priority.",
      detailsTitle: "Add Context",
      detailsBody: "Keep replying in the thread with screenshots, request ids, and upstream account details for faster diagnosis.",
    },
    list: {
      title: "Recent Tickets",
      viewThread: "View thread",
      emptyTitle: "No tickets yet",
      emptyBody: "Once you submit your first ticket, progress updates will appear here.",
    },
    filters: {
      searchPlaceholder: "Search by subject, category, or email",
      priorityPlaceholder: "Priority",
      allStatuses: "All statuses",
      submit: "Search",
      reset: "Reset",
    },
    form: {
      subjectLabel: "Subject",
      subjectPlaceholder: "Example: wallet balance was not credited",
      categoryLabel: "Category",
      categoryPlaceholder: "Payments, routing, models, billing, accounts",
      priorityLabel: "Priority",
      priorityPlaceholder: "normal / urgent / critical",
      contactLabel: "Contact email",
      contactPlaceholder: "operator@company.com",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Include the error time, key name, model name, and request id when possible for faster investigation.",
      submitting: "Submitting...",
      submit: "Submit Ticket",
    },
    detail: {
      threadTitle: "Ticket Thread",
      threadEmpty: "Select a ticket from the list to view the full conversation and follow-up actions.",
      updating: "Updating...",
      update: "Update Status",
      noMessages: "This ticket has no follow-up replies yet. Add an internal note or customer-facing update to move it forward.",
      authorNamePlaceholder: "Operator name, for example OpenTruck Support",
      internalLabel: "Mark as an internal note",
      replyPlaceholder: "Share investigation progress, request a request id, or confirm the action you already completed.",
      sending: "Sending...",
      send: "Send Reply",
      internalSuffix: " / internal",
      dateLocale: "en-US",
    },
    enums: {
      status: { open: "Open", processing: "Processing", resolved: "Resolved" },
      priority: { low: "Low", normal: "Normal", urgent: "Urgent", critical: "Critical" },
      authorType: { operator: "Operator", customer: "Customer", system: "System" },
    },
  },
  "zh-CN": {
    overview: {
      title: "工单中心",
      subtitle: "提交问题、跟踪进度、查看历史回复",
      create: "新建工单",
      submit: "提交建议",
    },
    categories: {
      open: "待处理",
      processing: "处理中",
      resolved: "已解决",
    },
    support: {
      title: "支持说明",
      responseTitle: "响应时间",
      responseBody: "工作日内普通工单通常在 12 小时内首响，紧急工单会优先处理。",
      escalationTitle: "问题升级",
      escalationBody: "涉及支付异常、密钥泄漏、计费错误等问题会自动升级到更高优先级。",
      detailsTitle: "补充信息",
      detailsBody: "你可以在工单中继续追加截图、request id 和上下游账号信息。",
    },
    list: {
      title: "最近工单",
      viewThread: "查看线程",
      emptyTitle: "暂无工单记录",
      emptyBody: "当你提交第一张工单后，处理进度会显示在这里。",
    },
    filters: {
      searchPlaceholder: "按标题、类型、邮箱搜索",
      priorityPlaceholder: "优先级",
      allStatuses: "全部状态",
      submit: "查询",
      reset: "重置",
    },
    form: {
      subjectLabel: "问题标题",
      subjectPlaceholder: "例如：钱包入账异常",
      categoryLabel: "问题类型",
      categoryPlaceholder: "支付、路由、模型、账单、账号",
      priorityLabel: "优先级",
      priorityPlaceholder: "normal / urgent / critical",
      contactLabel: "联系邮箱",
      contactPlaceholder: "operator@company.com",
      descriptionLabel: "问题描述",
      descriptionPlaceholder: "请尽量提供错误时间、令牌名称、模型名称和 request id，方便快速定位。",
      submitting: "提交中...",
      submit: "提交工单",
    },
    detail: {
      threadTitle: "工单线程",
      threadEmpty: "从左侧选择一张工单后，这里会显示完整对话和处理动作。",
      updating: "更新中...",
      update: "更新状态",
      noMessages: "这张工单还没有后续回复，先补一条处理记录吧。",
      authorNamePlaceholder: "处理人，如 OpenTruck Support",
      internalLabel: "记为内部备注，不对外显示语义标签",
      replyPlaceholder: "补充排查进展、索取 request id，或同步已完成的处理动作。",
      sending: "发送中...",
      send: "发送回复",
      internalSuffix: " / internal",
      dateLocale: "zh-CN",
    },
    enums: {
      status: { open: "待处理", processing: "处理中", resolved: "已解决" },
      priority: { low: "低", normal: "普通", urgent: "紧急", critical: "严重" },
      authorType: { operator: "运营", customer: "用户", system: "系统" },
    },
  },
};

export function getTicketsPageCopy(locale: Locale) {
  return copy[locale];
}
