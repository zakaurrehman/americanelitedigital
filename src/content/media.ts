// Photography. All images are from Unsplash under the Unsplash License (free for commercial use,
// no attribution required); source IDs are listed in docs/design/image-credits.md. They are
// illustrative: alt text describes what is shown and never presents the people as our team or
// clients. Static imports give Next.js the dimensions and a blur placeholder.

import type { StaticImageData } from "next/image";
import type { PillarId } from "./services";
import analyticsLaptop from "../../public/images/photos/analytics-laptop.jpg";
import appScreens from "../../public/images/photos/app-screens.jpg";
import brandSwatches from "../../public/images/photos/brand-swatches.jpg";
import collaborate from "../../public/images/photos/collaborate.jpg";
import designerTablet from "../../public/images/photos/designer-tablet.jpg";
import marketingDesk from "../../public/images/photos/marketing-desk.jpg";
import pairReview from "../../public/images/photos/pair-review.jpg";
import phoneLaptop from "../../public/images/photos/phone-laptop.jpg";
import presentation from "../../public/images/photos/presentation.jpg";
import sketchDesk from "../../public/images/photos/sketch-desk.jpg";
import strategyWall from "../../public/images/photos/strategy-wall.jpg";
import teamDesk from "../../public/images/photos/team-desk.jpg";
import wireframeSketch from "../../public/images/photos/wireframe-sketch.jpg";
import wireframeTablet from "../../public/images/photos/wireframe-tablet.jpg";
import workshop from "../../public/images/photos/workshop.jpg";

export type Photo = { src: StaticImageData; alt: string };

export const photos = {
  workshop: { src: workshop, alt: "A team workshop: one person presents ideas on sticky notes while colleagues take notes at their laptops." },
  collaborate: { src: collaborate, alt: "Four people working together around a wooden table with laptops." },
  wireframeSketch: { src: wireframeSketch, alt: "A hand sketching website wireframes on paper." },
  brandSwatches: { src: brandSwatches, alt: "Colour swatch cards and printed brand samples laid out on a table." },
  designerTablet: { src: designerTablet, alt: "A designer working with a pen tablet beside colour palettes and a laptop." },
  wireframeTablet: { src: wireframeTablet, alt: "Website wireframes being drawn on a tablet with a stylus." },
  appScreens: { src: appScreens, alt: "Mobile app screen designs displayed on a large monitor." },
  analyticsLaptop: { src: analyticsLaptop, alt: "A laptop showing an analytics dashboard with charts." },
  marketingDesk: { src: marketingDesk, alt: "A desk with a marketing strategy note, a pen and a book on marketing and pricing." },
  strategyWall: { src: strategyWall, alt: "A hand arranging printed screen designs on a planning wall." },
  teamDesk: { src: teamDesk, alt: "Overhead view of a shared desk with laptops, notebooks and coffee." },
  pairReview: { src: pairReview, alt: "Two people reviewing work together on a laptop in an office." },
  presentation: { src: presentation, alt: "A small team in a planning session around a whiteboard in a bright office." },
  sketchDesk: { src: sketchDesk, alt: "Top-down view of a designer sketching layouts with a phone and coloured pens on the desk." },
  phoneLaptop: { src: phoneLaptop, alt: "A person using a phone and a laptop at a desk." },
} satisfies Record<string, Photo>;

/** One photo per practice, used on service cards. */
export const pillarPhotos: Record<PillarId, Photo> = {
  brand: photos.designerTablet,
  build: photos.wireframeTablet,
  grow: photos.analyticsLaptop,
  advise: photos.strategyWall,
};

/** Header photo for each service page, keyed by slug. */
export const servicePhotos: Record<string, Photo> = {
  "branding-and-design-consulting-services": photos.brandSwatches,
  "web-development-consulting-services": photos.phoneLaptop,
  "application-development-consulting-services": photos.appScreens,
  "digital-marketing-consulting-services": photos.marketingDesk,
  "digital-strategy-consulting-services": photos.presentation,
};
