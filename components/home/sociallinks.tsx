import React from 'react';
import Image from 'next/image'; 

const SocialLinks = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 pt-6 md:pt-10">
      <a
        href="https://www.youtube.com/@vaclaimsacademy"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center text-red-600 font-bold text-center py-4 px-6 rounded-lg transition-colors"
      >
        <div className="flex items-center justify-center mb-3">
          <svg className="w-24 h-auto" viewBox="0 0 256 180" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
            <defs>
              <linearGradient x1="49.9804764%" y1="8.68053889e-07%" x2="49.9804764%" y2="100.030167%" id="linearGradient-1">
                <stop stopColor="#E52D27" offset="0%"></stop>
                <stop stopColor="#BF171D" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g>
              <g>
                <path d="M101.6,123.2 L170.8,87.4 L101.6,51.3 L101.6,123.2 L101.6,123.2 Z" fill="#FFFFFF"></path>
                <path d="M101.6,51.3 L162.3,91.8 L170.8,87.4 L101.6,51.3 L101.6,51.3 Z" opacity="0.12" fill="#420000"></path>
                <path d="M253.301054,38.8 C253.301054,38.8 250.80203,21.2 243.105037,13.4 C233.408825,3.2 222.513081,3.2 217.415072,2.6 C181.729012,0 128.04998,0 128.04998,0 L127.95002,0 C127.95002,0 74.2709879,0 38.3850059,2.6 C33.3869582,3.2 22.4912144,3.2 12.695041,13.4 C5.09800859,21.2 2.59898477,38.8 2.59898477,38.8 C2.59898477,38.8 0,59.6 0,80.3 L0,99.7 C0,120.4 2.59898477,141.1 2.59898477,141.1 C2.59898477,141.1 5.09800859,158.7 12.795002,166.5 C22.4912144,176.7 35.2862163,176.4 40.9839906,177.4 C61.4759859,179.4 127.95002,180 127.95002,180 C127.95002,180 181.729012,179.9 217.515033,177.3 C222.513081,176.7 233.408825,176.7 243.204998,166.5 C250.901991,158.7 253.401015,141.1 253.401015,141.1 C253.401015,141.1 256,120.4 256,99.7 L256,80.3 C255.900039,59.6 253.301054,38.8 253.301054,38.8 L253.301054,38.8 Z M101.560328,123.2 L101.560328,51.3 L170.733307,87.4 L101.560328,123.2 L101.560328,123.2 Z" fill="url(#linearGradient-1)"></path>
              </g>
            </g>
          </svg>
        </div>
        <h1 className="text-xl md:text-2xl lg:text-3xl tracking-wide font-bold">Subscribe on Youtube</h1>
      </a>
      <a
        href="https://www.facebook.com/VAClaimsAcademy/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center  transition-colors rounded-lg p-4"
      >
        <Image src="/imgs/like-us-on-facebook-seeklogo.png" alt="Facebook" width={200} height={60} className="w-auto h-auto" />
      </a>
    </div>
  );
};

export default SocialLinks;
