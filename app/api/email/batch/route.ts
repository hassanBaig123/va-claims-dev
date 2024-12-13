import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderTemplate } from "@/emails/utils/renderTemplate";
import { getAllUserEmails } from "@/utils/users/userManagement";

const resend = new Resend(process.env.RESEND_API_KEY);

// Hardcoded list of test email addresses
const testEmails = [
  'vaclaimstesting5@gmail.com',
  'jerc12341234@gmail.com',
  'vaclaimstesting@proton.me'
];

// Set this to true when you're ready to enable sending to all users
const ENABLE_SEND_TO_ALL = true;

// Maximum number of emails per batch
const BATCH_SIZE = 100;

async function sendEmailBatch(emails: string[], htmlBody: string) {
  const emailBatch = emails.map((email: string) => ({
    from: process.env.GMAIL_USER || "onboarding@vaclaims-academy.com",
    to: email,
    subject: "Important Message from VA Claims Academy",
    html: htmlBody,
  }));

  const { data, error } = await resend.batch.send(emailBatch);

  if (error) {
    console.error("Error sending batch emails:", error);
    throw new Error("Failed to send batch emails");
  }

  return data;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sendToAll, email } = body;

    let emails: string[];

    if (sendToAll && ENABLE_SEND_TO_ALL) {
      emails = testEmails;
      //emails = await getAllUserEmails();
    } else if (email) {
      emails = [email];
    } else {
      emails = testEmails;
    }

    const htmlBody = await renderTemplate('generalMessage', { message });

    let results = [];
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      try {
        const result = await sendEmailBatch(batch, htmlBody);
        results.push(result);
      } catch (error) {
        console.error(`Error sending batch ${i / BATCH_SIZE + 1}:`, error);
        // Continue with the next batch even if this one failed
      }
    }

    return NextResponse.json({ success: true, data: results }, { status: 200 });
  } catch (error) {
    console.error("Error in batch email API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
