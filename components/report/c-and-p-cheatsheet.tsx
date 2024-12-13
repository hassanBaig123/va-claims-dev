import React from 'react';
import { TypographyH2 } from './h2';
import { TypographyH3 } from './h3';
import { TypographyP } from './p';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileLines, 
  faComments, 
  faHouse, 
  faChartLine, 
  faCircleQuestion, 
  faUserGroup 
} from '@fortawesome/pro-solid-svg-icons';


interface CheatSheetItemProps {
  icon: React.ComponentProps<typeof FontAwesomeIcon>['icon'];
  title: string;
  description: string;
}

const CheatSheetItem: React.FC<CheatSheetItemProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start space-x-4 p-4 bg-[#F3F4F6] rounded-lg">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
        <FontAwesomeIcon icon={icon} className="text-blue-600 text-xl" />
      </div>
      <div className="flex-grow">
        <TypographyH3 className="mb-2">{title}</TypographyH3>
        <TypographyP>{description}</TypographyP>
      </div>
    </div>
  );
};

const CPExamCheatSheet: React.FC = () => {
  const cheatSheetItems: CheatSheetItemProps[] = [
    {
      icon: faFileLines,
      title: "Comprehensive Documentation",
      description: "Gather and organize all relevant medical records, including recent test results, doctor's notes, and treatment history. Ensure they're up-to-date and clearly demonstrate the progression of your condition."
    },
    {
      icon: faComments,
      title: "Clear Communication",
      description: "Articulate your symptoms and their impact on your daily life with specific examples. Be honest and thorough, avoiding exaggeration or understatement. Practice describing your condition beforehand to ensure clarity."
    },
    {
      icon: faHouse,
      title: "Daily Life Impact",
      description: "Prepare a detailed account of how your condition affects your work, relationships, and daily activities. Include specific instances where your disability has limited your ability to perform tasks or participate in events."
    },
    {
      icon: faChartLine,
      title: "Symptom Tracking",
      description: "Keep a log of your symptoms, including frequency, duration, and severity. Note any triggers or patterns you've observed. This data can provide valuable insights during the exam."
    },
    {
      icon: faCircleQuestion,
      title: "Anticipate Questions",
      description: "Research common C&P exam questions for your specific condition. Prepare concise, honest answers that accurately represent your experience. Don't hesitate to ask for clarification if you don't understand a question."
    },
    {
      icon: faUserGroup,
      title: "Support System",
      description: "Consider bringing a family member or friend who can provide additional perspective on how your condition affects you. They may remember details you've forgotten or notice impacts you've overlooked."
    }
  ];

  const generateRTF = () => {
    const rtfHeader = "{\\rtf1\\ansi\\deff0 {\\fonttbl{\\f0 Arial;}}\n";
    const rtfTitle = "{\\f0\\fs40\\b C&P Exam Cheat Sheet\\par}\n";
    const rtfSubtitle = "{\\f0\\fs24 Follow these essential tips to ensure a comprehensive and accurate assessment during your Compensation & Pension (C&P) exam, potentially leading to a more favorable disability rating.\\par\\par}\n";
    let rtfContent = "";
    cheatSheetItems.forEach(item => {
      rtfContent += `{\\f0\\fs32\\b ${item.title}\\par}\n`;
      rtfContent += `{\\f0\\fs24 ${item.description}\\par\\par}\n`;
    });
    const rtfFooter = "}";
    return rtfHeader + rtfTitle + rtfSubtitle + rtfContent + rtfFooter;
  };

  const handleDownload = () => {
    const rtfContent = generateRTF();
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "CP_Exam_Cheat_Sheet.rtf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md" style={{pageBreakBefore: 'always'}}>
      <TypographyH2>C&P Exam Cheat Sheet</TypographyH2>
      <TypographyP className="mt-2 mb-6">
        Follow these essential tips to ensure a comprehensive and accurate assessment during your Compensation & Pension (C&P) exam, potentially leading to a more favorable disability rating.
      </TypographyP>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cheatSheetItems.map((item, index) => (
          <CheatSheetItem key={index} {...item} />
        ))}
      </div>
      <button
        onClick={handleDownload}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors print:hidden flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Cheat Sheet
      </button>
    </div>
  );
};

export default CPExamCheatSheet;
