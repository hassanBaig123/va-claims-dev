import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderTemplate } from "@/emails/utils/renderTemplate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, templateName, templateData } = body;

    const htmlBody = await renderTemplate(templateName, templateData);

    const resend = new Resend(process.env.RESEND_API_KEY);

    let attachments = [];
    if (templateData?.attachments?.length) {
      attachments = await Promise.all(
        templateData.attachments.map(async (file: { path: string; filename: string; type: string }) => {
          const response = await fetch(file.path);
          const arrayBuffer = await response.arrayBuffer();
          const base64Content = Buffer.from(arrayBuffer).toString("base64");

          return {
            filename: file.filename,
            content: base64Content,
            type: file.type,
          };
        })
      );
    }
    const mailOptions = {
      from: process.env.GMAIL_USER || "onboarding@vaclaims-academy.com",
      to: email,
      subject: templateData.subject || "Message from VA Claims Academy",
      html: htmlBody,
      ...(attachments.length > 0 && { attachments }),
    };

    const info = await resend.emails.send(mailOptions);

    return NextResponse.json({ success: true, info }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
