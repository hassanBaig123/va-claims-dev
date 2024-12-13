import { NextRequest, NextResponse } from "next/server";
import { createAndSendMagicLink } from "@/utils/users/handleNewUsers";

export const config = {
  api: {
    bodyParser: false, // Set to false to manually handle the ReadableStream
  },
};

export async function POST(req: NextRequest) {
  if (req.body instanceof ReadableStream) {
    try {
      // Read and parse the request body
      const reader = req.body.getReader();
      let received = '';
      let done, value;
      while (({ done, value } = await reader.read()) && !done) {
        received += new TextDecoder().decode(value);
      }
      const { email } = JSON.parse(received);

      const result = await createAndSendMagicLink(email);
      if (result !== "success") {
        console.error("Error sending magic link");
        return new NextResponse(JSON.stringify({ error: "Failed to send magic link" }), { status: 500 });
      }
      console.log("Magic link sent successfully to:", email);
      return new NextResponse(JSON.stringify({ message: "Magic link sent successfully."}), { status: 200 });
    } catch (error) {
      console.error("Error handling request:", error);
      return new NextResponse(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
    }
  } else {
    console.log("Request body is not a stream");
    return new NextResponse(JSON.stringify({ error: "Request body is not a stream" }), { status: 400 });
  }
}
