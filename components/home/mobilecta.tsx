import { Button } from "../ui/button";
//Need a sticky CTA for mobile

export const MobileCTA = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-96 bg-card">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text">
        Get started today
      </h1>
      <p className="mt-4 text-lg font-medium text-center">
        Sign up for a free account and start preparing yourself for success.
      </p>
      <Button className="mt-8">Get started</Button>
    </div>
  );
};

