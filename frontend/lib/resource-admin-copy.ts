import type { Locale } from "@/lib/i18n";

type ResourceAdminCopy = {
  common: {
    edit: string;
    remove: string;
    save: string;
    cancel: string;
    confirmDelete: string;
    active: string;
    disabled: string;
  };
  tenants: {
    editTitle: string;
    editDescription: string;
    deleteTitle: string;
    deleteDescription: (name: string) => string;
    labels: { name: string; status: string; quota: string; rpm: string; tpm: string };
    messages: { created: string; updated: string; deleted: string };
  };
  nodes: {
    editTitle: string;
    editDescription: string;
    deleteTitle: string;
    deleteDescription: (name: string) => string;
    labels: {
      name: string;
      baseUrl: string;
      region: string;
      authType: string;
      status: string;
      health: string;
      weight: string;
      concurrency: string;
      tags: string;
    };
    health: { unknown: string; ok: string; degraded: string; down: string; error: string };
    messages: { created: string; updated: string; deleted: string };
  };
  apiKeys: {
    editTitle: string;
    editDescription: string;
    deleteTitle: string;
    deleteDescription: (name: string) => string;
    labels: { name: string; status: string; rawKey: string; scopeJson: string };
    rawKeyHint: string;
    scopeInvalidJson: string;
    messages: { created: string; updated: string; deleted: string };
  };
  models: {
    editTitle: string;
    editDescription: string;
    deleteTitle: string;
    deleteDescription: (name: string) => string;
    labels: {
      publicModel: string;
      externalModel: string;
      input: string;
      output: string;
      priority: string;
      status: string;
    };
    messages: { created: string; updated: string; deleted: string };
  };
};

const zhCN: ResourceAdminCopy = {
  common: { edit: "编辑", remove: "删除", save: "保存修改", cancel: "取消", confirmDelete: "确认删除", active: "活跃", disabled: "禁用" },
  tenants: {
    editTitle: "编辑租户",
    editDescription: "更新租户名称、状态和速率限制。",
    deleteTitle: "删除租户",
    deleteDescription: (name) => `删除后将移除 ${name} 及其关联的 API 密钥。`,
    labels: { name: "名称", status: "状态", quota: "配额", rpm: "RPM", tpm: "TPM" },
    messages: { created: "租户创建成功。", updated: "租户更新成功。", deleted: "租户删除成功。" },
  },
  nodes: {
    editTitle: "编辑节点",
    editDescription: "更新节点的路由元信息、健康状态和容量配置。",
    deleteTitle: "删除节点",
    deleteDescription: (name) => `删除后将移除 ${name} 及其模型路由。`,
    labels: { name: "名称", baseUrl: "基础 URL", region: "区域", authType: "鉴权类型", status: "状态", health: "健康", weight: "权重", concurrency: "最大并发", tags: "标签" },
    health: { unknown: "未知", ok: "正常", degraded: "降级", down: "离线", error: "错误" },
    messages: { created: "节点创建成功。", updated: "节点更新成功。", deleted: "节点删除成功。" },
  },
  apiKeys: {
    editTitle: "编辑 API 密钥",
    editDescription: "调整名称、状态、作用域，或轮换原始密钥。",
    deleteTitle: "删除 API 密钥",
    deleteDescription: (name) => `删除后将撤销 ${name} 的访问权限。`,
    labels: { name: "名称", status: "状态", rawKey: "原始密钥", scopeJson: "Scope JSON" },
    rawKeyHint: "留空则保持当前哈希不变",
    scopeInvalidJson: "Scope 必须是合法的 JSON。",
    messages: { created: "API 密钥创建成功。", updated: "API 密钥更新成功。", deleted: "API 密钥删除成功。" },
  },
  models: {
    editTitle: "编辑模型路由",
    editDescription: "调整公开模型名、上游模型、优先级和定价。",
    deleteTitle: "删除模型路由",
    deleteDescription: (name) => `删除后将下线 ${name} 这条公开航线。`,
    labels: { publicModel: "公开模型", externalModel: "上游模型", input: "输入", output: "输出", priority: "优先级", status: "状态" },
    messages: { created: "模型路由创建成功。", updated: "模型路由更新成功。", deleted: "模型路由删除成功。" },
  },
};

const en: ResourceAdminCopy = {
  common: { edit: "Edit", remove: "Delete", save: "Save changes", cancel: "Cancel", confirmDelete: "Confirm delete", active: "Active", disabled: "Disabled" },
  tenants: {
    editTitle: "Edit tenant",
    editDescription: "Update the tenant name, status, and rate limits.",
    deleteTitle: "Delete tenant",
    deleteDescription: (name) => `This removes ${name} and its API keys.`,
    labels: { name: "Name", status: "Status", quota: "Quota", rpm: "RPM", tpm: "TPM" },
    messages: { created: "Tenant created successfully.", updated: "Tenant updated successfully.", deleted: "Tenant deleted successfully." },
  },
  nodes: {
    editTitle: "Edit node",
    editDescription: "Update routing metadata, health, and capacity.",
    deleteTitle: "Delete node",
    deleteDescription: (name) => `This removes ${name} and its model routes.`,
    labels: { name: "Name", baseUrl: "Base URL", region: "Region", authType: "Auth type", status: "Status", health: "Health", weight: "Weight", concurrency: "Max concurrency", tags: "Tags" },
    health: { unknown: "Unknown", ok: "OK", degraded: "Degraded", down: "Down", error: "Error" },
    messages: { created: "Node created successfully.", updated: "Node updated successfully.", deleted: "Node deleted successfully." },
  },
  apiKeys: {
    editTitle: "Edit API key",
    editDescription: "Adjust name, status, scope, or rotate the raw key.",
    deleteTitle: "Delete API key",
    deleteDescription: (name) => `This revokes ${name}.`,
    labels: { name: "Name", status: "Status", rawKey: "Raw key", scopeJson: "Scope JSON" },
    rawKeyHint: "Leave blank to keep the current hash",
    scopeInvalidJson: "Scope must be valid JSON.",
    messages: { created: "API key created successfully.", updated: "API key updated successfully.", deleted: "API key deleted successfully." },
  },
  models: {
    editTitle: "Edit model route",
    editDescription: "Adjust public model naming, upstream binding, priority, and pricing.",
    deleteTitle: "Delete model route",
    deleteDescription: (name) => `This unpublishes ${name}.`,
    labels: { publicModel: "Public model", externalModel: "External model", input: "Input", output: "Output", priority: "Priority", status: "Status" },
    messages: { created: "Model route created successfully.", updated: "Model route updated successfully.", deleted: "Model route deleted successfully." },
  },
};

export function getResourceAdminCopy(locale: Locale): ResourceAdminCopy {
  return locale === "zh-CN" ? zhCN : en;
}
