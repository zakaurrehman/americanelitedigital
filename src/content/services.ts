// Service content. Intro, outcomes, deliverables and FAQ answers are carried over from the
// live service pages and homepage (lightly edited for length and grammar). "Problems" and
// "process" copy was written for the redesign from the methodology the site already describes
// (research → strategy/roadmap → build → monitor and optimise); the owner should confirm it.

export type PillarId = "brand" | "build" | "grow" | "advise";

export type Faq = { question: string; answer: string };

export type TitledText = { title: string; body: string };

export type DeliverableGroup = { title?: string; items: TitledText[] };

export type Service = {
  slug: string;
  pillar: PillarId;
  /** Short name used in navigation and lists. */
  name: string;
  /** H1 text — keeps the keyword phrase the existing URL and title were built around. */
  h1: string;
  /** Benefit statement shown under the H1. */
  headline: string;
  metaTitle: string;
  metaDescription: string;
  /** One sentence for index rows and cards. */
  summary: string;
  intro: string[];
  problems: TitledText[];
  outcomesTitle: string;
  outcomes: TitledText[];
  deliverables: DeliverableGroup[];
  /** Named deliverables from the old "Browse All Services" list. */
  catalogue: { title: string; items: string[] }[];
  process: TitledText[];
  faqs: Faq[];
  related: string[];
  insights: string[];
};

export type Pillar = {
  id: PillarId;
  name: string;
  tagline: string;
  description: string;
  services: string[];
};

export const pillars: Pillar[] = [
  {
    id: "brand",
    name: "Brand",
    tagline: "Identity, logos, voice and collateral.",
    description: "Define how your business looks, sounds and stands apart — then apply it consistently everywhere.",
    services: ["branding-and-design-consulting-services"],
  },
  {
    id: "build",
    name: "Build",
    tagline: "Websites, web apps and mobile software.",
    description: "Design and engineer the websites and applications your customers and team use every day.",
    services: ["web-development-consulting-services", "application-development-consulting-services"],
  },
  {
    id: "grow",
    name: "Grow",
    tagline: "SEO, paid media, social, email and content.",
    description: "Put your business in front of the right people and turn their attention into customers.",
    services: ["digital-marketing-consulting-services"],
  },
  {
    id: "advise",
    name: "Advise",
    tagline: "Audits, roadmaps and technology decisions.",
    description: "Know where you stand, what to do next, and which tools will get you there.",
    services: ["digital-strategy-consulting-services"],
  },
];

