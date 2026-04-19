export const DEFAULT_API = "http://bukhbatllc.mn";

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API;
}

export type ChatMessage = {
  id: string;
  role: "user" | "bot" | "agent";
  text: string;
  createdAt?: string;
};
