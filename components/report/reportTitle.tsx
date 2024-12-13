import React from 'react';
import Image from 'next/image';

interface ReportTitleProps {
    title: string;
}

const ReportTitle: React.FC<ReportTitleProps> = ({ title }) => {
    return (
        <div className="relative w-full bg-oxfordBlueNew overflow-hidden print:mt-10" style={{pageBreakBefore: 'always'}}>
            
            <div className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-lexendDeca font-bold text-white">
                    {title}
                </h1>
                <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                    
                    <Image
                        src="/imgs/Logo/VA_Claims_Round_Logo_Transparent_2_960px.png"
                        alt="VA Claims Logo"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default ReportTitle;