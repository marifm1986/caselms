export { clsx as cn } from "clsx";

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export const readingTime = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 220));

/** Only allow http(s) links from CMS content, so a stored `javascript:` URL can never render. */
export const safeUrl = (value: string | undefined) => {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
};

export const isMapEmbed = (value: string) => safeUrl(value).startsWith("https://www.google.com/maps/embed");
