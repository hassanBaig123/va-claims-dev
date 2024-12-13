import { NextRequest, NextResponse } from 'next/server';
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/utils/stripe/config";

async function getProductDetails(productId: string) {
  console.log("Fetching product details for ID:", productId); // Log the product ID being queried
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      prices (
        unit_amount
      )
    `
    )
    .eq("id", productId)
    .single();

  if (error) {
    console.error("Failed to fetch product details:", error);
    return null;
  }

  if (!data) {
    console.log("No data returned for product ID:", productId);
    return null;
  }
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~Product details:", data); // Log the product details being returned
  return data;
}

export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing
  },
};

export async function POST(req: NextRequest) {
  if (req.body instanceof ReadableStream) {
    try {
      const reader = req.body.getReader();
      let received = "";
      let done, value;
      while (({ done, value } = await reader.read()) && !done) {
        received += new TextDecoder().decode(value);
      }
      const body = JSON.parse(received);

      const { paymentMethodId, productId, userInfo } = body;  

      const product = await getProductDetails(productId);
      if (!product) {
        return NextResponse.json({ error: "Product not found or inactive" }, { status: 404 });
      }

      const customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        email: userInfo.email,
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        address: { line1: userInfo.address },
        phone: userInfo.phone,
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: product.prices[0].unit_amount,
        currency: "usd",
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
        customer: customer.id,
        payment_method: paymentMethodId,
        description: `Payment for ${product.name}`,
        metadata: { productId: product.id, productName: product.name },
      });

      if (paymentIntent.status === "requires_confirmation") {
        console.log("Payment requires confirmation");
        return NextResponse.json({
          requiresConfirmation: true,
          clientSecret: paymentIntent.client_secret
        }, { status: 200 });
      } else if (paymentIntent.status === "succeeded") {
        console.log("Payment succeeded");
        return NextResponse.json({ success: true }, { status: 200 });
      } else {
        console.log("Payment failed");
        return NextResponse.json({ success: false }, { status: 400 });
      }
    } catch (error) {
      console.error("Error parsing body:", error);
      return NextResponse.json({ error: "Failed to parse request body" }, { status: 500 });
    }
  } else {
    console.log("Body is not a stream, current body:", req.body);
    return NextResponse.json({ error: "Expected a stream in request body" }, { status: 400 });
  }
}
