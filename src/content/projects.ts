// Portfolio / case studies. Intentionally empty: the old site had no project information and
// nothing may be invented. /work/, the homepage "Selected work" section and the "Work" nav link
// appear automatically once a real project is added to `projects` (see docs/architecture.md).

export type Project = {
  slug: string;
  client: string;
  title: string;
  /** Service slugs from src/content/services.ts. */
  services: string[];
  summary: string;
  /** Only measured, client-approved results. Leave empty if there are none. */
  results: string[];
  image?: { src: string; width: number; height: number; alt: string };
  /** Required: confirmation the client agreed to be named. */
  clientApproved: true;
  /** Set only on the preview placeholders below. */
  placeholder?: true;
};

export const projects: Project[] = [];

/**
 * Clearly labelled slots for reviewing the layout before real case studies exist.
 * Rendered only when PREVIEW_PLACEHOLDER_WORK=true — never set this in production.
 */
const placeholderProjects: Project[] = [1, 2, 3].map((n) => ({
  slug: `placeholder-${n}`,
  client: `Client name ${n}`,
  title: `Case study slot ${n} — replace with a real project`,
  services: n === 1 ? ["branding-and-design-consulting-services"] : n === 2 ? ["web-development-consulting-services"] : ["digital-marketing-consulting-services"],
  summary: "Placeholder. Describe the client's challenge, what was delivered, and the outcome in two or three sentences.",
  results: [],
  clientApproved: true,
  placeholder: true,
}));

export function visibleProjects(): Project[] {
  if (projects.length) return projects;
  return process.env.PREVIEW_PLACEHOLDER_WORK === "true" ? placeholderProjects : [];
}
