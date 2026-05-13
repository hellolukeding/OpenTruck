import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export type AuthProviderMeta = {
  id: "credentials" | "github" | "google";
  name: string;
  description: string;
};

export type AuthUiConfig = {
  providers: AuthProviderMeta[];
  credentialsHint: string | null;
};

export const LOCAL_AUTH_SECRET = "opentruck-local-auth-secret";

const providerMeta: AuthProviderMeta[] = [
  {
    id: "credentials",
    name: "Account Password",
    description: "Use a local operator account for direct access during setup or internal operations.",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Use your GitHub account to access the OpenTruck console.",
  },
  {
    id: "google",
    name: "Google",
    description: "Use your Google Workspace or personal account to sign in.",
  },
];

type CredentialsAuthConfig = {
  username: string;
  password: string;
  displayName: string;
};

function isPrivateNetworkHost(host: string): boolean {
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "0.0.0.0"
  ) {
    return true;
  }

  if (host.startsWith("192.168.") || host.startsWith("10.")) {
    return true;
  }

  const parts = host.split(".");
  if (parts.length === 4 && parts[0] === "172") {
    const second = Number(parts[1]);
    return second >= 16 && second <= 31;
  }

  return false;
}

function shouldAllowDefaultOperatorCredentials(host: string | null): boolean {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  if (!host) {
    return false;
  }

  const hostname = host.split(":")[0].trim().toLowerCase();
  return isPrivateNetworkHost(hostname);
}

function getCredentialsAuthConfig(host?: string | null): CredentialsAuthConfig | null {
  const username = process.env.AUTH_CREDENTIALS_USERNAME;
  const password = process.env.AUTH_CREDENTIALS_PASSWORD;
  const displayName = process.env.AUTH_CREDENTIALS_NAME || "OpenTruck Operator";

  if (username && password) {
    return {
      username,
      password,
      displayName,
    };
  }

  if (shouldAllowDefaultOperatorCredentials(host ?? null)) {
    return {
      username: "admin",
      password: "opentruck-dev-password",
      displayName,
    };
  }

  return null;
}

export function getEnabledAuthProviderMeta(host?: string | null): AuthProviderMeta[] {
  return providerMeta.filter((provider) => {
    if (provider.id === "credentials") {
      return Boolean(getCredentialsAuthConfig(host));
    }
    const prefix = provider.id.toUpperCase();
    return Boolean(process.env[`AUTH_${prefix}_ID`] && process.env[`AUTH_${prefix}_SECRET`]);
  });
}

export function getAuthUiConfig(host?: string | null): AuthUiConfig {
  const credentialsConfig = getCredentialsAuthConfig(host);

  return {
    providers: getEnabledAuthProviderMeta(host),
    credentialsHint: credentialsConfig
      ? !process.env.AUTH_CREDENTIALS_USERNAME && !process.env.AUTH_CREDENTIALS_PASSWORD
        ? "Local development fallback: account `admin`, password `opentruck-dev-password`."
        : `Use the operator credentials configured for this deployment${credentialsConfig.username ? ` for \`${credentialsConfig.username}\`.` : "."}`
      : null,
  };
}

export function getAuthProviders() {
  const providers = [];

  providers.push(
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Account",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, request) {
        const identifier = String(credentials?.identifier || "").trim();
        const password = String(credentials?.password || "");
        const host =
          request?.headers?.get("x-forwarded-host") ||
          request?.headers?.get("host") ||
          null;
        const credentialsConfig = getCredentialsAuthConfig(host);

        if (!credentialsConfig || !identifier || !password) {
          return null;
        }

        const usernameMatches =
          identifier === credentialsConfig.username ||
          identifier.toLowerCase() === credentialsConfig.username.toLowerCase();

        if (!usernameMatches || password !== credentialsConfig.password) {
          return null;
        }

        return {
          id: "credentials-operator",
          name: credentialsConfig.displayName,
          email: identifier.includes("@") ? identifier : `${credentialsConfig.username}@local.opentruck`,
        };
      },
    }),
  );

  if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
    providers.push(
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
    );
  }

  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    providers.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    );
  }

  return providers;
}
