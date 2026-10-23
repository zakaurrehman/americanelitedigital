// Inquiry validation shared by the browser form and the API route, so both enforce the same
// rules. Pure TypeScript with no dependencies to keep the client bundle small.

export const INQUIRY_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  phoneMinDigits: 7,
  phoneMaxDigits: 15,
  phoneMax: 30,
  messageMax: 2000,
} as const;

export const NOT_SURE = "not-sure";

export type InquiryField = "name" | "email" | "phone" | "service" | "package" | "message";

export type Inquiry = {
  name: string;
  email: string;
  phone: string;
  /** Service slug, or NOT_SURE. Empty when not chosen. */
  service: string;
  /** Package id, only when packages are published. Empty otherwise. */
  package: string;
  message: string;
};

export type InquiryErrors = Partial<Record<InquiryField, string>>;

export type ValidationResult = { ok: true; data: Inquiry } | { ok: false; errors: InquiryErrors };

export type ValidationOptions = { serviceSlugs: readonly string[]; packageIds: readonly string[] };

const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;
const PHONE_CHARS = /^[0-9+().\-\s]+(\s*(x|ext\.?)\s*\d{1,6})?$/i;
const LINE_BREAK = /[\r\n]/;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateInquiry(raw: Record<string, unknown>, options: ValidationOptions): ValidationResult {
  const data: Inquiry = {
    name: text(raw.name).replace(/\s+/g, " "),
    email: text(raw.email).toLowerCase(),
    phone: text(raw.phone),
    service: text(raw.service),
    package: text(raw.package),
    message: text(raw.message).replace(/\r\n/g, "\n"),
  };
  const errors: InquiryErrors = {};

  if (!data.name) errors.name = "Enter your name.";
  else if (data.name.length < INQUIRY_LIMITS.nameMin) errors.name = "Your name must be at least 2 characters.";
  else if (data.name.length > INQUIRY_LIMITS.nameMax) errors.name = "Your name must be 100 characters or fewer.";
  else if (LINE_BREAK.test(text(raw.name)) || /https?:|www\./i.test(data.name)) errors.name = "Enter your name without links.";

  if (!data.email) errors.email = "Enter your email address.";
  else if (data.email.length > INQUIRY_LIMITS.emailMax || !EMAIL.test(data.email))
    errors.email = "Enter an email address in the format name@example.com.";

  const digits = data.phone.replace(/\D/g, "");
  if (!data.phone) errors.phone = "Enter your phone number.";
  else if (data.phone.length > INQUIRY_LIMITS.phoneMax || !PHONE_CHARS.test(data.phone))
    errors.phone = "Enter a phone number using digits, spaces, +, ( ) or -.";
  else if (digits.length < INQUIRY_LIMITS.phoneMinDigits || digits.length > INQUIRY_LIMITS.phoneMaxDigits)
    errors.phone = "Enter a phone number with 7 to 15 digits.";

  if (data.service && data.service !== NOT_SURE && !options.serviceSlugs.includes(data.service))
    errors.service = "Choose a service from the list.";

  if (data.package && !options.packageIds.includes(data.package)) errors.package = "Choose a package from the list.";

  if (data.message.length > INQUIRY_LIMITS.messageMax)
    errors.message = `Your message must be ${INQUIRY_LIMITS.messageMax.toLocaleString("en-US")} characters or fewer.`;

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
