"use server";

import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export const getCustomerPaymentRefund = async (customerId: string, productId: string): Promise<{ refunds: Stripe.Refund[]; paymentData: Stripe.PaymentIntent } | null> => {
    try {
        const { data: paymentsData } = await stripe.paymentIntents.list({
            customer: customerId,
            limit: 10,
        });

        const paymentData = paymentsData.find(p => p.metadata.productId === productId);


        if (!paymentData) {
            throw new Error('Payment not found for this package.');
        }

        const refunds = await stripe.refunds.list({
            charge: paymentData?.latest_charge as any
        });

        return {
            refunds: refunds.data ?? [],
            paymentData
        }
    } catch (error: any) {
        return null
    }
}