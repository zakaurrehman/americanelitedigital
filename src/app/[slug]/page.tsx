import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Markdown from "react-markdown";
import { CtaBand } from "@/components/sections/CtaBand";
import { formatDate } from "@/components/sections/InsightList";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { GlowRule } from "@/components/ui/Ornament";
import { getInsight, insights, insightsByDate } from "@/content/insights";
import { services } from "@/content/services";
import { readInsightBody, readingMinutes } from "@/lib/insights.server";
import { pageMetadata } from "@/lib/seo";
import { articleSchema } from "@/lib/structured-data";

// Articles live at the site root, exactly as they did on WordPress. Static routes
// (services, about, …) take precedence; anything not listed here is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const insight = getInsight((await params).slug);
  if (!insight) return {};
  return pageMetadata({
    title: insight.title,
    description: insight.summary,
    path: `/${insight.slug}/`,
    type: "article",
    image: { url: insight.image.src, width: insight.image.width, height: insight.image.height, alt: insight.image.alt },
    publishedTime: insight.published,
    modifiedTime: insight.modified,
  });
}

export default async function InsightPage({ params }: Props) {
  const insight = getInsight((await params).slug);
  if (!insight) notFound();

  const body = await readInsightBody(insight.slug);
  const relatedServices = services.filter((s) => s.insights.includes(insight.slug));
  const more = insightsByDate.filter((i) => i.slug !== insight.slug).slice(0, 3);

  return (
    <>
      {/* Reading progress: scroll-driven where supported, otherwise not shown (starts at scaleX(0)). */}
      <div aria-hidden="true" className="reading-progress fixed inset-x-0 top-[var(--header-h)] z-30 h-0.5 origin-left bg-gradient-to-r from-accent to-accent-strong" />

      <article>
        <header className="relative isolate overflow-hidden">
          <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
          <div className="container-site pt-8 sm:pt-10">
            <Breadcrumbs
              items={[
                { name: "Insights", path: "/blogs/" },
                { name: insight.title, path: `/${insight.slug}/` },
              ]}
            />
            <div className="mx-auto mt-14 max-w-4xl text-center lg:mt-20">
              <p className="motion-rise flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-small text-fg-subtle">
                <span className="rounded-full bg-accent-soft px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-accent-strong">{insight.topic}</span>
                <time dateTime={insight.published}>{formatDate(insight.published)}</time>
                <span aria-hidden="true">·</span>
                <span>{readingMinutes(body)} min read</span>
              </p>
              <h1 className="mt-7 text-display-l">
                <span className="line-mask">
                  <span>{insight.title}</span>
                </span>
              </h1>
              <p className="motion-rise mt-7 text-fg-muted [--delay:200ms]">
                By <span className="font-semibold text-brand">{insight.author}</span>
              </p>
            </div>
            <figure className="motion-slide mx-auto mt-14 max-w-5xl">
              <Image
                src={insight.image.src}
                alt={insight.image.alt}
                width={insight.image.width}
                height={insight.image.height}
                sizes="(min-width: 1100px) 64rem, 100vw"
                preload
                className="aspect-[16/9] w-full rounded-[var(--radius-xl)] object-cover shadow-[var(--shadow-lg)]"
              />
            </figure>
          </div>
        </header>

        <div className="container-site section pt-16 sm:pt-20">
          <div className="prose-editorial mx-auto">
            <Markdown
              components={{
                a: ({ href = "", children }) =>
                  href.startsWith("/") ? <Link href={href}>{children}</Link> : <a href={href} rel="noopener">{children}</a>,
              }}
            >
              {body}
            </Markdown>
          </div>

          <footer className="mx-auto mt-20 max-w-[42rem]">
            <GlowRule />
            <p className="mt-8 text-small text-fg-subtle">
              First published <time dateTime={insight.published}>{formatDate(insight.published)}</time> · Updated{" "}
              <time dateTime={insight.modified}>{formatDate(insight.modified)}</time>
            </p>
            {relatedServices.length > 0 && (
              <div data-spotlight className="mt-8">
                <div className="card spot p-6 sm:p-8">
                  <p className="eyebrow">Put it into practice</p>
                  <ul className="mt-4 space-y-1">
                    {relatedServices.map((s) => (
                      <li key={s.slug}>
                        <ArrowLink href={`/${s.slug}/`}>{s.name}</ArrowLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </footer>
        </div>
      </article>

      <section aria-labelledby="more-title" className="surface-raised section">
        <div className="container-site">
          <h2 id="more-title" className="eyebrow mb-10">
            More insights
          </h2>
          <ul data-spotlight className="grid gap-3 md:grid-cols-3">
            {more.map((item, i) => (
              <li key={item.slug} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <Link href={`/${item.slug}/`} className="card spot lift group flex h-full flex-col p-7">
                  <span className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-accent-strong">{item.topic}</span>
                  <span className="mt-4 flex-1 text-title font-medium">{item.title}</span>
                  <span className="mt-8 flex items-center justify-between">
                    <time dateTime={item.published} className="text-small text-fg-subtle">
                      {formatDate(item.published)}
                    </time>
                    <span className="arrow-disc">
                      <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={articleSchema(insight)} />
    </>
  );
}
