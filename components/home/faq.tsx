import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
    }
  ];

  return (
    <div className="container mb-32 md:px-24 lg:px-48">
      <h1 className="text-3xl text-center font-bold mb-20 sm:text-4xl md:text-4xl lg:text-5xl">
        Frequently Asked Questions
      </h1>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map(({ id, question, answer }) => (
          <AccordionItem key={id} value={id} className="mb-4">
            <AccordionTrigger className="text-xl sm:text-2xl text-crimson">
              {question}
            </AccordionTrigger>
            <AccordionContent className="p-5 text-lg">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}