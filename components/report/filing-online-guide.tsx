import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TypographyH2 } from '@/components/report/h2';
import { TypographyH3 } from '@/components/report/h3';
import { TypographyP } from '@/components/report/p';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faGlobe, faUserPlus, faEdit, faUpload, faCheckSquare, faBinoculars, faBookOpen, faDownload } from '@fortawesome/pro-solid-svg-icons';

interface Resource {
  name: string;
  url: string;
}

interface Step {
  title: string;
  description: string;
  resources: Resource[];
}

interface OnlineFilingGuide {
  title: string;
  introduction?: string;
  steps: Step[];
  additionalResources?: Resource[];
}

interface FilingOnlineGuideProps {
  guide: OnlineFilingGuide;
  isPrintVersion?: boolean;
}

const stepIcons = [faFileAlt, faGlobe, faUserPlus, faEdit, faUpload, faCheckSquare, faBinoculars, faBookOpen];

const FilingOnlineGuide: React.FC<FilingOnlineGuideProps> = ({ guide, isPrintVersion = false }) => {
  const generateRTFContent = () => {
    let content = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}
{\\colortbl ;\\red0\\green0\\blue0;}
\\viewkind4\\uc1\\pard\\cf1\\f0\\fs28\\b ${guide.title}\\par
\\b0\\fs24 ${guide.introduction}\\par
\\par
`;

    guide.steps.forEach((step, index) => {
      content += `\\b\\fs26 ${step.title}\\b0\\fs24\\par
${step.description}\\par
`;
      if (step.resources.length > 0) {
        content += `Resources:\\par
`;
        step.resources.forEach(resource => {
          content += `\\bullet ${resource.name}: ${resource.url}\\par
`;
        });
      }
      content += `\\par
`;
    });

    if (guide.additionalResources && guide.additionalResources.length > 0) {
      content += `\\b\\fs26 Additional Resources:\\b0\\fs24\\par
`;
      guide.additionalResources.forEach(resource => {
        content += `\\bullet ${resource.name}: ${resource.url}\\par
`;
      });
    }

    content += '}';
    return content;
  };

  const handleDownload = () => {
    const rtfContent = generateRTFContent();
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `VA_Disability_Claim_Filing_Guide.rtf`;
    link.click();
  };

  return (
    <div className={isPrintVersion
      ? "filing-online-guide p-0"
      : "filing-online-guide bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-lg"
    }>
      <TypographyH2 className="text-3xl font-bold mb-6 text-oxfordBlue border-b-2 border-oxfordBlue pb-2">{guide.title}</TypographyH2>
      
      {guide.introduction && (
        <TypographyP className="mb-8 text-gray-700 text-lg leading-relaxed">{guide.introduction}</TypographyP>
      )}
      
      {isPrintVersion ? (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Step</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Resources</th>
              <th className="border p-2 text-left">QR Code</th>
            </tr>
          </thead>
          <tbody>
            {guide.steps.map((step, index) => (
              <tr key={index}>
                <td className="border p-2 align-top">
                  <strong>{step.title}</strong>
                </td>
                <td className="border p-2 align-top">{step.description}</td>
                <td className="border p-2 align-top">
                  {step.resources.map((resource, resIndex) => (
                    <div key={resIndex} className="mb-2">
                      {resource.name}
                    </div>
                  ))}
                </td>
                <td className="border p-2 align-top">
                  {step.resources.map((resource, resIndex) => (
                    <div key={resIndex} className="mb-2">
                      <QRCodeSVG value={resource.url} size={64} />
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="space-y-8">
          {guide.steps.map((step, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-xl">
              <CardHeader className="bg-gradient-to-r from-platinum to-gray-200 flex flex-row justify-start p-4">
                <div className="bg-oxfordBlue text-white rounded-full p-2 mr-3 w-10 h-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={stepIcons[index % stepIcons.length]} className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-semibold text-oxfordBlue">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <TypographyP className="text-gray-600 mb-4">{step.description}</TypographyP>
                {step.resources.length > 0 && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    <strong className="text-blue-800 block mb-2">Resources:</strong>
                    <ul className="space-y-2">
                      {step.resources.map((resource, resIndex) => (
                        <li key={resIndex} className="flex items-center">
                          <FontAwesomeIcon icon={faBookOpen} className="w-4 h-4 mr-2 text-blue-600" />
                          <a href={resource.url} className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                            {resource.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {guide.additionalResources && guide.additionalResources.length > 0 && (
        <div className={isPrintVersion ? "mt-8" : "mt-12"}>
          <TypographyH3 className="text-2xl font-semibold text-oxfordBlue mb-6 border-b-2 border-oxfordBlue pb-2">Additional Resources</TypographyH3>
          {isPrintVersion ? (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Resource</th>
                  <th className="border p-2 text-left">QR Code</th>
                </tr>
              </thead>
              <tbody>
                {guide.additionalResources.map((resource, index) => (
                  <tr key={index}>
                    <td className="border p-2">{resource.name}</td>
                    <td className="border p-2">
                      <QRCodeSVG value={resource.url} size={64} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="pt-6">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guide.additionalResources.map((resource, index) => (
                    <li key={index} className="flex items-center bg-white p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md">
                      <FontAwesomeIcon icon={faBookOpen} className="w-5 h-5 mr-3 text-blue-600" />
                      <a href={resource.url} className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200 font-medium" target="_blank" rel="noopener noreferrer">
                        {resource.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!isPrintVersion && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-lg font-semibold"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Download Guide
          </button>
        </div>
      )}
    </div>
  );
};

export default FilingOnlineGuide;
