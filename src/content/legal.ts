// Legal text, carried over verbatim from /privacy-policy/ and /terms-conditions/ on the
// WordPress site (last modified 2024-09-13). Owner action: have counsel review — the policy
// describes cookies and usage analytics that the new site does not set.

import type { TitledText } from "./services";

export type LegalDocument = {
  title: string;
  lastModified: string;
  intro: string;
  sections: TitledText[];
};

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  lastModified: "2024-09-13",
  intro:
    "At American Elite Digital, your privacy is our priority. We are committed to protecting your personal information when you visit our website or use our services. This Privacy Policy outlines how we collect, use, and safeguard your information.",
  sections: [
    {
      title: "Information We Collect",
      body: "To provide exceptional service and enhance your online experience, American Elite Digital collects various types of information. This includes personal data such as your name, email address, and phone number when you interact with us. Additionally, we gather information about your website usage, including IP addresses, browser types, visited pages, and session duration. We also utilize cookies to track your preferences and improve your browsing experience.",
    },
    {
      title: "How We Use Your Information",
      body: "The information we collect is used to personalize and enhance your experience with American Elite Digital. We use your personal details to communicate with you, respond to your inquiries, and provide the services you request. Usage data is analyzed to understand how our services are being used, allowing us to improve and tailor our offerings to better meet your needs.",
    },
    {
      title: "Sharing Your Information",
      body: "American Elite Digital does not sell, trade, or rent your personal information to third parties. However, we may share your information with trusted third-party service providers who assist us in operating our website and delivering our services. These providers are bound by strict confidentiality agreements to protect your data as securely as we do.",
    },
    {
      title: "Data Security",
      body: "We implement robust security measures to protect your personal information from unauthorized access, use, or disclosure. Despite our efforts, please note that no method of data transmission or storage is completely secure. While we strive to protect your personal information, we cannot guarantee its absolute security.",
    },
    {
      title: "Your Rights",
      body: "You have the right to access, correct, or delete your personal information held by American Elite Digital. Additionally, you can opt out of receiving promotional communications from us at any time. To exercise these rights, please contact us, and we will assist you promptly.",
    },
    {
      title: "Changes to This Privacy Policy",
      body: "We may update this Privacy Policy to reflect changes in our practices or for other operational, legal, or regulatory reasons. The updated policy will be posted on this page, and the “Last Updated” date will be revised accordingly. We encourage you to review this policy periodically to stay informed about how we protect your information.",
    },
  ],
};

export const termsAndConditions: LegalDocument = {
  title: "Terms & Conditions",
  lastModified: "2024-09-13",
  intro:
    "By using American Elite Digital’s website and services, you agree to these Terms and Conditions. If you do not agree, please refrain from using our site and services.",
  sections: [
    {
      title: "Services",
      body: "American Elite Digital offers a comprehensive suite of digital solutions designed to increase your company’s online visibility, strengthen your brand, and drive business growth. From digital marketing to website development, our services are tailored to meet your specific business needs. We collaborate closely with you to understand your goals and develop a strategy that aligns with your vision. Whether you’re looking to revamp your website, enhance your brand visibility, or launch a digital marketing campaign, we have the expertise to exceed your expectations.",
    },
    {
      title: "User Responsibilities",
      body: "As a user of our website and services, you are responsible for providing accurate and up-to-date information. You must use our services in compliance with all applicable laws and regulations and avoid any activities that could harm our website, services, or reputation. Misuse of our systems or violation of others’ rights may result in consequences as outlined in these Terms and Conditions.",
    },
    {
      title: "Intellectual Property",
      body: "All content on the American Elite Digital website, including text, graphics, logos, images, and software, is protected by intellectual property laws. Unauthorized use, reproduction, or distribution of our content without prior written consent is prohibited and may result in legal action. We respect intellectual property rights and expect our users to do the same.",
    },
    {
      title: "Governing Law",
      body: "These Terms and Conditions are governed by the laws of the state in which American Elite Digital operates. Any disputes arising from the use of our website or services will be resolved in accordance with these laws.",
    },
    {
      title: "Changes to Terms",
      body: "We may revise these Terms and Conditions periodically to reflect changes in our services, legal requirements, or other operational needs. The latest version will always be available on our website, and your continued use of our services after any changes indicates your acceptance of the updated terms. If you do not agree with the revised terms, you should discontinue using our website and services.",
    },
  ],
};
