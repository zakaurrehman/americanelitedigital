import type { Metadata } from "next";
import { InquirySection } from "@/components/inquiry/InquirySection";
import { PageHeader } from "@/components/sections/PageHeader";
import { offer } from "@/content/company";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us — Start a Project",
  description: `Tell American Elite Digital about your project and get initial ideas free of charge. Call ${site.phone.display}, email ${site.email} or send a message.`,
  path: "/contact-us/",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Contact", path: "/contact-us/" }]}
        eyebrow="Contact"
        title={
          <>
            Start a project, <span className="em-accent">or just ask.</span>
          </>
        }
        lead={`${offer.long} Prefer to talk? Call ${site.phone.display}.`}
      />
      <InquirySection title="Send us a message." intro="Share as much or as little as you like. We use your details only to reply." />
    </>
  );
}
