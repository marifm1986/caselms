import {
  Briefcase,
  ChartColumn,
  FileText,
  Gavel,
  Globe,
  Lock,
  Plug,
  Receipt,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

// Icon keys selectable in the admin panel for features.
export const featureIcons: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  workflow: Workflow,
  file: FileText,
  receipt: Receipt,
  shield: ShieldCheck,
  users: Users,
  chart: ChartColumn,
  plug: Plug,
  scale: Scale,
  gavel: Gavel,
  lock: Lock,
  globe: Globe,
  zap: Zap,
  sparkles: Sparkles,
};

export function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const Icon = featureIcons[name] ?? Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}

type SocialProps = { className?: string };

// Brand marks drawn inline (lucide no longer ships brand icons).
export const SocialIcons = {
  linkedin: ({ className }: SocialProps) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  ),
  x: ({ className }: SocialProps) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  ),
  facebook: ({ className }: SocialProps) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07Z" />
    </svg>
  ),
  youtube: ({ className }: SocialProps) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  ),
};

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Image src={light?"/logo_white.svg":"/logo_black.svg"} alt="Brand logo" className={className} height={100} width={100}></Image>
  );
}
