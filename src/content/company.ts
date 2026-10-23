// About / Why Choose Us copy, carried over from the live pages with duplicated headings removed
// and long paragraphs tightened. Values and methodology are the company's own statements.

import type { Faq, TitledText } from "./services";

export const offer = {
  /** From the old CTA band: "Describe your requirements & we shall provide you with ideas free of cost." */
  short: "Free initial project ideas",
  long: "Describe your requirements and we'll come back with ideas — free of charge.",
};

export const about = {
  whoWeAre:
    "We are a team of digital strategists, designers and developers dedicated to helping companies succeed in the digital era. A strong, active online presence is essential to business success, and we deliver creative, effective digital strategies that strengthen brands and drive long-term growth.",
  goal:
    "To be the go-to resource for businesses looking to capitalise on digital transformation — guiding clients through the complexities of modern technology and helping them achieve their objectives.",
  mission:
    "To equip companies with the expertise, strategies and resources they need to thrive in the digital world, and to deliver services that exceed our clients' expectations by staying at the forefront of digital trends and technology.",
  values: [
    { title: "Innovation", body: "We constantly explore new technologies and techniques so our solutions stay ahead." },
    { title: "Excellence", body: "We hold every deliverable to the highest standard of quality." },
    { title: "Integrity", body: "We are honest and transparent in all our interactions." },
    { title: "Teamwork", body: "We collaborate closely with clients to understand their needs and achieve their goals." },
    { title: "Client-centric", body: "Our clients are at the heart of everything we do; we solve their challenges, not generic ones." },
  ] satisfies TitledText[],
  methodology:
    "We don't apply ordinary fixes to ordinary problems. We research customer behaviour, market trends and competitors to build strategies that deliver measurable, long-term results — and we cover the whole journey, from initial concept to final result, so every part of your digital presence works together.",
};

export const differentiators: TitledText[] = [
  {
    title: "Expertise and innovation",
    body: "Our team continuously explores the latest tactics, technologies and trends — from AI-driven analytics to modern web development — so the solutions we deliver meet industry standards and go beyond them.",
  },
  {
    title: "Tailored, not templated",
    body: "No two businesses are alike. We take the time to understand your goals, challenges and competitive landscape, and build a strategy that fits your audience and your brand.",
  },
  {
    title: "Results-driven",
    body: "Everything we do aims at tangible outcomes — a stronger online presence, more targeted traffic, higher conversion rates. We use data to guide decisions and monitor performance continuously.",
  },
  {
    title: "A true partnership",
    body: "From initial strategy to implementation and beyond, we work alongside you — available to support, answer questions and adjust as needed. Your success is our success.",
  },
  {
    title: "One accountable team",
    body: "Brand, web, apps and marketing designed to work as an integrated whole. Use one service or let us be your single-source provider, with consistency and cohesion across every project.",
  },
];

/** Company-wide way of working, condensed from the old About ("Our Unique Methodology") and Why Choose Us pages. */
export const processSteps: TitledText[] = [
  { title: "Discover", body: "We learn your business, goals and competitive landscape, and research your customers and market." },
  { title: "Plan", body: "We agree a strategy and roadmap with clear timelines and action items, so every step serves your goals." },
  { title: "Create", body: "We design and build — from initial concept to final result — with your feedback at every stage." },
  { title: "Launch & improve", body: "We launch, monitor performance with data, and keep refining what works." },
];

/** General FAQs for the homepage. Answers are from the old homepage FAQ and CTA copy. */
export const generalFaqs: Faq[] = [
  {
    question: "Is the first consultation free?",
    answer: "Yes. Describe your requirements and we'll come back with ideas, free of charge.",
  },
  {
    question: "Do I have to use all of your services?",
    answer:
      "No. Each service stands on its own. When it helps, we can also act as a single-source provider across brand, web, apps and marketing, so everything stays consistent.",
  },
  {
    question: "What benefits can I expect from your digital marketing consulting?",
    answer:
      "Tailored strategies that strengthen your online presence, increase website traffic and enhance brand awareness, with the aim of measurable growth and a higher return on investment.",
  },
  {
    question: "Why is having a digital strategy important for my business?",
    answer:
      "It keeps you competitive, drives growth and improves customer experience by aligning digital efforts with your business objectives and the right technologies.",
  },
  {
    question: "How can branding and design services impact my business?",
    answer:
      "They create a strong identity, differentiate your brand and keep messaging consistent across channels — which engages your audience and builds trust and loyalty.",
  },
  {
    question: "Can web development consulting improve my website's user experience?",
    answer:
      "Yes — through responsive, user-friendly design, seamless navigation, secure transactions and optimised performance, which lead to higher engagement and conversion rates.",
  },
];
