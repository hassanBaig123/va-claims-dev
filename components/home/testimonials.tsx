'use client'

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const IMAGES_PER_LOAD = 15;

const testimonialImages = [
    'Facebook USE FIRST.png',
    'Facebook.png',
    'Facebook1.png',
    'facebook11.png',
    'Facebook2.png',
    'facebook23.png',
    'facebook234.png',
    'facebook2345.png',
    'Facebook2437.png',
    'Facebook3.png',
    'facebook324.png',
    'Facebook324234.png',
    'facebook324341.png',
    'Facebook345.png',
    'Facebook4.png',
    'Facebook435.png',
    'Facebook456987.png',
    'facebook5.png',
    'Facebook567456.png',
    'facebook6.png',
    'Facebook656354.png',
    'Facebook657.png',
    'Facebook765463.png',
    'Facebook79865.png',
    'facebook87453.png',
    'Facebook987654.png',
    'Screenshot 2024-09-26 125606.png',
    'Screenshot 2024-09-27 190507.png',
    'Screenshot 2024-09-27 190630.png',
    'Screenshot 2024-09-27 190640.png',
    'Screenshot 2024-09-27 190652.png',
    'Screenshot 2024-09-27 190700.png',
    'Screenshot 2024-09-27 190710.png',
    'Screenshot 2024-09-27 190721.png',
    'Screenshot 2024-09-27 190729.png',
    'Screenshot 2024-09-27 190737.png',
    'Screenshot 2024-09-27 190745.png',
    'Screenshot 2024-09-27 190753.png',
    'Screenshot 2024-09-27 190800.png',
    'Screenshot 2024-09-27 190810.png',
    'Screenshot 2024-09-27 190817.png',
    'Screenshot 2024-09-27 190825.png',
    'Screenshot 2024-09-27 190832.png',
    'Screenshot 2024-09-27 190840.png',
    'Screenshot 2024-09-27 190848.png',
    'Screenshot 2024-09-27 190856.png',
    'Screenshot 2024-09-27 190904.png',
    'Screenshot 2024-09-27 190919.png',
    'Screenshot 2024-09-27 190929.png',
    'Screenshot 2024-09-27 191020.png',
    'Screenshot 2024-09-27 191028.png',
    'Screenshot 2024-09-27 191036.png',
    'Screenshot 2024-09-27 191044.png',
    'Screenshot 2024-09-27 191054.png',
    'Screenshot 2024-09-27 191102.png',
    'Screenshot 2024-09-27 191110.png',
    'Screenshot 2024-09-27 191117.png',
    'Screenshot 2024-09-27 191125.png',
    'Screenshot 2024-09-27 191132.png',
    'Screenshot 2024-09-27 191140.png',
    'Screenshot 2024-09-27 191147.png',
    'Screenshot 2024-09-27 191154.png',
    'Screenshot 2024-09-27 191203.png',
    'Screenshot 2024-09-27 191210.png',
    'Screenshot 2024-09-27 191217.png',
    'Screenshot 2024-09-27 191225.png',
    'Screenshot 2024-09-27 191233.png',
    'Screenshot 2024-09-27 191243.png',
    'Screenshot 2024-09-27 191251.png',
    'Screenshot 2024-09-27 191258.png',
    'Screenshot 2024-09-27 191308.png',
    'Screenshot 2024-09-27 191315.png',
    'Screenshot 2024-09-27 191322.png',
    'Screenshot 2024-09-27 191330.png',
    'Screenshot 2024-09-27 191336.png',
    'Screenshot 2024-09-27 191344.png',
    'Screenshot 2024-09-27 191351.png',
    'Screenshot 2024-09-27 191359.png',
    'Screenshot 2024-09-27 191407.png',
    'Screenshot 2024-09-27 191414.png',
    'Screenshot 2024-09-27 191422.png',
    'Screenshot 2024-09-27 191429.png',
    'Screenshot 2024-09-27 191437.png',
    'Screenshot 2024-09-27 191446.png',
    'Screenshot 2024-09-27 191454.png',
    'Screenshot 2024-09-27 191502.png',
    'Screenshot 2024-09-27 191510.png',
    'Screenshot 2024-09-27 191519.png',
    'Screenshot 2024-09-27 191526.png',
    'Screenshot 2024-09-27 191532.png',
    'Screenshot 2024-09-27 191539.png',
    'Screenshot 2024-09-27 191547.png',
    'Screenshot 2024-09-27 191554.png',
    'Screenshot 2024-09-27 191601.png',
    'Screenshot 2024-09-27 191609.png',
    'Screenshot 2024-09-27 191616.png',
    'Screenshot 2024-09-27 191624.png',
    'Screenshot 2024-09-27 191631.png',
    'Screenshot 2024-09-27 191638.png',
    'Screenshot 2024-09-27 191645.png',
    'Screenshot 2024-09-27 191652.png',
    'Screenshot 2024-09-27 191700.png',
    'Screenshot 2024-09-27 191708.png',
    'Screenshot 2024-09-27 191715.png',
    'Screenshot 2024-09-27 191724.png',
    'Screenshot 2024-09-27 191731.png',
    'Screenshot 2024-09-27 191737.png',
    'Screenshot 2024-09-27 191747.png',
    'Screenshot 2024-09-27 191755.png',
    'Screenshot 2024-09-27 191802.png',
    'Screenshot 2024-09-27 191809.png',
    'Screenshot 2024-09-27 191817.png',
    'Screenshot 2024-09-27 191825.png',
    'Screenshot 2024-09-27 191833.png',
    'Screenshot 2024-09-27 191840.png',
    'Screenshot 2024-09-27 191848.png',
    'Screenshot 2024-09-27 191858.png',
    'Screenshot 2024-09-27 191905.png',
    'Screenshot 2024-09-27 191912.png',
    'Screenshot 2024-09-27 191920.png',
    'Screenshot 2024-09-27 191927.png',
    'Screenshot 2024-09-27 191935.png',
    'Screenshot 2024-09-27 191949.png',
    'Screenshot 2024-09-27 192000.png',
    'Screenshot 2024-09-27 192008.png',
    'Screenshot 2024-09-27 192018.png',
    'Screenshot 2024-09-27 192025.png',
    'Screenshot 2024-09-27 192033.png',
    'Screenshot 2024-09-27 192041.png',
    'Screenshot 2024-09-27 192052.png',
    'Screenshot 2024-09-27 192059.png',
    'Screenshot 2024-09-27 192106.png',
    'Screenshot 2024-09-27 192112.png',
    'Screenshot 2024-09-27 192119.png',
    'Screenshot 2024-09-27 192126.png',
    'Screenshot 2024-09-27 192133.png',
    'Screenshot 2024-09-27 192139.png',
    'Screenshot 2024-09-27 192145.png',
    'Screenshot 2024-09-27 192152.png',
    'Screenshot 2024-09-27 192159.png',
    'Screenshot 2024-09-27 192205.png',
    'Screenshot 2024-09-27 192213.png',
    'Screenshot 2024-09-27 192220.png',
    'Screenshot 2024-09-27 192228.png',
    'Screenshot 2024-09-27 192235.png',
    'Screenshot 2024-09-27 192242.png',
    'Screenshot 2024-09-27 192249.png',
    'Screenshot 2024-09-27 192256.png',
    'Screenshot 2024-09-27 192321.png',
    'Screenshot 2024-09-27 192328.png',
    'Screenshot 2024-09-27 192336.png',
    'Screenshot 2024-09-27 192343.png',
    'Screenshot 2024-09-27 192350.png',
    'Screenshot 2024-09-27 192358.png',
    'Screenshot 2024-09-27 192405.png',
    'Screenshot 2024-09-27 192412.png',
    'Screenshot 2024-09-27 192418.png',
    'Screenshot 2024-09-27 192426.png',
    'Screenshot 2024-09-27 192432.png',
    'Screenshot 2024-09-27 192439.png',
    'Screenshot 2024-09-27 192446.png',
    'Screenshot 2024-09-27 192453.png',
    'Screenshot 2024-09-27 192507.png',
    'Screenshot 2024-09-27 192513.png',
    'Screenshot 2024-09-27 192523.png',
    'Screenshot 2024-09-27 192534.png',
    'Screenshot 2024-09-27 192542.png',
    'Screenshot 2024-09-27 192550.png',
    'Screenshot 2024-09-27 192557.png',
    'Screenshot 2024-09-27 192604.png',
    'Screenshot 2024-09-27 192611.png',
    'Screenshot 2024-09-27 192618.png',
    'Screenshot 2024-09-27 192626.png',
    'Screenshot 2024-09-27 192634.png',
    'Screenshot 2024-09-27 192642.png',
    'Screenshot 2024-09-27 192651.png',
    'Screenshot 2024-09-27 192715.png',
    'Screenshot 2024-09-27 192725.png',
    'Screenshot 2024-09-27 192732.png',
    'Screenshot 2024-09-27 192739.png',
    'Screenshot 2024-09-27 192752.png',
    'Screenshot 2024-09-27 192800.png',
    'Screenshot 2024-09-27 192808.png',
    'Screenshot 2024-09-27 192815.png',
    'Screenshot 2024-09-27 192822.png',
    'Screenshot 2024-09-27 192830.png',
    'Screenshot 2024-09-27 192837.png',
    'Screenshot 2024-09-27 192844.png',
    'Screenshot 2024-09-27 192851.png',
    'Screenshot 2024-09-27 192858.png',
    'Screenshot 2024-09-27 192904.png',
    'Screenshot 2024-09-27 192910.png',
    'Screenshot 2024-09-27 192919.png',
    'Screenshot 2024-09-27 192926.png',
    'Screenshot 2024-09-27 192932.png',
    'Screenshot 2024-09-27 192938.png',
    'Screenshot 2024-09-27 192947.png',
    'Screenshot 2024-09-27 192954.png',
    'Screenshot 2024-09-27 193003.png',
    'Screenshot 2024-09-29 090343.png',
    'Screenshot 2024-09-29 090430.png',
    'Screenshot 2024-09-29 090438.png',
    'Screenshot 2024-09-29 090448.png',
    'Screenshot 2024-09-29 090456.png',
    'Screenshot 2024-09-29 090504.png',
    'Screenshot 2024-09-29 090513.png',
    'Screenshot 2024-09-29 090521.png',
    'Screenshot 2024-09-29 090601.png',
    'Screenshot 2024-09-29 090619.png',
    'Screenshot 2024-09-29 090629.png',
    'Screenshot 2024-09-29 090751.png',
    'Screenshot 2024-09-29 090801.png',
    'Screenshot 2024-09-29 090808.png',
    'Screenshot 2024-09-29 090843.png',
    'Screenshot 2024-09-29 090851.png',
    'Screenshot 2024-09-29 090906.png',
    'Screenshot 2024-09-29 090917.png',
    'Screenshot 2024-09-29 090925.png',
    'Screenshot 2024-09-29 090932.png',
    'Screenshot 2024-09-29 090941.png',
    'Screenshot 2024-09-29 090947.png',
    'Screenshot 2024-09-29 090955.png',
    'Screenshot 2024-09-29 091003.png',
    'Screenshot 2024-09-29 091009.png',
    'Screenshot 2024-09-29 091018.png',
    'Screenshot 2024-09-29 091024.png',
    'Screenshot 2024-09-29 091031.png',
    'Screenshot 2024-09-29 091037.png',
    'Screenshot 2024-09-29 091053.png',
    'Screenshot 2024-09-29 091059.png',
    'Screenshot 2024-09-29 091106.png',
    'Screenshot 2024-09-29 091113.png',
    'Screenshot 2024-09-29 091119.png',
    'Screenshot 2024-09-29 091126.png',
    'Screenshot 2024-09-29 091134.png',
    'Screenshot 2024-09-29 091140.png',
    'VACA Saved My Life.png',
  ]

