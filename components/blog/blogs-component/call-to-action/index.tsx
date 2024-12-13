import { useAnalytics } from '@/lib/hooks/use-analytics'
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

interface CallToActionProps {
  buttonText: string
  buttonLink: string
  title: string
  headingStyles?: {
    color?: string
    fontSize?: string
    fontWeight?: string
    textAlign?: string
  }
  buttonStyles?: {
    backgroundColor?: string
    textColor?: string
    hoverBackgroundColor?: string
    activeBackgroundColor?: string
    padding?: string
    borderRadius?: string
    width?: string
    height?: string
    fontSize?: string
    iconWidth?: string
  }
}

const CallToAction: React.FC<CallToActionProps> = ({
  buttonText = '',
  buttonLink = '',
  title = '',
  headingStyles = {},
  buttonStyles = {},
}) => {
  const { trackEvent } = useAnalytics()

  const handleButtonClick = () => {
    trackEvent('click_cta', 'CallToAction', title)
  }

  const headingStyle: React.CSSProperties = {
    color: headingStyles?.color || 'white',
    fontSize: headingStyles?.fontSize || '3rem',
    fontWeight: headingStyles?.fontWeight || 'bold',
    textAlign:
      (headingStyles?.textAlign as React.CSSProperties['textAlign']) ||
      'center',
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: buttonStyles?.backgroundColor || '#f0c14b', // default navyYellow
    color: buttonStyles?.textColor || '#000', // default black text color
    padding: buttonStyles?.padding || '1rem 2rem',
    borderRadius: buttonStyles?.borderRadius || '8px',
    width: buttonStyles?.width || 'auto',
    height: buttonStyles?.height || '50px',
    fontSize: buttonStyles?.fontSize || '16px',
  }

  return (
    <div className="bg-oxfordBlueNew text-white py-12">
      <h2
        className="container font-bold font-lexendDeca mb-16"
        style={headingStyle}
      >
        {title}
      </h2>

      <div className="w-full flex justify-center z-20 mb-4">
        <Link
          href={buttonLink ?? '#'}
          className="group cta-button text-xl sm:text-3xl relative z-20 flex text-center justify-center items-center font-bold transition duration-300"
          style={buttonStyle}
          onClick={handleButtonClick}
        >
          {buttonText}
          <span className="inline-flex items-center justify-center p-2.5 ml-2 transition-transform duration-300 group-hover:translate-x-6">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="w-9 h-9"
              style={{
                color: buttonStyles?.textColor || '#000',
                width: buttonStyles?.iconWidth || '20px',
              }}
            />
          </span>
        </Link>
      </div>
    </div>
  )
}

export default CallToAction
