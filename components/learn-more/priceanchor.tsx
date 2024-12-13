import AngleElement from "@/components/angledesign";
import Image from "next/image";

const PriceAnchor = () => {
  return (
    <section
      className="flex flex-row justify-center mt-44 medium-white-after relative z-20 pb-44 w-full mb-32"
      style={{
        backgroundImage:
          "url('imgs/brand_patterns/VA_Claims_Stripes_Screen_Size_Portrait_Transparent_Pattern_repeatable.png')",
      }}
    >
      <div className="relative z-20">
        <div className="flex flex-row justify-center w-full">
          <div className="flex flex-col gap-5 items-center justify-center py-6 md:w-3/12 min-w-[414px] text-white bg-oxfordBlue card-shadow relative -top-16">
            <div className="w-[15px] h-[70px] bg-crimson absolute -right-[5px] -top-[10px]"></div>
            <h1 className="text-4xl">Transparent Pricing.</h1>
            <h1 className="text-4xl">No Hidden Fees.</h1>
            <h1 className="text-4xl">No Long-Term Contracts.</h1>
            <div className="w-[15px] h-[70px] bg-crimson absolute -left-[5px] -bottom-[10px]"></div>
          </div>
        </div>
        <div className="xl:max-w-[1400px] flex flex-col lg:flex-row justify-center items-center gap-10 px-10 mt-20">
          <div className="flex flex-col items-center relative basis-4/12 min-h-[380px] bg-white shadow-lg border-1 border-oxfordBlue">
            <div className="relative card-shadow w-[80%] -top-6">
              {/* <div className="w-[35%] h-[15px] bg-oxfordBlue absolute -right-[5%] -top-[10px]"></div> */}
              <div className="bg-crimson flex justify-center items-center">
                <h2 className="text-2xl inline-block text-white text-center py-3">
                  Fair Cost Commitment
                </h2>
              </div>
              <div className="w-[90%] h-[6px] bg-oxfordBlue absolute left-[5%] -bottom-[2px]"></div>
            </div>
            <p className="text-black text-lg p-10">
              While other premium claim companies charge up to $15,000 or take a
              significant portion of your hard-earned benefits, VA Claims
              Academy believes in a straightforward, transparent approach to
              pricing.
            </p>
          </div>
          <div className="flex flex-col items-center relative basis-4/12 min-h-[380px] bg-white shadow-lg border-1 border-oxfordBlue">
            <div className="relative card-shadow w-[80%] -top-6">
              {/* <div className="w-[35%] h-[15px] bg-oxfordBlue absolute -right-[5%] -top-[10px]"></div> */}
              <div className="bg-crimson flex justify-center items-center">
                <h2 className="text-2xl inline-block text-white text-center py-3">
                  Upfront Payment Clarity
                </h2>
              </div>
              <div className="w-[90%] h-[6px] bg-oxfordBlue absolute left-[5%] -bottom-[2px]"></div>
            </div>
            <p className="text-black text-lg  p-10">
              With our one-time payment model, you'll know exactly what you're
              paying for upfront – no surprises, no hidden fees, and no
              long-term contracts. We believe in earning your trust through
              clear, honest pricing and delivering unmatched value for your
              money.
            </p>
          </div>
          <div className="flex flex-col items-center relative basis-4/12 min-h-[380px] bg-white shadow-lg border-1 border-oxfordBlue">
            <div className="relative card-shadow w-[80%] -top-6">
              {/* <div className="w-[35%] h-[15px] bg-oxfordBlue absolute -right-[5%] -top-[10px]"></div> */}
              <div className="bg-crimson flex justify-center items-center">
                <h2 className="text-2xl inline-block text-white text-center py-3">
                  Flexible Plans, No Surprises
                </h2>
              </div>
              <div className="w-[90%] h-[6px] bg-oxfordBlue absolute left-[5%] -bottom-[2px]"></div>
            </div>
            <p className="text-black text-lg p-10">
              Choose the plan that best fits your needs and budget, and rest
              assured that you won't be locked into any complicated contracts or
              face unexpected costs down the road. At VA Claims Academy, we're
              committed to providing you with the highest quality service and
              support, without the stress of financial uncertainty.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceAnchor;
