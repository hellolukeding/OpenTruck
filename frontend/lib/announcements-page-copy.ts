import type { Locale } from "@/lib/i18n";

export type AnnouncementsPageCopy = {
  overview: {
    title: string;
    subtitle: string;
    streamTitle: string;
    total: (count: number) => string;
    dateLocale: string;
  };
  form: {
    title: string;
    titlePlaceholder: string;
    bodyPlaceholder: string;
    sortOrderPlaceholder: string;
    pinned: string;
    submitting: string;
    submit: string;
  };
  row: {
    edit: string;
    editTitle: string;
    editDescription: string;
    delete: string;
    deleteTitle: string;
    deleteDescription: (title: string) => string;
    cancel: string;
    saving: string;
    save: string;
    deleting: string;
    confirmDelete: string;
    pinned: string;
  };
  enums: {
    status: Record<string, string>;
    severity: Record<string, string>;
  };
  actions: {
    created: string;
    updated: string;
    deleted: string;
  };
};

const copy: Record<Locale, AnnouncementsPageCopy> = {
  en: {
    overview: {
      title: "Announcement Management",
      subtitle: "Maintain dashboard notices, operational reminders, and service updates in one place.",
      streamTitle: "Current Announcement Feed",
      total: (count) => `${count} total`,
      dateLocale: "en-US",
    },
    form: {
      title: "Create Announcement",
      titlePlaceholder: "Announcement title",
      bodyPlaceholder: "Announcement body",
      sortOrderPlaceholder: "Sort order",
      pinned: "Pin this announcement",
      submitting: "Submitting...",
      submit: "Create Announcement",
    },
    row: {
      edit: "Edit",
      editTitle: "Edit Announcement",
      editDescription: "Update the status, severity, and displayed content.",
      delete: "Delete",
      deleteTitle: "Delete Announcement",
      deleteDescription: (title) => `Deleting will remove announcement "${title}" from the feed.`,
      cancel: "Cancel",
      saving: "Saving...",
      save: "Save Changes",
      deleting: "Deleting...",
      confirmDelete: "Confirm Delete",
      pinned: "Pinned announcement",
    },
    enums: {
      status: { published: "Published", draft: "Draft", archived: "Archived" },
      severity: { info: "Info", success: "Success", warning: "Warning", error: "Error" },
    },
    actions: {
      created: "Announcement created.",
      updated: "Announcement updated.",
      deleted: "Announcement deleted.",
    },
  },
  "zh-CN": {
    overview: {
      title: "公告管理",
      subtitle: "集中维护总览公告、运营提醒和状态播报。",
      streamTitle: "当前公告流",
      total: (count) => `共 ${count} 条`,
      dateLocale: "zh-CN",
    },
    form: {
      title: "新增公告",
      titlePlaceholder: "公告标题",
      bodyPlaceholder: "公告正文",
      sortOrderPlaceholder: "排序值",
      pinned: "设为置顶公告",
      submitting: "提交中...",
      submit: "创建公告",
    },
    row: {
      edit: "编辑",
      editTitle: "编辑公告",
      editDescription: "更新状态、严重级别和展示内容。",
      delete: "删除",
      deleteTitle: "删除公告",
      deleteDescription: (title) => `删除后将移除公告“${title}”的展示。`,
      cancel: "取消",
      saving: "保存中...",
      save: "保存修改",
      deleting: "删除中...",
      confirmDelete: "确认删除",
      pinned: "置顶公告",
    },
    enums: {
      status: { published: "已发布", draft: "草稿", archived: "已归档" },
      severity: { info: "信息", success: "成功", warning: "警告", error: "错误" },
    },
    actions: {
      created: "公告已创建。",
      updated: "公告已更新。",
      deleted: "公告已删除。",
    },
  },
};

export function getAnnouncementsPageCopy(locale: Locale) {
  return copy[locale];
}
