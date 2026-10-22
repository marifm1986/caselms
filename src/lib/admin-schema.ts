import { featureIcons } from "@/components/ui/icons";
import {
  defaultFaqs,
  defaultFeatures,
  defaultPlans,
  defaultPosts,
  defaultStats,
  defaultTeam,
  defaultTestimonials,
} from "./defaults";

// Declarative description of each CMS collection. The admin CRUD screens,
// forms and seeding are all driven from this file: add a field here and it
// appears in the admin automatically.

export type FieldType = "text" | "textarea" | "number" | "boolean" | "image" | "list" | "select" | "date" | "slug";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  /** For slug fields: the field the slug is generated from. */
  from?: string;
};

export type CollectionDef = {
  key: string;
  label: string;
  singular: string;
  description: string;
  /** Cache tag refreshed on the public site after a change. */
  tag: string;
  titleField: string;
  columns: string[];
  fields: FieldDef[];
  seed: Record<string, unknown>[];
};

const published: FieldDef = { name: "published", label: "Published", type: "boolean", help: "Only published items appear on the site." };
const order: FieldDef = { name: "order", label: "Display order", type: "number", help: "Lower numbers appear first." };

export const collections: CollectionDef[] = [
  {
    key: "features",
    label: "Features",
    singular: "feature",
    description: "Product features shown on the home and features pages.",
    tag: "features",
    titleField: "title",
    columns: ["title", "category", "order", "published"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "summary", label: "Short summary", type: "text", required: true, help: "One line, used on feature cards." },
      { name: "description", label: "Description", type: "textarea", required: true, rows: 4 },
      { name: "category", label: "Category", type: "text", required: true },
      {
        name: "icon",
        label: "Icon",
        type: "select",
        options: Object.keys(featureIcons).map((k) => ({ value: k, label: k })),
      },
      { name: "bullets", label: "Key points", type: "list", help: "One point per line." },
      order,
      published,
    ],
    seed: defaultFeatures,
  },
  {
    key: "plans",
    label: "Pricing plans",
    singular: "plan",
    description: "Plans on the pricing page and firm-size cards on the home page.",
    tag: "plans",
    titleField: "name",
    columns: ["name", "monthlyPrice", "annualPrice", "highlighted", "published"],
    fields: [
      { name: "name", label: "Plan name", type: "text", required: true },
      { name: "audience", label: "Who it's for", type: "text", required: true },
      { name: "monthlyPrice", label: "Monthly price (£)", type: "number", help: "Set both prices to 0 for custom pricing." },
      { name: "annualPrice", label: "Annual price per month (£)", type: "number" },
      { name: "priceNote", label: "Price note", type: "text", help: 'For example "per user / month" or "Tailored pricing".' },
      { name: "features", label: "Included features", type: "list", help: "One feature per line." },
      { name: "ctaLabel", label: "Button label", type: "text", required: true },
      { name: "highlighted", label: "Highlight as most popular", type: "boolean" },
      order,
      published,
    ],
    seed: defaultPlans,
  },
  {
    key: "testimonials",
    label: "Testimonials",
    singular: "testimonial",
    description: "Customer quotes.",
    tag: "testimonials",
    titleField: "name",
    columns: ["name", "firm", "order", "published"],
    fields: [
      { name: "quote", label: "Quote", type: "textarea", required: true, rows: 4 },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text" },
      { name: "firm", label: "Firm", type: "text" },
      { name: "avatar", label: "Photo", type: "image" },
      order,
      published,
    ],
    seed: defaultTestimonials,
  },
  {
    key: "faqs",
    label: "FAQs",
    singular: "FAQ",
    description: "Questions on the home and pricing pages.",
    tag: "faqs",
    titleField: "question",
    columns: ["question", "order", "published"],
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true, rows: 4 },
      order,
      published,
    ],
    seed: defaultFaqs,
  },
  {
    key: "stats",
    label: "Stats",
    singular: "stat",
    description: "Animated numbers on the home page.",
    tag: "stats",
    titleField: "label",
    columns: ["label", "value", "suffix", "order"],
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "value", label: "Value", type: "number", required: true },
      { name: "prefix", label: "Prefix", type: "text", help: 'For example "£".' },
      { name: "suffix", label: "Suffix", type: "text", help: 'For example "+", "%" or "M".' },
      order,
    ],
    seed: defaultStats,
  },
  {
    key: "team",
    label: "Team",
    singular: "team member",
    description: "People shown on the about page.",
    tag: "team",
    titleField: "name",
    columns: ["name", "role", "order", "published"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "bio", label: "Short bio", type: "textarea", rows: 3 },
      { name: "photo", label: "Photo", type: "image" },
      order,
      published,
    ],
    seed: defaultTeam,
  },
  {
    key: "posts",
    label: "Insights",
    singular: "article",
    description: "Blog articles on the insights page.",
    tag: "posts",
    titleField: "title",
    columns: ["title", "publishedAt", "published"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "slug", from: "title", required: true, help: "Generated from the title. Lowercase letters, numbers and hyphens." },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true, rows: 2, help: "Used in listings and search results." },
      {
        name: "content",
        label: "Content",
        type: "textarea",
        required: true,
        rows: 14,
        help: 'Separate paragraphs with a blank line. Start a line with "## " for a heading.',
      },
      { name: "coverImage", label: "Cover image", type: "image" },
      { name: "author", label: "Author", type: "text", required: true },
      { name: "tags", label: "Tags", type: "list", help: "One tag per line." },
      { name: "publishedAt", label: "Publish date", type: "date", required: true },
      published,
    ],
    seed: defaultPosts,
  },
];

export const getCollection = (key: string) => collections.find((c) => c.key === key);

export function emptyRecord(def: CollectionDef): Record<string, unknown> {
  const today = new Date().toISOString().slice(0, 10);
  return Object.fromEntries(
    def.fields.map((f) => {
      switch (f.type) {
        case "number":
          return [f.name, 0];
        case "boolean":
          return [f.name, f.name === "published"];
        case "list":
          return [f.name, []];
        case "date":
          return [f.name, today];
        case "select":
          return [f.name, f.options?.[0]?.value ?? ""];
        default:
          return [f.name, ""];
      }
    }),
  );
}
