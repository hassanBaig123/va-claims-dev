interface AngleDesignProps {
  angleType:
    | "top-light-simple"
    | "top-light-small"
    | "top-light-large"
    | "top-dark-small"
    | "top-dark-large"
    | "bottom-light-simple"
    | "bottom-light-small"
    | "bottom-light-large"
    | "bottom-dark-small"
    | "bottom-dark-large";
  reverse?: boolean;
  upsideDown?: boolean;
  fillColor?: string;
}

const AngleElement: React.FC<AngleDesignProps> = ({
  angleType,
  reverse = false,
  upsideDown = false,
  fillColor = "#fff",
}) => {
  const flipClass = reverse ? "scale-x-[-1]" : "";
  const verticalFlipClass = upsideDown ? "scale-y-[-1]" : "";
  return (
    <>
      {angleType === "top-light-simple" && (
        <>
          <div className={`absolute -top-1 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80">
              <path
                fill={`${fillColor}`}
                d="M0,0L1440,0L0,80L00,80Z"
              ></path>
            </svg>
          </div>
        </>
      )}
      {angleType === "bottom-light-simple" && (
        <>
          <div className={`absolute -bottom-1 w-screen overflow-hidden ${flipClass} ${verticalFlipClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80">
            <defs>
    {/* <linearGradient id="gradient">
      <stop offset="5%" stop-color="#FFC338" />
      <stop offset="95%" stop-color="#FFEA68" />
    </linearGradient> */}
  </defs>
              <path
                 fill={`${fillColor}`}
                d="M0,0L1500,80L1440,80L00,80Z"
              ></path>
            </svg>
          </div>
        </>
      )}
      {angleType === "top-light-small" && (
        <>
          <div
            className={`absolute top-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill={`${fillColor}`}
                fillOpacity="0.2"
                d="M0,10L1440,50L1440,0L0,0Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute top-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill={`${fillColor}`}
                fillOpacity="0.2"
                d="M0,30L1440,60L1440,0L0,0Z"
              ></path>
            </svg>
          </div>
        </>
      )}
      {angleType === "top-light-large" && (
        <>
          <div
            className={`absolute -top-1 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill={`${fillColor}`}
                fillOpacity="0.3"
                d="M0,40L1440,96L1440,0L0,0Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute -top-1 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill={`${fillColor}`}
                fillOpacity="0.3"
                d="M0,30L1440,96L1440,0L0,0Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute -top-1 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill={`${fillColor}`}
                d="M0,16L1440,96L1440,0L0,0Z"
              ></path>
            </svg>
          </div>
        </>
      )}
      {angleType === "top-dark-small" && (
        <>
          <div
            className={`absolute top-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#000"
                fillOpacity="0.2"
                d="M0,10L1440,50L1440,0L0,0Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute top-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#000"
                fillOpacity="0.2"
                d="M0,30L1440,60L1440,0L0,0Z"
              ></path>
            </svg>
          </div>
        </>
      )}
      {angleType === "top-dark-large" && (
        <>
          <div
            className={`absolute -top-1 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#000"
                fillOpacity="0.3"
                d="M0,40L1440,96L1440,0L0,0Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute -top-1 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#000"
                fillOpacity="0.3"
                d="M0,30L1440,96L1440,0L0,0Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute -top-1 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#000"
                fillOpacity="1"
                d="M0,16L1440,96L1440,0L0,0Z"
              ></path>
            </svg>
          </div>
        </>
      )}
      {angleType === "bottom-light-large" && (
        <>
          <div
            className={`absolute bottom-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#fff"
                fillOpacity="0.3"
                d="M0,192L1440,320L1440,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute bottom-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200">
              <path
                fill="#fff"
                fillOpacity="0.3"
                d="M0,100L1440,200L1440,200L0,200Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute -bottom-1 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#fff"
                fillOpacity="1"
                d="M0,256L1440,320L1440,320L0,320Z"
              ></path>
            </svg>
          </div>
        </>
      )}
      {angleType === "bottom-light-small" && (
        <>
          <div
            className={`absolute bottom-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#fff"
                fillOpacity="0.3"
                d="M0,240L1440,320L1440,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute bottom-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200">
              <path
                fill="#fff"
                fillOpacity="0.3"
                d="M0,240L1440,200L1440,200L0,200Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute bottom-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#fff"
                fillOpacity="0.3"
                d="M0,276L1440,320L1440,320L0,320Z"
              ></path>
            </svg>
          </div>
        </>
      )}

      {angleType === "bottom-dark-small" && (
        <>
          <div
            className={`absolute bottom-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 3200">
              <path
                fill="#000"
                fillOpacity="0.3"
                d="M0,240L1440,320L1440,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute bottom-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200">
              <path
                fill="#000"
                fillOpacity="0.3"
                d="M0,240L1440,200L1440,200L0,200Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute bottom-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#000"
                fillOpacity="0.3"
                d="M0,276L1440,320L1440,320L0,320Z"
              ></path>
            </svg>
          </div>
        </>
      )}
      {angleType === "bottom-dark-large" && (
        <>
          <div
            className={`absolute bottom-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#000"
                fillOpacity="0.3"
                d="M0,192L1440,320L1440,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute bottom-0 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200">
              <path
                fill="#000"
                fillOpacity="0.3"
                d="M0,100L1440,200L1440,200L0,200Z"
              ></path>
            </svg>
          </div>
          <div
            className={`absolute -bottom-1 left-0 w-full z-10 ${flipClass} ${verticalFlipClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#000"
                fillOpacity="1"
                d="M0,256L1440,320L1440,320L0,320Z"
              ></path>
            </svg>
          </div>
        </>
      )}
    </>
  );
};

export default AngleElement;
