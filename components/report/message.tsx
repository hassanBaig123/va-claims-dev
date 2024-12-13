import React from 'react';
import { TypographyP } from '@/components/report/p';
import { Separator } from '@/components/report/separator';
import Image from 'next/image';

interface LetterProps {
  letter: {
    salutation?: string;
    paragraphs?: string[];
    closing?: {
      message?: string;
      signature?: string;
      title?: string;
    };
  };
}

const Message: React.FC<LetterProps> = ({ letter }) => {
  return (
    <div className="bg-cream bg-opacity-50 p-8 rounded-lg shadow-md max-w-3xl mx-auto my-8 font-serif relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-700"></div>
      <div className="mb-8">
        <Image src="/imgs/Logo/VA_Claims_Main_Logo_Multicolor_Transparent_960px.png" alt="VA Claims Academy Logo" width={150} height={50} />
      </div>
      {letter.salutation && (
        <TypographyP className="mb-6 text-xl font-semibold text-gray-800">{letter.salutation}</TypographyP>
      )}
      
      {letter.paragraphs && letter.paragraphs.map((paragraph, index) => (
        <TypographyP key={index} className="mb-4 text-justify leading-relaxed text-gray-700">
          {paragraph}
        </TypographyP>
      ))}
      
      {letter.closing && (
        <>
          <Separator className="my-6 border-gray-300" />
          {letter.closing.message && (
            <TypographyP className="mb-4 italic text-gray-600">{letter.closing.message}</TypographyP>
          )}
          <div className="mt-8 flex flex-col items-center justify-center">
            <Image src="/imgs/jordan-signature.png" alt="Jordan Anderson Signature" width={200} height={100} />
            {letter.closing.signature && (
              <TypographyP className="font-bold text-lg text-gray-800">{letter.closing.signature}</TypographyP>
            )}
            {letter.closing.title && (
              <TypographyP className="text-sm text-gray-600">{letter.closing.title}</TypographyP>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Message;
