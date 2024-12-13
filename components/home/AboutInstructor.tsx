// app/instructor/page.tsx
"use client";

export default function InstructorSection() {
  return (
    <div className=" bg-white px-12 py-12">
      <div className="container max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="max-w-xl">
        {/* Column for Image and Quote */}
        <div className="md:flex md:flex-col md:flex-shrink-0">
          <div className="h-96 w-96 rounded-full overflow-hidden mb-4">
            {/* Placeholder for the image */}
            <img
              src="https://via.placeholder.com/300"
              alt="Jordan Anderson"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Quote */}
          <blockquote className="italic border-l-4 bg-gray-50 text-gray-600 border-gray-200 quote px-4 py-3">
            {"\"You are not alone. Countless veterans are bullied by the VA into lower compensation and less benefits than they deserve. The battle against the VA is a fight the service didn’t train us for.\""}
            <footer className="mt-1 text-base text-right text-gray-500">- Jordan Anderson</footer>
          </blockquote>
        </div>
        </div>
        
        {/* Column for About the Instructor Text */}
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ABOUT THE INSTRUCTOR
          </h1>
          <h2 className="text-2xl text-red-600 mb-2">
            Jordan Anderson
          </h2>
          <p className="text-gray-600">
            Jordan is an Air Force veteran who has been successfully coaching individuals & accredited VSO’s on the VA claims process for more than half a decade. For years he struggled to navigate the VA’s bureaucratic nonsense. This grueling period of research, trial, error and refinement allowed him to build a proven system that yielded him the coveted 100% Permanent & Total rating. Seeing fellow vets get bullied by the system is what motivated him to build VA Claims Academy where veterans get the information the VA doesn’t want them to know. He gets a kick out of it.
          </p>
        </div>
      </div>
    </div>
  );
}
