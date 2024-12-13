import React from 'react';
import { TypographyP } from '@/components/report/p';
import { Separator } from '@/components/ui/separator';

interface PersonalStatementLetterProps {
  title: string;
  content: string | string[];
}

const PersonalStatementLetter: React.FC<PersonalStatementLetterProps> = ({ title, content }) => {
  const contentArray = Array.isArray(content) ? content : [content];

  const generateRTF = (title: string, content: string | string[]) => {
    const rtfHeader = "{\\rtf1\\ansi\\deff0 {\\fonttbl{\\f0 Times New Roman;}{\\f1 Arial;}}\n";
    const rtfTitle = `{\\f1\\fs40\\b ${title}\\par}\n`;
    const rtfContent = Array.isArray(content)
      ? content.map(paragraph => 
          `{\\f0\\fs28\\par\\pard\\fi720\\sl480\\slmult1 ${paragraph}\\par\\par}`
        ).join('\n')
      : `{\\f0\\fs28\\par\\pard\\fi720\\sl480\\slmult1 ${content}\\par}`;
    const rtfFooter = "}";
    return rtfHeader + rtfTitle + rtfContent + rtfFooter;
  };

  const handleDownload = () => {
    const rtfContent = generateRTF(title, content);
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Personal_Statement_${title.replace(/\s+/g, '_')}.rtf`;
    link.click();
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold my-4">{title}</h3>
      {contentArray.map((paragraph, index) => (
        <div key={index} className="mb-4">
          <TypographyP>{paragraph}</TypographyP>
        </div>
      ))}
      <button
        onClick={handleDownload}
        className="mt-6 px-4 py-2 mb-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors print:hidden"
      >
        Download Personal Statement
      </button>
      <Separator />
    </div>
  );
};

export default PersonalStatementLetter;