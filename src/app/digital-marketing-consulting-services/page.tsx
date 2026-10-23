import { ServicePage, serviceMetadata } from "@/components/sections/ServicePage";

const SLUG = "digital-marketing-consulting-services";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
