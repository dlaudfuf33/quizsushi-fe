import { cookies } from "next/headers";

export async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export async function getCookieSession() {
  const cookieStore = await cookies();
  return cookieStore.get("JSESSIONID");
}

export async function getCsrfToken() {
  const cookieStore = await cookies();
  return cookieStore.get("XSRF-TOKEN")?.value;
}
