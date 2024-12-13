import './style.css'
const TimelineItem = ({ data }: any) => (
    <div className="timeline-item">
        <div className="timeline-item-content">
            <p className='text-2xl text-crimson font-sans font-bold leading-[24px]'>{data.title}</p>
            <p className='text-platinum_950 text-base font-normal font-sans mt-[20px] '>{data.text}</p>
            <div className="p-[5px] circle relative flex items-center justify-center border-2 border-crimson rounded-full bg-white">
                <div className="h-full w-full bg-crimson rounded-full"></div>
            </div>
        </div>
    </div>
);
export default TimelineItem