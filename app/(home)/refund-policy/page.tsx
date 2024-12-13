import React from "react";

export default function RefundPolicy() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-20">
        <section className="flex flex-col items-center justify-center w-full p-10 min-h-[25vh]">
          <h1 className="text-3xl font-bold text-oxfordBlue text-center pb-10">
            Refund Policy for VA Claims Academy, LLC
          </h1>
          <p className="text-md">Last Updated: August 27, 2024</p>
        </section>

        <section
          id="refund-policy"
          className="flex flex-col justify-center w-full xl:w-1/2 p-10"
        >
          <p className="text-lg indent-10 mb-5">
            At VA Claims Academy, LLC, we are committed to your satisfaction with
            our services and products designed to assist veterans in navigating the
            VA claims process. If, for any reason, you are not satisfied with your
            purchase, we offer a 30-day, no-questions-asked refund policy. This
            policy outlines the conditions under which refunds are granted, how to
            request a refund, and other important details.
          </p>

          <ol className="list-decimal pl-4 space-y-4 text-base">
            <li>
              <strong>30-Day Guarantee</strong>
              <p>
                We offer a 30-day, no-questions-asked refund policy on most of our
                products and services. If you are not completely satisfied within 30
                days of your purchase, you may request a full refund. This policy
                applies to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Training Courses</li>
                <li>Downloadable Products (e.g., eBooks, guides, templates)</li>
              </ul>
            </li>

            <li>
              <strong>Exceptions to the Guarantee</strong>
              <p>
                While we strive to make our refund policy as flexible as possible,
                there are certain exceptions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Complete VetVictory Claim Guide</strong>: If a Complete VetVictory Claim Guide
                  has already been drafted, no refund will be issued for that
                  service.
                </li>
                <li>
                  <strong>Custom Services</strong>: Once work has commenced on your
                  Custom Personal Statement Drafts or Custom Nexus Letter Drafts, no
                  refund will be issued. Please contact us as soon as possible if you
                  wish to cancel before work begins.
                </li>
                <li>
                  <strong>Expedited Fees</strong>: Any fees paid for expedited
                  services are non-refundable, regardless of the status of the
                  service.
                </li>
              </ul>
            </li>

            <li>
              <strong>Future Subscription Services</strong>
              <p>
                In the event that we offer subscription-based services in the future,
                refunds will be available under the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Initial Subscription Purchase</strong>: Refunds for the
                  initial subscription purchase will be available within 7 days,
                  provided the services have not been accessed or utilized.
                </li>
                <li>
                  <strong>Cancellation</strong>: Subscriptions can be canceled at any
                  time, with the cancellation taking effect at the end of the current
                  billing cycle. Refunds for subscription renewals will not be
                  available once the billing cycle has commenced.
                </li>
              </ul>
            </li>

            <li>
              <strong>How to Request a Refund</strong>
              <p>To request a refund, please follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Contact Us</strong>: Email our customer support team at
                  info@vaclaimsacademy.com with your order number, date of purchase,
                  and the reason for your refund request.
                </li>
                <li>
                  <strong>Review Process</strong>: Our team will review your request
                  and determine your eligibility for a refund based on the conditions
                  outlined in this policy.
                </li>
                <li>
                  <strong>Refund Decision</strong>: If your request is approved, we
                  will process the refund to your original payment method within 10
                  business days. You will receive an email confirmation once the
                  refund has been processed.
                </li>
              </ol>
            </li>

            <li>
              <strong>Changes to the Refund Policy</strong>
              <p>
                VA Claims Academy, LLC reserves the right to modify or update this
                Refund Policy at any time. Changes to this policy will be posted on our
                website, and the "Last Updated" date at the top of this policy will be
                revised accordingly. We encourage you to review this policy periodically
                to stay informed about our refund practices.
              </p>
            </li>

            <li>
              <strong>Contact Information</strong>
              <p>
                If you have any questions or need further assistance regarding this
                Refund Policy, please contact us at:
              </p>
              <p className="mt-2">
                VA Claims Academy, LLC<br />
                5900 Balcones Dr, STE 100<br />
                Austin, TX 78731<br />
                Email: info@vaclaimsacademy.com<br />
                Phone: 210-201-3299
              </p>
            </li>
          </ol>
          
          <p className="text-md mt-10">
            By making a purchase from VA Claims Academy, LLC, you acknowledge that you
            have read, understood, and agree to be bound by this Refund Policy. If you
            have any questions or concerns, please don't hesitate to contact us.
          </p>
        </section>
      </div>
    </>
  );
}