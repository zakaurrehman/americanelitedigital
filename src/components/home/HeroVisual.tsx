import Image from "next/image";
import { CheckCircle2, Palette, Sparkles, TrendingUp } from "lucide-react";
import { photos } from "@/content/media";
import emblem from "../../../public/brand/emblem.png";

/** Parallax layer: moves with the pointer by `depth` px (driven by --tx/--ty from the nearest [data-tilt]). */
function layer(depth: number): React.CSSProperties {
  return {
    transform: `translate3d(calc(var(--tx, 0) * ${-depth}px), calc(var(--ty, 0) * ${-depth}px), 0)`,
    transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
  };
}

/**
 * Homepage hero collage: two photos, floating UI cards and the spinning crest badge.
 * The cards and badge are decorative (aria-hidden) and contain no metrics or claims; the main
 * photo is never faded, so it can be the page's largest paint.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[36rem] pb-12 pt-4 sm:pb-16 lg:pt-0">
      {/* Gold ring behind the main photo */}
      <div aria-hidden="true" className="absolute right-[4%] top-[6%] size-[70%] rounded-full border-2 border-dashed border-[rgb(200_146_29/0.45)]" style={layer(10)} />

      <div style={layer(14)} className="relative ml-auto w-[82%]">
        <div className="motion-photo photo aspect-[4/5] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]">
          <Image src={photos.workshop.src} alt={photos.workshop.alt} fill loading="eager" placeholder="blur" sizes="(min-width: 1024px) 38vw, 80vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[rgb(6_18_58/0.35)] via-transparent to-transparent" />
        </div>
      </div>

      <div style={layer(26)} className="absolute bottom-0 left-0 w-[50%]">
        <div className="motion-pop photo aspect-[4/3] rounded-[var(--radius-lg)] border-[6px] border-white shadow-[var(--shadow-lg)] [--delay:350ms]">
          <Image src={photos.wireframeSketch.src} alt={photos.wireframeSketch.alt} fill placeholder="blur" sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover" />
        </div>
      </div>

      {/* Brand card */}
      <div aria-hidden="true" style={layer(34)} className="absolute left-0 top-[8%] hidden sm:left-[-4%] sm:block">
        <div className="motion-pop [--delay:550ms]">
          <div className="float glass-card w-[13.5rem] p-4 [--float-dur:5.5s]">
            <div className="flex items-center gap-3">
              <span className="icon-tile size-10 rounded-xl">
                <Palette className="size-5" strokeWidth={1.75} />
              </span>
              <div className="leading-tight">
                <p className="text-[0.85rem] font-semibold text-brand">Brand identity</p>
                <p className="text-[0.75rem] text-fg-subtle">Logo · colour · type</p>
              </div>
            </div>
            <ul className="mt-3.5 space-y-2">
              {[88, 72, 80].map((w, i) => (
                <li key={w} className="flex items-center gap-2">
                  <CheckCircle2 className={`size-4 shrink-0 ${i < 2 ? "text-success" : "text-line-strong"}`} strokeWidth={2} />
                  <span className="h-1.5 rounded-full bg-[var(--mist)]" style={{ width: `${w}%` }} />
                </li>
              ))}
            </ul>
            <div className="mt-3.5 flex gap-1.5">
              {["var(--navy-800)", "var(--red-500)", "var(--gold-400)", "var(--blue-500)", "var(--green-700)"].map((c) => (
                <span key={c} className="size-5 rounded-full ring-2 ring-white" style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Growth card — an abstract chart, no figures */}
      <div aria-hidden="true" style={layer(40)} className="absolute bottom-[16%] right-0 sm:right-[-3%]">
        <div className="motion-pop [--delay:700ms]">
          <div className="float glass-card w-[10.5rem] p-3.5 [--float-delay:-2.5s] [--float-dur:6s] sm:w-[12.5rem] sm:p-4">
            <div className="flex items-center justify-between">
              <p className="text-[0.8rem] font-semibold text-brand">Search & growth</p>
              <span className="grid size-7 place-items-center rounded-full bg-[rgb(44_108_28/0.12)] text-success">
                <TrendingUp className="size-4" strokeWidth={2} />
              </span>
            </div>
            <div className="relative mt-3 h-20">
              <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-1.5">
                {[30, 42, 38, 55, 62, 74, 88].map((h, i) => (
                  <span
                    key={h}
                    className="chart-bar flex-1 rounded-t-[4px] bg-gradient-to-t from-[var(--blue-500)] to-[rgb(18_104_220/0.35)]"
                    style={{ height: `${h}%`, "--i": i } as React.CSSProperties}
                  />
                ))}
              </div>
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
                <path className="draw-line" d="M2 34 L18 28 L32 30 L48 20 L62 16 L78 10 L98 3" fill="none" stroke="var(--red-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Offer pill */}
      <div aria-hidden="true" style={layer(30)} className="absolute bottom-[-0.5rem] right-[10%] sm:bottom-[-1rem]">
        <div className="motion-pop [--delay:850ms]">
          <p className="float inline-flex items-center gap-2 rounded-full bg-[var(--navy-800)] px-4 py-2.5 text-[0.8rem] font-semibold text-white shadow-[var(--shadow-lg)] [--float-delay:-1s]">
            <Sparkles className="size-4 text-[var(--gold-400)]" strokeWidth={2} />
            Free initial project ideas
          </p>
        </div>
      </div>

      {/* Spinning crest badge */}
      <div aria-hidden="true" style={layer(20)} className="absolute right-[-0.25rem] top-[-0.75rem] size-24 sm:right-[-1.5rem] sm:size-32">
        <div className="motion-pop relative size-full rounded-full bg-white shadow-[var(--shadow-lg)] [--delay:950ms]">
          <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 size-full">
            <defs>
              <path id="hero-badge-path" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
            </defs>
            <text fontSize="9.5" fontWeight="700" fill="var(--navy-800)">
              <textPath href="#hero-badge-path" textLength="290" lengthAdjust="spacing">
                AMERICAN ELITE DIGITAL <tspan fill="var(--red-500)">★ ★ ★ ★ ★</tspan>
              </textPath>
            </text>
          </svg>
          <Image src={emblem} alt="" sizes="64px" className="absolute left-1/2 top-1/2 w-[52%] -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}
