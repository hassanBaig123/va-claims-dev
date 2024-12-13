import React from 'react'
import AngleElement from '@/components/angledesign'

const OthersCharge: React.FC = () => {
	return (
		<section className="w-full bg-white pb-20 relative">
			<div
				id="otherscharge"
				className="py-4 px-6 w-full mx-auto sm:py-20 font-light"
			>
				<div className="container relative z-10 max-w-3xl mx-auto text-center">
					<p className="font-bold mb-5 text-2xl sm:text-3xl text-platinum_950">
						Real Estate Experts Invest <span className='text-crimson'>$500,000</span> to get $4,000/ Month in Rent
					</p>
					<p className="mb-14 mx-5 text-xl sm:text-2xl text-platinum_950">
						This includes risking bad tenants, paying for repairs, property
						management, etc.
					</p>

					<p className="font-bold mb-5 text-2xl sm:text-3xl text-platinum_950">
						A College Degree Costs Upwards of <span className='text-crimson'>$100,000</span>.
					</p>
					<p className="mb-14 text-lg sm:text-2xl text-platinum_950">
						This can still be a good value for many people, and for no chance at
						a tax-free passive pension.
					</p>
					<p className="font-black text-3xl sm:text-4xl text-platinum_950 tracking-wide">
						<span className='text-crimson'>Veterans</span>, if your rating isn't right, you are leaving <span className='text-crimson'>money</span> on the
						table <span className='text-crimson'>every month</span>.
					</p>
				</div>        
			</div>
			<AngleElement angleType="bottom-light-simple" fillColor="#F3F4F6" />
		</section>
	)
}

export default OthersCharge