export const services: Service[] = [
  {
    slug: "web-development-consulting-services",
    pillar: "build",
    name: "Website design & development",
    h1: "Web Development Consulting",
    headline: "A website that makes the right first impression — and turns visitors into customers.",
    metaTitle: "Website Design & Development Consulting",
    metaDescription:
      "Custom, responsive websites and online stores designed, built and maintained by American Elite Digital — on a platform your team can manage.",
    summary: "Custom, responsive websites and online stores, built on a platform your team can manage.",
    intro: [
      "Your website often gives potential clients their first impression of your brand. Our web development consulting is designed to turn your online presence into a powerful business asset.",
      "We design and build custom, responsive websites — from marketing sites to secure online stores — on a content platform your team can manage, and we keep them fast, secure and up to date after launch.",
    ],
    problems: [
      { title: "Your site undersells you", body: "It looks dated next to competitors and doesn't reflect the quality of your work." },
      { title: "Visitors leave without acting", body: "Unclear pages and buried contact options mean interest never becomes an inquiry." },
      { title: "Updating it is a chore", body: "Simple content changes need a developer, so the site drifts out of date." },
    ],
    outcomesTitle: "Why choose our web development services",
    outcomes: [
      { title: "Custom design", body: "Fully customised websites that reflect your brand's unique identity — not a template with your logo on it." },
      { title: "Responsive by default", body: "A seamless experience on phones, tablets and desktops." },
      { title: "Built to sell", body: "Secure, user-friendly e-commerce when your website needs to take orders and payments." },
    ],
    deliverables: [
      {
        items: [
          { title: "UX/UI design", body: "Intuitive interfaces that are functional and visually engaging, so every visitor has a positive experience on any device." },
          { title: "Website design & development", body: "Custom websites that capture your brand's essence and meet your business needs — responsive, user-friendly and visually appealing." },
          { title: "E-commerce solutions", body: "Secure, easy-to-navigate online stores with seamless transactions that improve customer satisfaction and boost sales." },
          { title: "Content management systems", body: "CMS solutions on platforms like WordPress, Drupal and Joomla, so your team can keep the website up to date." },
          { title: "Mobile-first design", body: "Layouts that adapt to any screen size and give a consistent experience across desktops, tablets and smartphones." },
          { title: "Optimisation & maintenance", body: "Ongoing optimisation and maintenance to keep your website fast, secure and current with the latest technologies." },
        ],
      },
    ],
    catalogue: [{ title: "Also available", items: ["Website design", "Web development", "UI/UX design"] }],
    process: [
      { title: "Discover", body: "We learn your goals, customers and competitors, and review what your current site does well and badly." },
      { title: "Plan", body: "We agree the sitemap, content and the journeys that lead visitors to contact or buy." },
      { title: "Design & build", body: "We design the interface, build it responsively, and refine it with your feedback before launch." },
      { title: "Launch & maintain", body: "We launch, monitor performance, and keep the site secure and up to date." },
    ],
    faqs: [
      {
        question: "Can web development consulting improve my website's user experience?",
        answer:
          "Yes. Web development consulting improves user experience by creating responsive, user-friendly websites with seamless navigation, secure transactions and optimised performance, which leads to higher engagement and conversion rates.",
      },
      {
        question: "Which platforms do you build on?",
        answer:
          "We offer content management solutions on platforms like WordPress, Drupal and Joomla so your team can manage content easily, and we design and develop custom websites when your needs go beyond a standard CMS.",
      },
      {
        question: "Do you look after the website after launch?",
        answer:
          "Yes. We don't just build websites — our team provides ongoing optimisation and maintenance to keep your site fast, secure and up to date.",
      },
      {
        question: "Can you build an online store?",
        answer:
          "Yes. Our e-commerce development creates secure, user-friendly online stores optimised for easy navigation and seamless transactions.",
      },
    ],
    related: ["branding-and-design-consulting-services", "application-development-consulting-services", "digital-marketing-consulting-services"],
    insights: ["website-optimization-techniques-to-improve-user-experience-and-drive-conversions"],
  },
  {
    slug: "branding-and-design-consulting-services",
    pillar: "brand",
    name: "Brand identity & design",
    h1: "Branding and Design Consulting",
    headline: "A brand your customers recognise, remember and trust.",
    metaTitle: "Branding & Logo Design Consulting",
    metaDescription:
      "Brand strategy, logo and visual identity design, brand voice and marketing collateral from American Elite Digital — a consistent brand across every touchpoint.",
    summary: "Brand strategy, logos, visual identity, voice and the collateral that carries them.",
    intro: [
      "Your brand is the foundation of your company's identity. Our branding and design consulting helps you create a brand that resonates with your target audience and leaves a lasting impression.",
      "We research your market and competitors, define how you should be positioned, then design the identity, messaging and materials that make that position visible everywhere customers meet you.",
    ],
    problems: [
      { title: "You look like everyone else", body: "Competitors with a sharper identity win the comparison before a conversation starts." },
      { title: "Every touchpoint tells a different story", body: "Your website, social profiles, business cards and proposals don't look like they come from the same company." },
      { title: "The brand no longer fits", body: "You've grown, changed direction or moved upmarket, and the old identity is holding you back." },
    ],
    outcomesTitle: "Why invest in branding and design",
    outcomes: [
      { title: "A strong identity", body: "Establish a brand that clearly differentiates you from competitors." },
      { title: "Consistent messaging", body: "Ensure uniformity across all of your marketing channels." },
      { title: "An engaged audience", body: "Build trust and loyalty with a memorable brand experience." },
    ],
    deliverables: [
      {
        items: [
          { title: "Brand strategy development", body: "Research into your target market and competitors to define positioning, values, mission and vision — so messaging stays consistent across every platform." },
          { title: "Logo & visual identity design", body: "A logo is often the first impression of your business. We create unique logos and identity systems that embody your brand's essence." },
          { title: "Brand voice & messaging", body: "A unified voice that resonates with your audience, with taglines, slogans and key messages that tell your story." },
          { title: "Digital & website design", body: "Your website is a crucial brand touchpoint. We make sure it reflects your identity and turns visitors into loyal customers." },
          { title: "Marketing collateral design", body: "Banners, business cards, brochures and social media graphics that all align with your brand aesthetic and messaging." },
          { title: "Rebranding", body: "From a minor refresh to a major overhaul, we modernise and reposition your business so your identity fits where you're going." },
        ],
      },
    ],
    catalogue: [
      {
        title: "Logo design & brand identity",
        items: [
          "Logo design",
          "Brand guide",
          "Business card",
          "Letterhead",
          "Envelope",
          "Email signature",
          "Email template design",
          "PowerPoint template",
          "Word template",
          "Presentation folder",
          "Icon design",
          "Logo animation",
        ],
      },
      {
        title: "Business & advertising",
        items: ["Brochure & leaflet", "Flyer design", "Banner ads & signage", "Packaging design", "T-shirt design", "Resume design"],
      },
    ],
    process: [
      { title: "Discover", body: "We research your market, competitors and customers, and learn what makes your business different." },
      { title: "Define", body: "We agree positioning, values and voice — the strategy every design decision answers to." },
      { title: "Design", body: "We develop concepts and refine them with your feedback into a complete identity system." },
      { title: "Deliver", body: "You receive final files and guidance so your brand is applied consistently everywhere." },
    ],
    faqs: [
      {
        question: "How can branding and design services impact my business?",
        answer:
          "Branding and design create a strong identity, differentiate your brand and keep messaging consistent across all channels — which engages your audience and builds trust and loyalty.",
      },
      {
        question: "Can you refresh our existing brand instead of starting over?",
        answer:
          "Yes. Whether your brand needs a minor refresh or a major overhaul, our rebranding services modernise and reposition your business so your identity aligns with market trends and customer expectations.",
      },
      {
        question: "Do you design the materials that carry the brand?",
        answer:
          "Yes — banners, business cards, brochures, stationery, templates and social media graphics, each aligned with your overall brand aesthetic and messaging.",
      },
    ],
    related: ["web-development-consulting-services", "digital-marketing-consulting-services"],
    insights: ["from-brand-awareness-to-conversion-the-power-of-effective-digital-campaigns"],
  },
  {
    slug: "application-development-consulting-services",
    pillar: "build",
    name: "Application & software development",
    h1: "Application Development Consulting",
    headline: "Custom web and mobile software, designed around how your business actually works.",
    metaTitle: "Web & Mobile App Development Consulting",
    metaDescription:
      "Custom web applications, iOS and Android apps and enterprise software from American Elite Digital — secure, scalable and designed for the people who use them.",
    summary: "Custom web applications, iOS and Android apps, and enterprise software that scales with you.",
    intro: [
      "Turn business ideas into working digital products. Whether you need a custom web application or a mobile app, our developers and consultants bring your vision to life.",
      "We start with a discovery workshop to define the problem, the users and the scope, then design, build and test software that fits the way your business works — and can grow with it.",
    ],
    problems: [
      { title: "Off-the-shelf tools don't fit", body: "Your team works around the software instead of the software working for them." },
      { title: "Manual processes slow you down", body: "Spreadsheets, re-keyed data and disconnected systems cost hours every week." },
      { title: "You have an idea, not a team", body: "Taking a concept to a working app needs product, design and engineering skills under one roof." },
    ],
    outcomesTitle: "Benefits of our application development services",
    outcomes: [
      { title: "Custom solutions", body: "Applications tailored to your specific business needs." },
      { title: "Scalability", body: "Solutions designed to grow with your business." },
      { title: "User-friendly design", body: "Intuitive interfaces that make people want to use what we build." },
    ],
    deliverables: [
      {
        items: [
          { title: "Custom web application development", body: "Web applications tailored to your requirements — secure, scalable and optimised for performance." },
          { title: "Mobile app development", body: "High-performance apps for iOS and Android that are visually polished, easy to use and equipped with the features your users need." },
          { title: "Enterprise software development", body: "Robust, integrated systems for larger organisations that improve productivity, streamline processes and support collaboration." },
        ],
      },
    ],
    catalogue: [
      {
        title: "Software development",
        items: [
          "Custom software development",
          "Web app development",
          "Mobile app development",
          "App backend development",
          "Operations interface development",
          "QA testing",
          "Application re-engineering",
          "Virtual office",
        ],
      },
    ],
    process: [
      { title: "Discovery workshop", body: "We define the problem, the people who'll use the software, and what success looks like." },
      { title: "Product strategy & design", body: "We scope features, plan the architecture and design the interface before code is written." },
      { title: "Build & QA testing", body: "We develop in stages you can review, with quality-assurance testing throughout." },
      { title: "Launch & evolve", body: "We release, support and re-engineer the application as your needs change." },
    ],
    faqs: [
      {
        question: "What are the advantages of application development consulting?",
        answer:
          "Application development consulting turns business ideas into user-friendly digital solutions — such as custom web and mobile applications — that improve user engagement and optimise business processes.",
      },
      {
        question: "Do you build apps for both iOS and Android?",
        answer: "Yes. Our team creates high-performance mobile applications for iOS and Android.",
      },
      {
        question: "Can you improve an application we already have?",
        answer:
          "Yes. Application re-engineering, backend development and QA testing are part of our software development services, so we can modernise or extend existing software as well as build new products.",
      },
    ],
    related: ["web-development-consulting-services", "digital-strategy-consulting-services"],
    insights: ["how-to-create-a-unified-digital-strategy-that-aligns-with-your-business-goals"],
  },
  {
    slug: "digital-marketing-consulting-services",
    pillar: "grow",
    name: "Digital marketing & SEO",
    h1: "Digital Marketing Consulting",
    headline: "Get found by the right people — and give them a reason to choose you.",
    metaTitle: "Digital Marketing & SEO Consulting",
    metaDescription:
      "SEO, PPC, social media, content, email marketing and conversion optimisation from American Elite Digital — strategies built around your business goals.",
    summary: "SEO, pay-per-click, social, content, email and conversion optimisation, measured against your goals.",
    intro: [
      "Simply being online is no longer enough. You need a comprehensive, dynamic strategy that distinguishes your brand and connects with your audience.",
      "Our consultants work with you to build a digital marketing plan aligned with your business goals — whether you want more website traffic, more conversions or greater brand awareness — and we measure what it delivers.",
    ],
    problems: [
      { title: "Great business, low visibility", body: "Customers searching for what you offer find your competitors first." },
      { title: "Ad spend without clarity", body: "You're paying for clicks but can't see which campaigns bring in customers." },
      { title: "Traffic that doesn't convert", body: "People visit, then leave without calling, booking or buying." },
    ],
    outcomesTitle: "Why choose our digital marketing services",
    outcomes: [
      { title: "Customised strategies", body: "No one-size-fits-all plans. Every strategy is tailored to your market and objectives." },
      { title: "An experienced team", body: "Industry professionals who follow the latest trends and techniques in digital marketing." },
      { title: "A focus on results", body: "We focus on tangible outcomes — higher traffic, better engagement, more sales and revenue." },
    ],
    deliverables: [
      {
        title: "Marketing",
        items: [
          { title: "PPC advertising", body: "Campaigns targeted at your ideal audience on platforms like Google Ads, with spend optimised to maximise return." },
          { title: "Social media marketing", body: "Profile management, engaging content and growth strategies on platforms like Facebook, Instagram and LinkedIn." },
          { title: "Content marketing", body: "High-quality, relevant content that resonates with your audience, builds authority and drives organic traffic." },
          { title: "Email marketing", body: "Personalised campaigns that nurture leads, promote your services and encourage repeat business." },
          { title: "Conversion rate optimisation", body: "Analysis of how people use your website to improve the customer journey and turn more visitors into customers." },
          { title: "Analytics & reporting", body: "Actionable insight into the impact of your digital efforts, so decisions are driven by data." },
        ],
      },
      {
        title: "Search engine optimisation",
        items: [
          { title: "On-page optimisation", body: "Meta tags, headings, image alt text and internal linking that help search engines understand your content." },
          { title: "Keyword research & strategy", body: "Finding the terms your customers search for and working them naturally into your content." },
          { title: "Technical SEO", body: "Site architecture, broken links, mobile responsiveness and page speed — the foundations rankings depend on." },
          { title: "Link building", body: "A tailored strategy to earn relevant, authoritative backlinks that build credibility." },
          { title: "Local SEO", body: "Optimising your website and Google Business Profile so you appear prominently in local searches." },
          { title: "SEO audits & reports", body: "Detailed audits of current performance and regular reports on traffic, engagement and rankings." },
        ],
      },
    ],
    catalogue: [],
    process: [
      { title: "Audit", body: "We review your traffic, rankings, campaigns and conversion paths to see where you stand." },
      { title: "Strategy", body: "We choose channels, keywords and budgets that line up with your business goals." },
      { title: "Launch", body: "We create the content and campaigns, and fix the technical issues holding you back." },
      { title: "Measure & optimise", body: "We monitor performance continuously and adjust what isn't working." },
    ],
    faqs: [
      {
        question: "What benefits can I expect from your digital marketing consulting services?",
        answer:
          "Tailored strategies that strengthen your online presence, increase website traffic and enhance brand awareness, with the aim of measurable growth and a higher return on investment.",
      },
      {
        question: "How does SEO consulting improve my website's search engine performance?",
        answer:
          "By optimising on-page elements, conducting keyword research, strengthening technical SEO and building high-quality backlinks — all of which increase organic traffic and rankings.",
      },
      {
        question: "Do you offer local SEO?",
        answer:
          "Yes. If you serve a specific area, we optimise your website and Google Business Profile so you appear prominently in local searches.",
      },
    ],
    related: ["web-development-consulting-services", "digital-strategy-consulting-services", "branding-and-design-consulting-services"],
    insights: ["the-future-of-digital-marketing", "from-brand-awareness-to-conversion-the-power-of-effective-digital-campaigns"],
  },
  {
    slug: "digital-strategy-consulting-services",
    pillar: "advise",
    name: "Digital strategy & consulting",
    h1: "Digital Strategy & Consulting",
    headline: "A clear, prioritised roadmap for your digital investment.",
    metaTitle: "Digital Strategy & Consulting Services",
    metaDescription:
      "Digital audits, strategic roadmaps, technology integration and business consulting from American Elite Digital — so every digital initiative serves your goals.",
    summary: "Digital audits, roadmaps, technology integration and business consulting.",
    intro: [
      "In a fast-moving digital environment, a clear strategy is critical to staying competitive and driving growth. Our digital strategy and consulting gives your company the knowledge, guidance and tools to navigate it.",
      "We start by taking a comprehensive look at your business — your goals, challenges and unique value proposition — then assess your current digital efforts and identify where improvement will matter most.",
    ],
    problems: [
      { title: "Lots of activity, no plan", body: "Website, social, ads and tools grew piece by piece, and nobody owns the whole picture." },
      { title: "Unsure where to invest", body: "You know something needs to change, but not which project will pay off first." },
      { title: "Systems that don't connect", body: "Your CRM, marketing tools and website don't share data, so decisions rely on guesswork." },
    ],
    outcomesTitle: "Why invest in a digital strategy",
    outcomes: [
      { title: "Stay competitive", body: "Use the right technologies and trends to stay ahead." },
      { title: "Drive growth", body: "Aligning digital efforts with business objectives increases efficiency and revenue." },
      { title: "Better customer experience", body: "Understanding and improving the customer journey raises satisfaction and retention." },
    ],
    deliverables: [
      {
        items: [
          { title: "Comprehensive digital audits", body: "A thorough analysis of your digital assets — including your website and social media — to find gaps and growth opportunities." },
          { title: "Strategic planning & roadmaps", body: "A clear roadmap with timelines and action items, so every initiative aligns with your goals and is executed precisely." },
          { title: "Technology integration", body: "Help choosing and implementing the right tools — from marketing automation to CRM systems — to improve satisfaction and efficiency." },
          { title: "Business consulting", body: "Expert guidance and strategic support to improve performance, foster sustainable growth or streamline operations." },
        ],
      },
    ],
    catalogue: [{ title: "Advisory", items: ["Digital transformation", "Discovery workshop", "Product strategy", "Process consulting"] }],
    process: [
      { title: "Audit", body: "We analyse your website, channels, tools and data to establish where you stand." },
      { title: "Prioritise", body: "We weigh opportunities against your goals, budget and capacity." },
      { title: "Roadmap", body: "You get a sequenced plan with timelines, owners and action items." },
      { title: "Implement", body: "We stay involved through implementation and adjust the plan as results come in." },
    ],
    faqs: [
      {
        question: "Why is having a digital strategy important for my business?",
        answer:
          "A digital strategy keeps you competitive, drives growth and improves customer experience by aligning digital efforts with your business objectives and the right technologies.",
      },
      {
        question: "What does a digital audit cover?",
        answer:
          "We analyse your digital assets — including your website and social media accounts — to identify gaps and growth opportunities. The audit forms the foundation of your tailored strategy.",
      },
      {
        question: "Will you help us implement the plan?",
        answer:
          "Yes. From initial strategy development to implementation and beyond, we work closely with you — supporting, answering questions and adjusting as needed.",
      },
    ],
    related: ["digital-marketing-consulting-services", "web-development-consulting-services", "application-development-consulting-services"],
    insights: [
      "how-to-create-a-unified-digital-strategy-that-aligns-with-your-business-goals",
      "website-optimization-techniques-to-improve-user-experience-and-drive-conversions",
    ],
  },
];

export function getService(slug: string): Service {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}

export function getPillar(id: PillarId): Pillar {
  const pillar = pillars.find((p) => p.id === id);
  if (!pillar) throw new Error(`Unknown pillar: ${id}`);
  return pillar;
}

/** Services in pillar order (Brand → Build → Grow → Advise), for navigation. */
export const servicesInPillarOrder: Service[] = pillars.flatMap((p) => p.services.map(getService));
