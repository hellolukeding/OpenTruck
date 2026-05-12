import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export type AuthProviderMeta = {
  id: "github" | "google";
  name: string;
  description: string;
};

const providerMeta: AuthProviderMeta[] = [
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

export function getEnabledAuthProviderMeta(): AuthProviderMeta[] {
  return providerMeta.filter((provider) => {
    const prefix = provider.id.toUpperCase();
    return Boolean(process.env[`AUTH_${prefix}_ID`] && process.env[`AUTH_${prefix}_SECRET`]);
  });
}

export function getAuthProviders() {
  const providers = [];

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
