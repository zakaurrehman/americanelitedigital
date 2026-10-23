// Runs once when the server starts. A production server without a delivery channel would
// silently lose every inquiry, so make that impossible to miss in the logs.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NODE_ENV !== "production") return;
  const { isDeliveryConfigured } = await import("./lib/inquiry/deliver");
  if (!isDeliveryConfigured()) {
    console.error(
      "[inquiry] WARNING: no delivery channel configured. The contact form will return 503 until SMTP_* or CONTACT_WEBHOOK_URL is set. See .env.example.",
    );
  }
}
