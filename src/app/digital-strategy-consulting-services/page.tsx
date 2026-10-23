import { ServicePage, serviceMetadata } from "@/components/sections/ServicePage";

const SLUG = "digital-strategy-consulting-services";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
