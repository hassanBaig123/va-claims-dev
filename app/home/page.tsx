// app/welcome/page.tsx
"use client";

import { Button } from '@/components/ui/button';

export default function WelcomeSection() {
  
  return (
    
    <div className="absolute inset-0 bg-opacity-50 z-0" aria-hidden="true" >
        <svg className="absolute inset-0 w-full h-full" fill="currentColor" preserveAspectRatio="none" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg" />
        <div className="relative bg-white text-center py-16 lg:py-24">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        </h2>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Time To Work Smart, Not Hard
        </p>
        <div className="mt-10 flex justify-center">
            <Button variant="outline">Learn More</Button>
        </div>
    </div>
    </div>
  );
}
