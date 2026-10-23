// Article index. Titles, dates, author and featured images come from the WordPress REST API
// (/wp-json/wp/v2/posts, captured 2026-10-23). Bodies live in ./insights/<slug>.md.

export type Insight = {
  slug: string;
  title: string;
  /** Drawn from the article's own introduction, for cards and meta descriptions. */
  summary: string;
  author: string;
  published: string;
  modified: string;
  topic: string;
  image: { src: string; width: number; height: number; alt: string };
};

const AUTHOR = "Daniel Shane Sheibani Davidson, MD, MBA, DBA, PhD";

export const insights: Insight[] = [
  {
    slug: "the-future-of-digital-marketing",
    title: "The Future of Digital Marketing",
    summary:
      "As we move more into the digital era, marketing tactics are changing quickly — from AI and voice search to video, AR and the rise of ethical, data-conscious marketing.",
    author: AUTHOR,
    published: "2024-05-24T15:01:06Z",
    modified: "2024-10-18T04:29:35Z",
    topic: "Digital marketing",
    image: {
      src: "/images/insights/the-future-of-digital-marketing.jpg",
      width: 1600,
      height: 1144,
      alt: "The word “Digital” over a night-time city skyline overlaid with a network of connected points.",
    },
  },
  {
    slug: "from-brand-awareness-to-conversion-the-power-of-effective-digital-campaigns",
    title: "From Brand Awareness to Conversion: The Power of Effective Digital Campaigns",
    summary:
      "It is no longer enough to merely have a significant internet presence. How effective digital campaigns turn brand visibility into measurable business growth.",
    author: AUTHOR,
    published: "2024-05-24T15:01:03Z",
    modified: "2024-10-18T04:24:16Z",
    topic: "Campaigns",
    image: {
      src: "/images/insights/from-brand-awareness-to-conversion.jpg",
      width: 1600,
      height: 1067,
      alt: "A team reviewing printed infographics and a laptop dashboard around a meeting table.",
    },
  },
  {
    slug: "how-to-create-a-unified-digital-strategy-that-aligns-with-your-business-goals",
    title: "How to Create a Unified Digital Strategy that Aligns with Your Business Goals",
    summary:
      "A clear digital strategy keeps every online activity your company takes in line with your primary goals. Here is how to build one, step by step.",
    author: AUTHOR,
    published: "2024-05-24T15:00:19Z",
    modified: "2024-10-18T04:17:15Z",
    topic: "Strategy",
    image: {
      src: "/images/insights/unified-digital-strategy.jpg",
      width: 1600,
      height: 863,
      alt: "The word “Strategy” in a circular graphic over colleagues meeting in an office.",
    },
  },
  {
    slug: "website-optimization-techniques-to-improve-user-experience-and-drive-conversions",
    title: "Website Optimization Techniques to Improve User Experience and Drive Conversions",
    summary:
      "Techniques that improve your website’s speed, usability and conversion paths — raising engagement, improving retention and boosting leads or sales.",
    author: AUTHOR,
    published: "2024-05-19T04:18:15Z",
    modified: "2024-10-18T04:16:02Z",
    topic: "Websites",
    image: {
      src: "/images/insights/website-optimization-techniques.jpg",
      width: 1600,
      height: 1068,
      alt: "Two colleagues discussing a finance dashboard on a desktop monitor.",
    },
  },
];

/** Newest first. */
export const insightsByDate = [...insights].sort((a, b) => b.published.localeCompare(a.published));

export function getInsight(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug);
}
