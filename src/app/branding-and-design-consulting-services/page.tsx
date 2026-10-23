import { ServicePage, serviceMetadata } from "@/components/sections/ServicePage";

const SLUG = "branding-and-design-consulting-services";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
