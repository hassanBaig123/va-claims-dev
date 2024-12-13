import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export function FAQLong() {
    const faqItems = [
        {
          id: "faq-item-1",
          question: "What makes the VetVictory Claim Guide so valuable?",
          answer: "The VetVictory Claim Guide is a comprehensive, personalized guide that provides you with a clear roadmap for your VA claim. It includes in-depth research, scientific evidence, winning strategies from similar cases, and a step-by-step action plan tailored to your unique situation."
        },
        {
          id: "faq-item-2",
          question: "How do your custom-written personal statement templates benefit my claim?",
          answer: "Our custom-written personal statement templates help you effectively communicate your unique experiences and challenges to the VA. We translate your story into the language and format the VA is looking for, maximizing your chances of success."
        },
        {
          id: "faq-item-3",
          question: "What role do Nexus letters play in a VA disability claim?",
          answer: "Nexus letters are crucial in establishing a connection between your current disability and your military service. VA Claims Academy crafts custom Nexus letters tailored to your specific case, incorporating the necessary medical and legal language to effectively argue service connection."
        },
        {
          id: "faq-item-4",
          question: "How does the one-time payment model work, and what does it include?",
          answer: "With our one-time payment model, you pay a single, transparent fee upfront for your chosen package. This fee includes access to all the tools, resources, and support outlined in your package, with no hidden costs or long-term contracts."
        },
        {
          id: "faq-item-5",
          question: "What kind of expertise does the VA Claims Academy team have?",
          answer: "Our team consists of seasoned experts with a deep understanding of the VA disability claim process and 38 CFR. We stay up-to-date on the latest laws, regulations, and best practices to provide you with the most effective guidance and support."
        },
        {
          id: "faq-item-6",
          question: "How do I get started with VA Claims Academy?",
          answer: "Getting started is easy! Simply choose the package that best fits your needs, complete the intake form, and schedule your discovery call. Our team will guide you through the process and start gathering the information needed to build your personalized VA claim strategy."
        },
        {
          id: "faq-item-7",
          question: "Can VA Claims Academy guarantee a specific outcome for my VA disability claim?",
          answer: "While no one can guarantee a specific outcome, VA Claims Academy provides you with the tools, guidance, and support to build the strongest possible case for your VA claim. We put you in the best position to achieve a favorable result."
        },
        {
          id: "faq-item-8",
          question: "What makes VA Claims Academy's approach to VA disability claims unique?",
          answer: "VA Claims Academy offers a personalized, comprehensive approach to VA disability claims. We take the time to understand your unique situation, uncover all potential service-connected conditions, and provide custom-tailored tools and strategies to help you navigate the process with confidence."
        },
        {
          id: "faq-item-9",
          question: "How can I be sure that the information provided by VA Claims Academy is accurate and up-to-date?",
          answer: "Our team of experts continuously monitors changes in VA regulations and best practices to ensure that the information and guidance we provide are accurate and current. We pride ourselves on staying at the forefront of the VA disability claim landscape."
        },
        {
          id: "faq-item-10",
          question: "What happens if the VA denies my disability claim?",
          answer: "If your VA disability claim is denied, VA Claims Academy can help you understand your options for appealing the decision. We'll guide you through the decision contention process and provide the support you need to build a strong case for reconsideration."
        },
        {
          id: "faq-item-11",
          question: "Can I access VA Claims Academy's services from anywhere in the United States?",
          answer: "Yes! VA Claims Academy's services are available to veterans and service members throughout the United States. Our online platform and remote support allow us to serve clients regardless of their location."
        },
        {
          id: "faq-item-12",
          question: "How does VA Claims Academy help me prepare for my C&P exam?",
          answer: "We provide comprehensive guidance and resources to help you prepare for your Compensation and Pension (C&P) exam. Our C&P exam prep materials, included in your package, will equip you with the knowledge and strategies to approach your exam with confidence."
        },
        {
          id: "faq-item-13",
          question: "What sets VA Claims Academy apart from trying to navigate the VA claim process on my own?",
          answer: "Navigating the VA claim process alone can be overwhelming, confusing, and time-consuming. VA Claims Academy provides expert guidance, personalized strategies, and a wealth of resources to help you avoid common pitfalls and maximize your chances of success. We save you time, energy, and frustration."
        }
      ];
  
    return (
      <div id="faq-long" className="container mb-6 md:px-24 lg:px-48">
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