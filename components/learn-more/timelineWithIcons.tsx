import '@/components/learn-more/style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TimelineWithIcons = ({ data }: any) => (
  <div className="timeline-item">
    <div className="timeline-item-content">
      <p className="text-2xl text-crimson font-sans font-bold leading-[24px]">
        {data.title}
      </p>
      <p className="text-platinum_950 text-lg font-normal font-sans mt-[20px] ">
        {data.text}
      </p>

      {data.iconName ? (
        <div className="p-[5px] circle relative flex items-center justify-center bg-[#fbfafa]">
          <FontAwesomeIcon
            icon={data.iconName}
            className="w-12 h-12 p-3 m-8 text-crimson"
          />
        </div>
      ) : (
        <div className="p-[5px] circle relative flex items-center justify-center border-2 border-crimson rounded-full bg-white">
          <div className="h-full w-full bg-crimson rounded-full"></div>
        </div>
      )}
    </div>
  </div>
)
export default TimelineWithIcons
