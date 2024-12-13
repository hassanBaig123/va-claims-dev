"use server";

import { stripe } from "@/lib/stripe";

export const refundCustomer = async (customerId: string, productId: string, amount: number, reason: string) => {
    try {
        const { data: paymentsData } = await stripe.paymentIntents.list({
            customer: customerId,
            limit: 10,
        });

        const paymentData = paymentsData.find(p => p.metadata.productId === productId);

        if (!paymentData) {
            throw new Error('Payment not found for this package.');
        }

        // Convert the amount from dollars to cents (ensure no decimals)
        const amountInCents = Math.round(amount * 100);

        if (amountInCents > paymentData?.amount) throw new Error("Refund amount max reached.")

        // // Refund the payment
        await stripe.refunds.create({
            payment_intent: paymentData.id,
            amount: amountInCents, // Pass the amount in cents
            reason: "requested_by_customer",
            metadata: {
                reason
            }
        });

        return { message: "ok" };
    } catch (err: any) {
        console.error('Refund failed:', err);
        return { message: `${err.message}` };
    }
};
