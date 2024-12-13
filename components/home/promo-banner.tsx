interface PromoBannerProps {
    message: string;
    className?: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ 
    message,
    className = ''
}) => {
    return (
        <div className={`w-full relative ${className} mt-24 md:mt-32`}>
            {/* Red angle overlay with opposite slope */}
            {/* <div className="absolute w-full h-12 bg-crimsonNew transform skew-y-1 -top-1 shadow-lg" />
            <div className="absolute w-full h-12 bg-crimsonNew transform -skew-y-1 -top-1 shadow-lg" /> */}
            {/* Main banner */}
            <div className="w-full bg-crimsonNew overflow-hidden relative">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute transform -rotate-45 bg-white/30 w-32 md:w-56 h-24 md:h-56 -left-32 -top-[5.3rem]" />
                    <div className="absolute transform rotate-45 bg-white/30 w-32 md:w-56 h-24 md:h-56 -right-32 -bottom-[5.2rem]" />
                </div>
                
                {/* Main content */}
                <div className="container mx-auto px-4 py-3 relative">
                    <div className="flex items-center justify-center">
                        {/* Stars */}
                        <span className="hidden sm:block text-white/90 text-2xl mr-3">★</span>
                        
                        {/* Message */}
                        <p className="text-center text-white font-bold text-md sm:text-base md:text-xl 
                            tracking-wide px-2 sm:px-4">
                            {message}
                        </p>
                        
                        {/* Stars */}
                        <span className="hidden sm:block text-white/90 text-2xl ml-3">★</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoBanner;
