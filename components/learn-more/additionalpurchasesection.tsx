'use client'
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import PaymentDialog from '@/components/learn-more/paymentdialog';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_live_51MSCUvJxLu9kP7U0XRItcPfGXW01BgKv5Lj8XIceyy8EW54WEmyawwNWfEEw3SD6Si1FJWEiErOoegV7MF6q73M000b73VeZst');


const AdditionalPurchaseSection: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);

  const openDialog = (product: string, productId: string) => {
    setSelectedProduct(product);
    setSelectedProductId(productId);
    setIsOpen(true);
  };
  return (
    <section id="additional-purchase-section" className="mb-20">
      {/* <Elements stripe={stripePromise}>
        <PaymentDialog isOpen={isOpen} onOpenChange={setIsOpen} selectedProduct={selectedProduct} selectedProductId={selectedProductId} />
      </Elements> */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-5 mb-16 sm:mb-24">
          <h1 className="text-3xl sm:text-5xl font-bold text-center">
            We Offer These Additional Options to Help You Succeed
          </h1>
          
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-stretch space-y-6 md:space-y-0 md:space-x-6">
          {/* Free */}
          <div className="flex flex-col w-full sm:w-1/4 bg-white rounded-lg shadow-2xl p-6 border-2 border-gray-300 transform transition duration-500 sm:hover:scale-[1.02] order-3 ">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Free Tier
            </h2>
            <p className="text-center text-2xl text-gray-600 mt-2">Free</p>
            
            <ul className="mt-6 space-y-4 text-lg flex-grow">
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                This is a free tier Product
              </li>
             
            </ul>
            <button onClick={() => openDialog('Test', 'prod_Q14n8pEtGecNUR')} className="mt-auto bg-navyYellow hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded text-lg transition-colors duration-300">
              Get Instant Access
            </button>
          </div>
          {/* Subscription */}
          <div className="flex flex-col w-full sm:w-1/4 bg-white rounded-lg shadow-2xl p-6 border-2 border-gray-300 transform transition duration-500 sm:hover:scale-[1.02] order-3 ">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Subscription
            </h2>
            <p className="text-center text-2xl text-gray-600 mt-2">$10.00</p>
            <p className="text-center text-lg text-gray-600 mt-2">
              Recurring Payment
            </p>
            <ul className="mt-6 space-y-4 text-lg flex-grow">
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
               Subscription Product
              </li>
             
            </ul>
            <button onClick={() => openDialog('Test', 'prod_Q14n8pEtGecNUR')} className="mt-auto bg-navyYellow hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded text-lg transition-colors duration-300">
              Get Instant Access
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AdditionalPurchaseSection;
