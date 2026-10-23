import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { termsAndConditions } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "The terms and conditions for using the American Elite Digital website and services.",
  path: "/terms-conditions/",
});

export default function TermsPage() {
  return <LegalPage doc={termsAndConditions} path="/terms-conditions/" />;
}
