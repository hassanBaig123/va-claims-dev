import React, { useEffect } from 'react'
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import Link from 'next/link'
import Paragraph from '../paragraph'

interface BlogBannerProps {
  orientation: string
  Heading: any
  text: any
  backgroundImage?: any

  label: string
  buttonLink: string
  buttonText: string

  bannerContainerStyles?: {
    backgroundColor?: string
    backgroundSize?: string
    backgroundPosition?: string
    backgroundRepeat?: string
    borderRadius?: string
    padding?: string
    width?: string
    height?: string
  }

  headingStyles?: {
    color?: string
    fontSize?: string
    fontWeight?: string
    textAlign?: string
  }

  textStyles?: {
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

const BlogBannerComponent: React.FC<BlogBannerProps> = ({
  Heading = '',
  text = '',
  backgroundImage = '',

  label = '',
  orientation = '',
  buttonLink = '',
  buttonText = '',
  bannerContainerStyles = {},
  headingStyles = {},
  textStyles = {},
  buttonStyles = {},
}) => {
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent('view_banner', 'BlogBanner', Heading)
  }, [label, trackEvent])

  const handleButtonClick = () => {
    trackEvent('click_button', 'BlogBanner', buttonLink)
  }

  const containerStyle = {
    backgroundColor: bannerContainerStyles?.backgroundColor || '#0a173b',
    backgroundImage: backgroundImage
      ? `url(${backgroundImage?.data?.attributes?.url})`
      : undefined,
    backgroundSize: bannerContainerStyles?.backgroundSize || 'cover',
    backgroundPosition: bannerContainerStyles?.backgroundPosition || 'center',
    backgroundRepeat: bannerContainerStyles?.backgroundRepeat || 'no-repeat',
    borderRadius: bannerContainerStyles?.borderRadius || '8px',

    width:
      bannerContainerStyles?.width ||
      (orientation.toLowerCase() === 'vertical' ? '350px' : '100%'),
    height:
      bannerContainerStyles?.height ||
      (orientation.toLowerCase() === 'vertical' ? 'auto' : 'auto'),
    padding:
      bannerContainerStyles?.padding ||
      (orientation.toLowerCase() === 'vertical' ? '10px' : '30px'),
  }

  const headingStyle: React.CSSProperties = {
    color: headingStyles?.color || 'white',
    fontSize: headingStyles?.fontSize || '3rem',
    fontWeight: headingStyles?.fontWeight || 'bold',
    textAlign:
      (headingStyles?.textAlign as React.CSSProperties['textAlign']) ||
      'center',
  }

  const textStyle: React.CSSProperties = {
    color: textStyles?.color || 'white',
    fontSize: textStyles?.fontSize || '1rem',
    fontWeight: textStyles?.fontWeight || 'normal',
    textAlign:
      (textStyles?.textAlign as React.CSSProperties['textAlign']) || 'center',
  }

  const buttonStyle = {
    backgroundColor: buttonStyles?.backgroundColor || '#e6b00f',
    color: buttonStyles?.textColor || 'black',
    padding: buttonStyles?.padding || '10px 20px',
    borderRadius: buttonStyles?.borderRadius || '8px',
    width: buttonStyles?.width || 'auto',
    height: buttonStyles?.height || '50px',
    fontSize: buttonStyles?.fontSize || '16px',
  }

  const buttonHoverStyle = {
    backgroundColor: buttonStyles?.hoverBackgroundColor || '#b89323',
  }

  const buttonActiveStyle = {
    backgroundColor: buttonStyles?.activeBackgroundColor || '#7e6419',
  }

  return (
    <div
      className={`blog-banner flex items-center justify-center overflow-hidden text-white ${
        orientation.toLowerCase() === 'vertical'
          ? 'flex-col h-auto mx-auto'
          : 'flex-col justify-between'
      }`}
      style={containerStyle}
    >
      {Heading.map((headingItem: any, index: number) => (
        <h2 key={index} style={headingStyle} className="mb-2 leading-[46px]">
          {headingItem.children[0].text}
        </h2>
      ))}
      {text.map((textItem: any, index: number) => (
        <div key={index} style={textStyle}>
          <Paragraph>
            {textItem.children.map((child: any, i: number) => (
              <span key={i} className={child.bold ? 'font-bold' : 'text-2xl'}>
                {child.text}
              </span>
            ))}
          </Paragraph>
        </div>
      ))}
      <div className="w-full flex justify-center z-20">
        <Link
          href={buttonLink ?? '#'}
          className="group cta-button text-xl sm:text-3xl relative z-20 flex text-center justify-center items-center font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_2px_#c3c3c3] hover:shadow-[0px_0px_0px_4px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded"
          onClick={handleButtonClick}
          style={buttonStyle}
        >
          {buttonText}
          <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition-transform duration-300 group-hover:translate-x-6">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-black w-90"
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

export default BlogBannerComponent