export default function Testimonials() {
	const [visibleImages, setVisibleImages] = useState(IMAGES_PER_LOAD);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

	const loadMoreImages = () => {
		setVisibleImages((prev) => Math.min(prev + IMAGES_PER_LOAD, testimonialImages.length));
	};

	const handleImageLoad = (image: string) => {
		setLoadedImages(prev => new Set(prev).add(image));
	};

	return (
		<section className="w-full">
			<div className="w-full bg-platinum py-16 md:pb-32 md:pt-48">
				<div className="container mx-auto px-4">
					<h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-crimson">See What Veterans Like You Are Saying</h2>
				</div>
			</div>
			
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-5xl mx-auto">
					<div className="columns-2 md:columns-3 gap-4 md:gap-8">
						{testimonialImages.slice(0, visibleImages).map((image, index) => (
							<Dialog key={index}>
								<DialogTrigger asChild>
									<div 
										className={`break-inside-avoid mb-4 md:mb-8 cursor-pointer transition-all duration-500 ease-out ${
											loadedImages.has(image) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
										}`}
									>
										<Image
											src={`/imgs/testimonials/${image}`}
											alt={`Testimonial ${index + 1}`}
											width={400}
											height={400}
											className="w-full h-auto object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-2 border-gray-300"
											onClick={() => setSelectedImage(image)}
											onLoad={() => handleImageLoad(image)}
										/>
									</div>
								</DialogTrigger>
								<DialogContent className="max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] 2xl:max-w-[50vw] max-h-[90vh] overflow-y-auto p-0">
									<div className="relative w-full h-full flex items-center justify-center">
										<Image
											src={`/imgs/testimonials/${selectedImage}`}
											alt="Enlarged testimonial"
											width={1200}
											height={1200}
											className="object-contain max-h-[88vh]"
										/>
									</div>
								</DialogContent>
							</Dialog>
						))}
					</div>
					
					{visibleImages < testimonialImages.length && (
						<div className="text-center mt-8">
							<Button 
								onClick={loadMoreImages} 
								className="px-8 py-4 text-lg font-semibold bg-crimson text-white rounded-full hover:bg-red-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
							>
								Show More
							</Button>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}