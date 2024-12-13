import Footer from "@/components/home/footer";
import React from "react";

export default function TermsOfService() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-20">
        <section className="flex flex-col items-center justify-center w-full p-10 min-h-[25vh]">
          <h1 className="text-3xl font-bold text-oxfordBlue text-center pb-10">
            Terms of Service for VA Claims Academy, LLC
          </h1>
          <p className="text-md">Last Updated: April 2nd, 2024</p>
        </section>

        <section
          id="terms-of-service"
          className="flex flex-col justify-center w-full xl:w-1/2 p-10"
        >
          <p className="text-lg indent-10 mb-5">
            Please read these Terms of Service ("Terms") carefully before using
            the services and website provided by VA Claims Academy, LLC ("we,"
            "us," or "our"). By accessing or using our services and website, you
            agree to be bound by these Terms. If you do not agree with any part
            of these Terms, please do not use our services or website.
          </p>

          <ol className="list-decimal pl-4 space-y-4 text-base">
            <li>
              <strong>Description of Services</strong>: VA Claims Academy, LLC
              provides an online course that educates users about the VA
              disability claim process. We do not prepare, represent, or
              prosecute any person's VA disability claim. We are not accredited
              agents, attorneys, or doctors recognized by the VA. All
              information provided through our services is for informational
              purposes only and should not be considered legal, medical, or
              professional advice.
            </li>
            <li>
              <strong>Intellectual Property</strong>: All materials within the
              VA Claims Academy course, including but not limited to documents,
              personal statement templates, Nexus letter templates, and any
              other writing or content, are the property of VA Claims Academy,
              LLC, except for official government and publicly accessible
              materials that we refer users to. You may not reproduce,
              distribute, modify, or create derivative works of any of our
              proprietary materials without our prior written consent.
            </li>
            <li>
              <strong>User Obligations</strong>: By using our services, you
              agree to the following obligations:
              <ol className="list-lowerAlpha pl-6 space-y-2">
                <li>
                  You will not reproduce or share any content within the VA
                  Claims Academy course without our prior written consent.
                </li>
                <li>
                  You are solely responsible for verifying the accuracy and
                  currency of any documents or information provided by VA Claims
                  Academy before submitting your own VA claims or making any VA
                  claim-related decisions.
                </li>
                <li>
                  You acknowledge that VA Claims Academy, LLC, its affiliates,
                  contracted doctors, or other third parties are not liable for
                  any incorrect information submitted in your VA claim, even if
                  the information was provided by us. It is your responsibility
                  to verify and edit all information as needed before
                  submission.
                </li>
              </ol>
            </li>
            <li>
              <strong>Disclaimer of Warranties</strong>: Our services and
              website are provided on an "as is" and "as available" basis,
              without any warranties of any kind, whether express or implied. We
              do not warrant that our services will be uninterrupted,
              error-free, or free from harmful components. We disclaim all
              warranties, including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement.
            </li>
            <li>
              <strong>Limitation of Liability</strong>: In no event shall VA
              Claims Academy, LLC, its affiliates, officers, directors,
              employees, or agents be liable for any indirect, incidental,
              special, consequential, or punitive damages arising out of or
              relating to your use of our services or website, even if we have
              been advised of the possibility of such damages. Our total
              liability for any claim arising out of or relating to these Terms
              or our services shall not exceed the amount paid by you, if any,
              for accessing our services.
            </li>
            <li>
              <strong>Indemnification</strong>: You agree to indemnify, defend,
              and hold harmless VA Claims Academy, LLC, its affiliates,
              officers, directors, employees, and agents from and against any
              and all claims, liabilities, damages, losses, costs, and expenses,
              including reasonable attorneys' fees, arising out of or relating
              to your use of our services or website, your violation of these
              Terms, or your violation of any rights of another.
            </li>
            <li>
              <strong>Refund Policy</strong>: We offer a 100% satisfaction
              money-back guarantee for our services. However, we reserve the
              right to refuse a refund or service to anyone in extenuating
              circumstances or for any reason, at our sole discretion.
            </li>
            <li>
              <strong>Termination</strong>: We may terminate or suspend your
              access to our services and website at any time, without prior
              notice or liability, for any reason whatsoever, including but not
              limited to a breach of these Terms.
            </li>
            <li>
              <strong>Governing Law and Jurisdiction</strong>: These Terms shall
              be governed by and construed in accordance with the laws of the
              State of Texas, without giving effect to any principles of
              conflicts of law. You agree that any action at law or in equity
              arising out of or relating to these Terms shall be filed only in
              the state or federal courts located in Travis County, Texas, and
              you hereby consent and submit to the personal jurisdiction of such
              courts for the purposes of litigating any such action.
            </li>
            <li>
              <strong>Modifications to Terms</strong>: We reserve the right to
              modify these Terms at any time, without prior notice. Your
              continued use of our services and website after any changes to
              these Terms constitutes your acceptance of the new Terms.
            </li>
            <li>
              <strong>Severability</strong>: If any provision of these Terms is
              found to be invalid, illegal, or unenforceable, the remaining
              provisions shall continue in full force and effect.
            </li>
            <li>
              <strong>Entire Agreement</strong>: These Terms, together with our
              Privacy Policy, constitute the entire agreement between you and VA
              Claims Academy, LLC regarding your use of our services and website
              and supersede all prior or contemporaneous communications and
              proposals, whether oral or written, between you and us.
            </li>
          </ol>
          <p className="text-md mt-10">By using our services and website, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use our services or website.</p>
        </section>
      </div>
      <div>
        <Footer isHomePage={false} />
      </div>
    </>
  );
}
