"use server";

import { sendInspectionRequestNotificationEmail } from "@/lib/email/smtp";
import { PRODUCTION_SITE_URL } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

type InspectionRequestInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  osmPlaceId: string;
  slotId: string;
  issueNotes: string;
};

type InspectionRequestResult = {
  ok: boolean;
  message: string;
};

export async function createInspectionRequestAction(
  input: InspectionRequestInput,
): Promise<InspectionRequestResult> {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const address = input.address.trim();

  if (!firstName || !lastName || !email || !phone || !address || !input.slotId) {
    return { ok: false, message: "Please fill out all required fields." };
  }

  const supabase = await createClient();
  const { data: slot, error: slotError } = await supabase
    .from("slots")
    .select("id, starts_at, ends_at, is_available")
    .eq("id", input.slotId)
    .eq("type", "inspection")
    .single();

  if (slotError || !slot || !slot.is_available) {
    return {
      ok: false,
      message: "That inspection time is no longer available. Please choose another.",
    };
  }

  const customerId = crypto.randomUUID();
  const { error: customerError } = await supabase.from("customers").insert({
    id: customerId,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    address,
    city: input.city.trim() || null,
    state: input.state.trim() || null,
    zip: input.zip.trim() || null,
    latitude: input.latitude,
    longitude: input.longitude,
    osm_place_id: input.osmPlaceId.trim() || null,
  });

  if (customerError) {
    return {
      ok: false,
      message: customerError.message || "Could not create customer.",
    };
  }

  const { error: jobError } = await supabase.from("jobs").insert({
    customer_id: customerId,
    inspection_slot_id: input.slotId,
    status: "inspection_requested",
    issue_notes: input.issueNotes.trim() || null,
  });

  if (jobError) {
    return { ok: false, message: jobError.message };
  }

  await supabase
    .from("slots")
    .update({ is_available: false })
    .eq("id", input.slotId);

  try {
    const siteUrl = process.env.SITE_URL || PRODUCTION_SITE_URL;
    await sendInspectionRequestNotificationEmail({
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      customerPhone: phone,
      startsAt: slot.starts_at,
      endsAt: slot.ends_at,
      address,
      issueNotes: input.issueNotes.trim() || null,
      adminLink: `${siteUrl.replace(/\/$/, "")}/admin`,
    });
  } catch (error) {
    console.error("Inspection request notification email failed:", error);
  }

  return { ok: true, message: "Inspection request submitted." };
}
