import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate, 
        faListCheck, 
        faBadgeCheck, 
        faPenToSquare, 
        faTvRetro, 
        faFileCircleQuestion, 
        faCircleHalfStroke, 
        faPhone, 
        faDoNotEnter } from "@fortawesome/pro-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link";



export default function UserTodosPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h2 className="font-bold tracking-tight text-4xl">Todos</h2>
      <p className="text-md text-muted-foreground p-10 w-11/12 sm:w-5/12">
        Below is a list of your todos. These are tailored to your claim needs
        based on information you have provided. They are designed to gather the
        most important information that we will use to deliver the best results
        for you as well as inform you of the next steps in the process and
        information relevant to you.
      </p>

      <div id="todos-wrapper"  className="flex flex-col items-center justify-center w-full sm:w-11/12 xl:w-8/12 p-10 rounded-lg shadow-md"
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faTvRetro} className="w-7 h-7 mr-2"/>
                  <span className="text-lg">Watch an Introductory Video<span className="text-sm ml-4 text-amber-500 todo-requirement">Recommended</span></span>
                </div>
                <div className="flex items-center text-green-600 mr-6">
                  <span className="mr-3">Complete</span>
                  <FontAwesomeIcon icon={faBadgeCheck} className="w-7 h-7 ml-2"/>
                </div>
              </div>
            </AccordionTrigger>
              <AccordionContent>
              <p className="text-md text-gray-700 mt-4 px-6 py-2">
                Welcome to VA Claims Academy! We highly recommend you start by watching our introductory video. This video will guide you through the process of using our services, what you can expect going forward, and provide you with helpful tips to maximize the benefits of this service as well as your claim with the VA. It's designed to ensure you have all the necessary information to navigate your journey with confidence.
              </p>
              <div className="flex justify-end">
                <Link href="/" className={`${buttonVariants({ variant: "outline" })} mt-4 bg-blue-700 text-white mr-5`}>
                  Watch Video
                </Link>
              </div>
              </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faPenToSquare} className="w-7 h-7 mr-2"/>
                  <span className="text-lg">Complete your Intake Form<span className="text-sm ml-4 text-red-500 todo-requirement">*Required</span></span>
                </div>
                <div className="flex items-center text-green-600 mr-6">
                  <span className="mr-3">Complete</span>
                  <FontAwesomeIcon icon={faBadgeCheck} className="w-7 h-7 ml-2"/>
                </div>
              </div>
            </AccordionTrigger>
              <AccordionContent>
              <p className="text-md text-gray-700 mt-4 px-6 py-2">
                Thank you for submitting your intake form. We will review the information you provided to design a highly tailored follow up. Make sure to check back here as well as check your email for that follow up. Remember that all personally identifiable information is redacted from the information you provide to ensure your privacy and security.
              </p>
              <div className="flex justify-end">
                <Link href="/" className={`${buttonVariants({ variant: "outline" })} mt-4 bg-blue-700 text-white mr-5`}>
                  View Your Intake Form
                </Link>
              </div>
              </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faFileCircleQuestion} className="w-7 h-7 mr-2"/>
                  <span className="text-lg">Complete your Supplemental Questions<span className="text-sm ml-4 text-red-500 todo-requirement">*Required</span></span>
                </div>
                <div className="flex items-center text-blue-600 mr-6">
                  <span className="mr-3">Started</span>
                  <FontAwesomeIcon icon={faCircleHalfStroke} className="w-7 h-7 ml-2"/>
                </div>
              </div>
            </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center  bg-slate-100 p-5">
                    <h2 className="text-xl  px-6 py-2">
                      Back Pain
                    </h2>                    
                    <div className="flex items-center">
                    <FontAwesomeIcon icon={faBadgeCheck} className="w-5 h-5 mr-2 text-green-600"/> You've completed your supplemental questions for Back Pain.
                    </div>
                  </div>                  
                  <div className="flex justify-between items-center  p-5">
                    <h2 className="text-xl  px-6 py-2">
                      Combat PTSD
                    </h2>                    
                    <div className="flex items-center">
                    <FontAwesomeIcon icon={faBadgeCheck} className="w-5 h-5 mr-2 text-green-600"/> You've completed your supplemental questions for Back Pain.
                    </div>
                  </div>
                  <div className="flex justify-between items-center  bg-slate-100 p-5">
                    <h2 className="text-xl  px-6 py-2">
                      Tinnitus
                    </h2>                    
                    <div className="flex ">
                      <Link href="/" className={`${buttonVariants({ variant: "outline" })} bg-blue-700 text-white mr-5`}>
                        Complete Your Supplemental Questions for Tinnitus
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between items-center p-5">
                    <h2 className="text-xl  px-6 py-2">
                      Gastro Esophageal Reflux Disease (GERD)
                    </h2>                    
                    <div className="flex ">
                      <Link href="/" className={`${buttonVariants({ variant: "outline" })} bg-blue-700 text-white mr-5`}>
                        Complete Your Supplemental Questions for Gastro Esophageal Reflux Disease (GERD)
                      </Link>
                    </div>
                  </div>
                </div>
              </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="w-7 h-7 mr-2"/>
                  <span className="text-lg">Schedule Your Onboarding Call<span className="text-sm ml-4 text-red-500 todo-requirement">*Required</span></span>
                </div>
                <div className="flex items-center text-gray-600 mr-6">
                  <span className="mr-3">Not Available Yet</span>
                  <FontAwesomeIcon icon={faDoNotEnter} className="w-7 h-7 ml-2"/>
                </div>
              </div>
            </AccordionTrigger>
              <AccordionContent>
              <p className="text-md text-gray-700 mt-4 px-6 py-2">
                In order to schedule your onboarding call with a VA Claims Academy representative, you must first complete your intake form and supplemental questions. Once you have completed those steps, you will be able to schedule your onboarding call.
              </p>
              
              </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUserGraduate} className="w-7 h-7 mr-2"/>
                  <span className="text-lg">Continue with your Courses<span className="text-sm ml-4 text-amber-500 todo-requirement">Recommended</span></span>
                </div>                
                <div className="flex items-center text-blue-600 mr-6">
                  <span className="mr-3">Started</span>
                  <FontAwesomeIcon icon={faCircleHalfStroke} className="w-7 h-7 ml-2"/>
                </div>
              </div>
            </AccordionTrigger>
              <AccordionContent className="flex flex-col ml-5 w-full items-center">
                <h3 className="text-lg font-bold">You have completed the following modules:</h3>
                <ul className="mt-5 list-disc list-inside">
                  <li>Welcome: Start Here</li>
                  <li>Phase 1: Recon</li>
                  <li>Phase 2: STRATEGY</li>
                </ul>
                <h3 className="text-lg font-bold mt-5">Your Next Video:</h3>
                <Link href="/" className={`${buttonVariants({ variant: "outline" })} bg-blue-700 text-white mr-5 w-fit`}>
                What Type Of Claim Should I File? Here's The Answer
                </Link>              
              </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
}
