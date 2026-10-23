import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { privacyPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How American Elite Digital collects, uses and protects your personal information.",
  path: "/privacy-policy/",
});

export default function PrivacyPolicyPage() {
  return <LegalPage doc={privacyPolicy} path="/privacy-policy/" />;
}
