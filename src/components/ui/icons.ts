import {
  Award,
  CheckCircle2,
  Compass,
  Handshake,
  HeartHandshake,
  Lightbulb,
  MonitorSmartphone,
  Palette,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { PillarId } from "@/content/services";

// Icons for content lists. Numbers are kept only for real sequences (process steps, next steps,
// legal contents); unordered lists use these instead, so a page never shows "01" four times.

export const pillarIcons: Record<PillarId, LucideIcon> = {
  brand: Palette,
  build: MonitorSmartphone,
  grow: TrendingUp,
  advise: Compass,
};

/** In the order of `differentiators` in src/content/company.ts. */
export const differentiatorIcons: LucideIcon[] = [Lightbulb, Target, CheckCircle2, Handshake, Users];

/** In the order of `about.values` in src/content/company.ts. */
export const valueIcons: LucideIcon[] = [Lightbulb, Award, ShieldCheck, Users, HeartHandshake];
