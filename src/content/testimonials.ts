// Client testimonials. Intentionally empty: nothing may be invented. The homepage "What clients say"
// section appears automatically once a real, client-approved quote is added here.
// Testimonials are deliberately NOT emitted as Review/AggregateRating structured data — Google
// ignores self-published reviews of a business, and the brief forbids rating schema.

export type Testimonial = {
  /** The client's words, unedited apart from trimming (mark cuts with "…"). */
  quote: string;
  /** Person's name as they agreed to be credited (e.g. "Jane D."). */
  name: string;
  /** Job title and/or company, if the client agreed to show them. */
  role?: string;
  /** Service slug from src/content/services.ts the work was for. */
  service?: string;
  /** Required: confirmation the client agreed to be quoted on the website. */
  clientApproved: true;
  /** Set only on the preview placeholders below. */
  placeholder?: true;
};

export const testimonials: Testimonial[] = [];

/** Clearly labelled slots for reviewing the layout. Rendered only when PREVIEW_PLACEHOLDER_WORK=true. */
const placeholderTestimonials: Testimonial[] = [1, 2, 3].map((n) => ({
  quote: "Placeholder. A real client’s quote about working with American Elite Digital goes here, with their permission.",
  name: `Client name ${n}`,
  role: "Role, company",
  clientApproved: true,
  placeholder: true,
}));

export function visibleTestimonials(): Testimonial[] {
  if (testimonials.length) return testimonials;
  return process.env.PREVIEW_PLACEHOLDER_WORK === "true" ? placeholderTestimonials : [];
}
