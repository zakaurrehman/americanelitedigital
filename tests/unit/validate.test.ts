import { describe, expect, it } from "vitest";
import { NOT_SURE, validateInquiry } from "@/lib/inquiry/validate";

const options = { serviceSlugs: ["web-development-consulting-services"], packageIds: [] as string[] };
const valid = { name: "Jordan Lee", email: "jordan@example.com", phone: "(310) 555-0100", service: "", package: "", message: "" };

describe("validateInquiry", () => {
  it("accepts a complete, valid inquiry and normalises it", () => {
    const result = validateInquiry({ ...valid, name: "  Jordan   Lee ", email: " Jordan@Example.com " }, options);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("Jordan Lee");
      expect(result.data.email).toBe("jordan@example.com");
    }
  });

  it("requires name, email and phone", () => {
    const result = validateInquiry({}, options);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["email", "name", "phone"]);
  });

  it.each(["not-an-email", "a@b", "a@b.c", "a b@example.com", "@example.com"])("rejects malformed email %s", (email) => {
    expect(validateInquiry({ ...valid, email }, options).ok).toBe(false);
  });

  it.each(["name@example.co.uk", "first.last+tag@sub.example.org"])("accepts email %s", (email) => {
    expect(validateInquiry({ ...valid, email }, options).ok).toBe(true);
  });

  it("rejects line breaks and links in the name (header injection / spam)", () => {
    expect(validateInquiry({ ...valid, name: "Jordan\r\nBcc: x@example.com" }, options).ok).toBe(false);
    expect(validateInquiry({ ...valid, name: "Visit https://spam.example" }, options).ok).toBe(false);
  });

  it("checks phone characters and digit count", () => {
    expect(validateInquiry({ ...valid, phone: "call me" }, options).ok).toBe(false);
    expect(validateInquiry({ ...valid, phone: "12345" }, options).ok).toBe(false);
    expect(validateInquiry({ ...valid, phone: "+1 310 555 0100 ext. 12" }, options).ok).toBe(true);
    expect(validateInquiry({ ...valid, phone: "+44 20 7946 0958" }, options).ok).toBe(true);
  });

  it("only accepts known services or 'not sure'", () => {
    expect(validateInquiry({ ...valid, service: "web-development-consulting-services" }, options).ok).toBe(true);
    expect(validateInquiry({ ...valid, service: NOT_SURE }, options).ok).toBe(true);
    expect(validateInquiry({ ...valid, service: "free-money" }, options).ok).toBe(false);
  });

  it("rejects packages unless they are published", () => {
    expect(validateInquiry({ ...valid, package: "logo-design" }, options).ok).toBe(false);
    expect(validateInquiry({ ...valid, package: "logo-design" }, { ...options, packageIds: ["logo-design"] }).ok).toBe(true);
  });

  it("limits message length to 2,000 characters", () => {
    expect(validateInquiry({ ...valid, message: "x".repeat(2000) }, options).ok).toBe(true);
    expect(validateInquiry({ ...valid, message: "x".repeat(2001) }, options).ok).toBe(false);
  });

  it("ignores non-string values instead of throwing", () => {
    const result = validateInquiry({ name: ["array"], email: { a: 1 }, phone: 42 }, options);
    expect(result.ok).toBe(false);
  });
});
