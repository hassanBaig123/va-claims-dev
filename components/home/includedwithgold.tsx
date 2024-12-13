import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldCheck } from "@fortawesome/pro-solid-svg-icons";

interface IncludedWithGoldProps {
  color?: string;
  iconColor?: string;
  containerClass?: string; // Custom class for the container
  iconClass?: string;      // Custom class for the icon
  textClass?: string;      // Custom class for the text
}

const IncludedWithGold = ({
  color = "oxfordBlue",
  iconColor = "green-700",
  containerClass = "", // Default empty string
  iconClass = "",      // Default empty string
  textClass = "",      // Default empty string
}: IncludedWithGoldProps) => {
   return (
    <div className={`flex flex-col-reverse sm:flex-row justify-center items-center text-${color} text-center my-8 ${containerClass}`}>
      <FontAwesomeIcon
        icon={faShieldCheck}
        className={`text-${iconColor} sm:mr-2 w-16 h-16 mb-4 sm:my-0 sm:w-9 sm:h-9 ${iconClass}`}
      />
      <h3 className={`text-3xl font-semibold inline-flex items-center justify-center mb-4 sm:mb-0 px-6 sm:px-0 ${textClass}`}>
        INCLUDED WITH GOLD ADVANTAGE PACKAGE
      </h3>
    </div>
  );
};
export default IncludedWithGold;
