import { AccordionContentHome, AccordionHome, AccordionItemHome, AccordionTriggerHome } from "./accordian-home";

export function FAQ() {
  const faqItems = [
    {
      id: "faq-item-1",
      question: "How is VA Claims Academy different from other VA claim assistance services?",
      answer: "VA Claims Academy offers personalized, expert guidance tailored to your unique situation. We dive deep into your case to uncover all potential service-connected conditions and provide you with custom-tailored tools and strategies to navigate the VA claim process effectively."
    },
    {
      id: "faq-item-2",
      question: "Can I use VA Claims Academy's services if I'm already working with a VSO or another VA claims company?",
      answer: "Absolutely! Our services are designed to complement and enhance the assistance you receive from your existing VSO or VA claims company. We provide additional tools, guidance, and support to maximize your chances of success."
    },
    {
      id: "faq-item-3",
      question: "How long does the VA claim process typically take?",
      answer: "The duration of the VA claim process can vary depending on the complexity of your case and the VA's current workload. However, VA Claims Academy helps you navigate the process as efficiently as possible, providing you with the support you need every step of the way."
    },
    {
      id: "faq-item-4",
      question: "Can VA Claims Academy help me identify additional service-connected conditions?",
      answer: "Yes! Our in-depth discovery process and expert knowledge often uncover potential service-connected conditions that you may not have considered. We help you explore every possibility to maximize your benefits."
    },
    {
      id: "faq-item-5",
      question: "How does VA Claims Academy ensure the security and confidentiality of my personal information?",
      answer: "We employ industry-standard safeguards to protect your personal information, including secure data storage, encrypted communication channels, and strict access controls. Your information is kept strictly confidential and is only used to assist you with your VA claim."
    },
    {
      id: "faq-item-6",
      question: "What if I'm not satisfied with VA Claims Academy's services?",
      answer: "Your satisfaction is our top priority. If for any reason you're not completely satisfied with your experience, simply let us know, and we'll work to make it right. We offer a 100% satisfaction guarantee."
    },
    {
      id: "faq-item-7",
      question: "Does VA Claims Academy search through my medical records or file my VA claim for me?",
      answer: "No, VA Claims Academy does not search through your medical records or file your VA claim on your behalf. Our role is to provide you with the tools, guidance, and support to help you understand and navigate the VA claim process effectively. You remain in control of your own medical records and are responsible for filing your own claim, either on your own or with the assistance of a VSO or accredited representative."
    },
    {
      id: "faq-item-8",
      question: "Do you work with individuals that are FAA regulated?",
      answer: "Yes, quite often. The client is responsible for keeping up-to-date on FAA regulations, and how to best navigate them."
    },
    {
      id: "faq-item-9",
      question: "Does VA Claims Academy offer one on one services to assist in preparation of my VA Claim?",
      answer: "No, legally we are unable to directly aid in the presentation or preparation of your claim. We offer a robust educational service for educational purposes only. Those in need of more hands-on assistance should enlist the help of a VA accredited agent or VSO."
    },
    {
      id: "faq-item-10",
      question: "Is there additional charges after winning a rating increase? Such as 5x or 6x?",
      answer: "Negative."
    }
  ];

  return (
    <section id="faq" className="py-XXL px-L sm:px-XXL bg-white">
      <div className="w-full text-center">
        <h1 className="text-crimsonNew text-4xl sm:text-5xl font-lexendDeca font-bold">Frequently Asked Questions</h1>
      </div>

      <div className="mt-[80px] flex items-center justify-center ">


        <AccordionHome type="single" collapsible className="w-[100%] max-w-[1440px]">
          {faqItems.map(({ id, question, answer }) => (
            <AccordionItemHome key={id} value={id} className="border-b border-frenchGray mt-[10px]">
              <AccordionTriggerHome className="text-base text-platinum_950 font-semibold font-opensans">
                {question}
              </AccordionTriggerHome>
              <AccordionContentHome className="text-base text-text_2 font-normal font-opensans">
                {answer}
              </AccordionContentHome>
            </AccordionItemHome>
          ))}
        </AccordionHome>

      </div>
    </section>
  );
}
