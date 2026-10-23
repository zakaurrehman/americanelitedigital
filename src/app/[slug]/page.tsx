import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { CtaBand } from "@/components/sections/CtaBand";
import { formatDate } from "@/components/sections/InsightList";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { StarRule } from "@/components/ui/Ornament";
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
      <article>
        <header className="container-site pt-8 sm:pt-10">
          <Breadcrumbs
            items={[
              { name: "Insights", path: "/blogs/" },
              { name: insight.title, path: `/${insight.slug}/` },
            ]}
          />
          <div className="mx-auto mt-12 max-w-4xl text-center lg:mt-16">
            <p className="text-small text-fg-subtle">
              <span className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ornament">{insight.topic}</span>
              <span aria-hidden="true" className="mx-2">
                ·
              </span>
              <time dateTime={insight.published}>{formatDate(insight.published)}</time>
              <span aria-hidden="true" className="mx-2">
                ·
              </span>
              {readingMinutes(body)} min read
            </p>
            <h1 className="mt-5 font-display text-display-l">{insight.title}</h1>
            <p className="mt-6 text-fg-muted">
              By <span className="font-semibold text-fg">{insight.author}</span>
            </p>
          </div>
          <figure className="mx-auto mt-12 max-w-5xl">
            <Image
              src={insight.image.src}
              alt={insight.image.alt}
              width={insight.image.width}
              height={insight.image.height}
              sizes="(min-width: 1100px) 64rem, 100vw"
              priority
              className="aspect-[16/9] w-full rounded-sm border border-line object-cover"
            />
          </figure>
        </header>

        <div className="container-site section pt-14 sm:pt-16">
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

          <footer className="mx-auto mt-16 max-w-[42rem]">
            <StarRule />
            <p className="mt-8 text-small text-fg-subtle">
              First published <time dateTime={insight.published}>{formatDate(insight.published)}</time> · Updated{" "}
              <time dateTime={insight.modified}>{formatDate(insight.modified)}</time>
            </p>
            {relatedServices.length > 0 && (
              <div className="mt-8 rounded-md border border-line bg-bg-raised p-6 sm:p-8">
                <p className="eyebrow eyebrow-plain">Put it into practice</p>
                <ul className="mt-3 space-y-1">
                  {relatedServices.map((s) => (
                    <li key={s.slug}>
                      <ArrowLink href={`/${s.slug}/`}>{s.name}</ArrowLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </footer>
        </div>
      </article>

      <section aria-labelledby="more-title" className="surface-paper-2 section">
        <div className="container-site">
          <h2 id="more-title" className="eyebrow mb-8">
            More insights
          </h2>
          <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-[var(--line)] md:grid-cols-3">
            {more.map((item) => (
              <li key={item.slug} className="bg-bg">
                <Link href={`/${item.slug}/`} className="group flex h-full flex-col p-7">
                  <span className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ornament">{item.topic}</span>
                  <span className="mt-3 text-title font-semibold group-hover:text-accent">{item.title}</span>
                  <time dateTime={item.published} className="mt-4 text-small text-fg-subtle">
                    {formatDate(item.published)}
                  </time>
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
