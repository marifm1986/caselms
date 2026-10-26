export type SocialLinks = {
  linkedin?: string;
  x?: string;
  facebook?: string;
  youtube?: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  description: string;
  email: string;
  salesEmail: string;
  phone: string;
  address: string;
  hours: string;
  mapUrl: string;
  announcement: string;
  socials: SocialLinks;
};

export type Feature = {
  id: string;
  title: string;
  summary: string;
  description: string;
  icon: string;
  category: string;
  bullets: string[];
  order: number;
  published: boolean;
};

export type Plan = {
  id: string;
  name: string;
  audience: string;
  monthlyPrice: number;
  annualPrice: number;
  priceNote: string;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
  order: number;
  published: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  firm: string;
  avatar: string;
  order: number;
  published: boolean;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
};

export type Stat = {
  id: string;
  label: string;
  value: number;
  prefix: string;
  suffix: string;
  order: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  order: number;
  published: boolean;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  publishedAt: string;
  published: boolean;
};

export const ADMIN_SCOPES = ["content", "messages", "settings", "users"] as const;
export type AdminScope = (typeof ADMIN_SCOPES)[number];

export const ADMIN_SCOPE_LABELS: Record<AdminScope, string> = {
  content: "Content",
  messages: "Messages",
  settings: "Site settings",
  users: "User management",
};

export const ADMIN_ROLES = ["owner", "admin", "editor"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
};

export type AdminUser = {
  uid: string;
  email: string;
  role: AdminRole;
  scopes: AdminScope[];
  createdAt?: string;
  createdBy?: string | null;
};

export type AdminInvite = {
  id: string;
  email: string;
  role: Exclude<AdminRole, "owner">;
  scopes: AdminScope[];
  createdAt: string;
  createdBy: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  firm: string;
  phone: string;
  topic: string;
  message: string;
  createdAt: string;
  read: boolean;
};
