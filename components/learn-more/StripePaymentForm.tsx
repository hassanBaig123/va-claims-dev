import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripePaymentFormProps {
  onSuccessfulPayment: (paymentMethodId: string) => void;
  selectedProductId: string | null;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ onSuccessfulPayment, selectedProductId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zip, setZip] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const sendMagicLink = async (email: string, paymentMethodId: string) => {
    try {
      const response = await fetch('/api/sendMagicLink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to send magic link.");
      }
      setMessage("Your payment was successful! Please check your email to complete registration.");
      setIsError(false);
      onSuccessfulPayment(paymentMethodId);
    } catch (error) {
      console.error('Failed to send magic link:', error);
      setMessage("An error occurred while sending the magic link. Please try again.");
      setIsError(true);
    }
  };

  const handleSuccessfulPayment = async (paymentMethodId: string) => {
    try {
      console.log("Payment method ID:", paymentMethodId);
      console.log("Product ID:", selectedProductId);
      console.log("User Info:", { firstName, lastName, email, street, city, state, zip, phone });
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethodId,
          productId: selectedProductId,
          userInfo: { firstName, lastName, email, street, city, state, zip, phone }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data.");
      }
      console.log("Response data:", data);

      if (data.requiresConfirmation && data.clientSecret) {
        if (!stripe) {
          console.error("Stripe is not initialized.");
          setMessage("Payment processing is not available at this moment.");
          setIsError(true);
          return;
        }
        const result = await stripe.confirmCardPayment(data.clientSecret);
        if (result.error) {
          console.error('Error confirming payment:', result.error.message);
          setMessage(result.error.message || "An unknown error occurred");
          setIsError(true);
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          await sendMagicLink(email, paymentMethodId);
        } else {
          setMessage("Payment confirmation failed. Please try again.");
          setIsError(true);
        }
      } else if (data.success) {
        await sendMagicLink(email, paymentMethodId);
      } else {
        setMessage(data.error || "Payment failed. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error('Failed to complete the payment or send magic link:', error);
      setMessage("An error occurred. Please try again.");
      setIsError(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setIsError(false);

    if (!stripe || !elements) {
      console.error("Stripe has not initialized.");
      setMessage("Payment processing is not available at this moment.");
      setIsError(true);
      return;
    }

    const cardElement =elements.getElement(CardElement);
    if (!cardElement) {
      console.error("Card element not found.");
      setMessage("Payment cannot be processed at this time.");
      setIsError(true);
      return;
    }

    const paymentMethodResult = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: `${firstName} ${lastName}`,
        email,
        address: {
          line1: street,
          city,
          state,
          postal_code: zip,
          country: 'US',
        },
        phone,
      },
    });

    if (paymentMethodResult?.error) {
      console.error(paymentMethodResult.error.message);
      setMessage(paymentMethodResult.error.message || "An unknown error occurred.");
      setIsError(true);
    } else if (paymentMethodResult?.paymentMethod && selectedProductId) {
      await handleSuccessfulPayment(paymentMethodResult.paymentMethod.id);
    } else {
      console.error("Payment method or product ID missing.");
      setMessage("Payment method or product ID is missing.");
      setIsError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </div>
      )}
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="input-field"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Street Address"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Zip Code"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="input-field"
      />
      <CardElement className="card-element" />
      <button
        type="submit"
        disabled={!stripe || !firstName || !lastName || !email || !street || !city || !state || !zip || !phone}
        className="submit-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Pay
      </button>
    </form>
  );
};

export default StripePaymentForm;