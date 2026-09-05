"use server";

import { sendContactMessageNotificationEmail } from "@/lib/email/smtp";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function sendContactMessageAction(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const website = String(formData.get("website") || "").trim();

  // Silently accept automated submissions caught by the honeypot.
  if (website) {
    return {
      status: "success",
      message: "Thanks! Your message has been sent.",
    };
  }

  if (!firstName || !lastName || !email || !phone || !message) {
    return {
      status: "error",
      message: "Please complete all required fields.",
    };
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  if (
    firstName.length > 80 ||
    lastName.length > 80 ||
    email.length > 254 ||
    phone.length > 40 ||
    message.length > 5000
  ) {
    return {
      status: "error",
      message: "One or more fields are too long.",
    };
  }

  try {
    await sendContactMessageNotificationEmail({
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      customerPhone: phone,
      message,
    });

    return {
      status: "success",
      message: "Thanks! Your message has been sent. We’ll be in touch soon.",
    };
  } catch (error) {
    console.error("Contact message email failed:", error);

    return {
      status: "error",
      message:
        "We couldn’t send your message right now. Please call or email us directly.",
    };
  }
}
