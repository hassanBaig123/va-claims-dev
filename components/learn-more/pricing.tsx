'use client'
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import StripePaymentForm from '@/components/learn-more/StripePaymentForm';
import PaymentDialog from '@/components/learn-more/paymentdialog';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_live_51MSCUvJxLu9kP7U0XRItcPfGXW01BgKv5Lj8XIceyy8EW54WEmyawwNWfEEw3SD6Si1FJWEiErOoegV7MF6q73M000b73VeZst');


const Pricing: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);

  const openDialog = (product: string, productId: string) => {
    setSelectedProduct(product);
    setSelectedProductId(productId);
    setIsOpen(true);
  };
  return (
    <section id="pricing-section" className="mb-20">
      <Elements stripe={stripePromise}>
        <PaymentDialog isOpen={isOpen} onOpenChange={setIsOpen} selectedProduct={selectedProduct} selectedProductId={selectedProductId} />
      </Elements>
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-5 mb-16 sm:mb-24">
          <h1 className="text-3xl sm:text-5xl font-bold text-center">
            For Active Duty, Transitioning Military, and Veterans
          </h1>
          <h3 className="text-xl sm:text-3xl text-center">
            Lifetime value, one unbeatable price, for strategies that WORK
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-stretch space-y-6 md:space-y-0 md:space-x-6">
          {/* Bronze Plan */}
          <div className="flex flex-col w-full sm:w-1/4 bg-white rounded-lg shadow-2xl p-6 border-2 border-gray-300 transform transition duration-500 hover:scale-[1.02] order-2 sm:order-1">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Bronze
            </h2>
            <p className="text-center text-2xl text-gray-600 mt-2">$297.00</p>
            <p className="text-center text-lg text-gray-600 mt-2">
              One Time Payment
            </p>
            <ul className="mt-6 space-y-4 text-lg flex-grow">
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                MEB Process Guide
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Personal Statement Templates
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Comprehensive Claims Guide
              </li>
            </ul>
            <button onClick={() => openDialog('Bronze', 'prod_PnZM5ETN3s8bhn')} className="mt-auto bg-navyYellow hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded text-lg transition-colors duration-300">
              Get Instant Access
            </button>
          </div>
          {/* Gold Plan - This now comes first in the markup, but uses order- classes to position correctly */}
          <div className="flex flex-col w-full sm:w-1/3 bg-white rounded-lg shadow-2xl p-8 border-4 border-yellow-400 transition duration-500 sm:scale-[1.04] mb-32 sm:mb-0 sm:hover:scale-[1.06] transform-gpu order-1 sm:order-2">
            <h2 className="text-4xl font-bold text-center text-yellow-600">
              Gold Advantage
            </h2>
            <p className="text-center text-2xl text-gray-600 mt-2">$797.00</p>
            <p className="text-center text-lg text-gray-600 mt-2">
              One Time Payment
            </p>
            <ul className="mt-6 mb-6 space-y-4 text-lg flex-grow">
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Personalized Intake Process
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Curated Course with Relevant Modules and Videos
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Fully written personal statement templates for any condition
              </li>
              <strong>
                <li>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="inline mr-2 text-green-500 w-4 h-4"
                  />
                  Exclusive Clearpath Report
                </li>
              </strong>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                C&P Exam Guidance
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Updated VA Strategy Info
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Clear Next Steps
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                CUSTOM written NEXUS LETTER templates
              </li>
            </ul>
            <button onClick={() => openDialog('Gold', 'prod_PnZ9OixQFy8c6m')} className="mt-auto bg-navyYellow hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded text-lg transition-colors duration-300">
              Get Instant Access
            </button>
          </div>
          {/* Silver Plan */}
          <div className="flex flex-col w-full sm:w-1/4 bg-white rounded-lg shadow-2xl p-6 border-2 border-gray-300 transform transition duration-500 sm:hover:scale-[1.02] order-3">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Silver
            </h2>
            <p className="text-center text-2xl text-gray-600 mt-2">$497.00</p>
            <p className="text-center text-lg text-gray-600 mt-2">
              One Time Payment
            </p>
            <ul className="mt-6 space-y-4 text-lg flex-grow">
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                In-depth Personalized Intake
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Curated Educational Course
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Standard Nexus Letter Templates
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Standard Personal Letter Templates
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Secondary Condition Insights
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Personal Letter Writing Course
              </li>
            </ul>
            <button onClick={() => openDialog('Silver', 'prod_PnZH9fc6oZl5V9')} className="mt-auto bg-navyYellow hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded text-lg transition-colors duration-300">
              Get Instant Access
            </button>
          </div>
          {/* Test */}
          <div className="flex flex-col w-full sm:w-1/4 bg-white rounded-lg shadow-2xl p-6 border-2 border-gray-300 transform transition duration-500 sm:hover:scale-[1.02] order-3 ">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Test
            </h2>
            <p className="text-center text-2xl text-gray-600 mt-2">$0.50</p>
            <p className="text-center text-lg text-gray-600 mt-2">
              One Time Payment
            </p>
            <ul className="mt-6 space-y-4 text-lg flex-grow">
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="inline mr-2 text-green-500 w-4 h-4"
                />
                Test Product
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

export default Pricing;
