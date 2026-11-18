import { z } from "zod";

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1).default("MarketPulse India"),
  NEXT_PUBLIC_SITE_URL: z
    .url({ protocol: /^https?$/, hostname: /.+/ })
    .refine((value) => {
      const url = URL.parse(value);
      return url !== null && url.href === `${url.origin}/`;
    }, "Use an HTTP(S) origin without credentials, a path, or a query")
    .default("http://localhost:3000"),
});

export function parsePublicEnvironment(input: {
  NEXT_PUBLIC_APP_NAME?: string;
  NEXT_PUBLIC_SITE_URL?: string;
}): z.infer<typeof publicEnvironmentSchema> {
  return publicEnvironmentSchema.parse(input);
}

export const publicEnvironment = parsePublicEnvironment({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
