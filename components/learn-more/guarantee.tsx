import Image from 'next/image'
import Link from 'next/link'

const Guarantee = (props: { bgColor: string }) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-center ${
        props.bgColor || 'bg-white'
      }`}
    >
      <Image
        src="/imgs/ironclad_guarantee.png"
        alt="Guarantee"
        width={350}
        height={350}
        className={`w-[350px] h-[350px] ${
          props.bgColor === 'bg-oxfordBlue' ? 'invert' : ''
        }`}
      />
      <div className="flex flex-col justify-center gap-5 basis-5/12 items-center ">
        <h2
          className={`text-4xl ${
            props.bgColor === 'bg-oxfordBlue' ? 'text-white' : ' text-crimson'
          } font-5xl uppercase text-center font-oswald`}
        >
          Our Ironclad Risk-Free Guarantee
        </h2>
        <p
          className={`text-xl ${
            props.bgColor === 'bg-oxfordBlue' ? 'text-white' : ' text-black'
          } p-4 text-center`}
        >
          We stand behind our offer with a bold, 100% money-back satisfaction
          guarantee. It's simple—if you aren't completely satisfied, you don't
          pay.
        </p>
      </div>
    </div>
  )
}

export default Guarantee
