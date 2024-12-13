"use client";
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faUserGraduate,
  faListCheck,
  faBadgeCheck,
  faPenToSquare,
  faTvRetro,
  faFileCircleQuestion,
  faCircleHalfStroke,
  faPhone,
  faDoNotEnter,
  faInfinity,
  faLayerGroup,
  faFileDownload,
  faUsers,
  faFilePen,
  faUserCheck,
  faPencilAlt,
  faEnvelopeOpenText,
  faChalkboardTeacher,
  faSearch,
  faChevronRight,
} from "@fortawesome/pro-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { InlineWidget } from "react-calendly";

export default function UserProductsPage() {
  // State to track if the "all-modules" accordion is open
  const [isAllModulesOpen, setIsAllModulesOpen] = useState(false);
  // State to track the width of the progress bar
  const [progressWidth, setProgressWidth] = useState(0);
  // Target progress percentage (can be dynamically set based on some logic or data)
  const targetProgress = 75; // Example: 75%

  // Function to animate the progress bar to a target percentage
  const animateProgressBar = (duration, targetPercentage) => {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const width = Math.min(
        (progress / duration) * targetPercentage,
        targetPercentage
      );
      setProgressWidth(width);
      if (width < targetPercentage) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  // Effect to trigger the animation when the "all-modules" accordion is opened
  useEffect(() => {
    if (isAllModulesOpen) {
      console.log("Animating progress bar...");
      animateProgressBar(2000, targetProgress); // Animate over 2000ms to the targetProgress
    } else {
      setProgressWidth(0); // Reset progress bar when accordion is closed
    }
  }, [isAllModulesOpen, targetProgress]);

  // Variable for module information
  const moduleInformation = [
    {
      href: "/module/1",
      title: "Understanding VA Disability Claims",
      status: "Complete",
      icon: faBadgeCheck,
      color: "text-green-500",
    },
    {
      href: "/module/2",
      title: "Gathering Medical Evidence",
      status: "Complete",
      icon: faBadgeCheck,
      color: "text-green-500",
    },
    {
      href: "/module/3",
      title: "Filing Your Claim",
      status: "Started",
      icon: faCircleHalfStroke,
      color: "text-blue-500",
    },
    {
      href: "/module/4",
      title: "VA Claim Processing",
      status: "Not Started",
      icon: faDoNotEnter,
      color: "text-gray-500",
    },
    {
      href: "/module/5",
      title: "Receiving Your Decision",
      status: "Not Started",
      icon: faDoNotEnter,
      color: "text-gray-500",
    },
  ];

  // Define the intake process steps
  const intakeSteps = [
    {
      name: "Intake Form",
      status: "Complete",
      icon: "faFilePen",
      link: "/intake-form",
    },
    {
      name: "Supplemental Questionnaires",
      status: "Reviewing",
      icon: "faListCheck",
      link: "/supplemental-questionnaires",
    },
    // {
    //   name: 'Onboarding Call',
    //   status: 'Not Started',
    //   icon: 'faPhone',
    //   link: '/onboarding-call'
    // }
  ];

  // Function to return the FontAwesomeIcon component based on the icon name
  const getIcon = (iconName) => {
    switch (iconName) {
      case "faFilePen":
        return faFilePen;
      case "faListCheck":
        return faListCheck;
      case "faPhone":
        return faPhone;
      default:
        return faCircleHalfStroke; // Default icon for demonstration
    }
  };

  // Variable for personal statement conditions
  const personalStatementConditions = [
    { name: "Post-Traumatic Stress Disorder (PTSD)", link: "/templates/ptsd" },
    { name: "Hearing Loss", link: "/templates/hearing-loss" },
    { name: "Traumatic Brain Injury (TBI)", link: "/templates/tbi" },
    { name: "Chronic Back Pain", link: "/templates/chronic-back-pain" },
    { name: "Tinnitus", link: "/templates/tinnitus" },
  ];

  const userId = "user123"; // This should be dynamically set based on the actual user's ID
  const customPersonalStatementConditions = [
    {
      name: "Post-Traumatic Stress Disorder (PTSD)",
      link: `/user/${userId}/custom-templates/ptsd`,
    },
    {
      name: "Hearing Loss",
      link: `/user/${userId}/custom-templates/hearing-loss`,
    },
    {
      name: "Traumatic Brain Injury (TBI)",
      link: `/user/${userId}/custom-templates/tbi`,
    },
    {
      name: "Chronic Back Pain",
      link: `/user/${userId}/custom-templates/chronic-back-pain`,
    },
    { name: "Tinnitus", link: `/user/${userId}/custom-templates/tinnitus` },
  ];

  // Sample object for customNexusLetters
  const customNexusLetters = [
    {
      name: "Post-Traumatic Stress Disorder (PTSD)",
      link: `/user/${userId}/custom-nexus/ptsd`,
    },
    { name: "Hearing Loss", link: `/user/${userId}/custom-nexus/hearing-loss` },
    {
      name: "Traumatic Brain Injury (TBI)",
      link: `/user/${userId}/custom-nexus/tbi`,
    },
    {
      name: "Chronic Back Pain",
      link: `/user/${userId}/custom-nexus/chronic-back-pain`,
    },
    { name: "Tinnitus", link: `/user/${userId}/custom-nexus/tinnitus` },
  ];

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="font-bold text-4xl">Your Products</h1>
      <div className="flex items-center w-full sm:w-11/12 xl:w-8/12 p-10">
        <FontAwesomeIcon
          icon={faShieldHalved}
          className="w-12 h-12 mr-2 text-amber-500"
        />
        <h2 className="text-4xl font-bold text-amber-500">Gold Advantage Package</h2>
      </div>

      <div
        id="products-wrapper"
        className="flex flex-col items-center justify-center w-full sm:w-11/12 xl:w-8/12 p-10 rounded-lg shadow-md"
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="lifetime-access">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faInfinity} className="w-7 h-7 mr-2" />
                  <span className="text-lg">Lifetime Access</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-md text-gray-700 mt-4 px-6 py-2">
                Enjoy lifetime access to all current and future resources,
                ensuring you have the support and information you need at any
                stage of your journey.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="all-modules">
            <AccordionTrigger
              onClick={() => setIsAllModulesOpen(!isAllModulesOpen)}
            >
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faLayerGroup}
                    className="w-7 h-7 mr-2"
                  />
                  <span className="text-lg">Access to All Modules</span>
                </div>
                <div className="flex items-center text-blue-600 mr-6">
                  <span className="mr-3">Started</span>
                  <FontAwesomeIcon
                    icon={faCircleHalfStroke}
                    className="w-7 h-7 ml-2"
                  />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {/* <p className="text-lg text-gray-700 mt-4 px-6 py-2">
              Gain access to a comprehensive suite of modules covering every aspect of the VA claims process. 
              This universal resource is designed to empower all Gold package holders with essential knowledge and tools. 
              Completion of the intake process will enable us to tailor a Curated Course specifically for you, 
              enhancing your educational journey with personalized content.
            </p> */}
              <p className="text-md text-gray-700 mt-4 px-6 py-2">
                Gain access to a comprehensive suite of modules covering every
                aspect of the VA claims process, designed to empower you with
                knowledge and tools.
              </p>
              <Separator />
              <h3 className="mt-3 text-xl font-semibold text-center">
                Progress:
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-5 dark:bg-gray-700 relative my-4">
                <div
                  className="bg-blue-600 h-5 rounded-full"
                  style={{ width: `${progressWidth}%` }}
                ></div>
                <div className="absolute left-0 top-0 h-full flex items-center justify-end w-full pr-3 text-base font-semibold text-blue-800">
                  {Math.round(progressWidth)}%
                </div>
              </div>
              <ul className="list-none flex flex-col justify-center items-center gap-4">
                {moduleInformation.map((module, index) => (
                  <Link
                    key={index}
                    href={module.href}
                    className="w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 mx-auto"
                  >
                    <li className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer transform transition duration-300 ease-in-out hover:shadow-lg hover:bg-blue-50 active:bg-blue-100">
                      <span className="font-semibold text-md text-blue-600">
                        {module.title}
                      </span>
                      <div className="flex justify-end items-center">
                        <FontAwesomeIcon
                          icon={module.icon}
                          className={`w-5 h-5 ${module.color}`}
                        />
                        <p
                          className={`ml-2 text-sm ${module.color} font-semibold`}
                        >
                          {module.status}
                        </p>
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="board-room">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUsers} className="w-7 h-7 mr-2" />
                  <span className="text-lg">
                    Access to The Board Room Private Facebook Community
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex justify-center ">
              <div className="flex w-full items center sm:w-10/12 md:w-9/12">
                <p className="text-lg text-gray-700 mt-4 px-6 py-2">
                  Join an <strong>exclusive</strong> community of veterans and
                  experts where you can share experiences, ask questions, and
                  receive support throughout your VA claims process.
                </p>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center hover:bg-blue-100 transition-colors rounded-lg mt-10 sm:mt-0"
                >
                  <Image
                    src="/imgs/join-boardroom-facebook.png"
                    alt="Facebook"
                    width={400}
                    height={119}
                  />
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="personal-statement-templates">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faFilePen} className="w-7 h-7 mr-2" />
                  <span className="text-lg">
                    Fully Written Personal Statement Templates for Any Condition
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-gray-50 p-4 rounded-b-lg">
              <p className="text-md text-gray-700 mb-4">
                Here are Personal Letter templates for you based on the
                information you have provided us. <strong>Note:</strong> this is
                not the custom made Personal Letter that we will supply to you.
              </p>
              <Separator />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {personalStatementConditions.map((condition, index) => (
                  <a
                    key={index}
                    href={condition.link}
                    className="flex justify-between p-6 bg-white rounded-lg shadow hover:shadow-md hover:bg-blue-50 transition duration-300 ease-in-out"
                  >
                    <span className="font-medium text-md text-gray-800">
                      {condition.name}
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-5 h-5 text-gray-600 self-end"
                    />
                  </a>
                ))}
              </div>
              <a
                href="/all-personal-statement-templates"
                className="inline-block mt-6 px-6 py-2 text-lg text-blue-800 hover:text-gray-900 hover:bg-blue-50 bg-white font-semibold border border-gray-300 hover:border-gray-400 shadow hover:shadow-md rounded transition-colors duration-300"
              >
                View all Personal Statement Templates
              </a>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="intake-process">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faUserCheck}
                    className="w-7 h-7 mr-2"
                  />
                  <span className="text-lg">
                    Highly Personalized Intake Process
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="font-semibold text-xl text-center">
                    Intake Process Roadmap
                  </h3>
                  <p className="text-md text-gray-600 text-center">
                    Follow the steps below to complete your intake process.
                  </p>
                </div>
                <ol className="list-decimal list-inside space-y-4">
                  {intakeSteps.map((step, index) => (
                    <li
                      key={index}
                      className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                    >
                      <FontAwesomeIcon
                        icon={getIcon(step.icon)}
                        className="w-6 h-6 text-blue-500"
                      />
                      {step.status === "Not Started" ||
                      step.status === "Ready" ||
                      step.status === "Incomplete" ? (
                        <Link
                          href={step.link}
                          className="text-blue-600 hover:underline"
                        >
                          <span className="text-lg font-medium">
                            {step.name} -{" "}
                            <span className="font-semibold text-gray-500">
                              {step.status}
                            </span>
                          </span>
                        </Link>
                      ) : (
                        <span className="text-lg font-medium">
                          {step.name} -{" "}
                          <span
                            className={`font-semibold ${
                              step.status === "Complete"
                                ? "text-green-500"
                                : "text-yellow-500"
                            }`}
                          >
                            {step.status}
                          </span>
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="onboarding-call">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="w-7 h-7 mr-2" />
                  <span className="text-lg">1-on-1 Onboarding Call</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-md text-gray-700 mt-4 px-6 py-2">
                Begin your journey with a personal onboarding call to set clear
                expectations, answer your questions, and tailor the program to
                your specific needs.
              </p>
              <div className="my-4">
                <InlineWidget url="https://calendly.com/jerc12341234/30min" />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="custom-personal-statement">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className="w-7 h-7 mr-2"
                  />
                  <span className="text-lg">
                    CUSTOM Written Personal Statement Templates Specific to Your
                    Circumstance
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-blue-50 p-4 rounded-b-lg">
              <p className="text-lg text-gray-700 mb-4">
                Based on the conditions you've shared with us, here are
                custom-written Personal Statement templates tailored for you.
              </p>
              <Separator />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {customPersonalStatementConditions.map((condition, index) => (
                  <a
                    key={index}
                    href={condition.link}
                    className="flex justify-between p-6 bg-white rounded-lg shadow hover:shadow-md hover:bg-blue-50 transition duration-300 ease-in-out"
                  >
                    <span className="font-medium text-md text-gray-800">
                      {condition.name}
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-5 h-5 text-gray-600 self-end"
                    />
                  </a>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="nexus-letter">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faEnvelopeOpenText}
                    className="w-7 h-7 mr-2"
                  />
                  <span className="text-lg">
                    CUSTOM Written NEXUS LETTER Templates Ready to Be Signed by
                    Your Private Doctor!
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-green-50 p-4 rounded-b-lg">
              <p className="text-lg text-gray-700 mb-4">
                For the conditions you've disclosed, we've prepared
                custom-written NEXUS letter templates. These are ready to be
                reviewed and signed by your private doctor, aiding in the
                substantiation of your VA Disability claim.{" "}
                <strong>Note:</strong> These templates are specifically tailored
                to support your individual case.
              </p>
              <Separator />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {customNexusLetters.map((letter, index) => (
                  <a
                    key={index}
                    href={letter.link}
                    className="flex justify-between p-6 bg-white rounded-lg shadow hover:shadow-md hover:bg-blue-50 transition duration-300 ease-in-out"
                  >
                    <span className="font-medium text-md text-gray-800">
                      {letter.name}
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-5 h-5 text-gray-600 self-end"
                    />
                  </a>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="curated-course">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faChalkboardTeacher}
                    className="w-7 h-7 mr-2"
                  />
                  <span className="text-lg">
                    Curated Course Designed Specifically for Your Conditions
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-md text-gray-700 mt-4 px-6 py-2">
                Access a course curated specifically for your conditions,
                providing targeted information and strategies to navigate your
                claim effectively.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="clearpath-research-report">
            <AccordionTrigger>
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faSearch} className="w-7 h-7 mr-2" />
                  <span className="text-lg">Clearpath Research Report</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-start items-center w-full h-96 bg-[#0b1739] relative">
                <div className="w-1/12 bg-[url('/imgs/brand_patterns/VA_Claims_Stars_A4_Filled_3_Pattern.png')] h-full"></div>
                <div className='flex items-center justify-center w-5/12 absolute h-1/5 bg-[url("/imgs/brand_patterns/VA_Claims_A4_Stripes_Filled_4_Pattern_repeatable.png")] bottom-7'>
                  <h2 className="text-white text-4xl font-bold text-center">
                    Clearpath Report
                  </h2>
                </div>
                <div className="flex flex-col items-start ml-7 relative bottom-7 w-4/12">
                  <img
                    src="/imgs/Logo/VA_Claims_Secondary_Logo_Transparent_2.svg"
                    alt="VA Claims Secondary Logo"
                    className="w-[350px] mb-3"
                  />
                  
                </div>
                <div className="flex flex-col items- w-8/12">
                  <p className="text-lg text-white mt-4 px-6 py-2 w-full self-start p-5">
                    Benefit from a comprehensive Clearpath Research Report, offering
                    in-depth analysis and insights to support your claim and
                    maximize your benefits.
                  </p>
                <Link href="/your-report" className="inline-block text-center w-56 text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 shadow">                  
                    View Your Report                  
                </Link>
                </div>
              </div>
              
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
