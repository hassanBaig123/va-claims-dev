import Image from "next/image";

const Guarantee = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center">
      <Image
        src="/imgs/ironclad_guarantee.png"
        alt="Guarantee"
        width={350}
        height={350}
        className="w-[350px] h-[350px]"
      />
      <div className="flex flex-col justify-center gap-5 basis-5/12 items-center ">
        <h2 className="text-4xl text-crimson font-5xl uppercase font-oswald">
          Ironclad Guarantee
        </h2>
        <p className="text-xl text-black p-4">
        Here at VA Claims Academy, we are so confident that you will get more value out of this course than what you put in, that we offer a bold 100% risk-free money-back guarantee.
        </p>
        <p className="text-xl text-black p-4">
        If you find that none of these insights are applicable to you or you simply are not completely satisfied with the course, simply email our support team for a full hassle-free refund.
        </p>
      </div>
    </div>
  )
}

export default Guarantee

