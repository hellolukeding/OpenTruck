export type UpstreamAccountsPageCopy = {
  intake: {
    eyebrow: string;
    title: string;
    description: string;
    tabs: { start: string; complete: string };
    selectTenant: string;
    start: {
      labels: {
        tenant: string;
        selectTenant: string;
        redirectUri: string;
        proxyUrl: string;
        authUrl: string;
        expiresAt: string;
        sessionId: string;
        state: string;
      };
      hints: { redirectUri: string; proxyUrl: string };
      actions: { generate: string; open: string };
      messages: { generated: string };
    };
    complete: {
      labels: {
        tenant: string;
        selectTenant: string;
        sessionId: string;
        state: string;
        code: string;
        name: string;
        status: string;
      };
      hints: { code: string; state: string; sessionId: string };
      actions: { create: string };
      status: { active: string; disabled: string };
      messages: { created: string };
    };
  };
  table: {
    eyebrow: string;
    title: string;
    description: string;
    empty: string;
    noteTitle: string;
    noteBody: string;
    labels: {
      tenant: string;
      status: string;
      priority: string;
      lastUsed: string;
      cooldown: string;
      lastError: string;
      refresh: string;
      email: string;
      failures: string;
      never: string;
      clear: string;
      hasRefreshToken: string;
      noRefreshToken: string;
    };
  };
  summary: {
    totalAccounts: string;
    inTenantPool: string;
    active: string;
    eligibleForRouting: string;
    cooling: string;
    temporarilyRemoved: string;
    disabled: string;
    manuallyStopped: string;
    expiringSoon: string;
    tokenNeedsRefresh: string;
    topErrors: string;
    noRecentErrors: string;
    topTenants: string;
    noTenantDistribution: string;
  };
  dialogs: {
    details: string;
    detailsTitle: string;
    detailsDescription: (name: string) => string;
    edit: string;
    save: string;
    cancel: string;
    editTitle: string;
    editDescription: string;
    refresh: string;
    runRefresh: string;
    refreshTitle: string;
    refreshDescription: (name: string) => string;
    delete: string;
    confirmDelete: string;
    deleteTitle: string;
    deleteDescription: (name: string) => string;
    fields: {
      id: string;
      name: string;
      tenantId: string;
      accountType: string;
      platform: string;
      status: string;
      priority: string;
      consecutiveFailures: string;
      lastUsedAt: string;
      cooldownUntil: string;
      createdAt: string;
      updatedAt: string;
      extra: string;
    };
  };
  actions: {
    oauthLinkCreated: string;
    accountConnected: string;
    accountUpdated: string;
    accountDeleted: string;
    accountRefreshed: string;
  };
};
