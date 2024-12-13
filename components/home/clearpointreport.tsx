import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faInfoCircle, faSearch } from '@fortawesome/sharp-solid-svg-icons';

export const ClearpointReport = () => {
  return (
    <>
    <div className="flex flex-row justify-center p-8 gap-10 bg-gray-100">
        <div className="flex flex-col gap-5">
            <h1>Introducing</h1>
            <h1 className="text-5xl font-extrabold">Clearpoint Report</h1>
        </div>
        <div className="border-r border-black h-full mx-4"> </div>
        <div className="flex flex-col justify-items-center gap-5">
            <h2 className='align-middle text-2xl'><FontAwesomeIcon icon={faSearch} className='h-5 w-5' /> Comprehensive Research & Analysis</h2>
            <h2 className='align-middle text-2xl'><FontAwesomeIcon icon={faInfoCircle} className='h-5 w-5' /> Informed Decisions</h2>
            <h2 className='align-middle text-2xl'><FontAwesomeIcon icon={faCogs} className='h-5 w-5' /> Optimized Outcomes</h2>
        </div>
    </div>
    <section className="w-full">
        <div style={{backgroundImage: "url('/imgs/Clearpoint.png')"}} className="w-full bg-cover bg-center bg-no-repeat h-[800px]">
            
        </div>
    </section>
    </>
  );
};

