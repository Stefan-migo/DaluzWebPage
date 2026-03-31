"use client";

import { cn } from "@/lib/utils";
import {
  ExternalLink,
  FileText,
  Play,
  Video,
  Image,
  Music,
  type LucideIcon,
} from "lucide-react";
import type { DynamicLink, LinkIcon } from "@/types/membership";

// Icon mapping
const iconMap: Record<LinkIcon, LucideIcon> = {
  play: Play,
  document: FileText,
  video: Video,
  audio: Music,
  image: Image,
  external: ExternalLink,
};

export interface DynamicLinksProps {
  links: DynamicLink[];
  className?: string;
  variant?: "default" | "cards" | "buttons";
  showLabels?: boolean;
}

/**
 * DynamicLinks Component
 * Renders external links from Sanity CMS with appropriate icons
 */
export function DynamicLinks({
  links,
  className,
  variant = "default",
  showLabels = true,
}: DynamicLinksProps) {
  // Filter active links only
  const activeLinks = links?.filter((link) => link.isActive !== false) || [];

  if (activeLinks.length === 0) {
    return null;
  }

  if (variant === "cards") {
    return (
      <div className={cn("grid gap-4", className)}>
        {activeLinks.map((link, index) => (
          <DynamicLinkCard key={link._key || index} link={link} />
        ))}
      </div>
    );
  }

  if (variant === "buttons") {
    return (
      <div className={cn("flex flex-wrap gap-3", className)}>
        {activeLinks.map((link, index) => (
          <DynamicLinkButton
            key={link._key || index}
            link={link}
            showLabel={showLabels}
          />
        ))}
      </div>
    );
  }

  // Default: inline list
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {activeLinks.map((link, index) => (
        <DynamicLinkInline
          key={link._key || index}
          link={link}
          showLabel={showLabels}
        />
      ))}
    </div>
  );
}

/**
 * Single link as inline element
 */
function DynamicLinkInline({
  link,
  showLabel,
}: {
  link: DynamicLink;
  showLabel?: boolean;
}) {
  const Icon = iconMap[link.icon as LinkIcon] || ExternalLink;

  return (
    <a
      href={link.url}
      target={link.openInNewTab ? "_blank" : "_self"}
      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 text-sm text-brand-primary hover:text-brand-primary/80 transition-colors"
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {showLabel && <span>{link.label}</span>}
    </a>
  );
}

/**
 * Single link as a button
 */
function DynamicLinkButton({
  link,
  showLabel,
}: {
  link: DynamicLink;
  showLabel?: boolean;
}) {
  const Icon = iconMap[link.icon as LinkIcon] || ExternalLink;

  return (
    <a
      href={link.url}
      target={link.openInNewTab ? "_blank" : "_self"}
      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm font-medium"
    >
      <Icon className="w-4 h-4" />
      {showLabel && <span>{link.label}</span>}
    </a>
  );
}

/**
 * Single link as a card
 */
function DynamicLinkCard({ link }: { link: DynamicLink }) {
  const Icon = iconMap[link.icon as LinkIcon] || ExternalLink;

  return (
    <a
      href={link.url}
      target={link.openInNewTab ? "_blank" : "_self"}
      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
      className="group flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-primary/50 hover:shadow-md transition-all"
    >
      <div className="flex-shrink-0 w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-brand-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-brand-primary transition-colors">
          {link.label}
        </h4>
        {link.url && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {link.url.replace(/^https?:\/\//, "").split("/")[0]}
          </p>
        )}
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-brand-primary transition-colors flex-shrink-0 mt-1" />
    </a>
  );
}

// ============================================================================
// Server Component wrapper for fetching data
// ============================================================================

import { getDynamicLinksBySection } from "@/sanity/lib/queries";

export interface DynamicLinksBySectionProps {
  section: string;
  className?: string;
  variant?: "default" | "cards" | "buttons";
  showLabels?: boolean;
}

/**
 * Server component that fetches and renders dynamic links by section
 * Usage: <DynamicLinksBySection section="sesiones" />
 */
export async function DynamicLinksBySection({
  section,
  className,
  variant = "default",
  showLabels = true,
}: DynamicLinksBySectionProps) {
  const sectionData = await getDynamicLinksBySection(section);

  if (!sectionData || !sectionData.links) {
    return null;
  }

  return (
    <DynamicLinks
      links={sectionData.links}
      className={className}
      variant={variant}
      showLabels={showLabels}
    />
  );
}
